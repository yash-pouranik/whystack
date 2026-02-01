const express = require('express');
const router = express.Router();
const decisionController = require('../controllers/decision.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require JWT authentication
router.use(authenticateToken);

router.post('/:pullRequestId', decisionController.createOrUpdateDecision);
router.get('/:pullRequestId', decisionController.getDecisionByPR);
router.get('/', decisionController.searchDecisions);

module.exports = router;
