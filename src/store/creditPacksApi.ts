import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { CreditPack } from '../services/creditService';
import { config } from '../config/env';

export const creditPacksApi = createApi({
	reducerPath: 'creditPacksApi',
	baseQuery: fetchBaseQuery({ 
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