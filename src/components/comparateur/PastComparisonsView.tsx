import {
	FaCalculator,
	FaChevronLeft,
	FaChevronRight
} from 'react-icons/fa';

import type { InsuranceType } from '../../types';
import React from 'react';
import type { SimpleFormData } from '../ComparateurModule';
import type { User } from '../../store/userSlice';
import { motion } from 'framer-motion';
import { useComparisons } from '../../hooks/useComparisons';

interface InsuranceTypeConfig {
	id: InsuranceType;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
}



interface PastComparisonsViewProps {
	user: User | null;
	insuranceTypes: InsuranceTypeConfig[];
	historyPage: number;
	historyItemsPerPage: number;
	setHistoryPage: (page: number) => void;
	setCurrentStep: (step: 'history' | 'type' | 'form' | 'results' | 'loading') => void;
	setSelectedType: (type: InsuranceType) => void;
	setFormData: React.Dispatch<React.SetStateAction<SimpleFormData>>;
}

const PastComparisonsView: React.FC<PastComparisonsViewProps> = ({
	user,
	insuranceTypes,
	historyPage,
	historyItemsPerPage,
	setHistoryPage,
	setCurrentStep,
	setSelectedType,
	setFormData,
}) => {
	const { 
		getPaginatedComparisons,
		getDaysUntilExpiration,
		clearExpired
	} = useComparisons();

	// Get paginated comparisons
	const paginatedData = getPaginatedComparisons(historyPage, historyItemsPerPage);

	// Helper function to get insurance type name
	const getInsuranceTypeName = (type: InsuranceType) => {
		const typeConfig = insuranceTypes.find(t => t.id === type);
		return typeConfig?.name || type;
	};

	// Helper function to format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	// Helper function to get insurer logo
	const getInsurerLogo = (insurerName: string) => {
		const logoMap: { [key: string]: string } = {
			'Direct Assurance': '/insurances/direct.png',
			'Allianz': '/insurances/allianz.png',
			'MAIF': '/insurances/maif.png',
			'AXA': '/insurances/axa.png',
			'Generali': '/insurances/generali.png',
			'Groupama': '/insurances/groupama.png',
			'MACIF': '/insurances/macif.png',
			'kenko': '/insurances/kenko.png',
		};
		return logoMap[insurerName] || null;
	};

	return (
		<div className="space-y-8">
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Mes comparaisons d'assurances</h1>
						<p className="text-gray-600 text-lg">
							{user?.firstName
								? `${user.firstName}, retrouvez vos comparaisons précédentes ou lancez-en une nouvelle.`
								: "Retrouvez vos comparaisons précédentes ou lancez-en une nouvelle."}
						</p>
					</div>
					{paginatedData.totalItems > 0 && (
						<button
							onClick={() => clearExpired()}
							className="text-sm text-gray-500 hover:text-[#1e51ab] flex items-center"
						>
							Nettoyer les comparaisons expirées
						</button>
					)}
				</div>
			</motion.div>

			{/* New Comparison Button */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
			>
				<button
					onClick={() => setCurrentStep('type')}
					className="w-full bg-gradient-to-r from-[#1e51ab] to-[#163d82] text-white rounded-2xl p-8 hover:shadow-lg transition-all flex items-center justify-center group"
				>
					<div className="text-center">
						<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
							<FaCalculator className="h-8 w-8 text-white" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Nouvelle comparaison</h3>
						<p className="text-blue-100">Comparez les meilleures offres d'assurance</p>
					</div>
				</button>
			</motion.div>

			{/* Past Comparisons List */}
			{paginatedData.totalItems > 0 ? (
				<div className="space-y-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold text-gray-900">Comparaisons récentes</h2>
							<p className="text-sm text-gray-600">
								{paginatedData.totalItems} comparaison{paginatedData.totalItems > 1 ? 's' : ''} valide{paginatedData.totalItems > 1 ? 's' : ''}
							</p>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="grid gap-4"
					>
						{paginatedData.items.map((comparison, index) => {
							const daysLeft = getDaysUntilExpiration(comparison);
							const isExpiringSoon = daysLeft <= 2;
							
							return (
								<motion.div
									key={comparison.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className={`bg-white border rounded-xl p-6 hover:shadow-md transition-all cursor-pointer group ${
										isExpiringSoon ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
									}`}
									onClick={() => {
										// Prefill form with past comparison data
										setSelectedType(comparison.insuranceType);
										setFormData((prev: SimpleFormData) => ({
											...prev,
											age: comparison.criteria.age,
											profession: comparison.criteria.profession,
											monthlyBudget: comparison.criteria.monthlyBudget,
											location: comparison.criteria.location,
											vehicleType: comparison.criteria.vehicleType || '',
											coverageLevel: comparison.criteria.coverageLevel || '',
										}));
										setCurrentStep('form');
									}}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
												{React.createElement(
													insuranceTypes.find(t => t.id === comparison.insuranceType)?.icon || FaCalculator,
													{ className: "h-6 w-6 text-[#1e51ab]" }
												)}
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 group-hover:text-[#1e51ab] transition-colors">
													{getInsuranceTypeName(comparison.insuranceType)}
												</h3>
												<div className="flex items-center space-x-2 text-sm text-gray-600">
													<span>{formatDate(comparison.date)}</span>
													{isExpiringSoon && (
														<span className="text-orange-600 font-medium">
															• Expire dans {daysLeft} jour{daysLeft !== 1 ? 's' : ''}
														</span>
													)}
												</div>
											</div>
										</div>

										<div className="text-right">
											<div className="text-sm text-gray-500 mb-1">
												{comparison.resultsCount} offres trouvées
											</div>
											{comparison.topOffer && (
												<div className="text-sm flex items-center">
													{getInsurerLogo(comparison.topOffer.insurer) && (
														<img
															src={getInsurerLogo(comparison.topOffer.insurer)!}
															alt={comparison.topOffer.insurer}
															className="w-4 h-4 object-contain mr-2"
														/>
													)}
													<span className="font-medium text-[#1e51ab]">
														{comparison.topOffer.insurer}
													</span>
													<span className="text-gray-600 ml-2">
														{comparison.topOffer.price}€/mois
													</span>
												</div>
											)}
										</div>
									</div>

									<div className="mt-4 flex items-center justify-between text-sm text-gray-600">
										<div className="flex items-center space-x-4">
											<span>{comparison.criteria.profession}</span>
											<span>•</span>
											<span>{comparison.criteria.location}</span>
											<span>•</span>
											<span>Budget: {comparison.criteria.monthlyBudget}€/mois</span>
										</div>
										<div className="text-[#1e51ab] opacity-0 group-hover:opacity-100 transition-opacity">
											Relancer cette comparaison →
										</div>
									</div>
								</motion.div>
							);
						})}
					</motion.div>

					{/* Pagination */}
					{paginatedData.totalPages > 1 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex items-center justify-center space-x-2 mt-8"
						>
							<button
								onClick={() => setHistoryPage(Math.max(1, historyPage - 1))}
								disabled={!paginatedData.hasPreviousPage}
								className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<FaChevronLeft className="h-4 w-4" />
							</button>

							{[...Array(paginatedData.totalPages)].map((_, i) => (
								<button
									key={i + 1}
									onClick={() => setHistoryPage(i + 1)}
									className={`px-3 py-2 rounded-lg text-sm ${
										historyPage === i + 1
											? 'bg-[#1e51ab] text-white'
											: 'border border-gray-300 text-gray-600 hover:bg-gray-50'
									}`}
								>
									{i + 1}
								</button>
							))}

							<button
								onClick={() => setHistoryPage(Math.min(paginatedData.totalPages, historyPage + 1))}
								disabled={!paginatedData.hasNextPage}
								className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<FaChevronRight className="h-4 w-4" />
							</button>
						</motion.div>
					)}
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="text-center py-12"
				>
					<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<FaCalculator className="h-10 w-10 text-gray-400" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune comparaison précédente</h3>
					<p className="text-gray-600 mb-6">Commencez votre première comparaison pour trouver la meilleure assurance.</p>
					<button
						onClick={() => setCurrentStep('type')}
						className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors"
					>
						Commencer ma première comparaison
					</button>
				</motion.div>
			)}
		</div>
	);
};

export default PastComparisonsView; 