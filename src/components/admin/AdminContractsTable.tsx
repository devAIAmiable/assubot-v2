import { FaChevronLeft, FaChevronRight, FaRobot, FaSearch, FaSpinner, FaTrash } from 'react-icons/fa';
import React, { useCallback, useMemo, useState } from 'react';
import { useDeleteAdminTemplateContractMutation, useGetAdminTemplateContractsQuery, useSummarizeAdminTemplateContractMutation } from '../../store/contractsApi';

import type { BackendContractListItem } from '../../types/contract';
import Button from '../ui/Button';
// import InsurerDropdown from '../ui/InsurerDropdown';
import { motion } from 'framer-motion';
import { useGetInsurersQuery } from '../../store/insurersApi';

const AdminContractsTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInsurer, setSelectedInsurer] = useState<string>('');

  const [summarizeAdminTemplateContract, { isLoading: isSummarizing }] = useSummarizeAdminTemplateContractMutation();
  const [deleteAdminTemplateContract, { isLoading: isDeleting }] = useDeleteAdminTemplateContractMutation();

  // Get insurers for the dropdown
  const { data: insurersData } = useGetInsurersQuery({
    limit: 100,
    isActive: true,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const {
    data,
    isLoading,
    error,
  } = useGetAdminTemplateContractsQuery({
    page: currentPage,
    limit: 10,
    search: searchQuery.trim().length >= 2 ? searchQuery.trim() : undefined,
    insurerId: selectedInsurer || undefined,
  });

  const contracts = useMemo(() => {
    if (!data?.data) return [];
    return data.data;
  }, [data]);

  const totalPages = useMemo(() => {
    return data?.pagination?.totalPages || 1;
  }, [data?.pagination?.totalPages]);

  const handleDelete = useCallback(async (contractId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat template ? Cette action est irréversible.')) {
      try {
        await deleteAdminTemplateContract(contractId).unwrap();
      } catch (error) {
        console.error('Failed to delete admin template contract:', error);
      }
    }
  }, [deleteAdminTemplateContract]);

  const handleSummarize = useCallback(async (contractId: string) => {
    try {
      await summarizeAdminTemplateContract(contractId).unwrap();
    } catch (error) {
      console.error('Failed to summarize admin template contract:', error);
    }
  }, [summarizeAdminTemplateContract]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleInsurerChange = useCallback((insurerId: string) => {
    setSelectedInsurer(insurerId);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);


  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'active':
  //       return 'bg-green-100 text-green-800';
  //     case 'expired':
  //       return 'bg-red-100 text-red-800';
  //     case 'pending':
  //       return 'bg-yellow-100 text-yellow-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      auto: 'Auto',
      health: 'Santé',
      home: 'Habitation',
      moto: 'Moto',
      electronic_devices: 'Objets Électroniques',
      other: 'Autre',
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-3 text-gray-600">Chargement des contrats...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Erreur lors du chargement des contrats</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Nom du contrat ou assureur (min. 2 caractères)..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <p className="mt-1 text-xs text-amber-600">
              Minimum 2 caractères requis pour la recherche
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assureur</label>
          <select
            value={selectedInsurer}
            onChange={(e) => handleInsurerChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les assureurs</option>
            {insurersData?.data?.map((insurer) => (
              <option key={insurer.id} value={insurer.id}>
                {insurer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assureur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Résumé
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract: BackendContractListItem) => (
                <motion.tr
                  key={contract.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                      {contract.version && (
                        <div className="text-sm text-gray-500">Version: {contract.version}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contract.insurer?.name || 'Assureur inconnu'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCategoryLabel(contract.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {contract.version || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contract.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contract.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : contract.status === 'expired' 
                        ? 'bg-red-100 text-red-800' 
                        : contract.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {contract.status === 'active' 
                        ? 'Actif' 
                        : contract.status === 'expired' 
                        ? 'Expiré' 
                        : contract.status === 'pending' 
                        ? 'En attente' 
                        : 'Inconnu'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.summarizeStatus === 'done' 
                          ? 'bg-green-100 text-green-800' 
                          : contract.summarizeStatus === 'ongoing' 
                          ? 'bg-blue-100 text-blue-800' 
                          : contract.summarizeStatus === 'failed' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contract.summarizeStatus === 'done' 
                          ? 'Terminé' 
                          : contract.summarizeStatus === 'ongoing' 
                          ? 'En cours' 
                          : contract.summarizeStatus === 'failed' 
                          ? 'Échec' 
                          : 'Non résumé'
                        }
                      </span>
                      {contract.summarizedAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(contract.summarizedAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSummarize(contract.id)}
                        disabled={isSummarizing || contract.summarizeStatus !== 'pending' || contract.status === 'pending'}
                        className={`${
                          contract.summarizeStatus === 'pending' && contract.status !== 'pending'
                            ? 'text-green-600 hover:text-green-800' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isSummarizing ? (
                          <FaSpinner className="h-4 w-4 animate-spin" />
                        ) : (
                          <FaRobot className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDelete(contract.id)}
                        disabled={isDeleting || contract.status === 'pending'}
                        className={`${
                          contract.status === 'pending'
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800'
                        }`}
                      >
                        {isDeleting ? (
                          <FaSpinner className="h-4 w-4 animate-spin" />
                        ) : (
                          <FaTrash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md"
              >
                Précédent
              </Button>
              <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md"
              >
                Suivant
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> à{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, data?.pagination?.total || 0)}
                  </span>{' '}
                  sur <span className="font-medium">{data?.pagination?.total || 0}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <FaChevronLeft className="h-5 w-5" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "secondary"}
                        onClick={() => handlePageChange(page)}
                        className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <FaChevronRight className="h-5 w-5" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContractsTable;
