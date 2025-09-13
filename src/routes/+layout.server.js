// Disable prerendering for all pages since we need authentication
export const prerender = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch, url }) {
    // Skip authentication check during build/prerender
    if (url.hostname === 'sveltekit-prerender') {
        return {
            user: null
        };
    }

    // TEMPORARY: Mock user for preview testing without authentication
    // This should be removed before merging to production
    const PREVIEW_MODE = true; // Set to false before merging to production

    if (PREVIEW_MODE) {
        return {
            user: {
                identityProvider: 'mock',
                userId: 'preview-user',
                userDetails: 'Preview User',
                userRoles: ['anonymous', 'authenticated'],
                claims: []
            }
        };
    }

    try {
        const response = await fetch('/.auth/me');

        if (!response.ok) {
            return {
                user: null,
                error: 'Failed to fetch user information'
            };
        }

        const data = await response.json();

        return {
            user: data?.clientPrincipal || null
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            user: null,
            error: 'Authentication service unavailable'
        };
    }
}