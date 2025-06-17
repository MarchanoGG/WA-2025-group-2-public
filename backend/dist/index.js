"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./config/passport"));
const auth_1 = __importDefault(require("./routes/auth"));
const parent_api_1 = __importDefault(require("./routes/parent-api"));
const db_1 = __importDefault(require("./db"));
const auth_2 = require("./middleware/auth");
const api_1 = __importDefault(require("./routes/api"));
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: 'https://afspraakplanner-frontend-gqfvfnd4b7ambzck.westeurope-01.azurewebsites.net',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', (0, cors_1.default)());
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    name: 'wa_2025_session',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        secure: true,
    },
    secret: "secret",
    proxy: true,
    resave: false,
    saveUninitialized: false,
    store: new prisma_session_store_1.PrismaSessionStore(db_1.default, {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: false,
        dbRecordIdFunction: undefined,
    }),
}));
// Initialize Passport and restore authentication state from session
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Apply authentication middleware by default, excluding specific paths
app.use((0, auth_2.requireAuth)(['/login', '/auth/login', '/auth/register', '/parent-api']));
// Routes
app.use('/auth', auth_1.default);
app.use('/api', api_1.default);
app.use('/parent-api', parent_api_1.default);
// Serve login page
app.get('/login', ((req, res) => {
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
}));
// Serve profile page
app.get('/me', ((req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    const user = req.user;
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
}));
app.get('/', (_req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});