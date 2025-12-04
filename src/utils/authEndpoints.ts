/**
 * Utility to check if a URL is an authentication endpoint
 * Auth endpoints should be excluded from 401 auto-logout to prevent logout loops
 */

/**
 * Checks if a given URL matches an authentication endpoint pattern
 * @param url - The URL to check (can be full URL or just the path)
 * @returns true if the URL is an auth endpoint, false otherwise
 */
export const isAuthEndpoint = (url: string): boolean => {
  // Extract pathname from full URL if needed
  let pathname = url;
  try {
    // If it's a full URL, extract the pathname
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url);
      pathname = urlObj.pathname;
    } else {
      // Remove query string if present
      pathname = url.split('?')[0];
    }
  } catch {
    // If URL parsing fails, use the original string
    pathname = url.split('?')[0];
  }

  // Normalize pathname (remove leading/trailing slashes for consistent matching)
  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '');

  // List of auth endpoint patterns
  const authPatterns = [
    '/auth/login',
    '/auth/logout',
    '/auth/me',
    '/auth/session',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/refresh',
    '/auth/register',
    '/auth/verify/', // Note: verify endpoints have dynamic tokens
  ];

  // Check exact matches
  for (const pattern of authPatterns) {
    if (normalizedPath === pattern.replace(/^\/+|\/+$/g, '')) {
      return true;
    }
  }

  // Check for /auth/verify/* pattern (with token)
  if (/^auth\/verify\/.+/.test(normalizedPath)) {
    return true;
  }

  // Check for /auth/google* patterns
  if (/^auth\/google/.test(normalizedPath)) {
    return true;
  }

  return false;
};
