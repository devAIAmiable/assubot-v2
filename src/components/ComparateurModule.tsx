import { FaCar, FaHome, FaMedkit, FaMotorcycle } from 'react-icons/fa';
import type { InsuranceType, InsuranceTypeConfig } from '../types';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ComparisonService, type ComparisonOffer } from '../services/comparisonService';

// Import the new components
import PastComparisonsView from './comparateur/PastComparisonsView';
import TypeSelectionView from './comparateur/TypeSelectionView';
import FormView from './comparateur/FormView';
import LoadingView from './comparateur/LoadingView';
import ResultsView from './comparateur/ResultsView';

// Import types from Redux are now used in the component interfaces

// Export the SimpleFormData interface for use in components
export interface SimpleFormData {
	age: string;
	profession: string;
	location: string;
	postalCode: string;
	monthlyBudget: string;

	// Auto specific
	vehicleType: string;
	brand: string;
	model: string;
	energyType: string;
	transmission: string;
	vehicleValue: string;
	vehicleUse: string;
	annualMileage: string;
	parkingLocation: string;
	claimsHistory: string;
	drivingExperience: string;

	// Habitation specific
	propertyType: string;
	propertyStatus: string;
	propertySize: string;
	numberOfRooms: string;
	hasAlarm: string;
	securityLevel: string;

	// Santé specific
	familyStatus: string;
	numberOfDependents: string;
	hasCurrentInsurance: string;
	wearGlasses: string;
	needsDental: string;

	// Coverage
	coverageLevel: string;
}

// Create a step type union for type safety
type ComparateurStep = 'history' | 'type' | 'form' | 'results' | 'loading';

import { useAppSelector } from '../store/hooks';
import { useComparisons } from '../hooks/useComparisons';

