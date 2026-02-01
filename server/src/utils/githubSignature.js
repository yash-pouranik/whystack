const crypto = require('crypto');

/**
 * Verifies the GitHub webhook signature
 * @param {string} signature - The signature from the X-Hub-Signature-256 header
 * @param {Buffer} payload - The raw request body
 * @param {string} secret - The webhook secret
 * @returns {boolean} - True if signature is valid
 */
exports.verifySignature = (signature, payload, secret) => {
    if (!signature || !payload || !secret) {
        return false;
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    // Constant time comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};
