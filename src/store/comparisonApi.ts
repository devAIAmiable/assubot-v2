import type {
  ComparisonApiResponse,
  ComparisonCalculationRequest,
  ComparisonCalculationResponse,
  ComparisonCategory,
  ComparisonOfferDetails,
  ComparisonQuery,
  ComparisonSearchParams,
  ComparisonSession,
  ComparisonSessionStatus,
  CreateComparisonQueryParams,
  CreateComparisonSessionParams,
  UpdateComparisonSessionParams,
} from '../types/comparison';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import config from '../config/env';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: config.coreApiUrl,
  credentials: 'include',
  prepareHeaders: (headers) => {
    // Headers are handled by credentials: 'include' for cookie-based auth
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const comparisonApi = createApi({
  reducerPath: 'comparisonApi',
  baseQuery,
  tagTypes: ['ComparisonResult', 'ComparisonSession', 'ComparisonQuery', 'ComparisonOffer'],
  // Suppress error logging for development when API endpoints don't exist
  refetchOnMountOrArgChange: false,
  endpoints: (builder) => ({
    // Submit form data for comparison calculation
    calculateComparison: builder.mutation<ComparisonCalculationResponse, ComparisonCalculationRequest>({
      query: (body) => ({
        url: '/comparison/calculate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ComparisonResult'],
      transformResponse: (response: ComparisonApiResponse<ComparisonCalculationResponse>) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error?.message || 'Failed to calculate comparison');
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        const data = response.data as { error?: { message?: string } };
        return data?.error?.message || 'Network error';
      },
    }),

    // Phase 2 - Session management endpoints
    createComparisonSession: builder.mutation<ComparisonSession, CreateComparisonSessionParams>({
      query: (body) => ({
        url: '/comparison/sessions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ComparisonSession'],
    }),

    getComparisonSessions: builder.query<ComparisonSession[], { status?: ComparisonSessionStatus; category?: ComparisonCategory; limit?: number; offset?: number }>({
      query: (params) => ({
        url: '/comparison/sessions',
        params,
      }),
      providesTags: ['ComparisonSession'],
    }),

    getComparisonSession: builder.query<ComparisonSession, string>({
      query: (sessionId) => `/comparison/sessions/${sessionId}`,
      providesTags: (_, __, sessionId) => [{ type: 'ComparisonSession', id: sessionId }],
    }),

    updateComparisonSession: builder.mutation<ComparisonSession, { sessionId: string; updates: UpdateComparisonSessionParams }>({
      query: ({ sessionId, updates }) => ({
        url: `/comparison/sessions/${sessionId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_, __, { sessionId }) => [{ type: 'ComparisonSession', id: sessionId }],
    }),

    // Phase 2 - Natural language questions
    askQuestion: builder.mutation<ComparisonQuery, { sessionId: string; params: CreateComparisonQueryParams }>({
      query: ({ sessionId, params }) => ({
        url: `/comparison/sessions/${sessionId}/questions`,
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['ComparisonQuery'],
    }),

    getComparisonQuery: builder.query<ComparisonQuery, { sessionId: string; queryId: string }>({
      query: ({ sessionId, queryId }) => `/comparison/sessions/${sessionId}/questions/${queryId}`,
      providesTags: (_, __, { queryId }) => [{ type: 'ComparisonQuery', id: queryId }],
    }),

    // Additional endpoints from Swagger
    getComparisonOffers: builder.query<ComparisonOfferDetails[], { category: ComparisonCategory; limit?: number; offset?: number }>({
      query: (params) => ({
        url: '/comparison/offers',
        params,
      }),
      providesTags: ['ComparisonOffer'],
    }),

    getComparisonOffer: builder.query<ComparisonOfferDetails, string>({
      query: (id) => `/comparison/offers/${id}`,
      providesTags: (_, __, id) => [{ type: 'ComparisonOffer', id }],
    }),

    searchComparisonOffers: builder.mutation<ComparisonOfferDetails[], ComparisonSearchParams>({
      query: (body) => ({
        url: '/comparison/search',
        method: 'POST',
        body,
      }),
    }),

    getPopularOffers: builder.query<ComparisonOfferDetails[], { category?: ComparisonCategory; limit?: number }>({
      query: (params) => ({
        url: '/comparison/offers/popular',
        params,
      }),
      providesTags: ['ComparisonOffer'],
    }),

    getCheapestOffers: builder.query<ComparisonOfferDetails[], { category: ComparisonCategory; limit?: number }>({
      query: (params) => ({
        url: '/comparison/offers/cheapest',
        params,
      }),
      providesTags: ['ComparisonOffer'],
    }),
  }),
});

export const {
  // Phase 1 hooks
  useCalculateComparisonMutation,

  // Phase 2 hooks
  useCreateComparisonSessionMutation,
  useGetComparisonSessionsQuery,
  useGetComparisonSessionQuery,
  useUpdateComparisonSessionMutation,
  useAskQuestionMutation,
  useGetComparisonQueryQuery,

  // Additional offer hooks
  useGetComparisonOffersQuery,
  useGetComparisonOfferQuery,
  useSearchComparisonOffersMutation,
  useGetPopularOffersQuery,
  useGetCheapestOffersQuery,
} = comparisonApi;
