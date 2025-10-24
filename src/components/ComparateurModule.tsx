import type { ComparisonCategory, ComparisonOffer } from '../types/comparison';
import { useCallback, useMemo, useRef, useState } from 'react';

import ErrorBoundary from './comparateur/ErrorBoundary';
import FormView from './comparateur/FormView';
import LoadingView from './comparateur/LoadingView';
// Import the new components
import PastComparisonsView from './comparateur/PastComparisonsView';
import ResultsView from './comparateur/ResultsView';
import TypeSelectionView from './comparateur/TypeSelectionView';
import { getContractType } from '../utils/contractAdapters';
import { useAppSelector } from '../store/hooks';

// Create a step type union for type safety
type ComparateurStep = 'history' | 'type' | 'form' | 'results' | 'loading';

interface AskedQuestion {
  question: string;
  timestamp: Date;
  responses?: { [insurerId: string]: { hasAnswer: boolean; details: string } };
}

const ComparateurModule = () => {
  const user = useAppSelector((state) => state.user?.currentUser);
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
  const [comparisonResults] = useState<ComparisonOffer[]>([]);
  const [askedQuestions] = useState<AskedQuestion[]>([]);
  const [comparisonError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    insurers: [] as string[],
    rating: 0,
    coverages: [] as string[],
  });

  // History pagination state
  const [historyPage, setHistoryPage] = useState(1);
  const [historyItemsPerPage] = useState(4);

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

  // Memoize filtered results to prevent unnecessary recalculations
  const filteredResults = useMemo(() => {
    return comparisonResults.filter((offer) => {
      if (filters.rating > 0 && offer.rating < filters.rating) return false;
      if (filters.insurers.length > 0 && !filters.insurers.includes(offer.insurerName)) return false;
      const monthlyPrice = Math.round(offer.annualPremium / 12);
      if (monthlyPrice < filters.priceRange[0] || monthlyPrice > filters.priceRange[1]) return false;
      return true;
    });
  }, [comparisonResults, filters.rating, filters.insurers, filters.priceRange]);

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

  // TODO: Phase 2 - AI question handling
  const handleAiQuestion = useCallback(async () => {
    if (!aiQuestion.trim()) return;

    setIsAiLoading(true);

    // Add the question to our tracking array
    const newQuestion = {
      question: aiQuestion,
      timestamp: new Date(),
    };

    setAskedQuestions((prev) => [...prev, newQuestion]);

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
        {currentStep === 'history' && (
          <PastComparisonsView
            user={user}
            historyPage={historyPage}
            historyItemsPerPage={historyItemsPerPage}
            setHistoryPage={setHistoryPage}
            setCurrentStep={setCurrentStep}
            setSelectedType={setSelectedType}
            setFormData={setFormData}
          />
        )}
        {currentStep === 'type' && <TypeSelectionView user={user} contracts={contracts} setCurrentStep={setCurrentStep} handleTypeSelection={handleTypeSelection} />}
        {currentStep === 'form' && (
          <FormView selectedType={selectedType} formData={formData} updateFormField={updateFormField} setCurrentStep={setCurrentStep} comparisonError={comparisonError} />
        )}
        {currentStep === 'loading' && <LoadingView selectedType={selectedType} />}
        {currentStep === 'results' && (
          <ResultsView
            selectedType={selectedType}
            filteredResults={filteredResults}
            paginatedResults={paginatedResults}
            currentPage={currentPage}
            totalPages={totalPages}
            filters={filters}
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
