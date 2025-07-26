/**
 * API configuration file
 * Contains endpoints and configuration for external services
 */

// Cloudflare Worker endpoint for blog view counting
export const CLOUDFLARE_WORKER_ENDPOINT = 'https://3c2fa4bd-blog-counter.ajfairbanksblog.workers.dev';

// Other API endpoints can be added here
export const API_CONFIG = {
  viewCounter: {
    endpoint: CLOUDFLARE_WORKER_ENDPOINT,
    timeout: 5000, // ms
  }
};

export default API_CONFIG; 