import express, { Request, Response, RequestHandler } from 'express';
import session from 'express-session';
import passport from './config/passport';
import authRoutes from './routes/auth';
import parentApiRoutes from './routes/parent-api';
import prisma from './db';
import { requireAuth } from './middleware/auth';
import apiRoutes from './routes/api';
import {PrismaSessionStore} from '@quixo3/prisma-session-store';
import cors from 'cors';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const app = express();
const port = 3000;

app.use(cors({
  origin: 'https://afspraakplanner-frontend-gqfvfnd4b7ambzck.westeurope-01.azurewebsites.net',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(
  session({
    name: 'wa_2025_session',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: false,
    },
    secret: "secret",
    proxy: true,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma as any, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: false,
      dbRecordIdFunction: undefined,
    }),
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Apply authentication middleware by default, excluding specific paths
app.use(requireAuth(['/login', '/auth/login', '/auth/register', '/parent-api'] as any));

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/parent-api', parentApiRoutes);

// Serve login page
app.get('/login', ((req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Login</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .login-form { padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
          .form-group { margin-bottom: 15px; }
          input { padding: 8px; width: 200px; }
          button { padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }
          button:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="login-form">
          <h2>Login</h2>
          <form action="/auth/login" method="POST">
            <div class="form-group">
              <input type="text" name="username" placeholder="Username" required>
            </div>
            <div class="form-group">
              <input type="password" name="password" placeholder="Password" required>
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </body>
    </html>
  `);
}) as RequestHandler);

// Serve profile page
app.get('/me', ((req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const user = req.user as any;
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Profile</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
          .profile-card { padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .profile-header { margin-bottom: 20px; text-align: center; }
          .profile-info { margin-bottom: 20px; }
          .info-item { margin: 10px 0; }
          .info-label { font-weight: bold; color: #666; }
          .logout-btn { 
            display: block;
            width: 100%;
            padding: 10px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
          }
          .logout-btn:hover { background: #c82333; }
        </style>
      </head>
      <body>
        <div class="profile-card">
          <div class="profile-header">
            <h2>Welcome, ${user.firstName}!</h2>
          </div>
          <div class="profile-info">
            <div class="info-item">
              <span class="info-label">Username:</span> ${user.username}
            </div>
            <div class="info-item">
              <span class="info-label">Full Name:</span> ${user.firstName} ${user.lastName}
            </div>
            <div class="info-item">
              <span class="info-label">Initials:</span> ${user.initials}
            </div>
          </div>
          <form action="/auth/logout" method="POST">
            <button type="submit" class="logout-btn">Logout</button>
          </form>
        </div>
      </body>
    </html>
  `);
}) as RequestHandler);


app.get('/', (_req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});