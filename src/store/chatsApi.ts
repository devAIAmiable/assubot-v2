import type {
	Chat,
	ChatFilters,
	CreateChatRequest,
	MessageFilters,
	PaginatedChatResponse,
	PaginatedMessageResponse,
	UpdateChatRequest,
} from '../types/chat';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { config } from '../config/env';

// Note: ApiResponse interface removed as it's not used in this API

interface ApiErrorResponse {
	status: 'error';
	error: {
		code: string;
		message: string;
	};
}

// Base query with authentication
const baseQuery = fetchBaseQuery({
	baseUrl: `${config.coreApiUrl}/chats`,
	credentials: 'include',
	prepareHeaders: (headers) => {
		headers.set('Content-Type', 'application/json');
		return headers;
	},
});

export const chatsApi = createApi({
	reducerPath: 'chatsApi',
	baseQuery,
	tagTypes: ['Chat', 'Message'],
	endpoints: (builder) => ({
		// Get paginated chats for the authenticated user
		getChats: builder.query<PaginatedChatResponse, ChatFilters | undefined>({
			keepUnusedDataFor: 30 * 60, // 30 minutes in seconds
			query: (filters = {}) => {
				const queryParams: Record<string, string | number> = {
					page: filters.page || 1,
					limit: Math.min(filters.limit || 10, 100), // Ensure limit doesn't exceed 100
				};

				// Add optional parameters if they exist
				if (filters.sortBy) queryParams.sortBy = filters.sortBy;
				if (filters.sortOrder) queryParams.sortOrder = filters.sortOrder;
				if (filters.search && filters.search.trim().length >= 2) {
					queryParams.search = filters.search.trim();
				}

				return {
					url: '/',
					method: 'GET',
					params: queryParams,
				};
			},
			transformResponse: (response: any) => {
				// Handle the actual API response structure
				if (response.status === 'success' && response.data) {
					return {
						chats: response.data,
						pagination: response.pagination,
					};
				}
				// Fallback to original structure if different
				return response;
			},
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
			providesTags: ['Chat'],
		}),

		// Get a specific chat by ID
		getChatById: builder.query<Chat, string>({
			keepUnusedDataFor: 30 * 60, // 30 minutes in seconds
			query: (chatId) => ({
				url: `/${chatId}`,
				method: 'GET',
			}),
			transformResponse: (response: Chat) => response,
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
			providesTags: (_result, _error, chatId) => [{ type: 'Chat', id: chatId }],
		}),

		// Create a new chat
		createChat: builder.mutation<{ chat: Chat; message: string }, CreateChatRequest>({
			query: (chatData) => ({
				url: '/',
				method: 'POST',
				body: chatData,
			}),
			transformResponse: (response: { chat: Chat; message: string }) => response,
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
			invalidatesTags: ['Chat'],
		}),

		// Update a specific chat by ID
		updateChat: builder.mutation<Chat, { id: string; data: UpdateChatRequest }>({
			query: ({ id, data }) => ({
				url: `/${id}`,
				method: 'PUT',
				body: data,
			}),
			transformResponse: (response: Chat) => response,
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
			invalidatesTags: (_result, _error, { id }) => [{ type: 'Chat', id }, { type: 'Chat' }],
		}),

		// Delete a specific chat by ID
		deleteChat: builder.mutation<{ message: string }, string>({
			query: (chatId) => ({
				url: `/${chatId}`,
				method: 'DELETE',
			}),
			transformResponse: (response: { message: string }) => response,
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
			invalidatesTags: (_result, _error, chatId) => [
				{ type: 'Chat', id: chatId },
				{ type: 'Chat' },
			],
		}),

		// Get paginated messages for a specific chat
		getChatMessages: builder.query<PaginatedMessageResponse, { chatId: string; filters?: MessageFilters }>({
			keepUnusedDataFor: 5 * 60, // 5 minutes in seconds
			query: ({ chatId, filters = {} }) => {
				const queryParams: Record<string, string | number> = {
					page: filters.page || 1,
					limit: Math.min(filters.limit || 20, 100), // Ensure limit doesn't exceed 100
					sortBy: filters.sortBy || 'createdAt',
					sortOrder: filters.sortOrder || 'asc',
				};

				return {
					url: `/${chatId}/messages`,
					method: 'GET',
					params: queryParams,
				};
			},
			transformResponse: (response: any) => {
				// Handle the actual API response structure
				if (response.status === 'success' && response.data) {
					return {
						messages: response.data,
						pagination: response.pagination,
					};
				}
				// Fallback to original structure if different
				return response;
			},
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
			providesTags: (_result, _error, { chatId }) => [{ type: 'Message', id: chatId }],
		}),
	}),
});

export const {
	useGetChatsQuery,
	useGetChatByIdQuery,
	useGetChatMessagesQuery,
	useCreateChatMutation,
	useUpdateChatMutation,
	useDeleteChatMutation,
} = chatsApi;
