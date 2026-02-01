const axios = require('axios');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth.middleware');

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

        // Encrypt the token
        const { encrypt } = require('../utils/crypto');
        const encryptedToken = encrypt(accessToken);

        if (!user) {
            user = new User({
                githubId: userData.id.toString(),
                username: userData.login,
                avatarUrl: userData.avatar_url,
                accessToken: encryptedToken,
            });
        } else {
            user.accessToken = encryptedToken; // Update token
            user.username = userData.login; // Update username if changed
            user.avatarUrl = userData.avatar_url;
        }

        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);
        console.log('✅ JWT token generated for user:', user.username);

        // Redirect to frontend with token in URL
        const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}`;
        console.log('🔄 Redirecting to:', redirectUrl);
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(500).send('Internal Server Error during Auth');
    }
};

exports.logout = (req, res) => {
    // No server-side action needed for JWT
    // Token is cleared client-side
    console.log('🚪 Logout requested (JWT - client-side clear)');
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173/login');
};

exports.getCurrentUser = async (req, res) => {
    try {
        // req.userId is set by auth middleware
        const user = await User.findById(req.userId).select('-accessToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user._id,
            username: user.username,
            avatarUrl: user.avatarUrl
        });
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
        let user = await User.findOne({ username, githubId: { $regex: /^dev-/ } });

        if (!user) {
            user = new User({
                githubId: `dev-${Math.floor(Math.random() * 100000)}`,
                username,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                accessToken: 'dev-token'
            });
            await user.save();
        }

        // Generate JWT token
        const token = generateToken(user._id);
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error('Dev Login Error:', error);
        res.status(500).send('Error during dev login');
    }
};
