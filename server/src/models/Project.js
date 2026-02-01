const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    githubRepoId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String, // Github username or owner login
        required: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    // Link to our internal User who imported it? SRS says "Repository Owner... Imports repositories"
    importedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);
