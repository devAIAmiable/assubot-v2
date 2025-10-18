import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllReadMutation,
  useMarkAsReadMutation,
  type GetNotificationsParams,
  type Notification,
  type NotificationType,
} from '../store/notificationsApi';

interface UseNotificationsReturn {
  // Data
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;

  // Actions
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refetch: () => void;

  // Loading states for mutations
  isMarkingAsRead: boolean;
  isMarkingAllRead: boolean;
  isDeleting: boolean;
}

interface UseNotificationsOptions {
  filters?: GetNotificationsParams;
  skip?: boolean;
}

/**
 * Custom hook for managing notifications
 * Provides easy access to notifications data and actions
 */
export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
  const { filters, skip = false } = options;

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    isFetching: isFetchingNotifications,
    error: notificationsError,
    refetch,
  } = useGetNotificationsQuery(filters, { skip });

  // Fetch unread count
  const { data: unreadCountData, isLoading: isLoadingCount } = useGetUnreadCountQuery(undefined, { skip });

  // Mutations
  const [markAsReadMutation, { isLoading: isMarkingAsRead }] = useMarkAsReadMutation();
  const [markAllReadMutation, { isLoading: isMarkingAllRead }] = useMarkAllReadMutation();
  const [deleteNotificationMutation, { isLoading: isDeleting }] = useDeleteNotificationMutation();

  // Extract data
  const notifications = notificationsData?.data || [];
  const unreadCount = unreadCountData?.data.count || 0;
  const isLoading = isLoadingNotifications || isLoadingCount;
  const isFetching = isFetchingNotifications;
  const error = notificationsError
    ? 'data' in notificationsError && notificationsError.data && typeof notificationsError.data === 'object' && 'message' in notificationsError.data
      ? String(notificationsError.data.message)
      : 'Erreur lors du chargement des notifications'
    : null;

  // Action handlers
  const markAsRead = async (id: string): Promise<void> => {
    try {
      await markAsReadMutation(id).unwrap();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      throw err;
    }
  };

  const markAllRead = async (): Promise<void> => {
    try {
      await markAllReadMutation().unwrap();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  };

  const deleteNotification = async (id: string): Promise<void> => {
    try {
      await deleteNotificationMutation(id).unwrap();
    } catch (err) {
      console.error('Failed to delete notification:', err);
      throw err;
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    isFetching,
    error,
    markAsRead,
    markAllRead,
    deleteNotification,
    refetch,
    isMarkingAsRead,
    isMarkingAllRead,
    isDeleting,
  };
};

/**
 * Hook to get only unread notifications
 */
export const useUnreadNotifications = () => {
  return useNotifications({
    filters: {
      isRead: false,
      limit: 50,
    },
  });
};

/**
 * Hook to get notifications by type
 */
export const useNotificationsByType = (type: NotificationType) => {
  return useNotifications({
    filters: {
      type,
      limit: 50,
    },
  });
};

/**
 * Hook to get only unread count (lightweight)
 */
export const useUnreadNotificationsCount = () => {
  const { data } = useGetUnreadCountQuery();
  return data?.data.count || 0;
};
