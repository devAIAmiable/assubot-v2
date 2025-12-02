import type { ComparateurStep, RequestStatus } from './types';
import { pushEvent } from './core';

export const trackComparateurStepChange = (params: { from: ComparateurStep; to: ComparateurStep; category?: string | null }) => {
  return pushEvent({
    event: 'comparateur_step_change',
    from: params.from,
    to: params.to,
    category: params.category ?? undefined,
  });
};

export const trackComparateurFormSubmit = (params: { category?: string | null; status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'comparateur_form_submit',
    category: params.category ?? undefined,
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackComparateurResultsLoaded = (params: { sessionId: string; category?: string | null; offersCount: number }) => {
  return pushEvent({
    event: 'comparateur_results_loaded',
    session_id: params.sessionId,
    category: params.category ?? undefined,
    offers_count: params.offersCount,
  });
};

export const trackComparateurFilterChange = (params: { filter: string; value: string | number | boolean | Array<string | number> }) => {
  return pushEvent({
    event: 'comparateur_filter_change',
    filter: params.filter,
    value: params.value,
  });
};

export const trackComparateurAiQuestion = (params: { sessionId?: string; hasResponse: boolean }) => {
  return pushEvent({
    event: 'comparateur_ai_question',
    session_id: params.sessionId,
    has_response: params.hasResponse,
  });
};
