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

// Legacy type aliases for backward compatibility (will be deprecated)
export type GtmEventPayloads = AnalyticsEventPayloads;
export type GtmEventName = AnalyticsEventName;
export type GtmEvent<K extends GtmEventName = GtmEventName> = AnalyticsEvent<K>;
