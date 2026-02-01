const crypto = require('crypto');

// Use a consistent key for MVP (in prod, use process.env.ENCRYPTION_KEY)
// Key must be 32 bytes for aes-256-cbc
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';
const IV_LENGTH = 16; // For AES, this is always 16

const encrypt = (text) => {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // Store IV with encrypted text: iv:encrypted
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text) => {
    if (!text) return text;
    try {
        const textParts = text.split(':');
        // Handle unencrypted legacy tokens (optional, but good for transition)
        // If it doesn't match iv:encrypted format (simple check)
        if (textParts.length !== 2) return text;

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption failed, returning original (legacy support?):', error.message);
        return text;
    }
};

module.exports = { encrypt, decrypt };
