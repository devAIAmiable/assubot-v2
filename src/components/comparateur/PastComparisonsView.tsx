import type { ComparisonCategory, ComparisonSessionStatus } from '../../types/comparison';
import { FaCalculator, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useMemo, useState } from 'react';

import React from 'react';
import type { User } from '../../store/userSlice';
import { getComparisonCategoryIcon } from '../../config/categories';
import { motion } from 'framer-motion';
import { useGetComparisonSessionsQuery } from '../../store/comparisonApi';
import { useNavigate } from 'react-router-dom';

interface PastComparisonsViewProps {
  user: User | null;
  setCurrentStep: (step: 'history' | 'type' | 'form' | 'results' | 'loading') => void;
  setSelectedType: (type: ComparisonCategory) => void;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PastComparisonsView: React.FC<PastComparisonsViewProps> = ({ user, setCurrentStep, setSelectedType: _setSelectedType, setFormData: _setFormData }) => {
  // Internal state for filters and pagination
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<ComparisonCategory | undefined>(undefined);
  const [status, setStatus] = useState<ComparisonSessionStatus | undefined>(undefined);
  const limit = 4;

  // Calculate offset for pagination
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  // Fetch sessions from API
  const { data, isLoading, error } = useGetComparisonSessionsQuery({
    category,
    status,
    limit,
    offset,
  });

  // Calculate pagination info
  const totalPages = useMemo(() => {
    if (!data) return 0;
    return Math.ceil(data.total / limit);
  }, [data, limit]);

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Helper function to get insurance type name
  const getInsuranceTypeName = (type: string) => {
    if (type === 'auto') return 'Auto';
    if (type === 'home') return 'Habitation';
    return type;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status: ComparisonSessionStatus) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'abandoned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get days until expiration
  const getDaysUntilExpiration = (expiresAt: string) => {
    const now = new Date();
    const expirationDate = new Date(expiresAt);
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const navigate = useNavigate();

  // Handle session click -> navigate to session results page
  const handleSessionClick = (session: { id: string; category: string }) => {
    navigate(`/app/comparateur/${session.id}/resultats`);
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
                : 'Retrouvez vos comparaisons précédentes ou lancez-en une nouvelle.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* New Comparison Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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

      {/* Filters */}
      {data && data.total > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-4">
            <select
              value={category || ''}
              onChange={(e) => {
                setCategory(e.target.value ? (e.target.value as ComparisonCategory) : undefined);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e51ab]"
            >
              <option value="">Toutes les catégories</option>
              <option value="auto">Auto</option>
              <option value="home">Habitation</option>
            </select>
            <select
              value={status || ''}
              onChange={(e) => {
                setStatus(e.target.value ? (e.target.value as ComparisonSessionStatus) : undefined);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e51ab]"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="completed">Terminée</option>
              <option value="expired">Expirée</option>
              <option value="abandoned">Abandonnée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCalculator className="h-10 w-10 text-gray-400 animate-pulse" />
          </div>
          <p className="text-gray-600">Chargement des comparaisons...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCalculator className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">Impossible de charger vos comparaisons. Veuillez réessayer plus tard.</p>
        </motion.div>
      )}

      {/* Sessions List */}
      {!isLoading && !error && data && data.total > 0 && (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Comparaisons récentes</h2>
              <p className="text-sm text-gray-600">
                {data.total} comparaison{data.total > 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid gap-4">
            {data.sessions.map((session, index) => {
              const daysLeft = getDaysUntilExpiration(session.expiresAt);
              const isExpiringSoon = daysLeft <= 2;

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white border rounded-xl p-6 hover:shadow-md transition-all cursor-pointer group ${
                    isExpiringSoon ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleSessionClick(session)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                        {React.createElement(getComparisonCategoryIcon(session.category as ComparisonCategory), {
                          className: 'h-6 w-6 text-[#1e51ab]',
                        })}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#1e51ab] transition-colors">{getInsuranceTypeName(session.category)}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(session.status)}`}>
                            {session.status === 'active'
                              ? 'Active'
                              : session.status === 'completed'
                                ? 'Terminée'
                                : session.status === 'expired'
                                  ? 'Expirée'
                                  : session.status === 'abandoned'
                                    ? 'Abandonnée'
                                    : session.status === 'cancelled'
                                      ? 'Annulée'
                                      : session.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <span>{formatDate(session.createdAt)}</span>
                          {isExpiringSoon && (
                            <span className="text-orange-600 font-medium">
                              • Expire dans {daysLeft} jour{daysLeft !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">{session.resultOfferIds.length} offres trouvées</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <div className="text-[#1e51ab] opacity-0 group-hover:opacity-100 transition-opacity">Relancer cette comparaison →</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={!hasPreviousPage}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-2 rounded-lg text-sm ${page === i + 1 ? 'bg-[#1e51ab] text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={!hasNextPage}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && data && data.total === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCalculator className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune comparaison précédente</h3>
          <p className="text-gray-600 mb-6">Commencez votre première comparaison pour trouver la meilleure assurance.</p>
          <button onClick={() => setCurrentStep('type')} className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors">
            Commencer ma première comparaison
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PastComparisonsView;
