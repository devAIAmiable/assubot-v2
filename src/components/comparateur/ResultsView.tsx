import type { ComparisonCategory, ComparisonOffer } from '../../types/comparison';
import { FaChevronLeft, FaChevronRight, FaEye, FaStar } from 'react-icons/fa';

import Avatar from '../ui/Avatar';
import React from 'react';
import { getInsurerLogo } from '../../utils/insurerLogo';
import { motion } from 'framer-motion';

interface Filters {
  priceRange: number[];
  insurers: string[];
  rating: number;
  coverages: string[];
}

interface AskedQuestion {
  question: string;
  timestamp: Date;
  responses?: { [insurerId: string]: { hasAnswer: boolean; details: string } };
}

interface ResultsViewProps {
  selectedType: ComparisonCategory | null;
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
  currentContractsCount: number;
  otherOffersCount: number;
  askedQuestions: AskedQuestion[];
}

const ResultsView: React.FC<ResultsViewProps> = ({
  selectedType,
  filteredResults,
  paginatedResults,
  currentPage,
  totalPages,
  filters,
  isFilteringResults,
  setCurrentStep,
  handlePriceRangeChange,
  handleRatingChange,
  handleInsurerChange,
  handleFilterReset,
  setCurrentPage,
}) => {
  // Helper function to get insurer logo

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<FaStar key={i} className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />);
    }
    return stars;
  };

  // Format price
  const formatPrice = (annualPremium: number) => {
    const monthly = Math.round(annualPremium / 12);
    return {
      monthly,
      annual: annualPremium,
      formatted: `${monthly}€/mois`,
    };
  };

  // Get unique insurers for filter
  const uniqueInsurers = Array.from(new Set(filteredResults.map((offer) => offer.insurerName)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Résultats de comparaison</h1>
          <p className="text-gray-600 text-lg">
            {filteredResults.length} offre{filteredResults.length > 1 ? 's' : ''} trouvée{filteredResults.length > 1 ? 's' : ''} pour{' '}
            {selectedType === 'auto' ? "l'assurance auto" : "l'assurance habitation"}
          </p>
        </div>
        <button onClick={() => setCurrentStep('form')} className="text-[#1e51ab] hover:text-[#163d82] font-medium flex items-center">
          <FaChevronLeft className="h-4 w-4 mr-2" />
          Modifier le formulaire
        </button>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{filteredResults.length}</div>
          <div className="text-sm text-blue-800">Offres disponibles</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {filteredResults.length > 0 ? formatPrice(Math.min(...filteredResults.map((o) => o.annualPremium))).formatted : 'N/A'}
          </div>
          <div className="text-sm text-green-800">Prix le plus bas</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{filteredResults.length > 0 ? Math.max(...filteredResults.map((o) => o.rating)).toFixed(1) : 'N/A'}</div>
          <div className="text-sm text-purple-800">Meilleure note</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
              <button onClick={handleFilterReset} className="text-sm text-[#1e51ab] hover:text-[#163d82]">
                Réinitialiser
              </button>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix mensuel (€)</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange([filters.priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{filters.priceRange[0]}€</span>
                  <span>{filters.priceRange[1]}€</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Note minimum</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button key={rating} onClick={() => handleRatingChange(rating)} className={`p-1 ${filters.rating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    <FaStar className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Insurer Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assureurs</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueInsurers.map((insurer) => (
                  <label key={insurer} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.insurers.includes(insurer)}
                      onChange={(e) => handleInsurerChange(insurer, e.target.checked)}
                      className="h-4 w-4 text-[#1e51ab] focus:ring-[#1e51ab] border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{insurer}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {isFilteringResults && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-800 text-sm">Filtrage en cours...</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {paginatedResults.map((offer, index) => {
              const price = formatPrice(offer.annualPremium);
              const logo = getInsurerLogo(offer.insurerName);

              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {logo && <img src={logo} alt={offer.insurerName} className="h-12 w-12 object-contain rounded" />}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{offer.insurerName}</h3>
                          <span className="text-sm text-gray-500">{offer.offerTitle}</span>
                        </div>

                        {offer.description && <p className="text-gray-600 text-sm mb-3">{offer.description}</p>}

                        {/* Rating and Match Score */}
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            {renderStars(offer.rating)}
                            <span className="text-sm text-gray-600 ml-1">{offer.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-600">{offer.matchScore}% de correspondance</span>
                          </div>
                        </div>

                        {/* Key Features */}
                        {offer.keyFeatures && offer.keyFeatures.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Caractéristiques clés:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {offer.keyFeatures.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-1.5 h-1.5 bg-[#1e51ab] rounded-full mr-2"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{price.formatted}</div>
                      <div className="text-sm text-gray-500 mb-3">{price.annual}€/an</div>
                      <div className="space-y-2">
                        <button className="w-full bg-[#1e51ab] text-white px-4 py-2 rounded-lg hover:bg-[#163d82] transition-colors text-sm font-medium">
                          <FaEye className="h-3 w-3 inline mr-1" />
                          Voir détails
                        </button>
                        <button className="w-full border border-[#1e51ab] text-[#1e51ab] px-4 py-2 rounded-lg hover:bg-[#1e51ab] hover:text-white transition-colors text-sm font-medium">
                          Sélectionner
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Questions Section - TODO: Phase 2 */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <div className="flex items-center mb-4">
          <Avatar isAssistant size="md" />
          <h3 className="text-lg font-semibold text-gray-900">Questions IA</h3>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Bientôt disponible</span>
        </div>
        <p className="text-gray-600 mb-4">Bientôt, vous pourrez poser des questions en langage naturel sur ces offres.</p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 opacity-50">
          <textarea placeholder="Exemple: 'Quelles offres couvrent le vol à l'étranger?'" disabled className="w-full p-3 border border-gray-300 rounded-lg resize-none" rows={3} />
          <button disabled className="mt-3 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
            Poser une question
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
