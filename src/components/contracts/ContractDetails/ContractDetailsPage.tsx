import type { BackendContractGuarantee, Contract, DocumentType } from '../../../types/contract';
import { FaClipboardList, FaExclamationTriangle, FaEye, FaGlobe, FaPhone, FaShieldAlt, FaTimes } from 'react-icons/fa';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';

import CancellationsTab from './ContractTabs/CancellationsTab';
import ContactsTab from './ContractTabs/ContactsTab';
import ContractHeader from './ContractHeader';
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
import { useAppSelector } from '../../../store/hooks';
import { useContractDownload } from '../../../hooks/useContractDownload';
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

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tabIds[index]}`);
    }
  };

  const handleBack = () => {
    navigate('/app/contrats');
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

  const handleSelectGuarantee = (guarantee: BackendContractGuarantee) => {
    setSelectedGuarantee(guarantee);
    setIsGuaranteeModalOpen(true);
  };

  const handleCloseGuaranteeModal = () => {
    setIsGuaranteeModalOpen(false);
    setSelectedGuarantee(null);
  };

  const handleSummarize = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSummarize = async () => {
    if (!contractId) return;
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
          <button onClick={() => navigate('/app/contrats')} className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors">
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
          <button onClick={() => navigate('/app/contrats')} className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors">
            Retour aux contrats
          </button>
        </div>
      </div>
    );
  }

  const firstDocumentType = contract.documents?.[0]?.type;

  return (
    <div className="min-h-screen bg-gray-50">
      <ContractHeader
        contract={contract as Contract}
        onBack={handleBack}
        onEdit={handleEdit}
        onSummarize={handleSummarize}
        isSummarizing={isSummarizing}
        summarizeStatus={contract.summarizeStatus}
        requiredCredits={requiredCredits}
      />

      <TabGroup selectedIndex={selectedTab} onChange={handleTabChange}>
        <div className="border-b border-gray-200 bg-white">
          <TabList className="flex space-x-2 overflow-x-auto scrollbar-hide border-b border-gray-200 px-4 sm:px-0">
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
              <TabPanel className="p-4 sm:p-6">
                <OverviewTab contract={contract as Contract} onDownloadDocument={handleDownloadDocument} isGeneratingDocument={isGenerating} />
              </TabPanel>

              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <GuaranteesTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                  onSelectGuarantee={handleSelectGuarantee}
                />
              </TabPanel>

              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <ExclusionsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <ZonesTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <ObligationsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <CancellationsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              <TabPanel className="p-4 sm:px-0 sm:py-6">
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

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 z-50 safe-area-inset-bottom">
        <button
          onClick={handleSummarize}
          disabled={isSummarizing || contract.summarizeStatus !== 'pending'}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Résumer le contrat"
          title={`Résumé IA (${requiredCredits} crédits)`}
        >
          Résumer
        </button>
        <button onClick={handleEdit} className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg" aria-label="Modifier le contrat">
          Editer
        </button>
        {firstDocumentType && (
          <button
            onClick={handleDownloadFirstDocument}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Télécharger le premier document"
          >
            Télécharger
          </button>
        )}
      </div>

      {contract && <EditContractModal contract={contract} isOpen={isEditModalOpen} onClose={handleEditClose} onSuccess={handleEditSuccess} />}

      {selectedGuarantee && <GuaranteeDetailModal isOpen={isGuaranteeModalOpen} onClose={handleCloseGuaranteeModal} guarantee={selectedGuarantee} />}

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
