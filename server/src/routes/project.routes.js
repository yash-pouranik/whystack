const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

// Middleware to check auth
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    next();
};

router.use(requireAuth);

router.get('/github', projectController.listRepos);
router.post('/import', projectController.importRepo);
router.get('/', projectController.getProjects);
router.get('/:projectId/prs', projectController.getProjectPRs); // Added route

module.exports = router;
