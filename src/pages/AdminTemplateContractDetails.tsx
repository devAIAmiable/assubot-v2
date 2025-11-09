import type { BackendContractGuarantee } from '../types';
import type { Contract } from '../types/contract';
import { FaClipboardList, FaExclamationTriangle, FaGlobe, FaPhone, FaShieldAlt, FaTimes } from 'react-icons/fa';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CancellationsTab from '../components/contracts/ContractDetails/ContractTabs/CancellationsTab';
import ContactsTab from '../components/contracts/ContractDetails/ContractTabs/ContactsTab';
import ContractHeader from '../components/contracts/ContractDetails/ContractHeader';
import ExclusionsTab from '../components/contracts/ContractDetails/ContractTabs/ExclusionsTab';
import GuaranteeDetailModal from '../components/contracts/ContractDetails/modals/GuaranteeDetailModal';
import GuaranteesTab from '../components/contracts/ContractDetails/ContractTabs/GuaranteesTab';
import ObligationsTab from '../components/contracts/ContractDetails/ContractTabs/ObligationsTab';
import ZonesTab from '../components/contracts/ContractDetails/ContractTabs/ZonesTab';
import { selectIsContractProcessing } from '../store/contractProcessingSlice';
import { useAdminContractSummarize } from '../hooks/useAdminContractSummarize';
import { useAppSelector } from '../store/hooks';
import { useGetAdminTemplateContractByIdQuery } from '../store/contractsApi';

const AdminTemplateContractDetails = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedGuarantee, setSelectedGuarantee] = useState<BackendContractGuarantee | null>(null);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);

  // Get contract details using the admin template API
  const {
    data: contract,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAdminTemplateContractByIdQuery(contractId!, {
    skip: !contractId,
  });

  // Contract download functionality
  // const { generateDownloadUrls } = useContractDownload();

  // Admin contract summarization
  const { summarizeContract, isSummarizing } = useAdminContractSummarize();
  const isProcessing = useAppSelector((state) => selectIsContractProcessing(state, contractId || ''));

  // Scroll to top when component mounts or contractId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [contractId]);

  // WebSocket event listener for contract summarization
  useEffect(() => {
    const handleContractProcessed = (event: Event) => {
      const customEvent = event as CustomEvent<{ contractId: string; status: string }>;
      const data = customEvent.detail;

      if (data.contractId === contractId && data.status === 'success') {
        console.log('🔄 Refetching admin contract after successful processing...');
        refetch();
      }
    };

    window.addEventListener('contract_summarized', handleContractProcessed as EventListener);

    return () => {
      window.removeEventListener('contract_summarized', handleContractProcessed as EventListener);
    };
  }, [contractId, refetch]);

  // Show loading state for initial data fetch
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab] mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chargement du contrat...</h1>
          <p className="text-gray-600">Veuillez patienter pendant que nous récupérons les détails.</p>
        </div>
      </div>
    );
  }

  // Show error state
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
          <button onClick={() => navigate('/app/admin')} className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors">
            Retour à l'administration
          </button>
        </div>
      </div>
    );
  }

  // Redirect if contract not found
  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contrat non trouvé</h1>
          <p className="text-gray-600 mb-6">Le contrat que vous recherchez n'existe pas.</p>
          <button onClick={() => navigate('/app/admin')} className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors">
            Retour à l'administration
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { name: 'Garanties', icon: FaShieldAlt },
    { name: 'Exclusions', icon: FaExclamationTriangle },
    { name: 'Zone géographique', icon: FaGlobe },
    { name: 'Obligations', icon: FaClipboardList },
    { name: 'Résiliation', icon: FaTimes },
    { name: 'Contacts', icon: FaPhone },
  ];

  const handleGuaranteeClick = (guarantee: BackendContractGuarantee) => {
    setSelectedGuarantee(guarantee);
    setIsGuaranteeModalOpen(true);
  };

  const handleCloseGuaranteeModal = () => {
    setIsGuaranteeModalOpen(false);
    setSelectedGuarantee(null);
  };

  const handleClose = () => {
    navigate('/app/admin');
  };

  const handleSummarize = async () => {
    if (!contractId) return;
    try {
      await summarizeContract(contractId);
    } catch (error) {
      console.error('Failed to summarize admin contract:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContractHeader
        contract={contract as Contract}
        onBack={handleClose}
        onNavigateToEdit={() => navigate(`/app/admin/templates/${contractId}/edit`)}
        onSummarize={handleSummarize}
        isSummarizing={isSummarizing}
        summarizeStatus={contract.summarizeStatus}
        isAdminMode={true}
      />

      {/* Tabs and Content */}
      <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <TabList className="flex space-x-2 overflow-x-auto scrollbar-hide border-b border-gray-200 px-4 sm:px-0">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <TabPanels className="h-full">
            <div className="pb-20 lg:pb-0">
              {/* Garanties */}
              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <GuaranteesTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                  onSelectGuarantee={handleGuaranteeClick}
                />
              </TabPanel>

              {/* Exclusions */}
              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <ExclusionsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              {/* Zone géographique */}
              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <ZonesTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              {/* Obligations */}
              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <ObligationsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              {/* Résiliation */}
              <TabPanel className="p-4 sm:px-0 sm:py-6">
                <CancellationsTab
                  contract={contract as Contract}
                  summarizeStatus={contract.summarizeStatus}
                  isProcessing={isProcessing}
                  isSummarizing={isSummarizing}
                  onSummarize={handleSummarize}
                />
              </TabPanel>

              {/* Contacts */}
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

      {/* Guarantee Detail Modal */}
      {selectedGuarantee && <GuaranteeDetailModal isOpen={isGuaranteeModalOpen} onClose={handleCloseGuaranteeModal} guarantee={selectedGuarantee} />}
    </div>
  );
};

export default AdminTemplateContractDetails;
