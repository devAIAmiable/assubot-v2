import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { config } from '../config/env';

// Types based on the actual API response
export interface GeneralTerms {
	id: string;
	title: string;
	content: string;
	version: string;
	status: 'draft' | 'published' | 'archived';
	isActive: boolean;
	publishedAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface GeneralTermsResponse {
	status: string;
	message: string;
	title: string;
	content: string;
	version: string;
	isActive: boolean;
	id: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export const generalTermsApi = createApi({
	reducerPath: 'generalTermsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: config.coreApiUrl,
		credentials: 'include',
	}),
	keepUnusedDataFor: 10 * 60, // 10 minutes
	tagTypes: ['GeneralTerms'],
	endpoints: (build) => ({
		getActiveGeneralTerms: build.query<GeneralTermsResponse, void>({
			query: () => '/general-terms/active',
			keepUnusedDataFor: 10 * 60,
			providesTags: ['GeneralTerms'],
			transformResponse: (response: GeneralTermsResponse) => response,
		}),
	}),
});

export const { useGetActiveGeneralTermsQuery } = generalTermsApi; 