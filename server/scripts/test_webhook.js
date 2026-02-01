const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config({ path: './.env' });

const { GITHUB_WEBHOOK_SECRET, PORT } = process.env;
const SERVER_URL = `http://localhost:${PORT || 5000}/webhooks/github`;

if (!GITHUB_WEBHOOK_SECRET) {
    console.error('Error: GITHUB_WEBHOOK_SECRET is missing in ../.env');
    process.exit(1);
}

// Helper to sign payload
const sign = (payloadString) => {
    const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
    return 'sha256=' + hmac.update(payloadString).digest('hex');
};

const sendWebhook = async (event, payloadObj) => {
    try {
        // Crucial: Stringify ONCE and use that string for both signing AND sending
        // This ensures the server receives exactly what we signed.
        const payloadString = JSON.stringify(payloadObj);
        const signature = sign(payloadString);

        console.log(`Sending ${event} webhook to ${SERVER_URL}...`);

        const response = await axios.post(SERVER_URL, payloadString, {
            headers: {
                'x-github-event': event,
                'x-hub-signature-256': signature,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Success: ${response.status} ${response.data}`);
    } catch (error) {
        if (error.response) {
            console.error(`Failed: ${error.response.status} ${error.response.data}`);
        } else {
            console.error(`Error: ${error.message}`);
        }
    }
};

// Simulate PR Opened
const prOpenedPayload = {
    action: 'opened',
    pull_request: {
        number: 1,
        title: 'Test PR #1',
        user: { login: 'yash-pouranik' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        state: 'open',
        merged: false
    },
    repository: {
        id: 1138329404,
        full_name: 'yash-pouranik/testrepo'
    }
};

// Simulate PR Merged
const prMergedPayload = {
    action: 'closed',
    pull_request: {
        number: 1,
        title: 'Test PR #1',
        user: { login: 'yash-pouranik' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        closed_at: new Date().toISOString(),
        merged_at: new Date().toISOString(),
        state: 'closed',
        merged: true
    },
    repository: {
        id: 1138329404,
        full_name: 'yash-pouranik/testrepo'
    }
};

const run = async () => {
    console.log('--- Simulating PR Opened ---');
    await sendWebhook('pull_request', prOpenedPayload);

    console.log('\n--- Simulating PR Merged (after 2s) ---');
    setTimeout(async () => {
        await sendWebhook('pull_request', prMergedPayload);
    }, 2000);
};

run();
