const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/github', authController.login);
router.get('/github/callback', authController.callback);
router.get('/logout', authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser); // Protected with JWT
router.post('/dev-login', authController.devLogin);

module.exports = router;
