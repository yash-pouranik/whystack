const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require JWT authentication
router.use(authenticateToken);

router.get('/github', projectController.listRepos);
router.post('/import', projectController.importRepo);
router.get('/', projectController.getProjects);
router.get('/:projectId/prs', projectController.getProjectPRs);
router.delete('/:projectId', projectController.deleteProject);

module.exports = router;
