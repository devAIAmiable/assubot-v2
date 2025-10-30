import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ComparisonCalculationResponse } from '../../types/comparison';
import type { ComparisonSessionsState, ComparisonSessionEntry } from './types';

const initialState: ComparisonSessionsState = {
  byId: {},
};

const comparisonSessionsSlice = createSlice({
  name: 'comparisonSessions',
  initialState,
  reducers: {
    upsertSession: (state, action: PayloadAction<{ sessionId: string; result?: ComparisonCalculationResponse }>) => {
      const { sessionId, result } = action.payload;
      const existing = state.byId[sessionId];
      const now = new Date().toISOString();
      const entry: ComparisonSessionEntry = {
        sessionId,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        result: result ?? existing?.result,
      };
      state.byId[sessionId] = entry;
    },
    setSessionResult: (state, action: PayloadAction<{ sessionId: string; result: ComparisonCalculationResponse }>) => {
      const { sessionId, result } = action.payload;
      const existing = state.byId[sessionId];
      const now = new Date().toISOString();
      state.byId[sessionId] = {
        sessionId,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        result,
      };
    },
    removeSession: (state, action: PayloadAction<string>) => {
      delete state.byId[action.payload];
    },
    clearSessions: (state) => {
      state.byId = {};
    },
  },
});

export const { upsertSession, setSessionResult, removeSession, clearSessions } = comparisonSessionsSlice.actions;
export default comparisonSessionsSlice.reducer;
