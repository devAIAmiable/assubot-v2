// Import and re-export notification types from the API for convenience
import type {
  DeleteNotificationResponse,
  GetNotificationsParams,
  GetNotificationsResponse,
  MarkAllReadResponse,
  MarkAsReadResponse,
  Notification as NotificationBase,
  NotificationType as NotificationTypeBase,
  UnreadCountResponse,
} from '../store/notificationsApi';

// Re-export types
export type Notification = NotificationBase;
export type NotificationType = NotificationTypeBase;
export type {
  GetNotificationsParams,
  GetNotificationsResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
  MarkAllReadResponse,
  DeleteNotificationResponse,
};

// Additional utility types for notifications
export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationWithActions extends Notification {
  actions?: NotificationAction[];
}

// Notification priority levels (can be derived from type)
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// Helper function to get notification priority from type
export const getNotificationPriority = (type: NotificationType): NotificationPriority => {
  switch (type) {
    case 'error':
    case 'payment_failed':
    case 'contract_expired':
      return 'urgent';
    
    case 'warning':
    case 'credit_low':
    case 'contract_expiring':
      return 'high';
    
    case 'contract_processed':
    case 'contract_summarized':
    case 'comparison_ready':
    case 'payment_success':
    case 'credit_purchased':
      return 'medium';
    
    case 'info':
    case 'system':
    case 'new_message':
    case 'suggestions':
    default:
      return 'low';
  }
};

// Helper function to get notification color from type
export const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'error':
    case 'payment_failed':
      return 'text-red-600 bg-red-50 border-red-200';
    
    case 'warning':
    case 'credit_low':
    case 'contract_expiring':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    
    case 'contract_processed':
    case 'contract_summarized':
    case 'comparison_ready':
    case 'payment_success':
    case 'credit_purchased':
      return 'text-green-600 bg-green-50 border-green-200';
    
    case 'info':
    case 'system':
    case 'new_message':
    case 'suggestions':
    case 'contract_expired':
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200';
  }
};

// Helper function to get notification icon from type
export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'contract_processed':
    case 'contract_summarized':
      return 'FaFileAlt';
    
    case 'comparison_ready':
      return 'FaBrain';
    
    case 'new_message':
      return 'FaCommentAlt';
    
    case 'suggestions':
      return 'FaLightbulb';
    
    case 'contract_expiring':
    case 'contract_expired':
      return 'FaClock';
    
    case 'credit_low':
    case 'credit_purchased':
      return 'FaCoins';
    
    case 'payment_success':
      return 'FaCheckCircle';
    
    case 'payment_failed':
      return 'FaTimesCircle';
    
    case 'error':
      return 'FaExclamationCircle';
    
    case 'warning':
      return 'FaExclamationTriangle';
    
    case 'info':
    case 'system':
    default:
      return 'FaInfoCircle';
  }
};

