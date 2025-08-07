import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { config } from '../config/env';

// Types based on the API documentation
export interface CreditTransaction {
	id: string;
	userId: string;
	type: 'purchase' | 'usage' | 'adjustment';
	amount: number;
	description: string;
	source: 'stripe' | 'chatbot' | 'comparator' | 'admin' | 'system';
	referenceId?: string;
	packId?: string;
	createdAt: string;
	balanceAfter?: number;
}

export interface CreditTransactionsFilters {
	type?: 'purchase' | 'usage' | 'adjustment';
	startDate?: string;
	endDate?: string;
	limit?: number;
	offset?: number;
}

export interface CreditTransactionsResponse {
	status: string;
	message: string;
	transactions: CreditTransaction[];
	pagination: {
		total: number;
		limit: number;
		offset: number;
		hasMore: boolean;
	};
	filters: {
		type?: string;
		startDate?: string;
		endDate?: string;
	};
}

export interface CreditTransactionResponse {
	status: string;
	message: string;
	data: CreditTransaction;
}

export const creditTransactionsApi = createApi({
	reducerPath: 'creditTransactionsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: config.coreApiUrl,
		credentials: 'include', // Include cookies in requests
	}),
	// Global configuration - keep unused data for 5 minutes
	keepUnusedDataFor: 5 * 60, // 5 minutes in seconds
	tagTypes: ['CreditTransactions'],
	endpoints: (build) => ({
		getCreditTransactions: build.query<
			CreditTransactionsResponse,
			CreditTransactionsFilters | void
		>({
			query: (filters) => {
				const params = new URLSearchParams();
				if (filters) {
					if (filters.type) params.append('type', filters.type);
					if (filters.startDate) params.append('startDate', filters.startDate);
					if (filters.endDate) params.append('endDate', filters.endDate);
					if (filters.limit) params.append('limit', filters.limit.toString());
					if (filters.offset) params.append('offset', filters.offset.toString());
				}
				const queryString = params.toString();
				return `/credit-transactions${queryString ? `?${queryString}` : ''}`;
			},
			// Configuration for this specific endpoint
			keepUnusedDataFor: 5 * 60, // 5 minutes
			providesTags: ['CreditTransactions'],
			transformResponse: (response: CreditTransactionsResponse) => response,
		}),
		getCreditTransactionById: build.query<CreditTransaction, string>({
			query: (id) => `/credit-transactions/${id}`,
			// Configuration for this specific endpoint
			keepUnusedDataFor: 5 * 60, // 5 minutes
			providesTags: (result, error, id) => [{ type: 'CreditTransactions', id }],
			transformResponse: (response: CreditTransactionResponse) => response.data,
		}),
	}),
});

export const {
	useGetCreditTransactionsQuery,
	useGetCreditTransactionByIdQuery,
	useLazyGetCreditTransactionsQuery,
} = creditTransactionsApi;
