import type { ComparisonCategory } from '../types/comparison';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface PastComparison {
  id: string;
  date: string;
  expiresAt: string; // ISO date string for expiration (1 week from creation)
  category: ComparisonCategory;
  sessionId?: string; // For Phase 2 session management
  formData: Record<string, unknown>;
  resultOfferIds: string[];
  resultsCount: number;
  topOffer?: {
    insurerName: string;
    annualPremium: number;
    rating: number;
    matchScore: number;
  };
}

interface ComparisonsState {
  comparisons: PastComparison[];
  loading: boolean;
  error: string | null;
}

const initialState: ComparisonsState = {
  comparisons: [],
  loading: false,
  error: null,
};

const comparisonsSlice = createSlice({
  name: 'comparisons',
  initialState,
  reducers: {
    // Add a new comparison to history
    addComparison: (state, action: PayloadAction<Omit<PastComparison, 'id' | 'date' | 'expiresAt'>>) => {
      const now = new Date();
      const expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now

      const newComparison: PastComparison = {
        ...action.payload,
        id: Date.now().toString(),
        date: now.toISOString().split('T')[0],
        expiresAt: expirationDate.toISOString().split('T')[0],
      };
      // Add to beginning of array (most recent first)
      state.comparisons.unshift(newComparison);
    },

    // Remove a comparison from history
    removeComparison: (state, action: PayloadAction<string>) => {
      state.comparisons = state.comparisons.filter((c) => c.id !== action.payload);
    },

    // Clear all comparisons
    clearComparisons: (state) => {
      state.comparisons = [];
    },

    // Clear expired comparisons
    clearExpiredComparisons: (state) => {
      const now = new Date().toISOString().split('T')[0];
      state.comparisons = state.comparisons.filter((c) => c.expiresAt >= now);
    },

    // Update an existing comparison
    updateComparison: (state, action: PayloadAction<PastComparison>) => {
      const index = state.comparisons.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.comparisons[index] = action.payload;
      }
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addComparison, removeComparison, clearComparisons, clearExpiredComparisons, updateComparison, setLoading, setError } = comparisonsSlice.actions;

export default comparisonsSlice.reducer;
