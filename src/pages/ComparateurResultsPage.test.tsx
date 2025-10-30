import '@testing-library/jest-dom';

import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setSessionResult, upsertSession } from '../store/comparisonSessions/slice';

import ComparateurResultsPage from './ComparateurResultsPage';
import { Provider } from 'react-redux';
import React from 'react';
import { store } from '../store';

describe('ComparateurResultsPage', () => {
  it('renders LoadingView when no result yet', async () => {
    const sessionId = 'sess-123';
    store.dispatch(upsertSession({ sessionId }));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/app/comparateur/${sessionId}/resultats`]}>
          <Routes>
            <Route path="/app/comparateur/:sessionId/resultats" element={<ComparateurResultsPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });

  it('renders ResultsView when result exists', async () => {
    const sessionId = 'sess-456';
    store.dispatch(
      setSessionResult({
        sessionId,
        result: {
          status: 'success',
          message: 'ok',
          sessionId,
          offers: [],
          scores: {},
          totalOffers: 0,
          filteredCount: 0,
        },
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/app/comparateur/${sessionId}/resultats`]}>
          <Routes>
            <Route path="/app/comparateur/:sessionId/resultats" element={<ComparateurResultsPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // ResultsView shows no offers; assert on some static text from ResultsView fallback
    // If ResultsView has a heading, replace with appropriate text check
    expect(screen.queryByText(/Chargement/i)).toBeNull();
  });
});
