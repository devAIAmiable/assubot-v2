import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ResultsView from './ResultsView';
import type { ComparisonOffer } from '../../types/comparison';

const sampleOffer: ComparisonOffer = {
  id: 'offer-1',
  insurerId: 'ins-1',
  category: 'auto',
  isActive: true,
  displayOrder: 1,
  metadata: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  insurer: { id: 'ins-1', name: 'Aon', slug: 'aon', logoUrl: null, rating: 3.6 },
  formulas: [
    {
      id: 'f-1',
      offerId: 'offer-1',
      name: 'Tiers simple',
      slug: 'tiers-simple',
      annualPremiumCents: 44700,
      description: 'Couverture tiers simple obligatoire',
      displayOrder: 1,
      isRecommended: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      guarantees: [
        { id: 'g1', formulaId: 'f-1', name: 'Responsabilité civile', details: '...', limit: null, deductible: null, createdAt: new Date().toISOString() },
        { id: 'g2', formulaId: 'f-1', name: 'Défense-recours', details: '...', limit: null, deductible: null, createdAt: new Date().toISOString() },
      ],
    },
  ],
};

describe('ResultsView (table)', () => {
  const getBestFormula = (offer: ComparisonOffer) => offer.formulas[0] ?? null;

  const renderView = () =>
    render(
      <ResultsView
        selectedType={'auto'}
        filteredResults={[sampleOffer]}
        paginatedResults={[sampleOffer]}
        currentPage={1}
        totalPages={1}
        filters={{ priceRange: [0, 200], insurers: [], rating: 0, coverages: [] }}
        scores={{ [sampleOffer.id]: 87 }}
        getBestFormula={getBestFormula}
        isFilteringResults={false}
        setCurrentStep={() => {}}
        handlePriceRangeChange={() => {}}
        handleRatingChange={() => {}}
        handleInsurerChange={() => {}}
        handleFilterReset={() => {}}
        setCurrentPage={() => {}}
        currentContractsCount={0}
        otherOffersCount={1}
        askedQuestions={[]}
        aiQuestion={''}
        aiResponse={''}
      />
    );

  it('renders transposed headers (insurers) and attribute rows with actions', () => {
    renderView();

    // Column headers are insurers
    expect(screen.getByText('Aon')).toBeInTheDocument();

    // Attribute row headers
    expect(screen.getByText('Formule')).toBeInTheDocument();
    expect(screen.getByText('Prix')).toBeInTheDocument();
    expect(screen.getByText('Note')).toBeInTheDocument();
    expect(screen.getByText('Correspondance')).toBeInTheDocument();
    expect(screen.getByText('Caractéristiques clés')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Data in cells
    expect(screen.getByText('Tiers simple')).toBeInTheDocument();
    // Actions present
    expect(screen.getByRole('button', { name: /Voir détails/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sélectionner/i })).toBeInTheDocument();
  });

  it('limits to 4 insurer columns and shows message when more', () => {
    const manyOffers: ComparisonOffer[] = Array.from({ length: 6 }).map((_, i) => ({
      ...sampleOffer,
      id: `offer-${i}`,
      insurerId: `ins-${i}`,
      insurer: { ...sampleOffer.insurer, id: `ins-${i}`, name: `Insurer ${i}` },
    }));

    render(
      <ResultsView
        selectedType={'auto'}
        filteredResults={manyOffers}
        paginatedResults={manyOffers}
        currentPage={1}
        totalPages={1}
        filters={{ priceRange: [0, 200], insurers: [], rating: 0, coverages: [] }}
        scores={{}}
        getBestFormula={(o) => o.formulas[0]}
        isFilteringResults={false}
        setCurrentStep={() => {}}
        handlePriceRangeChange={() => {}}
        handleRatingChange={() => {}}
        handleInsurerChange={() => {}}
        handleFilterReset={() => {}}
        setCurrentPage={() => {}}
        currentContractsCount={0}
        otherOffersCount={6}
        askedQuestions={[]}
        aiQuestion={''}
        aiResponse={''}
      />
    );

    expect(screen.getByText('Affichage des 4 premières offres')).toBeInTheDocument();
    // Ensure first four insurers are present
    expect(screen.getByText('Insurer 0')).toBeInTheDocument();
    expect(screen.getByText('Insurer 3')).toBeInTheDocument();
  });
});
