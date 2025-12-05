/**
 * Analytics Event Types
 *
 * Only UX metrics are tracked - page views and button clicks.
 * Business actions (account creation, purchases, data saves, etc.) are NOT tracked.
 */
export type AnalyticsEventPayloads = {
  page_view: {
    page_path: string;
    page_title?: string;
  };
  cta_click: {
    label: string;
    location: string;
    destination?: string;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventPayloads;
export type AnalyticsEvent<K extends AnalyticsEventName = AnalyticsEventName> = { event: K } & AnalyticsEventPayloads[K];

// Helper types used in tracking function parameters (not events themselves)
export type AccountMethod = 'email' | 'google';
export type RequestStatus = 'success' | 'error';
export type PaymentStatus = 'success' | 'error';
export type CreditBalanceStatus = 'low' | 'ok' | 'critical';
export type CreditRefreshSource = 'manual' | 'auto';
export type CreditHistorySource = 'button' | 'auto';
export type ComparateurStep = 'history' | 'type' | 'form' | 'loading' | 'results' | string;
export type GuardType = 'protected_route' | 'profile_completion' | 'terms_acceptance';
export type ContractCreationMethod = 'upload' | 'manual';
export type SortOrder = 'asc' | 'desc';

// Extended event type that allows any event name (for backward compatibility)
// Business actions are filtered at runtime in umami.ts
export type ExtendedEvent = {
  event: string;
  [key: string]: unknown;
};

// Legacy type aliases for backward compatibility
export type GtmEventPayloads = AnalyticsEventPayloads;
export type GtmEventName = AnalyticsEventName | string;
export type GtmEvent<K extends GtmEventName = GtmEventName> = K extends AnalyticsEventName ? AnalyticsEvent<K> : ExtendedEvent;
