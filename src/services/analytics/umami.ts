import type { AnalyticsEventName, GtmEvent, GtmEventName } from './types';

import config from '@/config/env';

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

const isBrowser = typeof window !== 'undefined';

/**
 * Allowed events for tracking - only UX metrics
 * Business actions are explicitly excluded
 */
const ALLOWED_EVENTS: Array<AnalyticsEventName> = ['page_view', 'cta_click'];

/**
 * Check if an event should be tracked
 * Only page views and CTA clicks are allowed
 */
const isEventAllowed = (eventName: string): boolean => {
  return ALLOWED_EVENTS.includes(eventName as AnalyticsEventName);
};

/**
 * Check if Umami is available and ready
 */
const isUmamiReady = (): boolean => {
  return isBrowser && typeof window.umami !== 'undefined' && typeof window.umami.track === 'function';
};

/**
 * Track event using Umami analytics
 * Only tracks allowed UX events (page_view, cta_click)
 * Business actions are silently ignored
 */
export const trackUmamiEvent = <K extends GtmEventName>(event: GtmEvent<K>): boolean => {
  // Check if analytics is enabled
  if (!config.enableAnalytics || !config.umamiWebsiteId) {
    return false;
  }

  // Only track allowed UX events - ignore business actions
  if (!isEventAllowed(event.event)) {
    if (config.enableDebugMode) {
      console.debug('[Umami Analytics] Business action event ignored:', event.event);
    }
    return false;
  }

  // Check if Umami is ready
  if (!isUmamiReady()) {
    return false;
  }

  try {
    // Extract event data (all fields except 'event')
    const eventPayload = { ...event };
    delete (eventPayload as { event?: string }).event;

    // Add metadata
    const eventData: Record<string, unknown> = {
      ...(eventPayload as Record<string, unknown>),
      app_environment: config.environment,
      app_version: config.appVersion,
    };

    // Track event with Umami
    window.umami!.track(event.event, eventData);

    return true;
  } catch (error) {
    if (config.enableDebugMode) {
      console.error('[Umami Analytics] Error tracking event:', error);
    }
    return false;
  }
};

/**
 * Track page view using Umami
 * Umami automatically tracks page views, but we can add custom data
 */
export const trackUmamiPageView = (pagePath: string, pageTitle?: string): boolean => {
  if (!config.enableAnalytics || !config.umamiWebsiteId) {
    return false;
  }

  if (!isUmamiReady()) {
    return false;
  }

  try {
    const eventData: Record<string, unknown> = {
      page_path: pagePath,
      app_environment: config.environment,
      app_version: config.appVersion,
    };

    if (pageTitle) {
      eventData.page_title = pageTitle;
    }

    window.umami!.track('page_view', eventData);
    return true;
  } catch (error) {
    if (config.enableDebugMode) {
      console.error('[Umami Analytics] Error tracking page view:', error);
    }
    return false;
  }
};
