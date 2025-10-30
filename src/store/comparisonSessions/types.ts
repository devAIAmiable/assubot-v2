import type { ComparisonCalculationResponse } from '../../types/comparison';

export interface ComparisonSessionEntry {
  sessionId: string;
  createdAt: string;
  updatedAt?: string;
  result?: ComparisonCalculationResponse;
}

export interface ComparisonSessionsState {
  byId: Record<string, ComparisonSessionEntry>;
}
