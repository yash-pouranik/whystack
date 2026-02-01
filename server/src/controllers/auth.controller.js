const axios = require('axios');
const User = require('../models/User');

exports.login = (req, res) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=repo,user`;
    res.redirect(redirectUri);
};

exports.callback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        // Exchange code for token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(401).send('Authentication failed');
        }

        // Get User Profile
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userData = userResponse.data;

        // Upsert User
        let user = await User.findOne({ githubId: userData.id.toString() });

        if (!user) {
            user = new User({
                githubId: userData.id.toString(),
                username: userData.login,
                avatarUrl: userData.avatar_url,
                accessToken,
            });
        } else {
            user.accessToken = accessToken; // Update token
            user.username = userData.login; // Update username if changed
            user.avatarUrl = userData.avatar_url;
        }

        await user.save();

        // Set Session
        req.session.userId = user._id;

        // Redirect to frontend (or home for now)
        res.redirect(process.env.CLIENT_URL || '/');
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(500).send('Internal Server Error during Auth');
    }
};

exports.logout = (req, res) => {
    req.session = null;
    res.redirect('/');
};

exports.getCurrentUser = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const user = await User.findById(req.session.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// DEV ONLY: Login with any username for testing
exports.devLogin = async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).send('Username required');

    try {
        // Find existing or create dummy user
        // We use a dummy ID like 'dev-123'
        let user = await User.findOne({ username, githubId: { $regex: /^dev-/ } });

        if (!user) {
            user = new User({
                githubId: `dev-${Math.floor(Math.random() * 100000)}`,
                username: username,
                avatarUrl: 'https://via.placeholder.com/150',
                accessToken: 'dev-token-placeholder', // Won't work for real GitHub calls
            });
            await user.save();
        }

        req.session.userId = user._id;
        res.json({ message: 'Dev login successful', user });
    } catch (error) {
        console.error('Dev Auth Error:', error);
        res.status(500).send('Dev Auth Failed');
    }
};
