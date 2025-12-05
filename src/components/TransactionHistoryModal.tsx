import { FaTimes, FaPlus, FaMinus, FaExclamationTriangle, FaInbox } from 'react-icons/fa';
import { Fragment, useState, useEffect, useCallback } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { motion } from 'framer-motion';
import { trackCreditTransactionsRefresh } from '@/services/analytics';
import { useLazyCreditTransactions } from '../hooks/useCreditTransactions';
import { type CreditTransactionsFilters, type CreditTransaction } from '../store/creditTransactionsApi';
import Button from './ui/Button';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionHistoryModal = ({ isOpen, onClose }: TransactionHistoryModalProps) => {
  const [filters, setFilters] = useState<CreditTransactionsFilters>({
    type: undefined,
    startDate: '',
    endDate: '',
  });
  const [selectedTransaction, setSelectedTransaction] = useState<CreditTransaction | null>(null);
  const [allTransactions, setAllTransactions] = useState<CreditTransaction[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { getCreditTransactions, transactions, pagination, loading, error } = useLazyCreditTransactions();

  const loadTransactions = useCallback(
    async (source: 'manual' | 'auto' = 'auto') => {
      const queryFilters = {
        limit: 10,
        offset: currentOffset,
        type: filters.type,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };
      trackCreditTransactionsRefresh({ source });
      await getCreditTransactions(queryFilters);
    },
    [currentOffset, filters, getCreditTransactions]
  );

  // Load initial data when modal opens
  useEffect(() => {
    if (isOpen && allTransactions.length === 0) {
      loadTransactions();
    }
  }, [isOpen, allTransactions.length, loadTransactions]);

  // Reset pagination when filters change
  useEffect(() => {
    if (isOpen) {
      setAllTransactions([]);
      setCurrentOffset(0);
      setHasMore(true);
      loadTransactions();
    }
  }, [filters, isOpen, loadTransactions]);

  // Update transactions when new data arrives
  useEffect(() => {
    if (transactions.length > 0) {
      if (currentOffset === 0) {
        // First load - replace all transactions
        setAllTransactions(transactions);
      } else {
        // Pagination - append new transactions
        setAllTransactions((prev) => [...prev, ...transactions]);
      }
      setHasMore(pagination?.hasMore || false);
    }
  }, [transactions, pagination, currentOffset]);

  const loadMoreTransactions = async () => {
    if (!hasMore || loading || loadingMore) return;

    setLoadingMore(true);
    const newOffset = currentOffset + 10;
    setCurrentOffset(newOffset);

    const queryFilters = {
      limit: 10,
      offset: newOffset,
      type: filters.type,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    };
    trackCreditTransactionsRefresh({ source: 'auto' });
    await getCreditTransactions(queryFilters);
    setLoadingMore(false);
  };

  // Handle scroll to load more
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Load more when user scrolls to 80% of the content
    if (scrollPercentage > 0.8 && hasMore && !loadingMore && !loading) {
      loadMoreTransactions();
    }
  };

  const handleFilterChange = (field: keyof CreditTransactionsFilters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { type: undefined, startDate: '', endDate: '' };
    setFilters(clearedFilters);
  };

  // Helper function to get French label for transaction type
  const getTransactionLabel = (type: string, source: string) => {
    switch (type) {
      case 'purchase':
        return 'Achat de crédits';
      case 'usage':
        switch (source) {
          case 'chatbot':
            return 'Utilisation du chatbot';
          case 'comparator':
            return "Comparaison d'assurances";
          default:
            return 'Utilisation de crédits';
        }
      case 'adjustment':
        return 'Ajustement de crédits';
      default:
        return 'Transaction';
    }
  };

  const renderTransactionItem = (transaction: CreditTransaction, index: number) => (
    <motion.div
      key={transaction.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => setSelectedTransaction(transaction)}
    >
      <div className="flex items-center">
        {transaction.type === 'purchase' ? <FaPlus className="h-4 w-4 text-green-500 mr-3" /> : <FaMinus className="h-4 w-4 text-red-500 mr-3" />}
        <div>
          <p className="text-sm font-medium text-gray-900">{getTransactionLabel(transaction.type, transaction.source)}</p>
          <p className="text-xs text-gray-500">
            {new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
      <span className={`text-sm font-medium ${transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'}`}>
        {transaction.type === 'purchase' ? '+' : ''}
        {transaction.amount} crédits
      </span>
    </motion.div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <FaInbox className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction</h3>
      <p className="text-gray-500 text-center">Aucune transaction ne correspond à vos critères de recherche.</p>
      {(filters.type || filters.startDate || filters.endDate) && (
        <Button variant="secondary" size="sm" onClick={clearFilters} className="mt-4">
          Effacer les filtres
        </Button>
      )}
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <FaExclamationTriangle className="h-12 w-12 text-red-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
      <p className="text-gray-500 text-center mb-4">{error}</p>
      <Button variant="secondary" size="sm" onClick={() => loadTransactions('manual')}>
        Réessayer
      </Button>
    </div>
  );

  const renderLoadingState = () => (
    <div className="py-8">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between p-4 animate-pulse">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-3"></div>
            <div>
              <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 h-screen">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
            </TransitionChild>

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-6xl h-3/4 transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all flex flex-col max-h-[75vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                  <div>
                    <DialogTitle className="text-xl font-semibold text-gray-900">Historique des transactions</DialogTitle>
                    <p className="text-sm text-gray-600 mt-1">Consultez toutes vos transactions de crédits</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <FaTimes className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Filters - Modern UI (Hidden when showing details) */}
                {!selectedTransaction && (
                  <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {/* Type Filter */}
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              {[
                                { value: 'all', label: 'Tous', active: !filters.type },
                                {
                                  value: 'purchase',
                                  label: 'Achats',
                                  active: filters.type === 'purchase',
                                },
                                {
                                  value: 'usage',
                                  label: 'Usage',
                                  active: filters.type === 'usage',
                                },
                                {
                                  value: 'adjustment',
                                  label: 'Ajustements',
                                  active: filters.type === 'adjustment',
                                },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => handleFilterChange('type', option.value === 'all' ? '' : option.value)}
                                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                                    option.active ? 'bg-[#1e51ab] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Date Range */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-700">Période:</span>
                              <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-[#1e51ab] focus:border-[#1e51ab] transition-colors bg-white"
                                placeholder="De"
                              />
                              <span className="text-gray-400">à</span>
                              <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-[#1e51ab] focus:border-[#1e51ab] transition-colors bg-white"
                                placeholder="À"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Actions and Counter */}
                        <div className="flex items-center space-x-4">
                          {(filters.type || filters.startDate || filters.endDate) && (
                            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Effacer</span>
                            </button>
                          )}
                          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                            <span className="text-xs font-medium text-gray-600">
                              {allTransactions.length} transaction
                              {allTransactions.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50" onScroll={handleScroll}>
                  {selectedTransaction ? (
                    <div className="p-6">
                      {/* Header with Back Button */}
                      <div className="flex items-center mb-6">
                        <button onClick={() => setSelectedTransaction(null)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mr-4">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          <span className="text-sm font-medium">Retour</span>
                        </button>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Détails de la transaction</h3>
                      {/* Transaction Card */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header Section */}
                        <div
                          className={`px-6 py-4 ${
                            selectedTransaction.type === 'purchase'
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100'
                              : 'bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-full ${selectedTransaction.type === 'purchase' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {selectedTransaction.type === 'purchase' ? <FaPlus className="h-6 w-6" /> : <FaMinus className="h-6 w-6" />}
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{getTransactionLabel(selectedTransaction.type, selectedTransaction.source)}</h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(selectedTransaction.createdAt).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${selectedTransaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedTransaction.type === 'purchase' ? '+' : ''}
                                {selectedTransaction.amount} crédits
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{selectedTransaction.type === 'purchase' ? 'Ajouté' : 'Utilisé'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Transaction Info */}
                            <div className="space-y-4">
                              <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Informations de transaction</h5>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-sm text-gray-600">ID Transaction</span>
                                  <span className="text-sm font-medium text-gray-900 font-mono">{selectedTransaction.id}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-sm text-gray-600">Type</span>
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      selectedTransaction.type === 'purchase'
                                        ? 'bg-green-100 text-green-700'
                                        : selectedTransaction.type === 'usage'
                                          ? 'bg-blue-100 text-blue-700'
                                          : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                  >
                                    {selectedTransaction.type === 'purchase' ? 'Achat' : selectedTransaction.type === 'usage' ? 'Utilisation' : 'Ajustement'}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-sm text-gray-600">Source</span>
                                  <span className="text-sm font-medium text-gray-900 capitalize">{selectedTransaction.source || 'Système'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Timing Info */}
                            <div className="space-y-4">
                              <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Horodatage</h5>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-sm text-gray-600">Date</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {new Date(selectedTransaction.createdAt).toLocaleDateString('fr-FR', {
                                      weekday: 'long',
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-sm text-gray-600">Heure</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {new Date(selectedTransaction.createdAt).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-sm text-gray-600">Montant</span>
                                  <span className={`text-sm font-bold ${selectedTransaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'}`}>
                                    {selectedTransaction.type === 'purchase' ? '+' : ''}
                                    {selectedTransaction.amount} crédits
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : loading ? (
                    renderLoadingState()
                  ) : error ? (
                    renderErrorState()
                  ) : allTransactions.length === 0 ? (
                    renderEmptyState()
                  ) : (
                    <div className="p-6 space-y-3">
                      {allTransactions.map(renderTransactionItem)}

                      {/* Loading More Indicator */}
                      {loadingMore && (
                        <div className="flex items-center justify-center py-6">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1e51ab]"></div>
                            <span className="text-sm">Chargement en cours...</span>
                          </div>
                        </div>
                      )}

                      {/* End of Results */}
                      {!hasMore && allTransactions.length > 0 && (
                        <div className="flex items-center justify-center py-6">
                          <div className="text-sm text-gray-500">Toutes les transactions ont été chargées</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pagination removed - using infinite scroll instead */}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransactionHistoryModal;
