// commands/seed.ts
//
// Seed: rollen, users, klassen, parent-codes, afspraken.
// npm run seed
//-----------------------------------------------------------------------

import prisma from '../src/db';
import bcrypt from 'bcryptjs';

/* -------------------------------------------------  Helpers  ---- */
const randCode = (len = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < len; i++) code += chars[Math.random() * chars.length | 0];
    return code;
};

async function main() {
    /* -------------------------------------------  Rollen  ---------- */
    const roleNames = ['admin', 'mentor', 'dean'] as const;
    const roles: Record<(typeof roleNames)[number], { id: number }> = {} as any;

    for (const name of roleNames) {
        const role =
            (await prisma.role.findFirst({ where: { name } })) ??
            (await prisma.role.create({ data: { name } }));
        roles[name] = { id: role.id };
    }

    /* --------------------------------------------  Users  ---------- */
    const userSpecs = [
        {
            key: 'admin',
            username: 'admin',
            password: 'admin',
            firstName: 'Alice',
            lastName: 'Administrator',
            initials: 'AA',
            role: 'admin',
        },
        {
            key: 'mentor',
            username: 'mentor',
            password: 'mentor',
            firstName: 'Mark',
            lastName: 'Mentor',
            initials: 'MM',
            role: 'mentor',
        },
        {
            key: 'dean',
            username: 'dean',
            password: 'dean',
            firstName: 'Diana',
            lastName: 'Dean',
            initials: 'DD',
            role: 'dean',
        },
    ] as const;

    const users: Record<string, { id: number }> = {};

    for (const spec of userSpecs) {
        const user =
            (await prisma.user.findFirst({ where: { username: spec.username } })) ??
            (await prisma.user.create({
                data: {
                    username: spec.username,
                    password: await bcrypt.hash(spec.password, 10),
                    firstName: spec.firstName,
                    lastName: spec.lastName,
                    initials: spec.initials,
                    roles: {
                        create: { role: { connect: { id: roles[spec.role].id } } },
                    },
                },
            }));
        users[spec.key] = { id: user.id };
    }

    /* -------------------------------------------  Klassen  --------- */
    const classSpecs = [
        { className: '1A', education: 'havo' },
        { className: '2B', education: 'vwo' },
    ];

    const classes: { id: number }[] = [];

    for (const spec of classSpecs) {
        const cls =
            (await prisma.class.findFirst({ where: { className: spec.className } })) ??
            (await prisma.class.create({ data: spec }));
        classes.push({ id: cls.id });

        // koppel mentor & dean
        for (const role of ['mentor', 'dean'] as const) {
            await prisma.userClass.upsert({
                where: {
                    userId_classId: { userId: users[role].id, classId: cls.id },
                },
                update: {},
                create: { userId: users[role].id, classId: cls.id },
            });
        }
    }

    /* --------------------------------------  Parent-codes  --------- */
    const parentCodes: { id: number }[] = [];
    for (let i = 0; i < 10; i++) {
        const pc = await prisma.parentCode.create({ data: { code: randCode() } });
        parentCodes.push({ id: pc.id });
    }

    /* -----------------------------------------  Afspraken  --------- */
    const today = new Date();
    today.setHours(9, 0, 0, 0);              // 09:00
    const slotMin = 15;
    const perUser = 25;

    const slotTime = (n: number) =>
        new Date(today.getTime() + n * slotMin * 60_000);

    const mkAppointment = async (
        n: number,
        who: 'mentor' | 'dean',
        claimed: boolean
    ) => {
        const start = slotTime(n);
        const end = new Date(start.getTime() + slotMin * 60_000);
        await prisma.appointment.create({
            data: {
                startTime: start,
                endTime: end,
                isClaimed: claimed,
                isRejected: false,
                userId: users[who].id,
                classId: classes[n % classes.length].id,
                parentCodeId: claimed ? parentCodes[n % parentCodes.length].id : undefined,
                studentNumber: claimed ? `SN${n.toString().padStart(3, '0')}` : undefined,
                studentName: claimed ? `Student ${n}` : undefined,
                parentName: claimed ? `Parent ${n}` : undefined,
                phoneNumber: claimed ? '0612345678' : undefined,
                email: claimed ? `parent${n}@example.com` : undefined,
            },
        });
    };

    const jobs: Promise<any>[] = [];
    for (let i = 0; i < perUser; i++) {
        jobs.push(mkAppointment(i, 'mentor', i % 2 === 0));
        jobs.push(mkAppointment(i + perUser, 'dean', i % 2 === 1));
    }
    await Promise.all(jobs);

    console.log('✅  Seed voltooid!');
}

/* --------------------------------------------------------------- */
main()
    .catch((e) => {
        console.error('❌  Seed mislukt:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
