import {
	FaBrain,
	FaCalculator,
	FaCar,
	FaCheck,
	FaChevronLeft,
	FaChevronRight,
	FaFilter,
	FaHome,
	FaMedkit,
	FaMotorcycle,
	FaRobot,
	FaStar,
	FaTimes,
} from 'react-icons/fa';
import type { InsuranceType, InsuranceTypeConfig } from '../types';

import { motion } from 'framer-motion';
import { useAppSelector } from '../store/hooks';
import { useState } from 'react';

interface ComparisonOffer {
	id: string;
	insurer: string;
	price: { monthly: number; yearly: number };
	rating: number;
	coverages: { [key: string]: { included: boolean; value?: string } };
	pros: string[];
	cons: string[];
	score: number;
	recommended?: boolean;
}

interface FormData {
	age: string;
	profession: string;
	vehicleType: string;
	coverageLevel: string;
	monthlyBudget: string;
	location: string;
}

const ComparateurModule = () => {
	const user = useAppSelector((state) => state.user?.currentUser);
	const contracts = useAppSelector((state) => state.contracts?.contracts || []);

	// State management
	const [currentStep, setCurrentStep] = useState<'type' | 'form' | 'results'>('type');
	const [selectedType, setSelectedType] = useState<'auto' | 'habitation' | 'sante' | 'moto' | null>(
		null
	);
	// Calculate age from birth_date
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

	const [formData, setFormData] = useState<FormData>({
		age: calculateAge(user?.birth_date || '') || '',
		profession: user?.professional_category || '',
		vehicleType: '',
		coverageLevel: '',
		monthlyBudget: '',
		location: user?.city || '',
	});

	// Results state
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);
	const [aiQuestion, setAiQuestion] = useState('');
	const [aiResponse, setAiResponse] = useState('');
	const [isAiLoading, setIsAiLoading] = useState(false);
	const [filters, setFilters] = useState({
		priceRange: [0, 100],
		insurers: [] as string[],
		rating: 0,
		coverages: [] as string[],
	});

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

	// Mock results
	const getAllResults = (): ComparisonOffer[] => [
		{
			id: '1',
			insurer: 'Direct Assurance',
			price: { monthly: 32, yearly: 384 },
			rating: 4.2,
			score: 95,
			coverages: {
				RC: { included: true },
				Vol: { included: true },
				'Bris de glace': { included: true },
			},
			pros: ['Prix attractif', 'Assistance étendue'],
			cons: ['Réseau limité'],
			recommended: true,
		},
		{
			id: '2',
			insurer: 'Allianz',
			price: { monthly: 45, yearly: 540 },
			rating: 4.5,
			score: 88,
			coverages: {
				RC: { included: true },
				Vol: { included: true },
				'Bris de glace': { included: true },
			},
			pros: ['Service excellent'],
			cons: ['Prix élevé'],
		},
		{
			id: '3',
			insurer: 'MAIF',
			price: { monthly: 38, yearly: 456 },
			rating: 4.3,
			score: 82,
			coverages: {
				RC: { included: true },
				Vol: { included: true },
				'Bris de glace': { included: false },
			},
			pros: ['Mutuelle reconnue'],
			cons: ['Couverture limitée'],
		},
		{
			id: '4',
			insurer: 'AXA',
			price: { monthly: 42, yearly: 504 },
			rating: 4.1,
			score: 80,
			coverages: {
				RC: { included: true },
				Vol: { included: true },
				'Bris de glace': { included: true },
			},
			pros: ['Réseau étendu'],
			cons: ['Service moyen'],
		},
		{
			id: '5',
			insurer: 'Generali',
			price: { monthly: 35, yearly: 420 },
			rating: 4.0,
			score: 78,
			coverages: {
				RC: { included: true },
				Vol: { included: false },
				'Bris de glace': { included: true },
			},
			pros: ['Prix compétitif'],
			cons: ['Pas de couverture vol'],
		},
		{
			id: '6',
			insurer: 'Groupama',
			price: { monthly: 39, yearly: 468 },
			rating: 4.2,
			score: 75,
			coverages: {
				RC: { included: true },
				Vol: { included: true },
				'Bris de glace': { included: true },
			},
			pros: ['Service local'],
			cons: ['Prix moyen'],
		},
		{
			id: '7',
			insurer: 'MACIF',
			price: { monthly: 36, yearly: 432 },
			rating: 4.1,
			score: 73,
			coverages: {
				RC: { included: true },
				Vol: { included: true },
				'Bris de glace': { included: false },
			},
			pros: ['Mutuelle solidaire'],
			cons: ['Options limitées'],
		},
	];

	// Filter and paginate results
	const filteredResults = getAllResults().filter((offer) => {
		if (filters.rating > 0 && offer.rating < filters.rating) return false;
		if (filters.insurers.length > 0 && !filters.insurers.includes(offer.insurer)) return false;
		if (offer.price.monthly < filters.priceRange[0] || offer.price.monthly > filters.priceRange[1])
			return false;
		return true;
	});

	const paginatedResults = filteredResults.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

	const handleTypeSelection = (type: InsuranceType) => {
		setSelectedType(type);
		setCurrentStep('form');

		// Prefill from existing contracts
		const existingContract = contracts.find((c) => c.type === type && c.status === 'active');
		if (existingContract) {
			setFormData((prev) => ({
				...prev,
				monthlyBudget: Math.round(existingContract.premium / 12).toString(),
				vehicleType: type === 'auto' ? 'berline' : '',
				coverageLevel: type === 'auto' ? 'tous-risques' : 'standard',
			}));
		}
	};

	const handleFormSubmit = () => {
		setCurrentStep('results');
	};

	const handleAiQuestion = async () => {
		if (!aiQuestion.trim()) return;

		setIsAiLoading(true);
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
				response = `Basé sur votre question sur les prix, je recommande **Direct Assurance** à ${getAllResults()[0].price.monthly}€/mois. Cette offre vous fait économiser jusqu'à 13€/mois par rapport à la moyenne du marché tout en conservant une couverture complète avec assistance 24h/24.`;
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
				response = `Basé sur votre profil (${formData.profession}, ${formData.location}) et votre budget de ${formData.monthlyBudget}€/mois, voici mon analyse personnalisée :

**Recommandation principale : Direct Assurance**
- Prix optimal : ${getAllResults()[0].price.monthly}€/mois (dans votre budget)
- Couverture adaptée à vos besoins spécifiques
- Assistance 24h/24 incluse
- Bris de glace sans franchise

Cette offre correspond parfaitement à vos critères et vous offre le meilleur rapport qualité-prix du marché.`;
			}

			setAiResponse(response);
			setIsAiLoading(false);
		}, 1500);
	};

	// Type Selection View
	const TypeSelectionView = () => (
		<div className="space-y-8">
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Comparateur d'assurances</h1>
				<p className="text-gray-600 text-lg">
					{user?.first_name
						? `${user.first_name}, choisissez le type d'assurance à comparer.`
						: "Choisissez le type d'assurance à comparer."}
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="grid grid-cols-1 md:grid-cols-2 gap-6"
			>
				{insuranceTypes.map((type) => {
					const Icon = type.icon;
					return (
						<motion.div
							key={type.id}
							className="bg-white border-2 border-gray-100 rounded-2xl p-8 cursor-pointer hover:border-[#1e51ab] hover:shadow-lg transition-all"
							whileHover={{ scale: 1.02 }}
							onClick={() => handleTypeSelection(type.id)}
						>
							<div className="text-center">
								<div
									className={`w-20 h-20 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center mx-auto mb-6`}
								>
									<Icon className="h-10 w-10 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">{type.name}</h3>
								{contracts.some((c) => c.type === type.id && c.status === 'active') && (
									<div className="flex items-center justify-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
										<FaCheck className="h-3 w-3 mr-2" />
										Contrat existant détecté
									</div>
								)}
							</div>
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);

	// Form View
	const FormView = () => (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Assurance {selectedType}</h1>
					<p className="text-gray-600">
						Remplissez vos informations pour obtenir des devis personnalisés
					</p>
				</div>
				<button
					onClick={() => setCurrentStep('type')}
					className="text-[#1e51ab] hover:text-[#163d82] font-medium flex items-center"
				>
					<FaChevronLeft className="h-4 w-4 mr-2" />
					Changer de type
				</button>
			</div>

			<div className="bg-white border border-gray-100 rounded-2xl p-8">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleFormSubmit();
					}}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Âge</label>
							<input
								type="number"
								value={formData.age}
								onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
								placeholder="25"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
							<select
								value={formData.profession}
								onChange={(e) => setFormData((prev) => ({ ...prev, profession: e.target.value }))}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
								required
							>
								<option value="">Sélectionnez</option>
								<option value="Cadre">Cadre</option>
								<option value="Employé">Employé</option>
								<option value="Profession libérale">Profession libérale</option>
								<option value="Étudiant">Étudiant</option>
								<option value="Retraité">Retraité</option>
							</select>
						</div>
						{selectedType === 'auto' && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Type de véhicule
								</label>
								<select
									value={formData.vehicleType}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, vehicleType: e.target.value }))
									}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
									required
								>
									<option value="">Sélectionnez</option>
									<option value="citadine">Citadine</option>
									<option value="berline">Berline</option>
									<option value="suv">SUV</option>
									<option value="sportive">Sportive</option>
								</select>
							</div>
						)}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Niveau de couverture
							</label>
							<select
								value={formData.coverageLevel}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, coverageLevel: e.target.value }))
								}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
								required
							>
								<option value="">Sélectionnez</option>
								{selectedType === 'auto' && (
									<>
										<option value="tiers">Au tiers</option>
										<option value="tiers-plus">Tiers étendu</option>
										<option value="tous-risques">Tous risques</option>
									</>
								)}
								{selectedType !== 'auto' && (
									<>
										<option value="basique">Basique</option>
										<option value="standard">Standard</option>
										<option value="premium">Premium</option>
									</>
								)}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Budget mensuel maximum
							</label>
							<input
								type="number"
								value={formData.monthlyBudget}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, monthlyBudget: e.target.value }))
								}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
								placeholder="50"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
							<input
								type="text"
								value={formData.location}
								onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
								placeholder="Paris"
								required
							/>
						</div>
					</div>

					<div className="flex justify-end">
						<button
							type="submit"
							className="px-8 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors flex items-center"
						>
							<FaCalculator className="h-4 w-4 mr-2" />
							Voir les offres
						</button>
					</div>
				</form>
			</div>
		</div>
	);

	// Results View with Filters and Pagination
	const ResultsView = () => (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center justify-between"
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Offres d'assurance {selectedType}
					</h1>
					<p className="text-gray-600">{filteredResults.length} offres trouvées</p>
				</div>
				<button
					onClick={() => setCurrentStep('type')}
					className="text-[#1e51ab] hover:text-[#163d82] font-medium flex items-center"
				>
					<FaTimes className="h-4 w-4 mr-2" />
					Nouvelle recherche
				</button>
			</motion.div>

			{/* AI Assistant - Prominent Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6"
			>
				<div className="flex items-center mb-4">
					<FaRobot className="h-8 w-8 text-[#1e51ab] mr-3" />
					<div>
						<h2 className="text-xl font-bold text-gray-900">Assistant IA AssuBot</h2>
						<p className="text-sm text-gray-600">
							Posez vos questions pour trouver la meilleure assurance
						</p>
					</div>
				</div>

				{/* AI Question Input */}
				<div className="mb-4">
					<div className="flex gap-3">
						<input
							type="text"
							value={aiQuestion}
							onChange={(e) => setAiQuestion(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && handleAiQuestion()}
							className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
							placeholder="Ex: Quelle est l'assurance la moins chère ? Quel assureur a le meilleur service client ?"
							disabled={isAiLoading}
						/>
						<button
							onClick={handleAiQuestion}
							disabled={isAiLoading || !aiQuestion.trim()}
							className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
						>
							{isAiLoading ? (
								<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
							) : (
								<>
									<FaBrain className="h-4 w-4 mr-2" />
									Analyser
								</>
							)}
						</button>
					</div>
				</div>

				{/* Default AI Analysis */}
				<div className="bg-white/60 p-4 rounded-lg mb-4">
					<h4 className="font-semibold text-gray-900 mb-2 flex items-center">
						<FaBrain className="h-4 w-4 mr-2 text-[#1e51ab]" />
						Analyse automatique de votre profil
					</h4>
					<p className="text-gray-700 text-sm">
						Basé sur votre profil ({formData.profession}, {formData.location}) et votre budget de{' '}
						{formData.monthlyBudget}€/mois, je recommande <strong>Direct Assurance</strong> qui
						offre le meilleur équilibre prix-couverture pour vos besoins spécifiques.
					</p>
				</div>

				{/* AI Response */}
				{aiResponse && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						className="bg-white/80 p-4 rounded-lg border-l-4 border-[#1e51ab]"
					>
						<h4 className="font-semibold text-gray-900 mb-2 flex items-center">
							<FaRobot className="h-4 w-4 mr-2 text-[#1e51ab]" />
							Réponse de l'IA
						</h4>
						<div className="text-gray-700 text-sm whitespace-pre-line">{aiResponse}</div>
					</motion.div>
				)}

				{/* Quick Questions */}
				<div className="mt-4">
					<p className="text-xs text-gray-600 mb-2">Questions fréquentes :</p>
					<div className="flex flex-wrap gap-2">
						{[
							"Quelle est l'assurance la moins chère ?",
							'Quel assureur a le meilleur service client ?',
							'Quelle couverture pour les voyages ?',
							'Comment réduire ma franchise ?',
						].map((question) => (
							<button
								key={question}
								onClick={() => {
									setAiQuestion(question);
									setTimeout(() => handleAiQuestion(), 100);
								}}
								className="text-xs px-3 py-1 bg-white/80 text-gray-700 rounded-full hover:bg-white transition-colors border border-gray-200"
							>
								{question}
							</button>
						))}
					</div>
				</div>
			</motion.div>

			<div className="flex gap-6">
				{/* Filters Sidebar */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className="w-80 bg-white border border-gray-100 rounded-2xl p-6 h-fit"
				>
					<div className="flex items-center mb-6">
						<FaFilter className="h-5 w-5 text-[#1e51ab] mr-2" />
						<h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
					</div>

					<div className="space-y-6">
						{/* Price Range */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								Prix mensuel (€)
							</label>
							<div className="flex items-center space-x-3">
								<input
									type="number"
									value={filters.priceRange[0]}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]],
										}))
									}
									className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
									placeholder="Min"
								/>
								<span className="text-gray-500">-</span>
								<input
									type="number"
									value={filters.priceRange[1]}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											priceRange: [prev.priceRange[0], parseInt(e.target.value) || 100],
										}))
									}
									className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
									placeholder="Max"
								/>
							</div>
						</div>

						{/* Rating Filter */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">Note minimum</label>
							<select
								value={filters.rating}
								onChange={(e) =>
									setFilters((prev) => ({ ...prev, rating: parseFloat(e.target.value) }))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
							>
								<option value={0}>Toutes les notes</option>
								<option value={4}>4+ étoiles</option>
								<option value={4.2}>4.2+ étoiles</option>
								<option value={4.5}>4.5+ étoiles</option>
							</select>
						</div>

						{/* Insurers Filter */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">Assureurs</label>
							<div className="space-y-2 max-h-40 overflow-y-auto">
								{[
									'Direct Assurance',
									'Allianz',
									'MAIF',
									'AXA',
									'Generali',
									'Groupama',
									'MACIF',
								].map((insurer) => (
									<label key={insurer} className="flex items-center">
										<input
											type="checkbox"
											checked={filters.insurers.includes(insurer)}
											onChange={(e) => {
												if (e.target.checked) {
													setFilters((prev) => ({
														...prev,
														insurers: [...prev.insurers, insurer],
													}));
												} else {
													setFilters((prev) => ({
														...prev,
														insurers: prev.insurers.filter((i) => i !== insurer),
													}));
												}
											}}
											className="h-4 w-4 text-[#1e51ab] rounded border-gray-300 focus:ring-[#1e51ab]"
										/>
										<span className="ml-2 text-sm text-gray-700">{insurer}</span>
									</label>
								))}
							</div>
						</div>

						{/* Reset Filters */}
						<button
							onClick={() =>
								setFilters({ priceRange: [0, 100], insurers: [], rating: 0, coverages: [] })
							}
							className="w-full py-2 text-sm text-gray-600 hover:text-[#1e51ab] border border-gray-300 rounded-lg hover:border-[#1e51ab] transition-colors"
						>
							Réinitialiser les filtres
						</button>
					</div>
				</motion.div>

				{/* Results List */}
				<div className="flex-1">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-4"
					>
						{paginatedResults.map((offer, index) => (
							<motion.div
								key={offer.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className={`bg-white border-2 rounded-xl p-6 ${offer.recommended ? 'border-[#1e51ab] bg-blue-50' : 'border-gray-200'}`}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
											<span className="text-sm font-medium text-gray-600">
												{offer.insurer.charAt(0)}
											</span>
										</div>
										<div>
											<h3 className="text-lg font-semibold text-gray-900">{offer.insurer}</h3>
											<div className="flex items-center mt-1">
												{[...Array(5)].map((_, i) => (
													<FaStar
														key={i}
														className={`h-4 w-4 ${i < Math.floor(offer.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
													/>
												))}
												<span className="text-sm text-gray-600 ml-2">({offer.rating})</span>
											</div>
										</div>
									</div>

									<div className="text-right">
										<div className="text-2xl font-bold text-[#1e51ab]">{offer.price.monthly}€</div>
										<div className="text-sm text-gray-600">par mois</div>
										<div className="text-xs text-gray-500">{offer.price.yearly}€/an</div>
									</div>
								</div>

								{/* Coverage Summary */}
								<div className="mt-4 flex flex-wrap gap-2">
									{Object.entries(offer.coverages).map(([coverage, details]) => (
										<span
											key={coverage}
											className={`px-2 py-1 text-xs rounded-full ${
												details.included ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
											}`}
										>
											{details.included ? '✓' : '✗'} {coverage}
										</span>
									))}
								</div>

								{/* Actions */}
								<div className="mt-4 flex items-center justify-between">
									<div className="flex space-x-2">
										<button className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg text-sm hover:bg-[#163d82] transition-colors">
											Choisir cette offre
										</button>
										<button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
											Voir détails
										</button>
									</div>
									{offer.recommended && (
										<span className="text-xs font-medium text-[#1e51ab] bg-blue-100 px-2 py-1 rounded-full">
											Recommandé
										</span>
									)}
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Pagination */}
					{totalPages > 1 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex items-center justify-center space-x-2 mt-8"
						>
							<button
								onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
								disabled={currentPage === 1}
								className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<FaChevronLeft className="h-4 w-4" />
							</button>

							{[...Array(totalPages)].map((_, i) => (
								<button
									key={i + 1}
									onClick={() => setCurrentPage(i + 1)}
									className={`px-3 py-2 rounded-lg text-sm ${
										currentPage === i + 1
											? 'bg-[#1e51ab] text-white'
											: 'border border-gray-300 text-gray-600 hover:bg-gray-50'
									}`}
								>
									{i + 1}
								</button>
							))}

							<button
								onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
								disabled={currentPage === totalPages}
								className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<FaChevronRight className="h-4 w-4" />
							</button>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);

	return (
		<div className="space-y-8">
			{currentStep === 'type' && <TypeSelectionView />}
			{currentStep === 'form' && <FormView />}
			{currentStep === 'results' && <ResultsView />}
		</div>
	);
};

export default ComparateurModule;
