import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { config } from '../config/env';

// Types
export interface Insurer {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InsurerListResponse {
  status: string;
  message: string;
  data: Insurer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ApiErrorResponse {
  status: 'error';
  error: {
    code: string;
    message: string;
  };
}

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: `${config.coreApiUrl}/insurers`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Query parameters interface
interface GetInsurersParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  isActive?: boolean;
  supportedProducts?: string;
  category?: 'auto' | 'home' | 'health' | 'life' | 'disability';
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'rating' | 'country' | 'isActive';
  sortOrder?: 'asc' | 'desc';
}

export const insurersApi = createApi({
  reducerPath: 'insurersApi',
  baseQuery,
  tagTypes: ['Insurer'],
  endpoints: (builder) => ({
    // Get insurers with optional filters and pagination
    getInsurers: builder.query<InsurerListResponse, GetInsurersParams | void>({
      keepUnusedDataFor: 5 * 60, // 5 minutes in seconds (shorter cache for search results)
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.country) searchParams.append('country', params.country);
        if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
        if (params?.supportedProducts) searchParams.append('supportedProducts', params.supportedProducts);
        if (params?.category) searchParams.append('category', params.category);
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        const queryString = searchParams.toString();
        return {
          url: queryString ? `?${queryString}` : '',
          method: 'GET',
        };
      },
      transformResponse: (response: InsurerListResponse) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data?.error?.message || 'Une erreur est survenue',
        code: response.data?.error?.code || 'UNKNOWN_ERROR',
      }),
      providesTags: ['Insurer'],
    }),
  }),
});

export const { useGetInsurersQuery, useLazyGetInsurersQuery } = insurersApi;
