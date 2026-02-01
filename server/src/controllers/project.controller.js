const axios = require('axios');
const Project = require('../models/Project');
const User = require('../models/User');
const PullRequest = require('../models/PullRequest'); // Added dependency

// ... existing listRepos and importRepo ...
// List repositories from GitHub for the authenticated user
exports.listRepos = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // Fetch repos from GitHub
        // Using simple pagination parameters or fetching first 100 for MVP
        const githubRes = await axios.get('https://api.github.com/user/repos?per_page=100&sort=updated', {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        // Map relevant data
        const repos = githubRes.data.map(repo => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            private: repo.private,
            url: repo.html_url,
            description: repo.description,
            owner: repo.owner.login
        }));

        // Check which ones are already imported
        // We can optimize this but for MVP loop is fine
        const importedProjects = await Project.find({ importedBy: user._id });
        const importedIds = new Set(importedProjects.map(p => p.githubRepoId));

        const result = repos.map(repo => ({
            ...repo,
            isImported: importedIds.has(String(repo.id))
        }));

        res.json(result);
    } catch (error) {
        console.error('List Repos Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch repositories' });
    }
};

// Import a repository as a Project
exports.importRepo = async (req, res) => {
    const { githubRepoId, name, owner, visibility, githubUrl } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // Check if already exists
        let project = await Project.findOne({ githubRepoId });
        if (project) {
            return res.status(400).json({ message: 'Project already imported' });
        }

        project = new Project({
            githubRepoId,
            name,
            owner,
            visibility: visibility || 'public',
            importedBy: user._id
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Import Repo Error:', error.message);
        res.status(500).json({ message: 'Failed to import repository' });
    }
};

// Get imported projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ importedBy: req.userId }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
};

// NEW: Get PRs for a specific project
exports.getProjectPRs = async (req, res) => {
    const { projectId } = req.params;
    try {
        // Find project to verify access/existence
        // In real app verify user has access to this project
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Fetch PRs
        // Also populate decision status if possible?
        // We can use aggregate or just populate virtually if we set relations up right.
        // For now, let's fetch PRs and we might need to join decisions manually or client side?
        // Decision has 'pullRequest' ref.

        // Let's do a simple lookup
        const prs = await PullRequest.find({ project: projectId })
            .sort({ githubUpdatedAt: -1 })
            .lean();

        // Attach decision status
        // This is N+1 query potentially, but for MVP it's okay or we use aggregate.
        // Better: Aggregate
        const prsWithDecision = await PullRequest.aggregate([
            { $match: { project: project._id } },
            {
                $lookup: {
                    from: 'decisions',
                    localField: '_id',
                    foreignField: 'pullRequest',
                    as: 'decision'
                }
            },
            {
                $addFields: {
                    decisionStatus: { $ifNull: [{ $arrayElemAt: ["$decision.status", 0] }, "PENDING"] },
                    decisionId: { $arrayElemAt: ["$decision._id", 0] }
                }
            },
            { $sort: { githubUpdatedAt: -1 } }
        ]);

        res.json(prsWithDecision);
    } catch (error) {
        console.error("Get PRs Error", error);
        res.status(500).json({ message: 'Failed to fetch PRs' });
    }
};
