import type { GtmEvent, GtmEventName } from './types';

import config from '@/config/env';

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

const isBrowser = typeof window !== 'undefined';

/**
 * List of marketing events allowed to be sent to GTM
 * Only basic marketing insights - not detailed custom events
 */
const MARKETING_EVENTS_ALLOWED: Array<GtmEventName> = ['page_view'];

const ensureDataLayer = () => {
  if (!isBrowser) {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }
};

/**
 * Push event to GTM dataLayer
 *
 * Only marketing events (like page_view) are sent to GTM.
 * All detailed custom events (chat_selected, account_creation_success, etc.)
 * are blocked and not pushed to dataLayer.
 */
export const pushEvent = <K extends GtmEventName>(event: GtmEvent<K>): boolean => {
  // Only allow marketing events for GTM
  if (!MARKETING_EVENTS_ALLOWED.includes(event.event)) {
    // Custom detailed events are disabled - not pushed to dataLayer
    // Function returns false for API compatibility
    return false;
  }

  // Check if analytics is enabled
  if (!config.enableAnalytics || !config.gtmContainerId || !isBrowser) {
    return false;
  }

  ensureDataLayer();

  window.dataLayer.push({
    ...event,
    app_environment: config.environment,
    app_version: config.appVersion,
  });

  return true;
};

export const trackPageView = (pagePath: string, pageTitle?: string): boolean => {
  return pushEvent({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle,
  });
};
