import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface NlQueryItem {
  id: string;
  question: string;
  createdAt: string;
  offerMatches: Record<string, boolean>;
  explanation?: string;
}

export interface NlQueriesState {
  items: NlQueryItem[];
}

const initialState: NlQueriesState = {
  items: [],
};

const nlQueriesSlice = createSlice({
  name: 'nlQueries',
  initialState,
  reducers: {
    addQueryResult: (state, action: PayloadAction<{ id: string; question: string; createdAt: string; offerMatches: Record<string, boolean>; explanation?: string }>) => {
      const { id, question, createdAt, offerMatches, explanation } = action.payload;
      // Append; avoid duplicates by id
      const exists = state.items.some((i) => i.id === id);
      if (!exists) {
        state.items.push({ id, question, createdAt, offerMatches, explanation });
      }
    },
    clearQueries: (state) => {
      state.items = [];
    },
  },
});

export const { addQueryResult, clearQueries } = nlQueriesSlice.actions;
export default nlQueriesSlice.reducer;

// Selectors
export const selectNlQueries = (state: { nlQueries: NlQueriesState }): NlQueryItem[] => state.nlQueries.items;

export const makeSelectPerOfferStats = (offerIds: string[]) => (state: { nlQueries: NlQueriesState }) => {
  const totalQuestions = state.nlQueries.items.length;
  const perOffer: Record<string, { matches: number; total: number }> = {};
  offerIds.forEach((id) => {
    perOffer[id] = { matches: 0, total: totalQuestions };
  });
  state.nlQueries.items.forEach((item) => {
    offerIds.forEach((id) => {
      if (item.offerMatches[id]) perOffer[id].matches += 1;
    });
  });
  return { totalQuestions, perOffer };
};
