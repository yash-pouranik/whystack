const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({
    pullRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PullRequest',
        required: true,
        unique: true // One decision per PR
    },
    what: {
        type: String, // "Summary of change"
        required: true
    },
    why: {
        type: String, // "Reasoning" - CORE
        required: true
    },
    optionsConsidered: {
        type: String
    },
    tradeoffs: {
        type: String
    },
    author: {
        type: String, // GitHub username who wrote the decision
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'DOCUMENTED'],
        default: 'PENDING'
    },
    version: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Search indexes
decisionSchema.index({ what: 'text', why: 'text', optionsConsidered: 'text', tradeoffs: 'text' });

module.exports = mongoose.model('Decision', decisionSchema);
