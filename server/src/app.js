const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const decisionRoutes = require('./routes/decision.routes');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Webhooks need raw body for signature verification
app.use('/webhooks', express.raw({ type: 'application/json' }));

// Regular JSON body parser for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'secret_key'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/decisions', decisionRoutes);
app.use('/webhooks', webhookRoutes);

app.get('/', (req, res) => {
    res.send('WhyStack API is running');
});

module.exports = app;
