import express, { Request, Response } from 'express';
import prisma from '../db';
import { Role, User, Class, Appointment } from '../../prisma/__generated';
import bcrypt from 'bcryptjs';

const router = express.Router();

async function isAdmin(req: Request) {
    if (!req.user) {
        return false;
    }
    const requestUser = await prisma.user.findUnique({
        where: { id: (req.user as User)?.id },
        include: { 
            roles: {
                include: { role: true },
            }
        }
    });
    return requestUser?.roles.some(role => role.role.name === 'admin');
}

// retrieve all users
router.get('/users', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    const user = await prisma.user.findMany({
        include: {
            roles: {
                include: { role: true },
            }
        }
    });
    res.send(user);
});

// retrieve a single user by id
router.get('/users/:id', async (req, res) => {
    if (!await isAdmin(req)) {
        if (req.params.id && parseInt(req.params.id) !== (req.user as User)?.id) {
            res.status(403).send('Forbidden');
            return;
        }

        res.status(403).send('Forbidden');
        return;
    }

    const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
    });
    res.send(user);
});

// create or update a user
router.post('/users', async (req: Request, res: Response) => {
    if (!await isAdmin(req)) {
        if (req.body.id && req.body.id !== (req.user as User)?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }

    console.log(req.body);

    const {roles, password, ...userData} = req.body;

    if (password) {
        userData.password = await bcrypt.hash(password, 10);
    }

    if (roles) {
        if (!await isAdmin(req)) {
            res.status(403).send('Forbidden');
            return;
        }
    }

    let user;
    if (userData.id) {
        const existingUser = await prisma.user.findFirst({
            where: {
                username: userData.username,
                id: { not: parseInt(userData.id) }
            },
        });
    
        if (existingUser) {
            res.status(400).send('User already exists');
            return;
        }
    
        user = await prisma.user.update({
            where: { id: parseInt(userData.id) },
            data: userData,
        });
    } else {
        const existingUser = await prisma.user.findUnique({
            where: { username: userData.username },
        });
    
        if (existingUser) {
            res.status(400).send('User already exists');
            return;
        }
    
        user = await prisma.user.create({
            data: userData,
        });
    }

    if (roles && roles.length > 0) {
        user = await prisma.user.update({
            where: { id: user.id },
            data: { 
                roles: {
                    deleteMany: {},
                    create: roles.map((role: number) => ({
                        role: {
                            connect: { id: role },
                        },
                    })),
                },
            },
        });
    }
    res.send(user);
return;
});

// retrieve all classes
router.get('/classes', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    const requestUser = await prisma.user.findUnique({
        where: { id: (req.user as User)?.id },
        include: { 
            roles: {
                include: { role: true },
            }
        }
    });
    if (!requestUser?.roles.some(role => role.role.name === 'admin')) {
        res.status(403).send('Forbidden');
        return;
    }

    const classes = await prisma.class.findMany({
        include: {
            users: {
                include: {
                    user: {
                        include: {
                            roles: {
                                include: { role: true },
                            }
                        }
                    }
                }
            }
        }
    });
    res.send(classes);
});

// retrieve a single class by id
router.get('/classes/:id', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }
    
    const classData = await prisma.class.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
            users: {
                include: {
                    user: true
                }
            }
        }
    });
    res.send(classData);
});

// create or update a class
router.post('/classes', async (req: Request, res: Response) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    const {id, users, ...classData} = req.body;

    let classRecord;

    if (id) {
        classRecord = await prisma.class.update({
            where: { id: parseInt(id) },
            data: classData,
        });
    } else {
        classRecord = await prisma.class.create({
            data: classData,
        });
    }

    if (users && users.length > 0) {
        classRecord = await prisma.class.update({
            where: { id: classRecord.id },
            data: { 
                users: {
                    deleteMany: {},
                    create: users.map((userId: number) => ({
                        user: {
                            connect: { id: userId },
                        },
                    })),
                },
            },
            include: {
                users: {
                    include: {
                        user: true
                    }
                }
            }
        });
    }
    res.send(classRecord);
});

// list all valid parent codes
router.get('/parentCodes', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    const parentCode = await prisma.parentCode.findMany();
    res.send(parentCode);
});

router.get('/parentCodes/:id', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }
    
});

router.post('/parentCodes', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    const parentCode = req.body;

    let parentCodeRecord;

    if (parentCode.id) {
        parentCodeRecord = await prisma.parentCode.update({
            where: { id: parentCode.id },
            data: parentCode,
        });
    } else {
        parentCodeRecord = await prisma.parentCode.create({
            data: parentCode,
        });
    }

    res.send(parentCodeRecord);
});

