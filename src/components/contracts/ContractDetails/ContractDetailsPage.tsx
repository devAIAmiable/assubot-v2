import type { BackendContractGuarantee, Contract, DocumentType } from '../../../types/contract';
import { FaClipboardList, FaDownload as FaDownloadIcon, FaEdit as FaEditIcon, FaExclamationTriangle, FaEye, FaGlobe, FaPhone, FaShieldAlt, FaTimes } from 'react-icons/fa';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';

import CancellationsTab from './ContractTabs/CancellationsTab';
import ContactsTab from './ContractTabs/ContactsTab';
import ContractHeader from './ContractHeader';
import { ContractStatus } from '../../../types/contract';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import EditContractModal from './modals/EditContractModal';
import ExclusionsTab from './ContractTabs/ExclusionsTab';
import GuaranteeDetailModal from './modals/GuaranteeDetailModal';
import GuaranteesTab from './ContractTabs/GuaranteesTab';
import InsufficientCreditsModal from './modals/InsufficientCreditsModal';
import ObligationsTab from './ContractTabs/ObligationsTab';
import OverviewTab from './ContractTabs/OverviewTab';
import SummarizeConfirmationModal from './modals/SummarizeConfirmationModal';
import ZonesTab from './ContractTabs/ZonesTab';
import { selectIsContractProcessing } from '../../../store/contractProcessingSlice';
import { showToast } from '../../ui/Toast';
import { trackContractDelete } from '@/services/analytics/gtm';
import { useAppSelector } from '../../../store/hooks';
import { useContractDownload } from '../../../hooks/useContractDownload';
import { useContractOperations } from '../../../hooks/useContractOperations';
import { useContractSummarizationListener } from '../../../hooks/useContractSummarizationListener';
import { useContractSummarize } from '../../../hooks/useContractSummarize';
import { useGetContractByIdQuery } from '../../../store/contractsApi';

