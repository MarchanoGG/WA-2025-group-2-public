import express, { Request, Response } from 'express';
import prisma from '../db';
import { sendAppointmentConfirmation } from '../config/email';

const router = express.Router();

async function isValidCode(code: string) {
    const parentCode = await prisma.parentCode.findFirst({
        where: { code: code }
    });
    return parentCode !== null;
}

router.get('/validateParentCode', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
    }

    if (!await isValidCode(code)) {
        res.status(400).json({ error: 'Invalid code' });
        return;
    }

    res.status(200).json({ success: true });
});

router.post('/classes', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
    }

    if (!await isValidCode(code)) {
        res.status(400).json({ error: 'Invalid code' });
        return;
    }

    const classes = await prisma.class.findMany({
        select: {
            id: true,
            className: true,
            education: true,
            users: {
                select: {
                    user: {
                        select: {
                            id: true,
                            initials: true,
                            roles: {
                                select: {
                                    role: {
                                        select: {
                                            id: true,
                                            name: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    res.status(200).json(classes);
});

router.get('/classes/:id', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
    }

    if (!await isValidCode(code)) {
        res.status(400).json({ error: 'Invalid code' });
        return;
    }
    
    const classData = await prisma.class.findUnique({
        where: { id: parseInt(req.params.id) },
        select: {
            id: true,
            className: true,
            education: true,
            users: {
                select: {
                    user: {
                        select: {
                            id: true,
                            initials: true,
                            roles: {
                                select: {
                                    role: {
                                        select: {
                                            id: true,
                                            name: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    res.status(200).json(classData);
});

router.post('/appointments/:userId', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
    }

    if (!await isValidCode(code)) {
        res.status(400).json({ error: 'Invalid code' });
        return;
    }

    const appointments = await prisma.appointment.findMany({
        where: {
            userId: parseInt(req.params.userId),
            isClaimed: false,
        },
        select: {
            id: true,
            startTime: true,
            endTime: true
        }
    });

    res.status(200).json(appointments);
});

export default router;

router.post('/bookappointments/:id', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
    }

    const parentCode = await prisma.parentCode.findFirst({
        where: {
            code: code
        }
    });

    if (!parentCode) {
        res.status(400).json({ error: 'Invalid code' });
        return;
    }

    const appointment = await prisma.appointment.update({
        where: { id: parseInt(req.params.id) },
        data: {
            isClaimed: true,
            parentCode: {
                connect: {
                    id: parentCode.id
                }
            },
            studentNumber: req.body.studentNumber,
            studentName: req.body.studentName,
            parentName: req.body.parentName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            class: (req.body.classId ? {
                connect: {
                    id: req.body.classId
                }
            } : undefined)
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    try {
        // Send confirmation email
        if (appointment.email) {
            await sendAppointmentConfirmation(appointment.email, {
                studentName: appointment.studentName || '',
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                teacherName: `${appointment.user.firstName} ${appointment.user.lastName}`
            });
        }

    } catch (error) {
        console.error('Error sending email:', error);
    }

    res.status(200).json(appointment);
});
