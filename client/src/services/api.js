const API_URL = ''; // Use proxy - same origin

// Token management
const TOKEN_KEY = 'whystack_token';

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Helper to add Authorization header
const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    // Auth
    login: () => {
        window.location.href = `${API_URL}/auth/github`;
    },

    getMe: async () => {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
    },

    logout: () => {
        console.log('🚪 Logging out - clearing token');
        clearToken();
        window.location.href = '/login';
    },

    // Token helpers
    setToken,
    getToken,
    clearToken,

    // Projects
    getProjects: async () => {
        const res = await fetch(`${API_URL}/projects`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
    },

    importProject: async (data) => {
        const res = await fetch(`${API_URL}/projects/import`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to import');
        return res.json();
    },

    // PRs
    getPRs: async (projectId) => {
        const res = await fetch(`${API_URL}/projects/${projectId}/prs`, {
            headers: getHeaders()
        });
        return res.json();
    },

    getDecision: async (prId) => {
        const res = await fetch(`${API_URL}/decisions/${prId}`, {
            headers: getHeaders()
        });
        if (res.status === 404) return null;
        return res.json();
    },

    saveDecision: async (prId, data) => {
        const res = await fetch(`${API_URL}/decisions/${prId}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    }
};
