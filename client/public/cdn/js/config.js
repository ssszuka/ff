// Frontend Configuration for Dreamer's Land
const CONFIG = {
    // Domain Configuration
    DOMAINS: {
        BACKEND: 'https://janvi.jarvibeta.xyz',
        FRONTEND: 'https://f.janvi.jarvibeta.xyz'
    },

    // API Endpoints
    API: {
        INFO: '/api/info',
        VERIFY: '/api/verify',
        OAUTH2: '/OAuth2'
    },

    // Error handling
    ERROR: {
        PAGE: '/error',
        PARAM: 'msg'
    }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}