// create a new parent code
router.post('/parentCodes/generate', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    const amount = +req.body.amount;
    const parentCodes = [];
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < amount; i++) {
        // generate a random 16 character code
        let code = '';
        for(let j = 0; j < 16; j++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        parentCodes.push(code);
        await prisma.parentCode.create({
            data: {
                code: code,
            }
        });
    }
    res.send(parentCodes);
});

// get all appointments
router.get('/appointments', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    const appointments = await prisma.appointment.findMany();

    res.send(appointments);
});

// get single appointment
router.get('/appointment/:id', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(req.params.id) },
    });
    res.send(appointment);
});

router.post('/appointments', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    } 

    const appointment = req.body;

    let appointmentRecord;

    if (appointment.id) {
        appointmentRecord = await prisma.appointment.update({
            where: { id: appointment.id },
            data: appointment,
        });
    } else {
        appointmentRecord = await prisma.appointment.create({
            data: appointment,
        });
    }

    res.send(appointmentRecord);
});

// get all available appointments for a user
router.get('/appointments/:userId', async (req, res) => {
    if (!await isAdmin(req)) {
        if (req.params.userId && parseInt(req.params.userId) !== (req.user as User)?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }

    const appointments = await prisma.appointment.findMany({
        where: {
            userId: parseInt(req.params.userId),
        },
    });
    res.send(appointments);
});

// get all booked appointments for a user
router.get('/appointments/:userId/booked', async (req, res) => {
    if (!await isAdmin(req)) {
        if (req.params.userId && parseInt(req.params.userId) !== (req.user as User)?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }

    const appointments = await prisma.appointment.findMany({
        where: {
            startTime: {
                gte: new Date(),
            },
            userId: parseInt(req.params.userId),
            isClaimed: true,
            isRejected: false,
        },
    });
    res.send(appointments);
});

// set available appointments for a user
router.post('/appointments/:userId', async (req, res) => {
    if (!await isAdmin(req)) {
        if (req.params.userId && parseInt(req.params.userId) !== (req.user as User)?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }

    const {appointments} = req.body;

    // delete all other appointments for this user
    await prisma.appointment.deleteMany({
        where: {
            userId: parseInt(req.params.userId),
            id: { not: { in: appointments.map((a: Appointment) => a.id).filter((a: number) => a !== null && a !== undefined) } },
            isClaimed: false,
            isRejected: false
        },
    });
    for (const appointment of appointments) {
        // if the appointment already exists, update it
        if (appointment.id) {
            const appointmentRecord = await prisma.appointment.update({
                where: { id: appointment.id },
                data: {
                    startTime: appointment.startTime,
                    endTime: appointment.endTime,
                    userId: parseInt(req.params.userId),
                    classId: appointment.classId
                },
            });
        } else {
            // if the appointment does not exist, create it
            const appointmentRecord = await prisma.appointment.create({
                data: {
                    startTime: appointment.startTime,
                    endTime: appointment.endTime,
                    isClaimed: false,
                    isRejected: false,
                    userId: parseInt(req.params.userId),
                    classId: appointment.classId
                },
            });
        }
    }

    res.send(await prisma.appointment.findMany({
        where: {
            userId: parseInt(req.params.userId),
        },
    }));
});

router.post('/appointments/:id/reject', async (req, res) => {
    if (!await isAdmin(req)) {
        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: true,
            }
        });
        if (appointment?.user?.id !== (req.user as User)?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }

    const appointment = await prisma.appointment.update({
        where: { id: parseInt(req.params.id) },
        data: {
            isRejected: req.body.isRejected,
        },
    });
    res.send(appointment);
});

// delete a user
router.delete('/users/:id', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    try {
        await prisma.user.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).send('User not found');
    }
});

// delete a class
router.delete('/classes/:id', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    try {
        await prisma.class.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).send('Class not found');
    }
});

// delete a parent code
router.delete('/parentCodes/:id', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    try {
        await prisma.parentCode.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).send('Parent code not found');
    }
});

// delete an appointment
router.delete('/appointments/:id', async (req, res) => {
    const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(req.params.id) }
    });

    if (!appointment) {
        res.status(404).send('Appointment not found');
        return;
    }

    if (!await isAdmin(req)) {
        if (appointment.userId !== (req.user as User)?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }

    try {
        await prisma.appointment.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Error deleting appointment');
    }
});

// delete a parent code
router.delete('/parentCodes/:id', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }

    try {
        await prisma.parentCode.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).send('Parent code not found');
    }
});

export default router;