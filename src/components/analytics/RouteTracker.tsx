import { trackPageView } from '@/services/analytics/gtm';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const getPageTitle = () => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  return document.title;
};

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(pagePath, getPageTitle());
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default RouteTracker;
