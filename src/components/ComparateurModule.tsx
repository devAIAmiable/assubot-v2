import type { ComparisonCalculationResponse, ComparisonCategory, ComparisonOffer } from '../types/comparison';
import { trackComparateurFilterChange, trackComparateurResultsLoaded, trackComparateurStepChange } from '@/services/analytics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ErrorBoundary from './comparateur/ErrorBoundary';
import FormView from './comparateur/FormView';
import LoadingView from './comparateur/LoadingView';
// Import the new components
import PastComparisonsView from './comparateur/PastComparisonsView';
import ResultsView from './comparateur/ResultsView';
import TypeSelectionView from './comparateur/TypeSelectionView';
import { getContractType } from '../utils/contractAdapters';
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';

// Create a step type union for type safety
type ComparateurStep = 'history' | 'type' | 'form' | 'results' | 'loading';

interface AskedQuestion {
  question: string;
  timestamp: Date;
  responses?: { [insurerId: string]: { hasAnswer: boolean; details: string } };
}

const ComparateurModule = () => {
  const user = useAppSelector((state) => state.user?.currentUser);
  const navigate = useNavigate();
  const contracts = useAppSelector((state) => state.contracts?.contracts || []);

  // State management
  const [currentStep, setCurrentStep] = useState<ComparateurStep>('history');
  const [selectedType, setSelectedType] = useState<ComparisonCategory | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // Results state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isFilteringResults, setIsFilteringResults] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<ComparisonOffer[]>([]);
  const [comparisonScores, setComparisonScores] = useState<Record<string, number>>({});
  const [askedQuestions, setAskedQuestions] = useState<AskedQuestion[]>([]);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('');

  const [loadingTimerInterval, setLoadingTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    insurers: [] as string[],
    rating: 0,
    coverages: [] as string[],
  });
  const previousStepRef = useRef<ComparateurStep>('history');

  useEffect(() => {
    if (previousStepRef.current !== currentStep) {
      trackComparateurStepChange({
        from: previousStepRef.current,
        to: currentStep,
        category: selectedType ?? undefined,
      });
      previousStepRef.current = currentStep;
    }
  }, [currentStep, selectedType]);

  // Separate state setters to minimize re-renders
  const updatePriceRange = useCallback((newRange: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: newRange }));
  }, []);

  const updateInsurers = useCallback((newInsurers: string[]) => {
    setFilters((prev) => ({ ...prev, insurers: newInsurers }));
  }, []);

  const updateRating = useCallback((newRating: number) => {
    setFilters((prev) => ({ ...prev, rating: newRating }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ priceRange: [0, 200], insurers: [], rating: 0, coverages: [] });
  }, []);

  // Helper to get best formula for an offer (recommended > cheapest > first)
  const getBestFormula = useCallback((offer: ComparisonOffer) => {
    if (!offer.formulas || offer.formulas.length === 0) return null;

    // Try recommended first
    const recommended = offer.formulas.find((f) => f.isRecommended);
    if (recommended) return recommended;

    // Otherwise get cheapest
    return offer.formulas.reduce((cheapest, current) => {
      if (!cheapest) return current;
      return current.annualPremiumCents < cheapest.annualPremiumCents ? current : cheapest;
    });
  }, []);

  // Memoize filtered results to prevent unnecessary recalculations
  const filteredResults = useMemo(() => {
    return comparisonResults.filter((offer) => {
      const formula = getBestFormula(offer);
      if (!formula) return false;

      // Filter by rating
      if (filters.rating > 0 && offer.insurer.rating < filters.rating) return false;

      // Filter by insurer
      if (filters.insurers.length > 0 && !filters.insurers.includes(offer.insurer.name)) return false;

      // Filter by price (convert cents to euros)
      const monthlyPrice = Math.round(formula.annualPremiumCents / 100 / 12);
      if (monthlyPrice < filters.priceRange[0] || monthlyPrice > filters.priceRange[1]) return false;

      return true;
    });
  }, [comparisonResults, filters.rating, filters.insurers, filters.priceRange, getBestFormula]);

  // Separate current contracts from other offers for pagination
  const { currentContracts, otherOffers } = useMemo(() => {
    const current = filteredResults.filter((offer) => offer.id.startsWith('current-'));
    const others = filteredResults.filter((offer) => !offer.id.startsWith('current-'));
    return { currentContracts: current, otherOffers: others };
  }, [filteredResults]);

  // Memoize pagination calculations (only for non-current contracts)
  const paginatedResults = useMemo(() => {
    const paginatedOthers = otherOffers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // Always include current contracts at the top
    return [...currentContracts, ...paginatedOthers];
  }, [currentContracts, otherOffers, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(otherOffers.length / itemsPerPage);
  }, [otherOffers.length, itemsPerPage]);

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle price range changes with debouncing
  const handlePriceRangeChange = useCallback(
    (newRange: number[]) => {
      setIsFilteringResults(true);
      trackComparateurFilterChange({
        filter: 'priceRange',
        value: newRange,
      });

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for debounced update
      debounceTimerRef.current = setTimeout(() => {
        updatePriceRange(newRange);
        setCurrentPage(1);
        setIsFilteringResults(false);
      }, 500);
    },
    [updatePriceRange]
  );

  // Handle rating changes immediately
  const handleRatingChange = useCallback(
    (newRating: number) => {
      setIsFilteringResults(true);
      trackComparateurFilterChange({
        filter: 'rating',
        value: newRating,
      });
      updateRating(newRating);
      setCurrentPage(1);

      setTimeout(() => {
        setIsFilteringResults(false);
      }, 150);
    },
    [updateRating]
  );

  // Handle insurer changes immediately
  const handleInsurerChange = useCallback(
    (insurer: string, isChecked: boolean) => {
      setIsFilteringResults(true);
      trackComparateurFilterChange({
        filter: 'insurers',
        value: `${insurer}:${isChecked ? 'add' : 'remove'}`,
      });

      if (isChecked) {
        updateInsurers([...filters.insurers, insurer]);
      } else {
        updateInsurers(filters.insurers.filter((i) => i !== insurer));
      }
      setCurrentPage(1);

      setTimeout(() => {
        setIsFilteringResults(false);
      }, 150);
    },
    [filters.insurers, updateInsurers]
  );

  // Handle filter reset
  const handleFilterReset = useCallback(() => {
    setIsFilteringResults(true);
    trackComparateurFilterChange({
      filter: 'reset',
      value: 'all',
    });
    resetFilters();
    setCurrentPage(1);

    setTimeout(() => {
      setIsFilteringResults(false);
    }, 150);
  }, [resetFilters]);

  // Create a stable form update function
  const updateFormField = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Batch update function for test data filling
  const batchUpdateFormFields = useCallback((fields: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  }, []);

  const handleTypeSelection = useCallback(
    (type: ComparisonCategory) => {
      setSelectedType(type);

      // Prefill from existing contracts
      const existingContract = contracts.find((c) => {
        const contractType = getContractType(c);
        return (contractType === type || (type === 'home' && contractType === 'habitation')) && c.status === 'active';
      });

      if (existingContract) {
        // Prefill some basic data from existing contract
        setFormData((prev) => ({
          ...prev,
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          phone: user?.phone || '',
          birthDate: user?.birthDate || '',
          city: user?.city || '',
          postalCode: user?.zip || '',
          street: user?.address || '',
        }));
      }

      setCurrentStep('form');
    },
    [contracts, user]
  );

  // Handle comparison results from API response
  const handleComparisonResults = useCallback(
    (response: ComparisonCalculationResponse) => {
      // Keep brief loading to show progression while preparing redirect
      setCurrentStep('loading');
      setComparisonError(null);

      // Prime local state once to avoid tearing before redirect (and satisfy linter)
      setComparisonResults(response.offers);
      setComparisonScores(response.scores);
      setLoadingTimerInterval(null);

      trackComparateurResultsLoaded({
        sessionId: response.sessionId,
        category: selectedType ?? undefined,
        offersCount: response.offers.length,
      });

      setSessionId(response.sessionId);
      // Redirect directly to dedicated results page using API-provided sessionId
      navigate(`/app/comparateur/${response.sessionId}/resultats`);
    },
    [navigate, selectedType]
  );

  // Handle comparison errors
  const handleComparisonError = useCallback((error: string) => {
    setComparisonError(error);
    // Stay on form step so user can fix issues
    setCurrentStep('form');
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (loadingTimerInterval) {
        clearInterval(loadingTimerInterval);
      }
    };
  }, [loadingTimerInterval]);

  // TODO: Phase 2 - AI question handling
  const handleAiQuestion = useCallback(async () => {
    if (!aiQuestion.trim()) return;

    setIsAiLoading(true);

    // Add the question to our tracking array
    const newQuestion = {
      question: aiQuestion,
      timestamp: new Date(),
    };

    setAskedQuestions((prev: AskedQuestion[]) => [...prev, newQuestion]);

    // Simulate AI processing
    setTimeout(() => {
      setAiResponse('Cette fonctionnalité sera disponible dans la Phase 2.');
      setAiQuestion('');
      setIsAiLoading(false);
    }, 1500);
  }, [aiQuestion]);

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {currentStep === 'history' && <PastComparisonsView user={user} setCurrentStep={setCurrentStep} setSelectedType={setSelectedType} setFormData={setFormData} />}
        {currentStep === 'type' && <TypeSelectionView user={user} contracts={contracts} setCurrentStep={setCurrentStep} handleTypeSelection={handleTypeSelection} />}
        {currentStep === 'form' && (
          <FormView
            selectedType={selectedType}
            formData={formData}
            updateFormField={updateFormField}
            batchUpdateFormFields={batchUpdateFormFields}
            setCurrentStep={setCurrentStep}
            comparisonError={comparisonError}
            onComparisonSuccess={handleComparisonResults}
            onComparisonError={handleComparisonError}
          />
        )}
        {currentStep === 'loading' && <LoadingView selectedType={selectedType} />}
        {currentStep === 'results' && (
          <ResultsView
            sessionId={sessionId}
            selectedType={selectedType}
            filteredResults={filteredResults}
            paginatedResults={paginatedResults}
            currentPage={currentPage}
            totalPages={totalPages}
            filters={filters}
            scores={comparisonScores}
            getBestFormula={getBestFormula}
            aiQuestion={aiQuestion}
            aiResponse={aiResponse}
            isAiLoading={isAiLoading}
            isFilteringResults={isFilteringResults}
            setCurrentStep={setCurrentStep}
            setAiQuestion={setAiQuestion}
            handleAiQuestion={handleAiQuestion}
            handlePriceRangeChange={handlePriceRangeChange}
            handleRatingChange={handleRatingChange}
            handleInsurerChange={handleInsurerChange}
            handleFilterReset={handleFilterReset}
            setCurrentPage={setCurrentPage}
            currentContractsCount={currentContracts.length}
            otherOffersCount={otherOffers.length}
            askedQuestions={askedQuestions}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ComparateurModule;
