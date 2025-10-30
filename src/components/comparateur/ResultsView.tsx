import type { ComparisonCategory, ComparisonFormula, ComparisonOffer } from '../../types/comparison';
import { FaCheckCircle, FaChevronLeft, FaChevronRight, FaEye, FaStar, FaTimesCircle } from 'react-icons/fa';
import { addQueryResult, makeSelectPerOfferStats, selectNlQueries } from '../../store/comparisonSessions/nlQueriesSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

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
  sessionId: string;
  selectedType: ComparisonCategory | null;
  filteredResults: ComparisonOffer[];
  paginatedResults: ComparisonOffer[];
  currentPage: number;
  totalPages: number;
  filters: Filters;
  scores: Record<string, number>;
  getBestFormula: (offer: ComparisonOffer) => ComparisonFormula | null;
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
  sessionId,
  selectedType,
  filteredResults,
  paginatedResults,
  currentPage,
  totalPages,
  scores,
  getBestFormula,
  isFilteringResults,
  setCurrentStep,

  setCurrentPage,
}) => {
  // Helper function to get insurer logo
  const [aiInput, setAiInput] = React.useState('');
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const dispatch = useAppDispatch();
  const nlItems = useAppSelector(selectNlQueries);

  const onAskAi = async () => {
    if (!aiInput.trim()) return;
    try {
      setAiError(null);
      setAiLoading(true);
      const { comparisonService } = await import('../../services/comparison');
      const resp = await comparisonService.askSessionQuestion(sessionId, aiInput.trim());
      if (resp.success && resp.data) {
        dispatch(
          addQueryResult({
            id: resp.data.id,
            question: resp.data.question,
            createdAt: resp.data.createdAt,
            offerMatches: resp.data.offerMatches,
            explanation: resp.data.explanation,
          })
        );
        setAiInput('');
      } else {
        setAiError(resp.error || 'Échec du traitement de la question');
      }
    } finally {
      setAiLoading(false);
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<FaStar key={i} className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />);
    }
    return stars;
  };

  // Format price from cents
  const formatPrice = (annualPremiumCents: number) => {
    const annualPremium = annualPremiumCents / 100;
    const monthly = Math.round(annualPremium / 12);
    return {
      monthly,
      annual: annualPremium,
      formatted: `${monthly}€/mois`,
    };
  };

  // Get unique insurers for filter
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
            {filteredResults.length > 0
              ? formatPrice(
                  Math.min(
                    ...filteredResults.map((o) => {
                      const formula = getBestFormula(o);
                      return formula ? formula.annualPremiumCents : Infinity;
                    })
                  )
                ).formatted
              : 'N/A'}
          </div>
          <div className="text-sm text-green-800">Prix le plus bas</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{filteredResults.length > 0 ? Math.max(...filteredResults.map((o) => o.insurer.rating)).toFixed(1) : 'N/A'}</div>
          <div className="text-sm text-purple-800">Meilleure note</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Results - Full width (no sidebar) */}
        <div className="w-full">
          {isFilteringResults && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-800 text-sm">Filtrage en cours...</span>
              </div>
            </div>
          )}

          {/* Limit to 4 insurers/columns */}
          {paginatedResults.length > 4 && <div className="mb-2 text-xs text-gray-500">Affichage des 4 premières offres</div>}

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600"></th>
                  {paginatedResults.slice(0, 4).map((offer, index) => {
                    const logo = getInsurerLogo(offer.insurer.name);
                    return (
                      <motion.th key={offer.id} scope="col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="px-4 py-3 text-left">
                        <div className="flex items-center space-x-2">
                          {logo && <img src={logo} alt={offer.insurer.name} className="h-8 w-8 object-contain rounded" />}
                          <span className="text-sm font-semibold text-gray-900">{offer.insurer.name}</span>
                        </div>
                      </motion.th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {/* Formule */}
                <tr>
                  <th scope="row" className="px-4 py-4 text-xs font-semibold text-gray-600 align-top">
                    Formule
                  </th>
                  {paginatedResults.slice(0, 4).map((offer) => {
                    const formula = getBestFormula(offer);
                    if (!formula)
                      return (
                        <td key={offer.id} className="px-4 py-4 text-sm text-gray-500">
                          —
                        </td>
                      );
                    return (
                      <td key={offer.id} className="px-4 py-4">
                        <div className="text-sm text-gray-900 font-medium">{formula.name}</div>
                        {formula.description && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{formula.description}</div>}
                      </td>
                    );
                  })}
                </tr>

                {/* Prix */}
                <tr>
                  <th scope="row" className="px-4 py-4 text-xs font-semibold text-gray-600 align-top">
                    Prix
                  </th>
                  {paginatedResults.slice(0, 4).map((offer) => {
                    const formula = getBestFormula(offer);
                    if (!formula)
                      return (
                        <td key={offer.id} className="px-4 py-4 text-sm text-gray-500">
                          —
                        </td>
                      );
                    const price = formatPrice(formula.annualPremiumCents);
                    return (
                      <td key={offer.id} className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{price.formatted}</div>
                        <div className="text-xs text-gray-500">{Math.round(price.annual)}€/an</div>
                      </td>
                    );
                  })}
                </tr>

                {/* Note */}
                <tr>
                  <th scope="row" className="px-4 py-4 text-xs font-semibold text-gray-600 align-top">
                    Note
                  </th>
                  {paginatedResults.slice(0, 4).map((offer) => (
                    <td key={offer.id} className="px-4 py-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(offer.insurer.rating)}
                        <span className="text-sm text-gray-600 ml-1">{offer.insurer.rating.toFixed(1)}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Correspondance */}
                <tr>
                  <th scope="row" className="px-4 py-4 text-xs font-semibold text-gray-600 align-top">
                    Correspondance
                  </th>
                  {paginatedResults.slice(0, 4).map((offer) => {
                    const matchScore = scores[offer.id] || 0;
                    return (
                      <td key={offer.id} className="px-4 py-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-green-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {matchScore}%
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Caractéristiques clés */}
                <tr>
                  <th scope="row" className="px-4 py-4 text-xs font-semibold text-gray-600 align-top">
                    Caractéristiques clés
                  </th>
                  {paginatedResults.slice(0, 4).map((offer) => {
                    const formula = getBestFormula(offer);
                    if (!formula)
                      return (
                        <td key={offer.id} className="px-4 py-4 text-sm text-gray-500">
                          —
                        </td>
                      );
                    const keyFeatures = formula.guarantees.map((g) => g.name).slice(0, 3);
                    return (
                      <td key={offer.id} className="px-4 py-4">
                        <ul className="text-sm text-gray-600 space-y-1">
                          {keyFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#1e51ab] rounded-full mr-2"></span>
                              <span className="truncate max-w-[260px] inline-block align-top">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    );
                  })}
                </tr>

                {/* Actions */}
                <tr>
                  <th scope="row" className="px-4 py-4 text-xs font-semibold text-gray-600 align-top">
                    Actions
                  </th>
                  {paginatedResults.slice(0, 4).map((offer) => (
                    <td key={offer.id} className="px-4 py-4 text-left whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <button
                          className="bg-[#1e51ab] text-white px-3 py-2 rounded-lg hover:bg-[#163d82] transition-colors text-xs font-medium"
                          aria-label={`Voir détails ${offer.insurer.name}`}
                        >
                          <FaEye className="h-3 w-3 inline mr-1" /> Voir détails
                        </button>
                        <button
                          className="border border-[#1e51ab] text-[#1e51ab] px-3 py-2 rounded-lg hover:bg-[#1e51ab] hover:text-white transition-colors text-xs font-medium"
                          aria-label={`Sélectionner ${offer.insurer.name}`}
                        >
                          Sélectionner
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
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

      {/* AI Questions Section */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <div className="flex items-center mb-4">
          <Avatar isAssistant size="md" />
          <h3 className="text-lg font-semibold text-gray-900">Questions IA</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <textarea
            placeholder={'Exemple : "Quelles offres couvrent le vol à l\'étranger ?"'}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={3}
            value={aiInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAiInput(e.target.value)}
          />
          {aiError && <div className="text-red-600 text-sm mt-2">{aiError}</div>}
          <button onClick={onAskAi} disabled={aiLoading || !aiInput.trim()} className="mt-3 px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#163d82] disabled:opacity-60">
            {aiLoading ? 'Traitement en cours…' : 'Poser une question'}
          </button>
        </div>

        {nlItems.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600"></th>
                  {paginatedResults.slice(0, 4).map((offer, index) => {
                    const logo = getInsurerLogo(offer.insurer.name);
                    return (
                      <motion.th key={offer.id} scope="col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="px-4 py-3 text-left">
                        <div className="flex items-center space-x-2">
                          {logo && <img src={logo} alt={offer.insurer.name} className="h-8 w-8 object-contain rounded" />}
                          <span className="text-sm font-semibold text-gray-900">{offer.insurer.name}</span>
                        </div>
                      </motion.th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {nlItems.map((item) => (
                  <tr key={item.id}>
                    <th className="px-3 py-3 text-xs font-semibold text-gray-600 align-top text-left">{item.question}</th>
                    {paginatedResults.slice(0, 4).map((offer) => {
                      const matched = item.offerMatches[offer.id] === true;
                      return (
                        <td key={offer.id} className="px-3 py-3 text-center">
                          <span className={`inline-flex items-center gap-2 text-sm font-medium ${matched ? 'text-green-700' : 'text-red-700'}`}>
                            {matched ? <FaCheckCircle className="h-4 w-4" /> : <FaTimesCircle className="h-4 w-4" />}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <th className="px-3 py-3 text-xs font-semibold text-gray-600 text-left">Total</th>
                  {(() => {
                    const offerIds = paginatedResults.slice(0, 4).map((o) => o.id);
                    const { totalQuestions, perOffer } = makeSelectPerOfferStats(offerIds)({ nlQueries: { items: nlItems } });
                    const counts = paginatedResults.slice(0, 4).map((offer) => perOffer[offer.id]?.matches || 0);
                    const max = counts.length ? Math.max(...counts) : 0;
                    const min = counts.length ? Math.min(...counts) : 0;
                    return paginatedResults.slice(0, 4).map((offer) => {
                      const count = perOffer[offer.id]?.matches || 0;
                      const colorClass = count === max && count !== min ? 'text-green-600' : count === min && count !== max ? 'text-red-600' : 'text-gray-900';
                      return (
                        <td key={offer.id} className="px-3 py-3 text-center">
                          <span className={`text-lg font-bold ${colorClass}`}>{count}</span>
                          <span className="text-sm text-gray-600"> / {totalQuestions}</span>
                        </td>
                      );
                    });
                  })()}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsView;
