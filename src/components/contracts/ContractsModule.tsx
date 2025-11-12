import type { ContractCategory, ContractListItem } from '../../types/contract';
import { FaChevronDown, FaFileContract, FaPlus } from 'react-icons/fa';
import { StatCard, StatsGrid } from '../ui';
import { useEffect, useMemo, useState } from 'react';

import ContractCard from './ContractCard';
import CreateContractModal from './CreateContractModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditContractModal from './ContractDetails/modals/EditContractModal';
import Pagination from '../ui/Pagination';
import Spinner from '../ui/Spinner';
import { motion } from 'framer-motion';
import { trackContractDelete, trackContractFilterChange, trackContractSearch, trackContractSortChange } from '@/services/analytics/gtm';
import { useContractOperations } from '../../hooks/useContractOperations';
import { useContracts } from '../../hooks/useContracts';
import { useDebounced } from '../../hooks/useDebounced';

const ContractsModule = () => {
  const {
    pagination,
    isLoading,
    isFetching,
    error,
    searchQuery,
    selectedCategory,
    selectedSortBy,
    selectedSortOrder,
    setPage,
    setLimit,
    setSearchQuery,
    setCategory,
    setSortBy,
    setSortOrder,
    filteredContracts,
    contractStats,
  } = useContracts({
    initialPage: 1,
    initialLimit: 12,
  });

  const { deleteContract, isDeleting } = useContractOperations();
  const [editingContract, setEditingContract] = useState<ContractListItem | null>(null);
  const [deletingContract, setDeletingContract] = useState<ContractListItem | null>(null);
  const [isCreateContractModalOpen, setIsCreateContractModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const debouncedQuery = useDebounced(searchInput, 300);

  useEffect(() => {
    if (debouncedQuery !== searchQuery) {
      trackContractSearch({ queryLength: debouncedQuery.trim().length });
      setSearchQuery(debouncedQuery);
    }
  }, [debouncedQuery, searchQuery, setSearchQuery]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearchInputChange = (query: string) => {
    setSearchInput(query);
  };

  const handleTypeFilter = (category: string) => {
    trackContractFilterChange({
      filter: 'category',
      value: category,
    });
    setCategory(category === 'all' ? 'all' : (category as ContractCategory));
  };

  const handleDeleteContract = (contract: ContractListItem) => {
    setDeletingContract(contract);
  };

  const handleConfirmDelete = async () => {
    if (!deletingContract) return;

    try {
      trackContractDelete({ contractId: deletingContract.id, status: 'confirm' });
      await deleteContract(deletingContract.id);
      trackContractDelete({ contractId: deletingContract.id, status: 'success' });
      setDeletingContract(null);
    } catch (deleteError) {
      console.error('Failed to delete contract:', deleteError);
    }
  };

  const handleCancelDelete = () => {
    if (deletingContract) {
      trackContractDelete({ contractId: deletingContract.id, status: 'cancel' });
    }
    setDeletingContract(null);
  };

  const handleEditSuccess = () => {
    setEditingContract(null);
  };

  const contractsToRender = useMemo(
    () =>
      filteredContracts.map((contract, index) => ({
        contract,
        index,
      })),
    [filteredContracts]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" color="blue" className="mx-auto mb-4" />
      </div>
    );
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : ((error as { message?: string })?.message ?? 'Une erreur est survenue');
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">Erreur : {errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centralisation des contrats</h1>
          <p className="text-gray-600 text-lg">Gérez tous vos contrats d'assurance en un seul endroit</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            onClick={() => setIsCreateContractModalOpen(true)}
            className="bg-[#1e51ab] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#163d82] transition-colors flex items-center space-x-2"
            aria-label="Ajouter un contrat manuellement"
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus className="h-4 w-4" aria-hidden="true" />
            <span>Ajouter un contrat</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <StatsGrid>
        <StatCard label="Total des contrats" value={contractStats.total} type="total-contracts" isLoading={isFetching} />
        <StatCard label="Contrat(s) actif(s)" value={contractStats.active} type="active-contracts" valueColor="text-green-600" />
        <StatCard label="Dépenses annuelles" value={`${(contractStats.totalPremium / 100).toLocaleString('fr-FR')}€`} type="total-premium" />
        <StatCard label="Expiré(s)" value={contractStats.expired} type="expired-contracts" valueColor="text-red-600" />
      </StatsGrid>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white border border-gray-100 rounded-2xl p-6"
      >
        <div className="flex flex-col gap-6">
          {/* Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <label htmlFor="contracts-search" className="flex-1 max-w-md">
              <span className="sr-only">Rechercher un contrat</span>
              <div className="relative">
                <input
                  id="contracts-search"
                  type="search"
                  placeholder="Rechercher un contrat..."
                  value={searchInput}
                  onChange={(event) => handleSearchInputChange(event.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
                />
              </div>
            </label>

            <div className="flex flex-col lg:flex-row gap-4">
              <label className="relative">
                <span className="sr-only">Filtrer par type de contrat</span>
                <select
                  value={selectedCategory}
                  onChange={(event) => handleTypeFilter(event.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
                >
                  <option value="all">Tous les produits</option>
                  <option value="auto">Automobile</option>
                  <option value="home">Habitation</option>
                  <option value="health">Santé</option>
                  <option value="moto">Moto</option>
                  <option value="electronic_devices">Équipements électroniques</option>
                  <option value="other">Autre</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </label>

              <label className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-200">
                <span className="px-2 text-sm font-medium text-gray-600">Trier par</span>
                <select
                  value={selectedSortBy}
                  onChange={(event) => {
                    const newSortBy = event.target.value as 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'annualPremiumCents' | 'name' | 'category' | 'status';
                    trackContractSortChange({
                      sortBy: newSortBy,
                      sortOrder: selectedSortOrder,
                    });
                    setSortBy(newSortBy);
                  }}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors text-sm"
                >
                  <option value="createdAt">Date de création</option>
                  <option value="updatedAt">Date de modification</option>
                  <option value="startDate">Date de début</option>
                  <option value="endDate">Date de fin</option>
                  <option value="annualPremiumCents">Dépenses annuelles</option>
                  <option value="name">Nom du contrat</option>
                  <option value="category">Catégorie</option>
                  <option value="status">Statut</option>
                </select>
                <button
                  onClick={() => {
                    const newOrder = selectedSortOrder === 'asc' ? 'desc' : 'asc';
                    trackContractSortChange({
                      sortBy: selectedSortBy,
                      sortOrder: newOrder,
                    });
                    setSortOrder(newOrder);
                  }}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  aria-label={`Basculer l'ordre de tri (${selectedSortOrder === 'asc' ? 'croissant' : 'décroissant'})`}
                  type="button"
                >
                  {selectedSortOrder === 'asc' ? (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contracts Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
        {contractsToRender.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-4">
            <FaFileContract className="h-16 w-16 text-gray-300 mx-auto" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900">Aucun contrat trouvé</h3>
            <p className="text-gray-600">Ajoutez un contrat manuellement ou importez vos documents pour commencer.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setIsCreateContractModalOpen(true)}
                className="bg-[#1e51ab] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#163d82] transition-colors"
              >
                Ajouter un contrat
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {contractsToRender.map(({ contract, index }) => (
              <ContractCard key={contract.id} contract={contract} index={index} onEdit={setEditingContract} onDelete={handleDeleteContract} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Contract Modal */}
      {editingContract && <EditContractModal contract={editingContract} isOpen={Boolean(editingContract)} onClose={() => setEditingContract(null)} onSuccess={handleEditSuccess} />}

      {/* Delete Confirmation Modal */}
      {deletingContract && (
        <DeleteConfirmationModal
          isOpen={Boolean(deletingContract)}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          contractName={deletingContract.name}
          isDeleting={isDeleting}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
        className="mt-8"
      />

      <CreateContractModal open={isCreateContractModalOpen} onClose={() => setIsCreateContractModalOpen(false)} />
    </div>
  );
};

export default ContractsModule;
