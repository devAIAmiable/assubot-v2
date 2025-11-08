import { AnimatePresence, motion } from 'framer-motion';
import type { BackendContractGuarantee, ObligationType } from '../types';
import { ComposableMap, Geographies, Geography, Graticule, Marker, ZoomableGroup } from 'react-simple-maps';
import { Disclosure, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import {
  FaArrowLeft,
  FaBan,
  FaCheck,
  FaChevronCircleDown,
  FaChevronDown,
  FaChevronRight,
  FaChevronUp,
  FaClipboardList,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaExclamationTriangle,
  FaFileAlt,
  FaFilter,
  FaFlag,
  FaGlobe,
  FaInfoCircle,
  FaMapMarkedAlt,
  FaPhone,
  FaSearch,
  FaShieldAlt,
  FaTimes,
} from 'react-icons/fa';
import { getContactTypeLabel, getObligationTypeLabel, getStatusColor, getStatusLabel, getTypeIcon, getTypeLabel } from '../utils/contract';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Avatar from '../components/ui/Avatar';
import ContractSummarizationStatus from '../components/ui/ContractSummarizationStatus';
import GuaranteeDetailModal from '../components/contracts/ContractDetails/modals/GuaranteeDetailModal';
import ReactMarkdown from 'react-markdown';
import { capitalizeFirst } from '../utils/text';
import { getDisplayValue } from '../utils/dateHelpers';
import { getInsurerLogo } from '../utils/insurerLogo';
import { selectIsContractProcessing } from '../store/contractProcessingSlice';
import { useAdminContractSummarize } from '../hooks/useAdminContractSummarize';
import { useAppSelector } from '../store/hooks';
// import { useContractDownload } from '../hooks/useContractDownload';
import { useGetAdminTemplateContractByIdQuery } from '../store/contractsApi';

function getZoneCoordinates(zone: { latitude?: string | null; longitude?: string | null }): [number, number] | null {
  const latitudeValue = zone.latitude ?? undefined;
  const longitudeValue = zone.longitude ?? undefined;

  const latitude = latitudeValue !== undefined && latitudeValue !== '' ? Number(latitudeValue) : undefined;
  const longitude = longitudeValue !== undefined && longitudeValue !== '' ? Number(longitudeValue) : undefined;

  if (typeof latitude === 'number' && Number.isFinite(latitude) && typeof longitude === 'number' && Number.isFinite(longitude)) {
    return [longitude, latitude];
  }

  return null;
}

const AdminTemplateContractDetails = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedGuarantee, setSelectedGuarantee] = useState<BackendContractGuarantee | null>(null);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);
  const [expandedObligations, setExpandedObligations] = useState<Record<string, boolean>>({});

  // Search and filter state for zones and exclusions
  const [zoneSearchQuery, setZoneSearchQuery] = useState('');
  const [zoneTypeFilter, setZoneTypeFilter] = useState<string>('all');
  const [exclusionSearchQuery, setExclusionSearchQuery] = useState('');
  const [expandedExclusions, setExpandedExclusions] = useState<Record<string, boolean>>({});
  const [expandedZones, setExpandedZones] = useState<Record<string, boolean>>({});

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

  const isContractExpired = contract ? (contract.endDate ? new Date(contract.endDate) < new Date() : false) : false;

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
    // { name: "Vue d'ensemble", icon: FaEye },
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

  const toggleObligationExpansion = (type: string) => {
    setExpandedObligations((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Filter and toggle functions for zones and exclusions
  const filteredZones =
    contract?.zones?.filter((zone) => {
      const zoneName = zone.name?.toLowerCase() ?? '';
      const matchesSearch = zoneName.includes(zoneSearchQuery.toLowerCase());
      const matchesType = zoneTypeFilter === 'all' || zone.type === zoneTypeFilter;
      return matchesSearch && matchesType;
    }) || [];

  const filteredExclusions =
    contract?.exclusions?.filter((exclusion) => {
      return exclusion.description.toLowerCase().includes(exclusionSearchQuery.toLowerCase());
    }) || [];

  const toggleExclusionExpansion = (id: string) => {
    setExpandedExclusions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'country':
        return FaFlag;
      case 'zone':
      case 'region':
      case 'city':
        return FaMapMarkedAlt;
      default:
        return FaGlobe;
    }
  };

  const getZoneTypeLabel = (type: string) => {
    switch (type) {
      case 'country':
        return 'Pays';
      case 'zone':
        return 'Zone';
      case 'region':
        return 'Région';
      case 'city':
        return 'Ville';
      default:
        return 'Zone';
    }
  };

  const handleClose = () => {
    navigate('/app/admin');
  };

  // const handleDownload = async (type: DocumentType) => {
  //   if (!contractId) return;

  //   try {
  //     // generateDownloadUrls generates links for all documents but we only need to open the one we clicked on
  //     const downloadDocuments = await generateDownloadUrls(contractId);
  //     const docDownload = downloadDocuments.find((d) => (d.type as unknown as DocumentType) === type);
  //     if (docDownload) {
  //       window.open(docDownload.url, '_blank');
  //     }
  //   } catch (error) {
  //     console.error('Failed to download contract documents:', error);
  //     // You could add a toast notification here
  //   }
  // };

  const handleSummarize = async () => {
    if (!contractId) return;
    try {
      await summarizeContract(contractId);
    } catch (error) {
      console.error('Failed to summarize admin contract:', error);
    }
  };

  // Pending/Processing Summarization Message Component
  const PendingSummarizationMessage = () => {
    // Show processing loader if status is ongoing
    if (contract?.summarizeStatus === 'ongoing' || isProcessing) {
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 shadow-lg">
            <div className="relative mb-6">
              <Avatar size="xl" isAssistant />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-25 w-25 border-t-2 border-b-2 border-[#1e51ab]"></div>
              </div>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Analyse en cours</h4>
            <p className="text-gray-600 leading-relaxed">J'ai analyse ton contrat et génère les informations détaillées...</p>
            <p className="text-sm text-gray-500 mt-2">Cela peut prendre quelques instants</p>
          </div>
        </div>
      );
    }

    // Show pending or failed state with button to start/retry analysis
    if (contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'failed') {
      const isFailed = contract?.summarizeStatus === 'failed';
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 shadow-lg">
            <Avatar size="xl" isAssistant />
            <h4 className="text-xl font-semibold text-gray-900 mb-3">{isFailed ? 'Analyse échouée' : 'Analyse en attente'}</h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              {isFailed
                ? "L'analyse du contrat a échoué. Clique sur « Réessayer » pour relancer l'analyse."
                : "Je t'affiche les détails dès que j'ai analysé ton contrat. Clique sur « Lancer l'analyse » pour démarrer"}
            </p>
            <button
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1e51ab] text-white font-medium rounded-lg hover:bg-[#163d82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSummarizing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Démarrage...</span>
                </>
              ) : (
                <>
                  <span>{isFailed ? 'Réessayer' : "Lancer l'analyse"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    // Return null for other statuses (shouldn't reach here, but safety fallback)
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                {/* Insurer logo or type icon */}
                {contract?.insurer?.name && getInsurerLogo(contract.insurer.name) ? (
                  <img src={getInsurerLogo(contract.insurer.name)} alt={contract.insurer.name} className="w-12 h-12 object-contain rounded bg-white border border-gray-100" />
                ) : (
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    {(() => {
                      const TypeIcon = getTypeIcon(contract.category);
                      return <TypeIcon className="h-6 w-6 text-[#1e51ab]" />;
                    })()}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{contract.name}</h1>
                  <p className="text-gray-600">
                    {getDisplayValue(contract.insurer?.name)} - {getTypeLabel(contract.category)}
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Template</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Contract status badge */}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${isContractExpired ? 'bg-red-100 text-red-800' : getStatusColor(contract.status)}`}>
                {isContractExpired ? 'Expiré' : getStatusLabel(contract.status)}
              </span>

              {/* Contract Summarization Status */}
              <ContractSummarizationStatus summarizeStatus={contract?.summarizeStatus} />

              {/* Edit button */}
              <button
                onClick={() => navigate(`/app/admin/templates/${contractId}/edit`)}
                className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaEdit className="h-4 w-4" />
                <span>Modifier</span>
              </button>

              {/* Summarize button */}
              {(contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'failed') && (
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-[#1e51ab] text-white text-sm font-medium rounded-lg hover:bg-[#163d82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSummarizing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Démarrage...</span>
                    </>
                  ) : (
                    <>
                      <FaFileAlt className="h-4 w-4" />
                      <span>{contract?.summarizeStatus === 'failed' ? 'Réessayer' : 'Résumer'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

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
            {/* Add bottom padding for mobile action bar */}
            <div className="pb-20 lg:pb-0">
              {/* Garanties */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : contract.guarantees && contract.guarantees.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Header with inline stats */}
                      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <FaShieldAlt className="text-blue-600" />
                          <span className="font-semibold text-gray-900">{contract.guarantees.length} garanties</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300" />
                        <div className="flex items-center gap-2">
                          <FaCheck className="text-green-600" />
                          <span className="text-sm text-gray-700">
                            {contract.guarantees.reduce((total, garantie) => {
                              return (
                                total +
                                (garantie.details?.reduce((detailTotal, detail) => {
                                  return detailTotal + (detail.coverages?.filter((c) => c.type === 'covered').length || 0);
                                }, 0) || 0)
                              );
                            }, 0)}{' '}
                            couvertures
                          </span>
                        </div>
                        <div className="h-4 w-px bg-gray-300" />
                        <div className="flex items-center gap-2">
                          <FaTimes className="text-red-600" />
                          <span className="text-sm text-gray-700">
                            {contract.guarantees.reduce((total, garantie) => {
                              return (
                                total +
                                (garantie.details?.reduce((detailTotal, detail) => {
                                  return detailTotal + (detail.coverages?.filter((c) => c.type === 'not_covered').length || 0);
                                }, 0) || 0)
                              );
                            }, 0)}{' '}
                            exclusions
                          </span>
                        </div>
                      </div>

                      {/* Clickable guarantee list */}
                      <div className="space-y-3">
                        {contract.guarantees.map((guarantee, index) => {
                          const coverageCount =
                            guarantee.details?.reduce((total, detail) => {
                              return total + (detail.coverages?.filter((c) => c.type === 'covered').length || 0);
                            }, 0) || 0;
                          const exclusionCount =
                            guarantee.details?.reduce((total, detail) => {
                              return total + (detail.coverages?.filter((c) => c.type === 'not_covered').length || 0);
                            }, 0) || 0;

                          return (
                            <button
                              key={guarantee.id}
                              onClick={() => handleGuaranteeClick(guarantee)}
                              className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 mb-1">{guarantee.title}</h4>
                                    <p className="text-xs text-gray-500">
                                      {coverageCount} couvertures • {exclusionCount} exclusions
                                    </p>
                                  </div>
                                </div>
                                <FaChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Empty State */
                    <div className="text-center py-12">
                      <div className="max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaShieldAlt className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune garantie spécifiée</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">Ce contrat ne contient pas encore d'informations détaillées sur les garanties.</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>

              {/* Exclusions */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : (
                    <div className="space-y-6">
                      {/* Header with search */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-amber-100 flex items-center justify-center">
                            <FaBan className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex flex-wrap items-center gap-2">
                              <span>Exclusions générales</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              {filteredExclusions.length} exclusion{filteredExclusions.length > 1 ? 's' : ''}
                              {exclusionSearchQuery && ` trouvée${filteredExclusions.length > 1 ? 's' : ''}`}
                            </p>
                          </div>
                        </div>

                        {/* Search bar */}
                        <div className="relative w-full">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Rechercher..."
                            value={exclusionSearchQuery}
                            onChange={(e) => setExclusionSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                          />
                          {exclusionSearchQuery && (
                            <button onClick={() => setExclusionSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Exclusions grid */}
                      {contract.exclusions && contract.exclusions.length > 0 ? (
                        filteredExclusions.length > 0 ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredExclusions.map((exclusion) => {
                              const isExpanded = expandedExclusions[exclusion.id] || false;
                              const description = capitalizeFirst(exclusion.description);
                              const isLong = description.length > 150;
                              const truncatedDescription = isLong && !isExpanded ? description.substring(0, 150) + '...' : description;

                              return (
                                <motion.div
                                  key={exclusion.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-amber-300 transition-all group cursor-pointer"
                                  onClick={() => isLong && toggleExclusionExpansion(exclusion.id)}
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                        <FaBan className="h-5 w-5 text-amber-600" />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm sm:text-base text-gray-900 leading-relaxed">{truncatedDescription}</p>
                                      {isLong && (
                                        <button
                                          className="mt-2 text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExclusionExpansion(exclusion.id);
                                          }}
                                        >
                                          {isExpanded ? (
                                            <>
                                              <FaChevronUp className="h-3 w-3" />
                                              Voir moins
                                            </>
                                          ) : (
                                            <>
                                              <FaChevronCircleDown className="h-3 w-3" />
                                              Voir plus
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex-shrink-0">
                                      <FaInfoCircle className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <FaSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune exclusion trouvée</h4>
                            <p className="text-sm text-gray-600">Essayez de modifier votre recherche</p>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                          <FaBan className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Aucune exclusion spécifiée</h4>
                          <p className="text-sm sm:text-base text-gray-600">Ce contrat ne contient pas d'exclusions générales</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabPanel>

              {/* Zone géographique */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : (
                    <div className="space-y-6">
                      {contract.zones && contract.zones.length > 0 ? (
                        <>
                          {/* Header with search and filter */}
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start sm:items-center gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-blue-100 flex items-center justify-center">
                                <FaGlobe className="h-5 w-5 sm:h-6 sm:w-6 text-[#1e51ab]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex flex-wrap items-center gap-2">
                                  <span>Zones géographiques</span>
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  {filteredZones.length} zone{filteredZones.length > 1 ? 's' : ''} de couverture
                                  {(zoneSearchQuery || zoneTypeFilter !== 'all') && ` (filtré${filteredZones.length > 1 ? 's' : ''})`}
                                </p>
                              </div>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex flex-col gap-2">
                              {/* Search */}
                              <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FaSearch className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Rechercher..."
                                  value={zoneSearchQuery}
                                  onChange={(e) => setZoneSearchQuery(e.target.value)}
                                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent text-sm"
                                />
                                {zoneSearchQuery && (
                                  <button onClick={() => setZoneSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                  </button>
                                )}
                              </div>

                              {/* Filter and Clear */}
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaFilter className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <select
                                    value={zoneTypeFilter}
                                    onChange={(e) => setZoneTypeFilter(e.target.value)}
                                    className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                                  >
                                    <option value="all">Tous</option>
                                    <option value="country">Pays</option>
                                    <option value="zone">Zones</option>
                                    <option value="region">Régions</option>
                                    <option value="city">Villes</option>
                                  </select>
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <FaChevronDown className="h-3 w-3 text-gray-400" />
                                  </div>
                                </div>

                                {/* Clear filters */}
                                {(zoneSearchQuery || zoneTypeFilter !== 'all') && (
                                  <button
                                    onClick={() => {
                                      setZoneSearchQuery('');
                                      setZoneTypeFilter('all');
                                    }}
                                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap flex-shrink-0"
                                  >
                                    <FaTimes className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {filteredZones.length > 0 ? (
                            <div className="space-y-6">
                              {/* Map Section */}
                              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Carte interactive des zones</h4>
                                    {/* Legend */}
                                    <div className="flex items-center gap-4 text-sm">
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-[#1e51ab]"></div>
                                        <span className="text-gray-600">Zones couvertes</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-gray-300"></div>
                                        <span className="text-gray-600">Autres régions</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full h-[300px] sm:h-[400px] lg:h-[550px] bg-gray-50 overflow-hidden relative">
                                  <ComposableMap
                                    projection="geoEqualEarth"
                                    projectionConfig={{
                                      scale: 190,
                                      center: [0, 15],
                                    }}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                    }}
                                  >
                                    <ZoomableGroup>
                                      {/* Graticule */}
                                      <Graticule stroke="#e2e8f0" strokeWidth={1} />

                                      {/* World Countries */}
                                      <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                                        {({ geographies }) =>
                                          geographies.map((geo) => {
                                            // Check if this country/region matches any of the contract zones
                                            const isHighlighted = filteredZones.some((zone) => {
                                              const zoneCode = zone.code?.toUpperCase();
                                              const geoCode = String(geo.properties.iso_a2 || geo.properties.ISO_A2 || '').toUpperCase();
                                              if (zoneCode && geoCode && geoCode !== 'ZZ') {
                                                return geoCode === zoneCode;
                                              }

                                              const geoName = geo.properties.name?.toLowerCase();
                                              const zoneName = zone.name?.toLowerCase();
                                              return !!zoneName && !!geoName && geoName === zoneName;
                                            });

                                            return (
                                              <g key={geo.rsmKey} style={{ cursor: 'crosshair' }}>
                                                <title>{geo.properties.name}</title>
                                                <Geography
                                                  geography={geo}
                                                  fill={isHighlighted ? '#1e51ab' : '#cedaf0'}
                                                  stroke="#fff"
                                                  strokeWidth={1}
                                                  style={{
                                                    default: { outline: 'none' },
                                                    hover: {
                                                      fill: isHighlighted ? '#163d82' : '#e2e8f0',
                                                      outline: 'none',
                                                    },
                                                    pressed: { outline: 'none' },
                                                  }}
                                                />
                                              </g>
                                            );
                                          })
                                        }
                                      </Geographies>

                                      {/* Zone Markers */}
                                      {filteredZones.map((zone) => {
                                        const coordinates = getZoneCoordinates(zone);
                                        if (!coordinates) return null;

                                        return (
                                          <Marker key={zone.id} coordinates={coordinates}>
                                            <g>
                                              {/* Animated pulse circle */}
                                              <circle r="8" fill="#1e51ab" opacity="0.2">
                                                <animate attributeName="r" from="4" to="12" dur="2s" begin="0s" repeatCount="indefinite" />
                                                <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
                                              </circle>
                                              {/* Main marker circle */}
                                              <circle r="3" fill="#1e51ab" stroke="#fff" strokeWidth="1.5" />
                                              {/* Zone label */}
                                              <text
                                                textAnchor="middle"
                                                y="-15"
                                                style={{
                                                  fontFamily: 'system-ui',
                                                  fill: '#1e51ab',
                                                  fontSize: '11px',
                                                  fontWeight: '600',
                                                  textShadow: '1px 1px 3px rgba(255,255,255,0.9)',
                                                }}
                                              >
                                                {capitalizeFirst(zone.name)}
                                              </text>
                                            </g>
                                          </Marker>
                                        );
                                      })}
                                    </ZoomableGroup>
                                  </ComposableMap>
                                </div>
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                  <p className="text-xs sm:text-sm text-gray-600 text-center">Utilisez la molette de votre souris pour zoomer et dézoomer sur la carte</p>
                                </div>
                              </div>

                              {/* Zone Cards Grid */}
                              <div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 px-1">Liste des zones de couverture</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {filteredZones.map((zone) => {
                                    const ZoneIcon = getZoneIcon(zone.type);
                                    const hasConditions = zone.conditions && zone.conditions.length > 0;
                                    const isExpanded = expandedZones[zone.id] || false;

                                    return (
                                      <motion.div
                                        key={zone.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#1e51ab] transition-all group"
                                      >
                                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                                          <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                              <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                  <ZoneIcon className="h-5 w-5 text-[#1e51ab]" />
                                                </div>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h5 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{capitalizeFirst(zone.name)}</h5>
                                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full text-xs font-medium text-[#1e51ab]">
                                                    {getZoneTypeLabel(zone.type)}
                                                  </span>
                                                  <span className="text-xs font-medium text-[#1e51ab] bg-white/80 px-2 py-0.5 rounded-full">Code ISO : {zone.code || 'N/A'}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Card Content */}
                                        {hasConditions && (
                                          <div className="p-4">
                                            <button
                                              onClick={() =>
                                                setExpandedZones((prev) => ({
                                                  ...prev,
                                                  [zone.id]: !prev[zone.id],
                                                }))
                                              }
                                              className="w-full flex items-center justify-between text-left group/btn"
                                            >
                                              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <FaInfoCircle className="h-3.5 w-3.5 text-[#1e51ab]" />
                                                Conditions spécifiques
                                              </span>
                                              <FaChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                              {isExpanded && (
                                                <motion.div
                                                  initial={{ height: 0, opacity: 0 }}
                                                  animate={{ height: 'auto', opacity: 1 }}
                                                  exit={{ height: 0, opacity: 0 }}
                                                  className="overflow-hidden"
                                                >
                                                  <div className="mt-3 space-y-2">
                                                    {zone.conditions!.map((condition, index) => (
                                                      <div key={index} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                                                        <FaCheck className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <span className="leading-relaxed">{condition}</span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </div>
                                        )}

                                        {/* No conditions message */}
                                        {!hasConditions && (
                                          <div className="px-4 pb-4">
                                            <p className="text-xs text-gray-500 italic">Aucune condition spécifique</p>
                                          </div>
                                        )}
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                              <FaSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune zone trouvée</h4>
                              <p className="text-sm text-gray-600 mb-4">Aucune zone ne correspond à vos critères de recherche</p>
                              <button
                                onClick={() => {
                                  setZoneSearchQuery('');
                                  setZoneTypeFilter('all');
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#163d82] transition-colors"
                              >
                                <FaTimes className="h-4 w-4" />
                                Réinitialiser les filtres
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center text-gray-500 py-12">
                          <div className="w-full max-w-md mx-auto bg-white rounded-xl border border-blue-200 p-6 sm:p-8 shadow-lg">
                            <FaGlobe className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
                            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Aucune zone géographique spécifiée</h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Ce contrat ne spécifie pas de zones de couverture géographique.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabPanel>

              {/* Obligations */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <FaClipboardList className="text-blue-600 mr-3" />
                        Obligations
                      </h3>

                      {contract.obligations && contract.obligations.length > 0 ? (
                        (() => {
                          // Group obligations by type
                          const groupedObligations = contract.obligations.reduce(
                            (groups, obligation) => {
                              const type = obligation.type;
                              if (!groups[type]) {
                                groups[type] = [];
                              }
                              groups[type].push(obligation);
                              return groups;
                            },
                            {} as Record<string, typeof contract.obligations>
                          );

                          // Render grouped obligations with accordion
                          return Object.entries(groupedObligations).map(([type, obligations]) => {
                            const isExpanded = expandedObligations[type] || false;

                            return (
                              <div key={type} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                {/* Header - Always visible */}
                                <button onClick={() => toggleObligationExpansion(type)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <FaClipboardList className="text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                      <h4 className="font-semibold text-gray-900">{getObligationTypeLabel(type as ObligationType)}</h4>
                                      <p className="text-sm text-gray-500">
                                        {obligations.length} obligation{obligations.length > 1 ? 's' : ''}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">{obligations.length}</span>
                                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                  </div>
                                </button>

                                {/* Content - Expandable */}
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                      <div className="p-4 pt-0 border-t border-gray-100">
                                        <ul className="space-y-3">
                                          {obligations.map((obligation) => (
                                            <li key={obligation.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                              <FaCheck className="text-blue-600 mt-1 flex-shrink-0" />
                                              <span className="text-gray-900">{obligation.description}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          });
                        })()
                      ) : (
                        <div className="text-center text-gray-500 py-8">Aucune obligation spécifiée</div>
                      )}
                    </div>
                  )}
                </div>
              </TabPanel>

              {/* Résiliation */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-8 rounded-2xl border border-yellow-100">
                      <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                        <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 mr-2 sm:mr-3" />
                        Questions fréquentes sur la résiliation
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        {contract.cancellations && contract.cancellations.length > 0 ? (
                          contract.cancellations.map((termination) => (
                            <Disclosure key={termination.id}>
                              {({ open }) => (
                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                  <Disclosure.Button className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="font-medium text-sm sm:text-base text-gray-900">{termination.question}</span>
                                      {open ? <FaChevronUp className="text-gray-400 flex-shrink-0" /> : <FaChevronDown className="text-gray-400 flex-shrink-0" />}
                                    </div>
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="p-3 sm:p-4 pt-0 border-t border-gray-100">
                                    <div className="prose prose-sm max-w-none text-sm sm:text-base text-gray-700 leading-relaxed">
                                      <ReactMarkdown>{termination.response}</ReactMarkdown>
                                    </div>
                                  </Disclosure.Panel>
                                </div>
                              )}
                            </Disclosure>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            <FaExclamationTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p>Aucune information de résiliation disponible</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>

              {/* Contacts */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : (
                    <>
                      <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 flex items-center">
                        <FaPhone className="h-5 w-5 sm:h-6 sm:w-6 text-[#1e51ab] mr-2 sm:mr-3" />
                        Qui contacter
                      </h3>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {contract.contacts && contract.contacts.length > 0 ? (
                          contract.contacts.map((contact) => (
                            <div key={contact.id} className="bg-blue-50 p-4 sm:p-6 rounded-2xl border border-blue-100">
                              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                                <FaClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                                {getContactTypeLabel(contact.type)}
                              </h4>
                              <div className="space-y-3 sm:space-y-4">
                                {contact.name && (
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{contact.name}</p>
                                  </div>
                                )}
                                {contact.phone && (
                                  <div className="flex items-center space-x-3">
                                    <FaPhone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <a href={`tel:${contact.phone}`} className="font-medium text-gray-900 text-sm sm:text-base hover:text-blue-600 transition-colors">
                                      {contact.phone}
                                    </a>
                                  </div>
                                )}
                                {contact.email && (
                                  <div className="flex items-center space-x-3">
                                    <FaEnvelope className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <a href={`mailto:${contact.email}`} className="font-medium text-gray-900 text-sm sm:text-base hover:text-blue-600 transition-colors">
                                      {contact.email}
                                    </a>
                                  </div>
                                )}
                                {contact.openingHours && (
                                  <div className="flex items-center space-x-3">
                                    <FaClock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <span className="font-medium text-gray-900 text-sm sm:text-base">{contact.openingHours}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center text-gray-500 py-8">Aucun contact disponible</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
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
