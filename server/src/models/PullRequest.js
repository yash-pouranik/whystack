const mongoose = require('mongoose');

const pullRequestSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    githubPrNumber: {
        type: Number,
        required: true
    },
    title: String,
    author: String, // GitHub username
    status: {
        type: String,
        enum: ['OPEN', 'MERGED', 'CLOSED'],
        default: 'OPEN'
    },
    mergedWithoutDecision: {
        type: Boolean,
        default: false
    },
    // Timestamps from GitHub (Explicit)
    githubCreatedAt: Date,
    githubUpdatedAt: Date,
    githubClosedAt: Date,
    githubMergedAt: Date,

    // System Timestamps (Mongoose)
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Enable automatic timestamps for system fields

// Index for easy lookup
pullRequestSchema.index({ project: 1, githubPrNumber: 1 }, { unique: true });

module.exports = mongoose.model('PullRequest', pullRequestSchema);
