import type { ReactNode } from 'react';
import config from '@/config/env';
import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

const ensureDataLayer = () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }
};

interface GtmProviderProps {
  children: ReactNode;
}

const GtmProvider = ({ children }: GtmProviderProps) => {
  useEffect(() => {
    if (!config.enableAnalytics || !config.gtmContainerId) {
      return;
    }

    ensureDataLayer();
    window.dataLayer.push({
      event: 'gtm_provider_ready',
      app_environment: config.environment,
      app_version: config.appVersion,
    });
  }, []);

  return <>{children}</>;
};

export default GtmProvider;
