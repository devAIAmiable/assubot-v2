import { pushEvent } from './core';

export const trackCtaClick = (params: { label: string; location: string; destination?: string }) => {
  return pushEvent({
    event: 'cta_click',
    label: params.label,
    location: params.location,
    destination: params.destination,
  });
};

export const trackNavigationRedirect = (params: { from: string; to: string; reason?: string }) => {
  return pushEvent({
    event: 'navigation_redirect',
    from: params.from,
    to: params.to,
    reason: params.reason,
  });
};