const DEFAULT_REQUIRED_CREDITS = 5;

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const ContractDetailsPage: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();

  const {
    data: contract,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetContractByIdQuery(contractId!, {
    skip: !contractId,
  });

  useContractSummarizationListener(contractId, refetch);

  const { generateDownloadUrls, isGenerating } = useContractDownload();
  const { summarizeContract, isSummarizing, insufficientCredits } = useContractSummarize();
  const { deleteContract, isDeleting: isDeletingContract, deleteError } = useContractOperations();

  const isProcessing = useAppSelector((state) => selectIsContractProcessing(state, contractId || ''));
  const currentUser = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [contractId]);

  const tabs = useMemo(
    () => [
      { name: "Vue d'ensemble", icon: FaEye },
      { name: 'Garanties', icon: FaShieldAlt },
      { name: 'Exclusions', icon: FaExclamationTriangle },
      { name: 'Zone géographique', icon: FaGlobe },
      { name: 'Obligations', icon: FaClipboardList },
      { name: 'Résiliation', icon: FaTimes },
      { name: 'Contacts', icon: FaPhone },
    ],
    []
  );

  const tabIds = useMemo(() => tabs.map((tab) => slugify(tab.name)), [tabs]);

  const getInitialTabIndex = useCallback(() => {
    if (typeof window === 'undefined') {
      return 0;
    }
    const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    const index = tabIds.indexOf(hash);
    return index >= 0 ? index : 0;
  }, [tabIds]);

  const [selectedTab, setSelectedTab] = useState<number>(() => getInitialTabIndex());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGuarantee, setSelectedGuarantee] = useState<BackendContractGuarantee | null>(null);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    const index = tabIds.indexOf(hash);
    if (index >= 0) {
      setSelectedTab(index);
    }
  }, [tabIds]);

  useEffect(() => {
    if (deleteError) {
      showToast.error(deleteError);
    }
  }, [deleteError]);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tabIds[index]}`);
    }
  };

  const handleBack = () => {
    navigate('/app/contracts');
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteContract = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    if (contractId) {
      trackContractDelete({ contractId, status: 'cancel' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!contractId) {
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      trackContractDelete({ contractId, status: 'confirm' });
      await deleteContract(contractId);
      trackContractDelete({ contractId, status: 'success' });
      showToast.success('Contrat supprimé avec succès.');
      navigate('/app/contracts');
    } catch (deleteErr) {
      console.error('Failed to delete contract:', deleteErr);
      showToast.error('Erreur lors de la suppression du contrat.');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleSelectGuarantee = (guarantee: BackendContractGuarantee) => {
    setSelectedGuarantee(guarantee);
    setIsGuaranteeModalOpen(true);
  };

  const handleCloseGuaranteeModal = () => {
    setIsGuaranteeModalOpen(false);
    setSelectedGuarantee(null);
  };

  const isActiveContract = contract?.status === ContractStatus.ACTIVE;
  const canSummarize = isActiveContract && (contract?.summarizeStatus === undefined || contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'failed');

  const handleSummarize = () => {
    if (!canSummarize) {
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSummarize = async () => {
    if (!contractId || !canSummarize) {
      setIsConfirmModalOpen(false);
      return;
    }
    setIsConfirmModalOpen(false);
    try {
      await summarizeContract(contractId);
    } catch (summarizeError) {
      console.error('Failed to summarize contract:', summarizeError);
    }
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleDownloadDocument = useCallback(
    async (type: DocumentType) => {
      if (!contractId) return;
      try {
        const documents = await generateDownloadUrls(contractId);
        const doc = documents.find((item) => item.type === type);
        if (doc?.url) {
          window.open(doc.url, '_blank');
        }
      } catch (downloadError) {
        console.error('Failed to download contract document:', downloadError);
      }
    },
    [contractId, generateDownloadUrls]
  );

  const handleDownloadFirstDocument = useCallback(() => {
    if (!contract?.documents?.length) return;
    handleDownloadDocument(contract.documents[0].type);
  }, [contract?.documents, handleDownloadDocument]);

  const requiredCredits = insufficientCredits.errorDetails.requiredCredits ?? DEFAULT_REQUIRED_CREDITS;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chargement du contrat...</h1>
          <p className="text-gray-600">Veuillez patienter pendant que nous récupérons les détails.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
        ? String(error.data.message)
        : 'Une erreur est survenue lors du chargement du contrat.';

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-4">Erreur lors du chargement</h1>
          <p className="text-red-600 mb-6">{errorMessage}</p>
          <button onClick={() => navigate('/app/contracts')} className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors">
            Retour aux contrats
          </button>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contrat non trouvé</h1>
          <p className="text-gray-600 mb-6">Le contrat que vous recherchez n'existe pas.</p>
          <button onClick={() => navigate('/app/contracts')} className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors">
            Retour aux contrats
          </button>
        </div>
      </div>
    );
  }

  const firstDocumentType = contract.documents?.[0]?.type;

  const mobileActionColumns = firstDocumentType ? 'grid-cols-[3fr_1fr_1fr]' : 'grid-cols-[3fr_1fr]';

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <ContractHeader
        contract={contract as Contract}
        onBack={handleBack}
        onEdit={handleEdit}
        onSummarize={handleSummarize}
        onDelete={handleDeleteContract}
        isSummarizing={isSummarizing}
        isDeleting={isDeletingContract}
        summarizeStatus={contract.summarizeStatus}
        requiredCredits={requiredCredits}
      />

      <TabGroup selectedIndex={selectedTab} onChange={handleTabChange}>
        <div className="border-b border-gray-200 bg-white">
          <TabList className="flex space-x-2 overflow-x-auto scrollbar-hide border-b border-gray-200 px-0 sm:px-4">
            {tabs.map((tab, index) => (
              <Tab
                key={tabIds[index]}
                className={({ selected }) =>
                  `flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap min-w-fit ${
                    selected ? 'border-[#1e51ab] text-[#1e51ab]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
              </Tab>
            ))}
          </TabList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabPanels className="h-full">
            <div className="pb-20 lg:pb-0">
              <TabPanel className="px-0 py-4 sm:px-6 sm:py-6">
                <OverviewTab contract={contract as Contract} onDownloadDocument={handleDownloadDocument} isGeneratingDocument={isGenerating} />
              </TabPanel>

              <TabPanel className="px-0 py-4 sm:px-0 sm:py-6">
                <GuaranteesTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                  onSelectGuarantee={handleSelectGuarantee}
                />
              </TabPanel>

              <TabPanel className="px-0 py-4 sm:px-0 sm:py-6">
                <ExclusionsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              <TabPanel className="px-0 py-4 sm:px-0 sm:py-6">
                <ZonesTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              <TabPanel className="px-0 py-4 sm:px-0 sm:py-6">
                <ObligationsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              <TabPanel className="px-0 py-4 sm:px-0 sm:py-6">
                <CancellationsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              <TabPanel className="px-0 py-4 sm:px-0 sm:py-6">
                <ContactsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>
            </div>
          </TabPanels>
        </div>
      </TabGroup>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 z-50 safe-area-inset-bottom">
        <div className={`grid ${mobileActionColumns} gap-2 items-center`}>
          {/* Résumer button (3/5 width) */}
          <button
            onClick={handleSummarize}
            disabled={isSummarizing || !canSummarize}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed truncate"
            aria-label="Résumer le contrat"
            title={`Résumé IA (${requiredCredits} crédits)`}
          >
            Résumer
          </button>

          {/* Modifier (1/5) */}
          <button onClick={handleEdit} className="w-full h-12 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center" aria-label="Modifier le contrat">
            <FaEditIcon className="h-5 w-5" />
          </button>

          {/* Télécharger (1/5) */}
          {firstDocumentType && (
            <button
              onClick={handleDownloadFirstDocument}
              disabled={isGenerating}
              className="w-full h-12 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Télécharger le premier document"
            >
              <FaDownloadIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {contract && <EditContractModal contract={contract} isOpen={isEditModalOpen} onClose={handleEditClose} onSuccess={handleEditSuccess} />}

      {selectedGuarantee && <GuaranteeDetailModal isOpen={isGuaranteeModalOpen} onClose={handleCloseGuaranteeModal} guarantee={selectedGuarantee} />}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        contractName={contract.name}
        isDeleting={isDeletingContract}
      />

      <InsufficientCreditsModal
        isOpen={insufficientCredits.isModalOpen}
        onClose={insufficientCredits.closeModal}
        operation={insufficientCredits.errorDetails.operation}
        requiredCredits={insufficientCredits.errorDetails.requiredCredits}
        currentCredits={insufficientCredits.currentCredits}
      />

      <SummarizeConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmSummarize}
        currentCredits={currentUser?.creditBalance ?? 0}
        requiredCredits={requiredCredits}
        isProcessing={isSummarizing}
      />
    </div>
  );
};

export default ContractDetailsPage;
