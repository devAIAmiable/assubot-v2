import { config } from '../config/env';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithAuth } from '../utils/baseQueryWithAuth';

// Single document download response
interface SingleDocumentDownloadResponse {
  status: string;
  message: string;
  url: string;
  expiresAt: string;
  type: string;
}

interface ApiErrorResponse {
  status: 'error';
  error: {
    code: string;
    message: string;
  };
}

// Base query with authentication and 401 auto-logout
const baseQuery = createBaseQueryWithAuth({
  baseUrl: `${config.coreApiUrl}/documents`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const internalDocumentApi = createApi({
  reducerPath: 'internalDocumentApi',
  baseQuery,
  tagTypes: ['InternalDocument'],
  endpoints: (builder) => ({
    // Download internal document (general documents like code_mutualite, etc.)
    downloadInternalDocument: builder.mutation<SingleDocumentDownloadResponse, { url: string; documentType: string }>({
      query: ({ url, documentType }) => ({
        url: '/internal/download',
        method: 'POST',
        body: { url, documentType },
      }),
      transformResponse: (response: SingleDocumentDownloadResponse) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data?.error?.message || 'Une erreur est survenue',
        code: response.data?.error?.code || 'UNKNOWN_ERROR',
      }),
    }),
  }),
});

export const { useDownloadInternalDocumentMutation } = internalDocumentApi;
