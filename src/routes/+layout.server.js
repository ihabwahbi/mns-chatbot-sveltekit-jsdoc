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