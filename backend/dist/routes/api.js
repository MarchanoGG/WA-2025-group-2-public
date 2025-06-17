"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
async function isAdmin(req) {
    if (!req.user) {
        return false;
    }
    const requestUser = await db_1.default.user.findUnique({
        where: { id: req.user?.id },
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
    const user = await db_1.default.user.findMany({
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
        if (req.params.id && parseInt(req.params.id) !== req.user?.id) {
            res.status(403).send('Forbidden');
            return;
        }
        res.status(403).send('Forbidden');
        return;
    }
    const user = await db_1.default.user.findUnique({
        where: { id: parseInt(req.params.id) },
    });
    res.send(user);
});
// create or update a user
router.post('/users', async (req, res) => {
    if (!await isAdmin(req)) {
        if (req.body.id && req.body.id !== req.user?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }
    console.log(req.body);
    const { roles, ...userData } = req.body;
    if (roles) {
        if (!await isAdmin(req)) {
            res.status(403).send('Forbidden');
            return;
        }
    }
    let user;
    if (userData.id) {
        user = await db_1.default.user.update({
            where: { id: parseInt(userData.id) },
            data: userData,
        });
    }
    else {
        user = await db_1.default.user.create({
            data: userData,
        });
    }
    if (roles && roles.length > 0) {
        user = await db_1.default.user.update({
            where: { id: user.id },
            data: {
                roles: {
                    deleteMany: {},
                    create: roles.map((role) => ({
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
    const requestUser = await db_1.default.user.findUnique({
        where: { id: req.user?.id },
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
    const classes = await db_1.default.class.findMany({
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
    const classData = await db_1.default.class.findUnique({
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
router.post('/classes', async (req, res) => {
    if (!await isAdmin(req)) {
        res.status(403).send('Forbidden');
        return;
    }
    const { id, users, ...classData } = req.body;
    let classRecord;
    if (id) {
        classRecord = await db_1.default.class.update({
            where: { id: parseInt(id) },
            data: classData,
        });
    }
    else {
        classRecord = await db_1.default.class.create({
            data: classData,
        });
    }
    if (users && users.length > 0) {
        classRecord = await db_1.default.class.update({
            where: { id: classRecord.id },
            data: {
                users: {
                    deleteMany: {},
                    create: users.map((userId) => ({
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
    const parentCode = await db_1.default.parentCode.findMany();
    res.send(parentCode);
});
// create a new parent code
router.post('/parentCodes', async (req, res) => {
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
        for (let j = 0; j < 16; j++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        parentCodes.push(code);
        await db_1.default.parentCode.create({
            data: {
                code: code,
            }
        });
    }
    res.send(parentCodes);
});
// get all available appointments for a user
router.get('/appointments/:userId', async (req, res) => {
    if (!await isAdmin(req)) {
        if (req.params.userId && parseInt(req.params.userId) !== req.user?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }
    const appointments = await db_1.default.appointment.findMany({
        where: {
            userId: parseInt(req.params.userId),
        },
    });
    res.send(appointments);
});
// get all booked appointments for a user
router.get('/appointments/:userId/booked', async (req, res) => {
    if (!await isAdmin(req)) {
        if (req.params.userId && parseInt(req.params.userId) !== req.user?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }
    const appointments = await db_1.default.appointment.findMany({
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
        if (req.params.userId && parseInt(req.params.userId) !== req.user?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }
    const { appointments } = req.body;
    // delete all other appointments for this user
    await db_1.default.appointment.deleteMany({
        where: {
            userId: parseInt(req.params.userId),
            id: { not: { in: appointments.map((a) => a.id).filter((a) => a !== null && a !== undefined) } },
            isClaimed: false,
            isRejected: false
        },
    });
    for (const appointment of appointments) {
        // if the appointment already exists, update it
        if (appointment.id) {
            const appointmentRecord = await db_1.default.appointment.update({
                where: { id: appointment.id },
                data: {
                    startTime: appointment.startTime,
                    endTime: appointment.endTime,
                    userId: parseInt(req.params.userId),
                    classId: appointment.classId
                },
            });
        }
        else {
            // if the appointment does not exist, create it
            const appointmentRecord = await db_1.default.appointment.create({
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
    res.send(await db_1.default.appointment.findMany({
        where: {
            userId: parseInt(req.params.userId),
        },
    }));
});
router.post('/appointments/:id/reject', async (req, res) => {
    if (!await isAdmin(req)) {
        if (req.params.id && parseInt(req.params.id) !== req.user?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }
    const appointment = await db_1.default.appointment.update({
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
        await db_1.default.user.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
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
        await db_1.default.class.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
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
        await db_1.default.parentCode.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(404).send('Parent code not found');
    }
});
// delete an appointment
router.delete('/appointments/:id', async (req, res) => {
    const appointment = await db_1.default.appointment.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    if (!appointment) {
        res.status(404).send('Appointment not found');
        return;
    }
    if (!await isAdmin(req)) {
        if (appointment.userId !== req.user?.id) {
            res.status(403).send('Forbidden');
            return;
        }
    }
    try {
        await db_1.default.appointment.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).send('Error deleting appointment');
    }
});
exports.default = router;