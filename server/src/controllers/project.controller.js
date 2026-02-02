const axios = require('axios');
const Project = require('../models/Project');
const User = require('../models/User');
const PullRequest = require('../models/PullRequest'); // Added dependency

// ... existing listRepos and importRepo ...
const { decrypt } = require('../utils/crypto');

// List repositories from GitHub for the authenticated user
exports.listRepos = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // Decrypt token
        const accessToken = decrypt(user.accessToken);

        // Fetch repos from GitHub
        // Using simple pagination parameters or fetching first 100 for MVP
        const githubRes = await axios.get('https://api.github.com/user/repos?per_page=100&sort=updated', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
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

        // --- NEW: Sync PRs immediately (SRS 7.1) ---
        // Decrypt token for use
        const { decrypt } = require('../utils/crypto');
        const accessToken = decrypt(user.accessToken);

        try {
            // Fetch ~30 PRs (GitHub default limit is 30, max 100)
            const prRes = await axios.get(`https://api.github.com/repos/${owner}/${name}/pulls?state=all&per_page=30`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });

            const prs = prRes.data.map(pr => ({
                project: project._id,
                githubPrNumber: pr.number,
                title: pr.title,
                author: pr.user.login,
                status: pr.state === 'closed' ? (pr.merged_at ? 'MERGED' : 'CLOSED') : 'OPEN',
                githubCreatedAt: pr.created_at,
                githubUpdatedAt: pr.updated_at,
                githubClosedAt: pr.closed_at,
                githubMergedAt: pr.merged_at
            }));

            if (prs.length > 0) {
                // Use ordered: false to continue if some duplicates exist (though this is new project)
                await PullRequest.insertMany(prs, { ordered: false });
                console.log(`Synced ${prs.length} PRs for ${name}`);
            }
        } catch (syncError) {
            console.error('Initial PR Sync Failed (Non-fatal):', syncError.message);
            // Don't fail the request, just log it. Background job would retry in real app.
        }

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

// NEW: Delete Project (Cascading)
const Decision = require('../models/Decision'); // Ensure this import is present

exports.deleteProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // 1. Find Project and verify owner
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.importedBy.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: You do not own this project' });
        }

        // 2. Find associated PRs
        const prs = await PullRequest.find({ project: projectId });
        const prIds = prs.map(pr => pr._id);

        // 3. Delete Decisions (Cascade Level 2)
        if (prIds.length > 0) {
            const deleteDecisionsResult = await Decision.deleteMany({ pullRequest: { $in: prIds } });
            console.log(`Deleted ${deleteDecisionsResult.deletedCount} decisions for project ${project.name}`);
        }

        // 4. Delete PRs (Cascade Level 1)
        const deletePrsResult = await PullRequest.deleteMany({ project: projectId });
        console.log(`Deleted ${deletePrsResult.deletedCount} PRs for project ${project.name}`);

        // 5. Delete Project (Root)
        await Project.findByIdAndDelete(projectId);

        res.json({ message: 'Project and all associated data deleted successfully' });
    } catch (error) {
        console.error("Delete Project Error", error);
        res.status(500).json({ message: 'Failed to delete project' });
    }
};
