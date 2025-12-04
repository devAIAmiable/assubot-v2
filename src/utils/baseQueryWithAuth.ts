/**
 * Shared RTK Query base query wrapper with 401 auto-logout handling
 * Wraps fetchBaseQuery to automatically log out users on 401 errors (except auth endpoints)
 */

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { handleUnauthorizedLogout } from './authHelpers';
import { isAuthEndpoint } from './authEndpoints';

interface BaseQueryConfig {
  baseUrl: string;
  credentials?: RequestCredentials;
  prepareHeaders?: (headers: Headers) => Headers;
}

/**
 * Creates a base query function with 401 auto-logout handling
 * @param config - Configuration for fetchBaseQuery
 * @returns A base query function that wraps fetchBaseQuery with 401 handling
 */
export const createBaseQueryWithAuth = (config: BaseQueryConfig): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQuery = fetchBaseQuery({
    baseUrl: config.baseUrl,
    credentials: config.credentials || 'include',
    prepareHeaders: config.prepareHeaders,
  });

  return async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    // Check for 401 errors
    if ('error' in result && result.error) {
      const error = result.error as FetchBaseQueryError;

      // Check if it's a 401 status (numeric status code)
      if (typeof error.status === 'number' && error.status === 401) {
        // Extract the endpoint URL from args
        let endpoint = '';
        if (typeof args === 'string') {
          endpoint = args;
        } else if (typeof args === 'object' && 'url' in args) {
          endpoint = args.url;
        }

        // Construct full URL for checking (combine baseUrl and endpoint)
        let fullUrl = endpoint;
        if (!endpoint.startsWith('http')) {
          // Remove query string for endpoint checking
          const endpointPath = endpoint.split('?')[0];
          // Combine baseUrl and endpoint path, handling slashes
          const baseUrlClean = config.baseUrl.replace(/\/+$/, '');
          const endpointClean = endpointPath.replace(/^\/+/, '');
          fullUrl = `${baseUrlClean}/${endpointClean}`;
        }

        // Only logout if it's not an auth endpoint
        if (!isAuthEndpoint(fullUrl)) {
          handleUnauthorizedLogout();
        }
      }
    }

    return result;
  };
};
