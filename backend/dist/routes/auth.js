"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// Login route
router.post('/login', passport_1.default.authenticate('local'), (async (req, res) => {
    const user = req.user;
    const userWithRoles = await db_1.default.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            initials: true,
            roles: {
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,
                        },
                    }
                },
            },
        },
    });
    res.json({
        user: userWithRoles,
        sessionToken: req.sessionID
    });
}));
// Logout route
router.post('/logout', ((req, res) => {
    req.logout(() => {
        res.json({ message: 'Logged out successfully' });
    });
}));
// Get current user route
router.get('/me', ((req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = req.user;
    // Fetch user with roles
    db_1.default.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            initials: true,
            roles: {
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,
                        },
                    }
                },
            },
        },
    }).then(userWithRoles => {
        res.json({
            user: userWithRoles,
            sessionToken: req.sessionID
        });
    }).catch(error => {
        res.status(500).json({ message: 'Error fetching user data' });
    });
}));
exports.default = router;