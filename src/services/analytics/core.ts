import config from '@/config/env';
import type { GtmEvent, GtmEventName } from './types';

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

const isBrowser = typeof window !== 'undefined';

const ensureDataLayer = () => {
  if (!isBrowser) {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }
};

export const pushEvent = <K extends GtmEventName>(event: GtmEvent<K>): boolean => {
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
