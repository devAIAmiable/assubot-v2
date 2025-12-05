import type { GtmEvent, GtmEventName } from './types';
import { trackUmamiEvent, trackUmamiPageView } from './umami';

/**
 * Push event to analytics (Umami)
 *
 * Only UX metrics are tracked:
 * - page_view: Page navigation events
 * - cta_click: Button click events
 *
 * Business actions (account creation, purchases, data saves, form submissions, etc.)
 * are silently ignored and NOT tracked to maintain privacy and focus on UX metrics only.
 */
export const pushEvent = <K extends GtmEventName>(event: GtmEvent<K>): boolean => {
  return trackUmamiEvent(event);
};

export const trackPageView = (pagePath: string, pageTitle?: string): boolean => {
  return trackUmamiPageView(pagePath, pageTitle);
};
