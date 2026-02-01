const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/github', authController.login);
router.get('/github/callback', authController.callback);
router.get('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);
router.post('/dev-login', authController.devLogin);

module.exports = router;
