const express = require('express');
const router = express.Router();
const decisionController = require('../controllers/decision.controller');

// Middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    next();
};

router.use(requireAuth);

router.post('/:pullRequestId', decisionController.createOrUpdateDecision);
router.get('/:pullRequestId', decisionController.getDecisionByPR);
router.get('/', decisionController.searchDecisions);

module.exports = router;
