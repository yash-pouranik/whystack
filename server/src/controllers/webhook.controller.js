const { verifySignature } = require('../utils/githubSignature');
const Project = require('../models/Project');
const PullRequest = require('../models/PullRequest');
const Decision = require('../models/Decision');

exports.handleGithubWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-hub-signature-256'];
        const event = req.headers['x-github-event'];

        // 1. Verify Signature
        if (!verifySignature(signature, req.body, process.env.GITHUB_WEBHOOK_SECRET)) {
            console.warn('Invalid Webhook Signature');
            return res.status(401).send('Invalid Signature');
        }

        // Parse payload
        let payload;
        try {
            payload = JSON.parse(req.body.toString());
        } catch (e) {
            console.error('Webhook Payload Parse Error:', e);
            return res.status(400).send('Invalid JSON Payload');
        }

        // 2. Only handle pull_request events
        if (event !== 'pull_request') {
            return res.status(200).send('Ignored event type');
        }

        const { action, pull_request, repository } = payload;

        // Guard clauses for essential data
        if (!pull_request || !repository) {
            console.error('Missing pull_request or repository in payload');
            return res.status(400).send('Invalid payload structure');
        }

        // Filter supported actions
        if (!['opened', 'closed', 'reopened', 'synchronize'].includes(action)) {
            return res.status(200).send('Ignored action');
        }

        console.log(`Received PR event: ${action} for repo ${repository.id}, PR #${pull_request.number}`);

        // 3. Find associated Project
        const project = await Project.findOne({ githubRepoId: repository.id.toString() });

        if (!project) {
            console.log(`Project not found for repo ${repository.id}. Ignoring.`);
            return res.status(200).send('Project not tracked');
        }

        // 4. Determine Status & Metadata
        // Default to current status if synchronous update, otherwise calculate
        let status;

        if (action === 'synchronize') {
            // For code updates, we do NOT change the status.
            // We needs to fetch existing status or just undefined to trigger "no change" in update?
            // Mongoose update: if status is undefined, it won't update it.
            status = undefined;
        } else if (action === 'closed') {
            status = pull_request.merged ? 'MERGED' : 'CLOSED';
        } else {
            // opened, reopened
            status = 'OPEN';
        }

        const prData = {
            project: project._id,
            githubPrNumber: pull_request.number,
            title: pull_request.title,
            author: pull_request.user.login,
            // Explicit GitHub timestamps
            githubCreatedAt: pull_request.created_at,
            githubUpdatedAt: pull_request.updated_at,
            githubClosedAt: pull_request.closed_at,
            githubMergedAt: pull_request.merged_at,
            // System timestamp for this update
            updatedAt: new Date()
        };

        // Only update status if explicitly set (skip for synchronize)
        if (status) {
            prData.status = status;
        }

        // 5. Upsert Pull Request (Idempotency)
        // We use setOnInsert for creation-only fields if needed, 
        // but here we mostly want latest data from GitHub.
        const pr = await PullRequest.findOneAndUpdate(
            { project: project._id, githubPrNumber: pull_request.number },
            { $set: prData },
            { new: true, upsert: true }
        );

        // 6. Check Decision State (Post-update)
        // "On PR merged: if decision missing -> flag as 'merged_without_decision'"
        // We do not mutate decision state here.
        if (status === 'MERGED') {
            const decision = await Decision.findOne({ pullRequest: pr._id });

            // Flag if NO decision OR decision is PENDING
            if (!decision || decision.status === 'PENDING') {
                if (!pr.mergedWithoutDecision) {
                    pr.mergedWithoutDecision = true;
                    await pr.save();
                    console.log(`Flagged PR #${pr.githubPrNumber} as merged_without_decision`);
                }
            } else {
                // If decision exists & DOCUMENTED, ensure flag is clear
                if (pr.mergedWithoutDecision) {
                    pr.mergedWithoutDecision = false;
                    await pr.save();
                }
            }
        }

        res.status(200).send('Processed');
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