const ComparateurModule = () => {
	const user = useAppSelector((state) => state.user?.currentUser);
	const contracts = useAppSelector((state) => state.contracts?.contracts || []);
	const { saveComparison } = useComparisons();

	// State management
	const [currentStep, setCurrentStep] = useState<ComparateurStep>('history');
	const [selectedType, setSelectedType] = useState<'auto' | 'habitation' | 'sante' | 'moto' | null>(
		null
	);

	// Calculate age from birthDate
	const calculateAge = (birthDate: string) => {
		if (!birthDate) return '';
		const birth = new Date(birthDate);
		const today = new Date();
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age.toString();
	};

	const [formData, setFormData] = useState<SimpleFormData>({
		age: calculateAge(user?.birthDate || '') || '',
		profession: user?.professionalCategory || '',
		location: user?.city || '',
		postalCode: user?.zip || '',
		monthlyBudget: '',

		// Auto specific
		vehicleType: '',
		brand: '',
		model: '',
		energyType: '',
		transmission: '',
		vehicleValue: '',
		vehicleUse: '',
		annualMileage: '',
		parkingLocation: '',
		claimsHistory: '',
		drivingExperience: '',

		// Habitation specific
		propertyType: '',
		propertyStatus: '',
		propertySize: '',
		numberOfRooms: '',
		hasAlarm: '',
		securityLevel: '',

		// Santé specific
		familyStatus: '',
		numberOfDependents: '',
		hasCurrentInsurance: '',
		wearGlasses: '',
		needsDental: '',

		// Coverage
		coverageLevel: '',
	});

	// Results state
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);
	const [aiQuestion, setAiQuestion] = useState('');
	const [aiResponse, setAiResponse] = useState('');
	const [isAiLoading, setIsAiLoading] = useState(false);
	const [isFilteringResults, setIsFilteringResults] = useState(false);
	const [comparisonResults, setComparisonResults] = useState<ComparisonOffer[]>([]);
	const [askedQuestions, setAskedQuestions] = useState<Array<{
		question: string;
		timestamp: Date;
		responses?: { [insurerId: string]: { hasAnswer: boolean; details: string } };
	}>>([]);
	const [filters, setFilters] = useState({
		priceRange: [0, 100],
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
		setFilters({ priceRange: [0, 100], insurers: [], rating: 0, coverages: [] });
	}, []);

	// Insurance types
	const insuranceTypes: InsuranceTypeConfig[] = [
		{ id: 'auto', name: 'Assurance Auto', icon: FaCar, color: 'from-blue-500 to-blue-600' },
		{
			id: 'habitation',
			name: 'Assurance Habitation',
			icon: FaHome,
			color: 'from-green-500 to-green-600',
		},
		{ id: 'sante', name: 'Assurance Santé', icon: FaMedkit, color: 'from-red-500 to-red-600' },
		{
			id: 'moto',
			name: 'Assurance Moto',
			icon: FaMotorcycle,
			color: 'from-purple-500 to-purple-600',
		},
	];

	// Memoize filtered results to prevent unnecessary recalculations
	const filteredResults = useMemo(() => {
		return comparisonResults.filter((offer) => {
		if (filters.rating > 0 && offer.rating < filters.rating) return false;
		if (filters.insurers.length > 0 && !filters.insurers.includes(offer.insurer)) return false;
			if (
				offer.price.monthly < filters.priceRange[0] ||
				offer.price.monthly > filters.priceRange[1]
			)
			return false;
		return true;
	});
	}, [comparisonResults, filters.rating, filters.insurers, filters.priceRange]);

	// Separate current contracts from other offers for pagination
	const { currentContracts, otherOffers } = useMemo(() => {
		const current = filteredResults.filter(offer => offer.isCurrentContract);
		const others = filteredResults.filter(offer => !offer.isCurrentContract);
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
	const updateFormField = useCallback((field: keyof SimpleFormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	}, []);

	const handleTypeSelection = useCallback(
		(type: InsuranceType) => {
		setSelectedType(type);

		// Prefill from existing contracts
		const existingContract = contracts.find((c) => c.type === type && c.status === 'active');
		if (existingContract) {
			setFormData((prev) => ({
				...prev,
				monthlyBudget: Math.round(existingContract.premium / 12).toString(),
					vehicleType: type === 'auto' ? 'car' : '',
					coverageLevel: type === 'auto' ? 'tous_risques' : 'standard',
			}));
		}

			setCurrentStep('form');
		},
		[contracts]
	);

	const handleFormSubmit = useCallback(async () => {
		if (!selectedType) return;

		setCurrentStep('loading');

		try {
			// Use current formData directly, not through dependency
			setFormData((currentFormData) => {
				// Map SimpleFormData to the service's expected FormData format
				const serviceFormData = {
					age: currentFormData.age,
					profession: currentFormData.profession,
					location: currentFormData.location,
					monthlyBudget: currentFormData.monthlyBudget,
					// Add type-specific fields as needed by the service
					...(selectedType === 'auto' && {
						vehicleType: currentFormData.vehicleType,
						energyType: currentFormData.energyType,
						parkingLocation: currentFormData.parkingLocation,
						claimsHistory: currentFormData.claimsHistory,
					}),
					...(selectedType === 'habitation' && {
						propertyType: currentFormData.propertyType,
						hasAlarm: currentFormData.hasAlarm === 'true',
						securityLevel: currentFormData.securityLevel,
					}),
					...(selectedType === 'sante' && {
						familyStatus: currentFormData.familyStatus,
						hasChronicCondition: false,
						practicesSport: false,
					}),
					...(selectedType === 'moto' && {
						motorcycleType: currentFormData.vehicleType,
						engineSize: '125',
						hasAntiTheft: false,
					}),
				} as Parameters<typeof ComparisonService.getComparisons>[1];

				// Find existing contract for this insurance type
				const existingContract = contracts.find((c) => c.type === selectedType && c.status === 'active');
				
				// Process comparison asynchronously
				ComparisonService.getComparisons(selectedType, serviceFormData, existingContract)
					.then((results) => {
						setComparisonResults(results);
		setCurrentStep('results');

						// Save this comparison to history using Redux
						const comparisonData = {
							insuranceType: selectedType,
							criteria: {
								age: currentFormData.age,
								profession: currentFormData.profession,
								location: currentFormData.location,
								monthlyBudget: currentFormData.monthlyBudget,
								vehicleType: currentFormData.vehicleType,
								coverageLevel: currentFormData.coverageLevel,
							},
							resultsCount: results.length,
							topOffer: {
								insurer: results[0]?.insurer || '',
								price: results[0]?.price.monthly || 0,
								rating: results[0]?.rating || 0,
							},
						};

						saveComparison(comparisonData);
					})
					.catch((error) => {
						console.error('Error fetching comparison results:', error);
						setCurrentStep('form');
					});

				// Return unchanged form data
				return currentFormData;
			});
		} catch (error) {
			console.error('Error fetching comparison results:', error);
			setCurrentStep('form');
		}
	}, [selectedType, saveComparison]);

	// Function to analyze how insurers respond to specific questions
	const analyzeQuestionResponses = useCallback((question: string, offers: ComparisonOffer[]) => {
		const responses: { [insurerId: string]: { hasAnswer: boolean; details: string } } = {};
		
		offers.forEach(offer => {
			const lowerQuestion = question.toLowerCase();
			let hasAnswer = false;
			let details = '';

			// Analysis logic based on question content and offer coverages
			if (lowerQuestion.includes('vol') && lowerQuestion.includes('étranger')) {
				hasAnswer = offer.coverages['Vol'] && offer.coverages['Vol'].included;
				details = hasAnswer ? 'Couverture vol à l\'étranger incluse' : 'Vol à l\'étranger non couvert';
			} else if (lowerQuestion.includes('assistance') && lowerQuestion.includes('24')) {
				hasAnswer = offer.coverages['Assistance'] && offer.coverages['Assistance'].included;
				details = hasAnswer ? 'Assistance 24h/24 disponible' : 'Assistance limitée';
			} else if (lowerQuestion.includes('juridique')) {
				hasAnswer = offer.coverages['Protection juridique'] && offer.coverages['Protection juridique'].included;
				details = hasAnswer ? 'Protection juridique incluse' : 'Protection juridique en option';
			} else if (lowerQuestion.includes('franchise') && lowerQuestion.includes('glace')) {
				hasAnswer = Math.random() > 0.4; // Mock logic
				details = hasAnswer ? 'Franchise bris de glace réduite' : 'Franchise standard';
			} else if (lowerQuestion.includes('remplacement')) {
				hasAnswer = offer.coverages['Véhicule de remplacement'] && offer.coverages['Véhicule de remplacement'].included;
				details = hasAnswer ? 'Véhicule de remplacement garanti' : 'Véhicule de remplacement non inclus';
			} else {
				// Generic analysis for other questions
				hasAnswer = Math.random() > 0.3; // Mock logic for demo
				details = hasAnswer ? 'Critère satisfait' : 'Critère non satisfait';
			}

			responses[offer.id] = { hasAnswer, details };
		});

		return responses;
	}, []);

	const handleAiQuestion = useCallback(async () => {
		if (!aiQuestion.trim()) return;

		setIsAiLoading(true);
		
		// Add the question to our tracking array
		const questionResponses = analyzeQuestionResponses(aiQuestion, comparisonResults);
		const newQuestion = {
			question: aiQuestion,
			timestamp: new Date(),
			responses: questionResponses
		};
		
		setAskedQuestions(prev => [...prev, newQuestion]);

		// Simulate AI processing
		setTimeout(() => {
			// Generate AI response based on question
			let response = '';
			const lowerQuestion = aiQuestion.toLowerCase();

			if (
				lowerQuestion.includes('moins cher') ||
				lowerQuestion.includes('prix') ||
				lowerQuestion.includes('économie')
			) {
				const cheapestOffer = comparisonResults.length > 0 ? comparisonResults[0] : null;
				const recommendedOffer = comparisonResults.find((offer) => offer.recommended);

				if (recommendedOffer && cheapestOffer && recommendedOffer.id === cheapestOffer.id) {
					response = `Excellente nouvelle ! **${recommendedOffer.insurer}** à ${recommendedOffer.price.monthly}€/mois est à la fois notre recommandation et l'offre la moins chère. Cette offre vous fait économiser tout en conservant une couverture complète avec assistance 24h/24.`;
				} else if (cheapestOffer) {
					response = `Pour le prix le plus bas, **${cheapestOffer.insurer}** à ${cheapestOffer.price.monthly}€/mois est votre meilleur choix${recommendedOffer ? `. Cependant, notre recommandation **${recommendedOffer.insurer}** à ${recommendedOffer.price.monthly}€/mois offre un meilleur rapport qualité-prix.` : '.'}`;
				} else {
					response = `Je n'ai pas encore de résultats de comparaison à analyser. Veuillez d'abord effectuer une recherche.`;
				}
			} else if (
				lowerQuestion.includes('service') ||
				lowerQuestion.includes('client') ||
				lowerQuestion.includes('assistance')
			) {
				response = `Pour un service client exceptionnel, **Allianz** se démarque avec une note de 4.5/5 et un réseau d'agences étendu. Leurs clients apprécient particulièrement la réactivité en cas de sinistre et l'accompagnement personnalisé.`;
			} else if (
				lowerQuestion.includes('vol') ||
				lowerQuestion.includes('sécurité') ||
				lowerQuestion.includes('protection')
			) {
				response = `Concernant la protection contre le vol, **Direct Assurance** et **Allianz** offrent toutes deux une couverture complète. Direct Assurance inclut même la protection à l'étranger, idéale si vous voyagez fréquemment.`;
			} else if (lowerQuestion.includes('franchise') || lowerQuestion.includes('remboursement')) {
				response = `Pour minimiser les franchises, **Direct Assurance** propose un bris de glace sans franchise, tandis qu'Allianz applique 50€ et MAIF 100€. Cela peut représenter une économie significative en cas de sinistre.`;
			} else {
				const recommendedOffer =
					comparisonResults.find((offer) => offer.recommended) || comparisonResults[0];
				response = recommendedOffer
					? `**Recommandation principale : ${recommendedOffer.insurer}**
- Prix optimal : ${recommendedOffer.price.monthly}€/mois
- Couverture adaptée à vos besoins spécifiques
- Note de ${recommendedOffer.rating}/5
- Score de compatibilité : ${recommendedOffer.score}/100
${recommendedOffer.recommended ? '- ⭐ **Choix recommandé par notre IA**' : ''}

Cette offre correspond parfaitement à vos critères et vous offre le meilleur rapport qualité-prix du marché.`
					: `Pour vous donner une analyse personnalisée, j'ai besoin des résultats de votre comparaison. Veuillez d'abord effectuer une recherche.`;
			}

			setAiResponse(response);
			setAiQuestion(''); // Clear the input after asking
			setIsAiLoading(false);
		}, 1500);
	}, [aiQuestion, comparisonResults, analyzeQuestionResponses]);

					return (
		<div className="space-y-8">
			{currentStep === 'history' && (
				<PastComparisonsView
					user={user}
					insuranceTypes={insuranceTypes}
					historyPage={historyPage}
					historyItemsPerPage={historyItemsPerPage}
					setHistoryPage={setHistoryPage}
					setCurrentStep={setCurrentStep}
					setSelectedType={setSelectedType}
					setFormData={setFormData}
				/>
			)}
			{currentStep === 'type' && (
				<TypeSelectionView
					user={user}
					insuranceTypes={insuranceTypes}
					contracts={contracts}
					setCurrentStep={setCurrentStep}
					handleTypeSelection={handleTypeSelection}
				/>
			)}
			{currentStep === 'form' && (
				<FormView
					selectedType={selectedType}
					formData={formData}
					updateFormField={updateFormField}
					handleFormSubmit={handleFormSubmit}
					setCurrentStep={setCurrentStep}
				/>
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
	);
};

export default ComparateurModule;
