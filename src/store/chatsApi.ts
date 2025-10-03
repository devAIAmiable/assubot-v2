import type {
  ApiSuccessResponse,
  Chat,
  ChatFilters,
  ChatMessage,
  CreateChatRequest,
  CreateChatResponse,
  MessageFilters,
  PaginatedChatResponse,
  PaginatedMessageResponse,
  SendMessageApiResponse,
  SendMessageRequest,
  SendMessageResponse,
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
      transformResponse: (response: ApiSuccessResponse<Chat[]> | PaginatedChatResponse): PaginatedChatResponse => {
        // Handle the actual API response structure
        if ('status' in response && response.status === 'success' && response.data) {
          return {
            chats: response.data,
            pagination: response.pagination || {
              page: 1,
              limit: 10,
              total: response.data.length,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
        // Fallback to original structure if different
        return response as PaginatedChatResponse;
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
    createChat: builder.mutation<CreateChatResponse, CreateChatRequest>({
      query: (chatData) => ({
        url: '/',
        method: 'POST',
        body: chatData,
      }),
      transformResponse: (response: CreateChatResponse) => response,
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
      invalidatesTags: (_result, _error, chatId) => [{ type: 'Chat', id: chatId }, { type: 'Chat' }],
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
      transformResponse: (response: ApiSuccessResponse<ChatMessage[]> | PaginatedMessageResponse): PaginatedMessageResponse => {
        // Handle the actual API response structure
        if ('status' in response && response.status === 'success' && response.data) {
          return {
            messages: response.data,
            pagination: response.pagination || {
              page: 1,
              limit: 20,
              total: response.data.length,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
        // Fallback to original structure if different
        return response as PaginatedMessageResponse;
      },
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      providesTags: (_result, _error, { chatId }) => [{ type: 'Message', id: chatId }],
    }),

    // Send a message to a specific chat
    sendMessage: builder.mutation<SendMessageResponse, { chatId: string; message: SendMessageRequest }>({
      query: ({ chatId, message }) => ({
        url: `/${chatId}/messages`,
        method: 'POST',
        body: message,
      }),
      transformResponse: (response: ApiSuccessResponse<SendMessageApiResponse> | SendMessageResponse) => {
        // Handle the actual API response structure
        if ('status' in response && response.status === 'success' && response.data) {
          return {
            message: response.data.message,
            chat: response.data.chat,
            usedCredits: response.data.usedCredits,
            remainingCredits: response.data.remainingCredits,
          };
        }
        // Fallback to original structure if different
        return response as SendMessageResponse;
      },
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      async onQueryStarted({ chatId, message }, { dispatch, queryFulfilled }) {
        // Generate optimistic message ID and timestamp
        const optimisticId = `optimistic-${Date.now()}-${Math.random()}`;
        const now = new Date();
        // Set timestamp slightly in the past to ensure it appears before assistant's response
        const optimisticTimestamp = new Date(now.getTime() - 1000).toISOString(); // 1 second ago

        const optimisticMessage = {
          id: optimisticId,
          chatId,
          content: message.content,
          role: message.role,
          createdAt: optimisticTimestamp,
          updatedAt: optimisticTimestamp,
        };

        // Optimistically update the cache with user message
        const patchResult = dispatch(
          chatsApi.util.updateQueryData('getChatMessages', { chatId, filters: { page: 1, limit: 50, sortOrder: 'asc' } }, (draft) => {
            if (draft && draft.messages) {
              draft.messages.push(optimisticMessage);
            }
          })
        );

        try {
          const { data } = await queryFulfilled;

          // Update with real response data
          dispatch(
            chatsApi.util.updateQueryData('getChatMessages', { chatId, filters: { page: 1, limit: 50, sortOrder: 'asc' } }, (draft) => {
              if (draft && draft.messages) {
                // Keep the optimistic user message and add the assistant's message
                // The API response contains the assistant's message, not the user's message

                // Add the assistant's message from API response
                // Check if assistant message already exists to avoid duplicates
                const assistantExists = draft.messages.some(
                  (msg) =>
                    msg.role === 'assistant' &&
                    msg.content === data.message.content &&
                    Math.abs(new Date(msg.createdAt).getTime() - new Date(data.message.createdAt).getTime()) < 5000 // Within 5 seconds
                );

                if (!assistantExists) {
                  // Ensure the assistant message has the correct role
                  const assistantMessage = {
                    ...data.message,
                    role: 'assistant' as const,
                  };
                  draft.messages.push(assistantMessage);
                  // Sort messages by creation time to ensure proper order
                  draft.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                }
              }
            })
          );

          // Update user credits if provided
          if (data.remainingCredits !== undefined) {
            dispatch({ type: 'user/updateCredits', payload: data.remainingCredits });
          }

          // Update chat last message
          dispatch({ type: 'chat/updateChatLastMessage', payload: { chatId, message: data.message } });

          // Store quick actions if provided
          if (data.actions && Array.isArray(data.actions)) {
            dispatch({ type: 'chat/setQuickActions', payload: { chatId, actions: data.actions } });
          }
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
          throw error;
        }
      },
      invalidatesTags: (_result, _error, { chatId }) => [{ type: 'Chat', id: chatId }, { type: 'Chat' }],
    }),
  }),
});

export const { useGetChatsQuery, useGetChatByIdQuery, useGetChatMessagesQuery, useSendMessageMutation, useCreateChatMutation, useUpdateChatMutation, useDeleteChatMutation } =
  chatsApi;
