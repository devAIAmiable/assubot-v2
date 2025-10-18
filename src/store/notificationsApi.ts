import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import config from '../config/env';

// Notification types
export type NotificationType =
  | 'contract_processed'
  | 'contract_summarized'
  | 'comparison_ready'
  | 'new_message'
  | 'suggestions'
  | 'contract_expiring'
  | 'contract_expired'
  | 'credit_low'
  | 'credit_purchased'
  | 'payment_success'
  | 'payment_failed'
  | 'system'
  | 'info'
  | 'warning'
  | 'error';

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// API request/response interfaces
export interface GetNotificationsParams {
  isRead?: boolean;
  type?: NotificationType;
  limit?: number;
  offset?: number;
}

export interface GetNotificationsResponse {
  status: string;
  data: Notification[];
}

export interface UnreadCountResponse {
  status: string;
  data: {
    count: number;
  };
}

export interface MarkAsReadResponse {
  status: string;
  data: {
    id: string;
    isRead: boolean;
    readAt: string;
  };
}

export interface MarkAllReadResponse {
  status: string;
  data: {
    count: number;
  };
}

export interface DeleteNotificationResponse {
  status: string;
  data: {
    message: string;
  };
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.coreApiUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Notifications', 'UnreadCount'],
  endpoints: (builder) => ({
    // Get user notifications
    getNotifications: builder.query<GetNotificationsResponse, GetNotificationsParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Handle params being void or undefined
        if (params) {
          if (params.isRead !== undefined) {
            searchParams.append('isRead', String(params.isRead));
          }
          if (params.type) {
            searchParams.append('type', params.type);
          }
          if (params.limit !== undefined) {
            searchParams.append('limit', String(params.limit));
          }
          if (params.offset !== undefined) {
            searchParams.append('offset', String(params.offset));
          }
        }

        const queryString = searchParams.toString();
        return `/notifications${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Notifications'],
    }),

    // Get unread notifications count
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['UnreadCount'],
    }),

    // Mark notification as read
    markAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically update the notifications list
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', undefined, (draft) => {
            const notification = draft.data.find((n) => n.id === id);
            if (notification) {
              notification.isRead = true;
              notification.readAt = new Date().toISOString();
            }
          })
        );

        // Optimistically update the unread count
        const patchCountResult = dispatch(
          notificationsApi.util.updateQueryData('getUnreadCount', undefined, (draft) => {
            if (draft.data.count > 0) {
              draft.data.count -= 1;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic updates on error
          patchResult.undo();
          patchCountResult.undo();
        }
      },
    }),

    // Mark all notifications as read
    markAllRead: builder.mutation<MarkAllReadResponse, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'POST',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
      // Optimistic update
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // Optimistically mark all as read
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', undefined, (draft) => {
            const now = new Date().toISOString();
            draft.data.forEach((notification) => {
              notification.isRead = true;
              notification.readAt = now;
            });
          })
        );

        // Optimistically set unread count to 0
        const patchCountResult = dispatch(
          notificationsApi.util.updateQueryData('getUnreadCount', undefined, (draft) => {
            draft.data.count = 0;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic updates on error
          patchResult.undo();
          patchCountResult.undo();
        }
      },
    }),

    // Delete notification
    deleteNotification: builder.mutation<DeleteNotificationResponse, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically remove the notification
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', undefined, (draft) => {
            const index = draft.data.findIndex((n) => n.id === id);
            if (index !== -1) {
              const wasUnread = !draft.data[index].isRead;
              draft.data.splice(index, 1);

              // Update unread count if the deleted notification was unread
              if (wasUnread) {
                dispatch(
                  notificationsApi.util.updateQueryData('getUnreadCount', undefined, (countDraft) => {
                    if (countDraft.data.count > 0) {
                      countDraft.data.count -= 1;
                    }
                  })
                );
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetNotificationsQuery, useGetUnreadCountQuery, useMarkAsReadMutation, useMarkAllReadMutation, useDeleteNotificationMutation } = notificationsApi;
