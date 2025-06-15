"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.isAuthenticated = void 0;
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
};
exports.isAuthenticated = isAuthenticated;
const requireAuth = (excludePaths = []) => {
    return (req, res, next) => {
        // Check if the current path is in the exclude list
        if (excludePaths.some(path => req.path.startsWith(path))) {
            next();
            return;
        }
        if (req.isAuthenticated()) {
            next();
            return;
        }
        // For API routes, return JSON response
        if (req.path.startsWith('/auth/') || req.path.startsWith('/api/')) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        // For web routes, redirect to login
        res.redirect('/login');
    };
};
exports.requireAuth = requireAuth;
