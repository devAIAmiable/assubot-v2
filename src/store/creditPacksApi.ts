import type { CreditPack } from '../services/creditService';
import { config } from '../config/env';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithAuth } from '../utils/baseQueryWithAuth';

export const creditPacksApi = createApi({
  reducerPath: 'creditPacksApi',
  baseQuery: createBaseQueryWithAuth({
    baseUrl: config.coreApiUrl,
    credentials: 'include', // Include cookies in requests
  }),
  // Global configuration - keep unused data for 10 minutes
  keepUnusedDataFor: 10 * 60, // 10 minutes in seconds
  tagTypes: ['CreditPacks'],
  endpoints: (build) => ({
    getCreditPacks: build.query<CreditPack[], void>({
      query: () => '/credit-packs',
      // Configuration for this specific endpoint
      keepUnusedDataFor: 10 * 60, // 10 minutes
      providesTags: ['CreditPacks'],
      transformResponse: (response: { status: string; message: string; creditPacks: CreditPack[] }) => response.creditPacks,
    }),
  }),
});

export const { useGetCreditPacksQuery } = creditPacksApi;
