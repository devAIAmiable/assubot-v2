import type { PersistedRootState } from '../index';

export const selectComparisonSessionById = (state: PersistedRootState, sessionId: string) => state.comparisonSessions?.byId?.[sessionId];
