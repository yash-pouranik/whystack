const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Note: Body parsing is handled in app.js with express.raw() for /webhooks prefix
// So we don't need body-parser middleware here.

router.post('/github', webhookController.handleGithubWebhook);

module.exports = router;
