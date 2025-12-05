import type { ReactNode } from 'react';
import config from '@/config/env';
import { useEffect } from 'react';

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

interface AnalyticsProviderProps {
  children: ReactNode;
}

/**
 * Analytics Provider for Umami
 * Waits for Umami script to load and ensures it's ready
 * Kept name as AnalyticsProvider for backward compatibility
 */
const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  useEffect(() => {
    if (!config.enableAnalytics || !config.umamiWebsiteId) {
      return;
    }

    // Umami script is loaded in index.html, so we just need to wait for it
    // Events will be queued and sent once Umami is ready
    if (config.enableDebugMode) {
      const checkUmami = () => {
        if (typeof window !== 'undefined' && window.umami) {
          console.log('[Analytics] Umami is ready');
          return true;
        }
        return false;
      };

      // Log when Umami becomes available (for debugging)
      if (!checkUmami()) {
        const interval = setInterval(() => {
          if (checkUmami()) {
            clearInterval(interval);
          }
        }, 100);

        const timeout = setTimeout(() => {
          clearInterval(interval);
          if (!checkUmami()) {
            console.warn('[Analytics] Umami script not loaded after 5 seconds');
          }
        }, 5000);

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    }
  }, []);

  return <>{children}</>;
};

export default AnalyticsProvider;
