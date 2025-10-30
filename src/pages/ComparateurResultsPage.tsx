import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { ComparisonCalculationResponseDto } from '../schemas/comparison';
import type { ComparisonCategory } from '../types/comparison';
import ErrorBoundary from '../components/comparateur/ErrorBoundary';
import LoadingView from '../components/comparateur/LoadingView';
import ResultsView from '../components/comparateur/ResultsView';
import { comparisonService } from '../services/comparison';

const ComparateurResultsPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ComparisonCalculationResponseDto | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!sessionId || result) return;
      setLoadError(null);
      const resp = await comparisonService.getSessionResults(sessionId);
      if (!cancelled) {
        if (resp.success && resp.data) {
          setResult(resp.data);
        } else {
          setLoadError(resp.error || 'Impossible de récupérer les résultats.');
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [result, sessionId]);

  const selectedType = useMemo<ComparisonCategory | null>(() => (result?.offers?.[0]?.category as ComparisonCategory | undefined) ?? null, [result]);

  const offersNormalized = useMemo(() => {
    return (result?.offers ?? []).map((o) => ({
      ...o,
      isActive: o.isActive ?? true,
      displayOrder: o.displayOrder ?? 0,
      metadata: (o.metadata ?? {}) as Record<string, unknown>,
      createdAt: o.createdAt ?? '',
      updatedAt: o.updatedAt ?? '',
      insurer: {
        ...o.insurer,
        logoUrl: o.insurer.logoUrl ?? null,
      },
      formulas: (o.formulas ?? []).map((f) => ({
        ...f,
        description: f.description ?? '',
        displayOrder: f.displayOrder ?? 0,
        isRecommended: f.isRecommended ?? false,
        createdAt: f.createdAt ?? '',
        updatedAt: f.updatedAt ?? '',
        guarantees: (f.guarantees ?? []).map((g) => ({
          ...g,
          details: g.details ?? '',
          limit: g.limit ?? null,
          deductible: g.deductible ?? null,
          createdAt: g.createdAt ?? '',
        })),
      })),
    }));
  }, [result]);

  const scoresNormalized = useMemo(() => (result?.scores ?? {}) as Record<string, number>, [result]);

  if (!sessionId) return null;

  return (
    <ErrorBoundary>
      {!result && !loadError ? (
        <LoadingView selectedType={selectedType} />
      ) : result ? (
        <ResultsView
          sessionId={sessionId}
          selectedType={selectedType}
          filteredResults={offersNormalized}
          paginatedResults={offersNormalized}
          currentPage={1}
          totalPages={1}
          filters={{ priceRange: [0, 9999], insurers: [], rating: 0, coverages: [] }}
          scores={scoresNormalized}
          getBestFormula={(offer) => offer.formulas?.[0] || null}
          aiQuestion={''}
          aiResponse={''}
          isAiLoading={false}
          isFilteringResults={false}
          setCurrentStep={() => {}}
          setAiQuestion={() => {}}
          handleAiQuestion={() => {}}
          handlePriceRangeChange={() => {}}
          handleRatingChange={() => {}}
          handleInsurerChange={() => {}}
          handleFilterReset={() => {}}
          setCurrentPage={() => {}}
          currentContractsCount={0}
          otherOffersCount={result.offers.length}
          askedQuestions={[]}
        />
      ) : (
        <div className="max-w-2xl mx-auto bg-white border border-red-200 rounded-xl p-6 mt-8 text-center">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h2>
          <p className="text-sm text-red-600 mb-4">{loadError}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/app/comparateur')}
              className="px-4 py-2 border border-[#1e51ab] text-[#1e51ab] rounded-lg hover:bg-[#1e51ab] hover:text-white transition-colors text-sm"
            >
              Revenir à l'historique
            </button>
            <button
              onClick={() => {
                // retrigger effect by clearing error
                setLoadError(null);
              }}
              className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#163d82] transition-colors text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default ComparateurResultsPage;
