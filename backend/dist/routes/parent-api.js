"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
async function isValidCode(code) {
    const parentCode = await db_1.default.parentCode.findFirst({
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
router.get('/classes', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
    }
    if (!await isValidCode(code)) {
        res.status(400).json({ error: 'Invalid code' });
        return;
    }
    const classes = await db_1.default.class.findMany({
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
    const classData = await db_1.default.class.findUnique({
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
router.get('/appointments/:userId', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
    }
    if (!await isValidCode(code)) {
        res.status(400).json({ error: 'Invalid code' });
        return;
    }
    const appointments = await db_1.default.appointment.findMany({
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
router.post('/appointments/:id', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
    }
    const parentCode = await db_1.default.parentCode.findFirst({
        where: {
            code: code
        }
    });
    if (!parentCode) {
        res.status(400).json({ error: 'Invalid code' });
        return;
    }
    const appointment = await db_1.default.appointment.update({
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
        }
    });
    res.status(200).json(appointment);
});
exports.default = router;
