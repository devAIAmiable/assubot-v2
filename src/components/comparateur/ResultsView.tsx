import {
	FaBrain,
	FaChevronLeft,
	FaChevronRight,
	FaFilter,
	FaRobot,
	FaStar,
	FaThumbsUp,
	FaTimes
} from 'react-icons/fa';

import type { ComparisonOffer } from '../../services/comparisonService';
import type { InsuranceType } from '../../types';
import React from 'react';
import { motion } from 'framer-motion';

interface Filters {
	priceRange: number[];
	insurers: string[];
	rating: number;
	coverages: string[];
}

interface ResultsViewProps {
	selectedType: InsuranceType | null;
	filteredResults: ComparisonOffer[];
	paginatedResults: ComparisonOffer[];
	currentPage: number;
	totalPages: number;
	filters: Filters;
	aiQuestion: string;
	aiResponse: string;
	isAiLoading: boolean;
	isFilteringResults: boolean;
	setCurrentStep: (step: 'history' | 'type' | 'form' | 'results' | 'loading') => void;
	setAiQuestion: (question: string) => void;
	handleAiQuestion: () => void;
	handlePriceRangeChange: (range: number[]) => void;
	handleRatingChange: (rating: number) => void;
	handleInsurerChange: (insurer: string, checked: boolean) => void;
	handleFilterReset: () => void;
	setCurrentPage: (page: number) => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
	selectedType,
	filteredResults,
	paginatedResults,
	currentPage,
	totalPages,
	filters,
	aiQuestion,
	aiResponse,
	isAiLoading,
	isFilteringResults,
	setCurrentStep,
	setAiQuestion,
	handleAiQuestion,
	handlePriceRangeChange,
	handleRatingChange,
	handleInsurerChange,
	handleFilterReset,
	setCurrentPage,
}) => {
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
		};
		return logoMap[insurerName] || null;
	};

	return (
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
				<div className="flex items-center space-x-4">
					<button
						onClick={() => setCurrentStep('history')}
						className="text-gray-600 hover:text-[#1e51ab] font-medium flex items-center"
					>
						<FaChevronLeft className="h-4 w-4 mr-2" />
						Mes comparaisons
					</button>
					<span className="text-gray-300">|</span>
					<button
						onClick={() => setCurrentStep('type')}
						className="text-[#1e51ab] hover:text-[#163d82] font-medium flex items-center"
					>
						<FaTimes className="h-4 w-4 mr-2" />
						Nouvelle recherche
					</button>
				</div>
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
						{(() => {
							const recommendedOffer = filteredResults.find(offer => offer.recommended);
							if (recommendedOffer) {
								return (
									<>
										Basé sur votre profil et budget, je recommande <strong>{recommendedOffer.insurer}</strong> qui
										offre le meilleur équilibre prix-couverture pour vos besoins spécifiques à <strong>{recommendedOffer.price.monthly}€/mois</strong>.
									</>
								);
							}
							return "Analysez les offres ci-dessous pour trouver la meilleure assurance selon vos critères.";
						})()}
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
										handlePriceRangeChange([parseInt(e.target.value) || 0, filters.priceRange[1]])
									}
									className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
									placeholder="Min"
								/>
								<span className="text-gray-500">-</span>
								<input
									type="number"
									value={filters.priceRange[1]}
									onChange={(e) =>
										handlePriceRangeChange([filters.priceRange[0], parseInt(e.target.value) || 100])
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
								onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
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
											onChange={(e) => handleInsurerChange(insurer, e.target.checked)}
											className="h-4 w-4 text-[#1e51ab] rounded border-gray-300 focus:ring-[#1e51ab]"
										/>
										<span className="ml-2 text-sm text-gray-700">{insurer}</span>
									</label>
								))}
							</div>
						</div>

						{/* Reset Filters */}
						<button
							onClick={handleFilterReset}
							className="w-full py-2 text-sm text-gray-600 hover:text-[#1e51ab] border border-gray-300 rounded-lg hover:border-[#1e51ab] transition-colors"
						>
							Réinitialiser les filtres
						</button>
					</div>
				</motion.div>

				{/* Results Table */}
				<div className="flex-1">
					{isFilteringResults ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-center">
								<div className="w-8 h-8 border-2 border-[#1e51ab] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
								<p className="text-sm text-gray-600">Filtrage des offres...</p>
							</div>
						</div>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-white border border-gray-200 rounded-xl overflow-hidden"
						>
							{/* Table Header */}
							<div className="bg-gray-50 border-b border-gray-200">
								<div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-900">
									<div className="col-span-3">Assureur</div>
									<div className="col-span-2">Prix/mois</div>
									<div className="col-span-1">Note</div>
									<div className="col-span-3">Garanties principales</div>
									<div className="col-span-1">Franchise</div>
									<div className="col-span-2">Actions</div>
								</div>
							</div>

							{/* Table Body */}
							<div className="divide-y divide-gray-200">
								{paginatedResults.map((offer, index) => (
									<motion.div
										key={offer.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
										className={`relative grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 ${
											offer.recommended ? 'bg-blue-50 border-l-4 border-l-[#1e51ab]' : ''
										}`}
									>
										{/* Assureur */}
										<div className="col-span-3 flex items-center space-x-3">
											<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 border border-gray-200 flex-shrink-0">
												{getInsurerLogo(offer.insurer) ? (
													<img
														src={getInsurerLogo(offer.insurer)!}
														alt={offer.insurer}
														className="w-full h-full object-contain"
													/>
												) : (
													<span className="text-sm font-medium text-gray-600">
														{offer.insurer.charAt(0)}
													</span>
												)}
											</div>
											<div>
												<div className="font-semibold text-gray-900">{offer.insurer}</div>
												<div className="text-sm text-gray-600">Assurance Standard</div>
												{offer.recommended && (
													<span className="inline-flex items-center px-2 py-1 text-xs font-medium text-[#1e51ab] bg-blue-100 rounded-full mt-1">
														<FaThumbsUp className="w-3 h-3 mr-1" />
														Recommandé
													</span>
												)}
											</div>
										</div>

										{/* Prix */}
										<div className="col-span-2">
											<div className="text-lg font-bold text-[#1e51ab]">{offer.price.monthly}€</div>
											<div className="text-sm text-gray-600">{offer.price.yearly}€/an</div>
										</div>

										{/* Note */}
										<div className="col-span-1">
											<div className="flex items-center">
												{[...Array(5)].map((_, i) => (
													<FaStar
														key={i}
														className={`h-4 w-4 ${i < Math.floor(offer.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
													/>
												))}
											</div>
											<div className="text-sm text-gray-600 mt-1">{offer.rating}/5</div>
										</div>

										{/* Garanties principales */}
										<div className="col-span-3">
											<div className="flex flex-wrap gap-1">
												{Object.entries(offer.coverages)
													.filter(([, details]) => details.included)
													.slice(0, 3)
													.map(([coverage]) => (
														<span
															key={coverage}
															className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
														>
															✓ {coverage}
														</span>
													))}
												{Object.keys(offer.coverages).filter(key => offer.coverages[key].included).length > 3 && (
													<span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
														+{Object.keys(offer.coverages).filter(key => offer.coverages[key].included).length - 3} autres
													</span>
												)}
											</div>
										</div>

										{/* Franchise */}
										<div className="col-span-1">
											<div className="text-sm">
												<div className="text-gray-900 font-medium">
													150€
												</div>
												<div className="text-gray-600 text-xs">
													Bris: 50€
												</div>
											</div>
										</div>

										{/* Actions */}
										<div className="col-span-2 flex flex-col space-y-1">
											<button className="px-3 py-1.5 bg-[#1e51ab] text-white rounded text-xs hover:bg-[#163d82] transition-colors whitespace-nowrap">
												Souscrire
											</button>
											<button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors whitespace-nowrap">
												Voir détails
											</button>
										</div>
									</motion.div>
								))}
							</div>

							{/* Table Footer with summary */}
							<div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
								<div className="flex justify-between items-center text-sm text-gray-600">
									<div>
										{filteredResults.length} offre{filteredResults.length > 1 ? 's' : ''} trouvée{filteredResults.length > 1 ? 's' : ''}
									</div>
									<div className="flex items-center space-x-4">
										<div>Prix moyen: {Math.round(filteredResults.reduce((sum, offer) => sum + offer.price.monthly, 0) / filteredResults.length)}€/mois</div>
										<div>Note moyenne: {(filteredResults.reduce((sum, offer) => sum + offer.rating, 0) / filteredResults.length).toFixed(1)}/5</div>
									</div>
								</div>
							</div>
						</motion.div>
					)}

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
};

export default ResultsView; 