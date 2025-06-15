import express, { Request, Response, RequestHandler } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import prisma from '../db';

const router = express.Router();

// Login route
router.post('/login', passport.authenticate('local'), (async (req, res) => {
  const user = req.user as any;

  const userWithRoles = await prisma.user.findUnique({
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
}) as RequestHandler);

// Logout route
router.post('/logout', ((req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
}) as RequestHandler);

// Get current user route
router.get('/me', ((req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const user = req.user as any;
  
  // Fetch user with roles
  prisma.user.findUnique({
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
}) as RequestHandler);

export default router; 