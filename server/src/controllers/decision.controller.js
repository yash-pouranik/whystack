const axios = require('axios');
const Decision = require('../models/Decision');
const PullRequest = require('../models/PullRequest');
const Project = require('../models/Project');
const User = require('../models/User');

// Helper to check permissions
const checkWritePermission = async (user, project, pullRequest) => {
    // 1. Is Repo Owner?
    // We stored owner username in Project.owner
    if (project.owner === user.username) return true;

    // 2. Is PR Author?
    if (pullRequest.author === user.username) return true;

    // 3. Is allowed Collaborator?
    // Check via GitHub API: GET /repos/{owner}/{repo}/collaborators/{username}
    // OR check repo permissions with user token: GET /repos/{owner}/{repo}
    try {
        const response = await axios.get(`https://api.github.com/repos/${project.owner}/${project.name}`, {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        });
        const permissions = response.data.permissions;
        // Push access implies write ability
        if (permissions && (permissions.push || permissions.admin)) {
            return true;
        }
    } catch (error) {
        console.error('Error checking permissions:', error.message);
    }

    return false;
};

exports.createOrUpdateDecision = async (req, res) => {
    const { what, why, optionsConsidered, tradeoffs } = req.body;
    const { pullRequestId } = req.params;

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const pr = await PullRequest.findById(pullRequestId).populate('project');
        if (!pr) return res.status(404).json({ message: 'PR not found' });

        // Check Access
        const canWrite = await checkWritePermission(user, pr.project, pr);
        if (!canWrite) {
            return res.status(403).json({ message: 'Forbidden: You cannot write a decision for this PR' });
        }

        let decision = await Decision.findOne({ pullRequest: pr._id });

        if (decision) {
            // Update
            decision.what = what;
            decision.why = why;
            decision.optionsConsidered = optionsConsidered;
            decision.tradeoffs = tradeoffs;
            decision.version += 1; // Increment version
            decision.updatedAt = Date.now();
            // Ensure status is documented
            decision.status = 'DOCUMENTED';
        } else {
            // Create
            decision = new Decision({
                pullRequest: pr._id,
                what,
                why,
                optionsConsidered,
                tradeoffs,
                author: user.username,
                status: 'DOCUMENTED'
            });
        }

        await decision.save();

        // If PR is marked as mergedWithoutDecision, clear it?
        // SRS doesn't explicitly say clear it, but "Decision written -> DOCUMENTED" implies good state.
        if (pr.mergedWithoutDecision) {
            pr.mergedWithoutDecision = false;
            await pr.save();
        }

        res.json(decision);
    } catch (error) {
        console.error('Create Decision Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getDecisionByPR = async (req, res) => {
    const { pullRequestId } = req.params;
    try {
        const decision = await Decision.findOne({ pullRequest: pullRequestId });
        if (!decision) return res.status(404).json({ message: 'Decision not found' });
        res.json(decision);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.searchDecisions = async (req, res) => {
    const { q, repoId, author } = req.query;

    try {
        const query = {};

        // Keyword search
        if (q) {
            query.$text = { $search: q };
        }

        // Author filter
        if (author) {
            query.author = author;
        }

        // Repo filter (requires join logic or secondary query)
        if (repoId) {
            // Find PRs in this project
            const project = await Project.findOne({ githubRepoId: repoId });
            if (project) {
                const prs = await PullRequest.find({ project: project._id }).select('_id');
                const prIds = prs.map(pr => pr._id);
                query.pullRequest = { $in: prIds };
            }
        }

        const decisions = await Decision.find(query)
            .populate({
                path: 'pullRequest',
                populate: { path: 'project' }
            })
            .sort({ createdAt: -1 });

        res.json(decisions);
    } catch (error) {
        console.error('Search Error:', error.message);
        res.status(500).json({ message: 'Search Failed' });
    }
};
