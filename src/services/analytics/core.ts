import { trackUmamiEvent, trackUmamiPageView } from './umami';

import type { ExtendedEvent } from './types';

/**
 * Push event to analytics (Umami)
 *
 * Only UX metrics are tracked:
 * - page_view: Page navigation events
 * - cta_click: Button click events
 *
 * Business actions (account creation, purchases, data saves, form submissions, etc.)
 * are silently ignored and NOT tracked to maintain privacy and focus on UX metrics only.
 *
 * This function accepts any event type for backward compatibility, but only
 * allowed UX events will actually be tracked.
 */
export const pushEvent = (event: ExtendedEvent): boolean => {
  return trackUmamiEvent(event as { event: string; [key: string]: unknown });
};

export const trackPageView = (pagePath: string, pageTitle?: string): boolean => {
  return trackUmamiPageView(pagePath, pageTitle);
};
