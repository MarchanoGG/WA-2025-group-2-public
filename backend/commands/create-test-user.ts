// create an admin user with the username "admin" and the password "admin"

import prisma from '../src/db';
import bcrypt from 'bcryptjs';


async function createAdminUser() {
    // create admin role if it doesn't exist
    let adminRole = await prisma.role.findFirst({
        where: { name: 'admin' },
    });

    const adminRoleId = adminRole?.id;

    const adminUser = await prisma.user.findFirst({
        where: { username: 'admin' },
    });
    if (adminUser) {
        return adminUser;
    }

    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('admin', 10),
            firstName: 'Admin',
            lastName: 'User',
            initials: 'AU',
            roles: {
                create: {
                    role: {
                        connect: { id: adminRoleId },
                    },
                },
            },
        },
    });

    return admin;
}

createAdminUser().then((admin) => {
    console.log(admin);
});
