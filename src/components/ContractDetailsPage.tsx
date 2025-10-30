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
  FaEye,
  FaFileAlt,
  FaFilePdf,
  FaFilter,
  FaFlag,
  FaGlobe,
  FaInfoCircle,
  FaMagic,
  FaMapMarkedAlt,
  FaPhone,
  FaSearch,
  FaShieldAlt,
  FaTimes,
} from 'react-icons/fa';
import { formatDateForDisplayFR, getDisplayValue } from '../utils/dateHelpers';
import { getContactTypeLabel, getObligationTypeLabel, getStatusColor, getStatusLabel, getTypeIcon, getTypeLabel } from '../utils/contract';
import { getContractListItemInsurer, getContractListItemType } from '../utils/contractAdapters';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Avatar from './ui/Avatar';
import ContractSummarizationStatus from './ui/ContractSummarizationStatus';
import EditContractModal from './EditContractModal';
import GuaranteeDetailModal from './contract/GuaranteeDetailModal';
import InsufficientCreditsModal from './ui/InsufficientCreditsModal';
import ReactMarkdown from 'react-markdown';
import SummarizeConfirmationModal from './ui/SummarizeConfirmationModal';
import { capitalizeFirst } from '../utils/text';
import { getInsurerLogo } from '../utils/insurerLogo';
import { selectIsContractProcessing } from '../store/contractProcessingSlice';
// No transformation needed - using backend data directly
import { useAppSelector } from '../store/hooks';
import { useContractDownload } from '../hooks/useContractDownload';
import { useContractSummarize } from '../hooks/useContractSummarize';
import { useGetContractByIdQuery } from '../store/contractsApi';

function getZoneCoordinates(zoneLabel: string): [number, number] | null {
  const zoneMap: Record<string, [number, number]> = {
    // Europe
    europe: [10, 50],
    france: [2, 46],
    allemagne: [10, 51],
    espagne: [-3, 40],
    italie: [12, 42],
    'royaume-uni': [-2, 54],
    suisse: [8, 47],
    belgique: [4, 50],
    'pays-bas': [5, 52],
    luxembourg: [6, 50],
    autriche: [14, 47],
    pologne: [19, 52],
    'republique-tcheque': [15, 50],
    slovaquie: [19, 48],
    hongrie: [19, 47],
    roumanie: [25, 46],
    bulgarie: [25, 43],
    grece: [22, 39],
    portugal: [-8, 39],
    irlande: [-8, 53],
    danemark: [10, 56],
    suede: [18, 62],
    norvege: [8, 62],
    finlande: [26, 64],
    estonie: [26, 59],
    lettonie: [25, 57],
    lituanie: [24, 55],
    slovenie: [15, 46],
    croatie: [16, 45],
    serbie: [21, 44],
    montenegro: [19, 42],
    albanie: [20, 41],
    macedoine: [22, 42],
    'bosnie-herzegovine': [18, 44],
    malte: [14, 36],
    chypre: [33, 35],
    islande: [-18, 65],

    // Amérique du Nord
    'amerique-du-nord': [-100, 45],
    'etats-unis': [-98, 39],
    canada: [-96, 56],
    mexique: [-102, 23],
    alaska: [-150, 64],
    californie: [-120, 37],
    texas: [-100, 31],
    floride: [-81, 27],
    'new-york': [-75, 43],
    quebec: [-71, 52],
    ontario: [-79, 50],
    'colombie-britannique': [-125, 53],

    // Amérique du Sud
    'amerique-du-sud': [-60, -15],
    bresil: [-55, -15],
    argentine: [-64, -34],
    chili: [-71, -30],
    perou: [-75, -10],
    colombie: [-74, 4],
    venezuela: [-66, 6],
    equateur: [-78, -2],
    bolivie: [-65, -17],
    paraguay: [-58, -23],
    uruguay: [-56, -33],
    guyane: [-59, 5],
    suriname: [-56, 4],
    'guyane-francaise': [-53, 4],

    // Afrique
    afrique: [20, 0],
    'afrique-du-nord': [3, 30],
    'afrique-de-l-ouest': [-10, 10],
    'afrique-centrale': [20, 0],
    'afrique-de-l-est': [35, 0],
    'afrique-du-sud': [25, -30],
    maroc: [-7, 32],
    algerie: [3, 28],
    tunisie: [9, 34],
    libye: [17, 27],
    egypte: [30, 27],
    senegal: [-14, 14],
    mali: [-3, 17],
    niger: [8, 17],
    tchad: [19, 15],
    soudan: [30, 15],
    ethiopie: [40, 8],
    kenya: [38, 0],
    tanzanie: [35, -6],
    zambie: [27, -15],
    zimbabwe: [29, -20],
    botswana: [24, -22],
    namibie: [17, -22],
    angola: [18, -12],
    congo: [15, -1],
    rdc: [23, -3],
    cameroun: [12, 6],
    nigeria: [8, 10],
    ghana: [-1, 8],
    'cote-d-ivoire': [-5, 8],
    guinee: [-10, 10],
    'sierra-leone': [-12, 8],
    liberia: [-9, 6],
    gambie: [-16, 13],
    'guinee-bissau': [-15, 12],
    'cap-vert': [-24, 16],
    mauritanie: [-12, 20],
    'burkina-faso': [-2, 12],
    benin: [2, 9],
    togo: [1, 8],
    gabon: [12, -1],
    'guinee-equatoriale': [10, 2],
    'sao-tome-et-principe': [7, 1],
    comores: [44, -12],
    seychelles: [55, -5],
    maurice: [58, -20],
    madagascar: [47, -20],
    mayotte: [45, -13],
    reunion: [56, -21],

    // Asie
    asie: [100, 40],
    'asie-de-l-est': [120, 35],
    'asie-du-sud': [80, 20],
    'asie-du-sud-est': [105, 10],
    'asie-centrale': [70, 45],
    chine: [105, 35],
    japon: [138, 36],
    'coree-du-sud': [128, 36],
    'coree-du-nord': [127, 40],
    mongolie: [105, 46],
    inde: [78, 20],
    pakistan: [70, 30],
    afghanistan: [67, 33],
    iran: [53, 32],
    irak: [44, 33],
    'arabie-saoudite': [45, 24],
    yemen: [48, 15],
    oman: [57, 21],
    'emirats-arabes-unis': [54, 24],
    qatar: [51, 25],
    kuwait: [47, 29],
    bahrein: [50, 26],
    jordanie: [36, 31],
    syrie: [39, 35],
    liban: [36, 34],
    israel: [35, 31],
    palestine: [35, 32],
    turquie: [35, 39],
    georgie: [43, 42],
    armenie: [45, 40],
    azerbaidjan: [47, 40],
    kazakhstan: [68, 48],
    ouzbekistan: [64, 41],
    turkmenistan: [59, 40],
    kirghizistan: [75, 41],
    tadjikistan: [71, 39],
    vietnam: [106, 16],
    laos: [103, 18],
    cambodge: [104, 13],
    thailande: [101, 13],
    myanmar: [96, 22],
    malaisie: [102, 3],
    singapour: [104, 1],
    brunei: [115, 4],
    indonesie: [120, -2],
    philippines: [122, 13],
    taiwan: [121, 24],
    'hong-kong': [114, 22],
    macao: [113, 22],
    'sri-lanka': [81, 7],
    maldives: [73, 3],
    nepal: [84, 28],
    bhoutan: [90, 27],
    bangladesh: [90, 24],
    // Océanie
    oceanie: [135, -25],
    australie: [135, -25],
    'nouvelle-zelande': [174, -41],
    'papouasie-nouvelle-guinee': [145, -6],
    fidji: [178, -18],
    samoa: [-172, -14],
    tonga: [-175, -21],
    vanuatu: [167, -16],
    'nouvelle-caledonie': [166, -21],
    'polynesie-francaise': [-150, -17],

    // Régions générales
    monde: [0, 20],
    'hemisphere-nord': [0, 45],
    'hemisphere-sud': [0, -45],
    'zone-euro': [10, 50],
    schengen: [10, 50],
    'union-europeenne': [10, 50],
    ue: [10, 50],
    mediterranee: [18, 35],
    atlantique: [-30, 30],
    pacifique: [180, 0],
    indien: [80, -20],
  };

  const normalizedLabel = zoneLabel
    .toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ûüù]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return zoneMap[normalizedLabel] || null;
}

const ContractDetailsPage = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGuarantee, setSelectedGuarantee] = useState<BackendContractGuarantee | null>(null);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);
  const [expandedObligations, setExpandedObligations] = useState<Record<string, boolean>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Search and filter state for zones and exclusions
  const [zoneSearchQuery, setZoneSearchQuery] = useState('');
  const [zoneTypeFilter, setZoneTypeFilter] = useState<string>('all');
  const [exclusionSearchQuery, setExclusionSearchQuery] = useState('');
  const [expandedExclusions, setExpandedExclusions] = useState<Record<string, boolean>>({});
  const [expandedZones, setExpandedZones] = useState<Record<string, boolean>>({});

  // Get contract details using RTK Query directly to access refetch
  const {
    data: contract,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetContractByIdQuery(contractId!, {
    skip: !contractId,
  });

  // Listen for contract processing events to trigger refetch
  // Using a custom event on window to avoid duplicate socket listeners
  useEffect(() => {
    const handleContractProcessed = (event: Event) => {
      const customEvent = event as CustomEvent<{ contractId: string; status: string }>;
      const data = customEvent.detail;

      // Refetch contract when this specific contract is processed successfully
      if (data.contractId === contractId && data.status === 'success') {
        console.log('🔄 Refetching contract after successful processing...');
        refetch();
      }
    };

    // Listen to custom window event instead of direct socket subscription
    window.addEventListener('contract_summarized', handleContractProcessed as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('contract_summarized', handleContractProcessed as EventListener);
    };
  }, [contractId, refetch]);

  // Contract download functionality
  const { generateDownloadUrls, isGenerating } = useContractDownload();

  // Contract summarize functionality
  const { summarizeContract, isSummarizing, insufficientCredits } = useContractSummarize();

  // Check if this contract is currently processing (from Redux)
  const isProcessing = useAppSelector((state) => selectIsContractProcessing(state, contractId || ''));

  // Get current user for credit balance
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const isContractExpired = contract ? (contract.endDate ? new Date(contract.endDate) < new Date() : false) : false;

  // Scroll to top when component mounts or contractId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [contractId]);

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
          <button onClick={() => navigate('/app/contrats')} className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors">
            Retour aux contrats
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
          <button onClick={() => navigate('/app/contrats')} className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors">
            Retour aux contrats
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { name: "Vue d'ensemble", icon: FaEye },
    { name: 'Garanties', icon: FaShieldAlt },
    { name: 'Exclusions', icon: FaExclamationTriangle },
    { name: 'Zone géographique', icon: FaGlobe },
    { name: 'Obligations', icon: FaClipboardList },
    { name: 'Résiliation', icon: FaTimes },
    { name: 'Contacts', icon: FaPhone },
  ];

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    // Optionally refresh the contract data or show success message
  };

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

  const handleClose = () => {
    navigate('/app/contrats');
  };

  // Use contract data directly for the edit modal (no transformation needed)
  const contractForEdit = contract;

  const handleDownload = async (type: DocumentType) => {
    if (!contractId) return;

    try {
      // generateDownloadUrls generates links for all documents but we only need to open the one we clicked on
      const downloadDocuments = await generateDownloadUrls(contractId);
      const docDownload = downloadDocuments.find((d) => (d.type as unknown as DocumentType) === type);
      if (docDownload) {
        window.open(docDownload.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to download contract documents:', error);
      // You could add a toast notification here
    }
  };

  const handleSummarize = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSummarize = async () => {
    if (!contractId) return;
    setIsConfirmModalOpen(false);

    try {
      await summarizeContract(contractId);
      // Success - could show a toast notification here
    } catch (error) {
      console.error('Failed to summarize contract:', error);
      // Error handling is done in the hook
    }
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  // Filter and toggle functions for zones and exclusions
  const filteredZones =
    contract?.zones?.filter((zone) => {
      const matchesSearch = zone.label.toLowerCase().includes(zoneSearchQuery.toLowerCase());
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

  const toggleZoneExpansion = (id: string) => {
    setExpandedZones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'country':
        return FaFlag;
      case 'zone':
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
      default:
        return 'Zone';
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
              <Avatar isAssistant size="xl" />
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
            <Avatar isAssistant />
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{isFailed ? 'Analyse échouée' : 'Analyse en attente'}</h4>
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

  // AI Disclaimer Component
  const AIDisclaimer = () => (
    <div className="mt-6 text-center">
      <div className="flex items-center justify-center">
        <div className="flex-shrink-0">
          <FaMagic className="h-4 w-4 text-[#1e51ab]" />
        </div>
        <div className="ml-2">
          <p className="text-sm text-gray-500">
            <span className="font-medium">
              Votre espace « Contrats » est confidentiel. L'extraction des informations repose sur une IA, veuillez vérifier les informations importantes.
            </span>
          </p>
        </div>
      </div>
    </div>
  );

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
                {contract?.insurer?.name ? (
                  <img
                    src={getInsurerLogo(getContractListItemInsurer(contract))}
                    alt={contract.insurer.name}
                    className="w-12 h-12 object-contain rounded bg-white border border-gray-100"
                  />
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
                    {getDisplayValue(contract.insurer?.name)} - {getTypeLabel(getContractListItemType(contract))}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Contract status badge */}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${isContractExpired ? 'bg-red-100 text-red-800' : getStatusColor(contract.status)}`}>
                {isContractExpired ? 'Expiré' : getStatusLabel(contract.status)}
              </span>

              {/* Summarization status */}
              <ContractSummarizationStatus summarizeStatus={contract?.summarizeStatus} className="px-3 py-1" />

              {/* Action buttons */}
              <div className="flex items-center space-x-1">
                {/* Summarize button - Only show when status is pending or failed */}
                {(contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'failed') && (
                  <div className="relative group">
                    <button
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSummarizing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div> : <FaFileAlt className="h-4 w-4" />}
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {isSummarizing ? 'Génération en cours...' : contract?.summarizeStatus === 'failed' ? 'Réessayer le résumé' : 'Générer le résumé'}
                    </div>
                  </div>
                )}

                {/* Edit button */}
                <div className="relative group">
                  <button onClick={handleEdit} className="p-2 text-gray-600 hover:text-[#1e51ab] transition-colors">
                    <FaEdit className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Modifier le contrat
                  </div>
                </div>
              </div>
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
              {/* Vue d'ensemble */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {/* Mon contrat en un coup d'œil */}
                  <div className="mb-6 sm:mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-8 rounded-2xl border border-blue-100">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                        <FaShieldAlt className="h-5 w-5 sm:h-6 sm:w-6 text-[#1e51ab] mr-2 sm:mr-3" />
                        Mon contrat en un coup d'œil
                        <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b border-blue-200">
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Bien(s)/Bénéficiaire(s)</span>
                            <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.subject}</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-blue-200">
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Formule</span>
                            <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.formula ? capitalizeFirst(contract.formula) : 'Non spécifiée'}</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-blue-200">
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Prime annuelle</span>
                            <span className="text-sm sm:text-base font-semibold text-[#1e51ab]">{(contract.annualPremiumCents / 100).toFixed(2)} €</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b border-blue-200">
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Renouvellement tacite</span>
                            <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.tacitRenewal ? 'Oui' : 'Non'}</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-blue-200">
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Début de contrat</span>
                            <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.startDate ? formatDateForDisplayFR(contract.startDate) : '-'}</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-blue-200">
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Fin de contrat</span>
                            <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.endDate ? formatDateForDisplayFR(contract.endDate) : '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Garanties souscrites + Sidebar */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Garanties souscrites (2/3) */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                          Garanties souscrites
                          <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          {contract.guarantees && contract.guarantees.length > 0 ? (
                            contract.guarantees.map((garantie) => (
                              <div key={garantie.id} className="flex items-center space-x-3 p-3 sm:p-4 bg-green-50 rounded-xl border border-green-100">
                                <FaCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                                <span className="font-medium text-gray-900 text-sm sm:text-base">{capitalizeFirst(garantie.title)}</span>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 text-center text-gray-500 py-4">Aucune garantie spécifiée</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar (1/3) */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Documents - Chat-style references */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Documents</h3>
                        <div className="space-y-2">
                          {contract.documents && contract.documents.length > 0 ? (
                            contract.documents.map((doc) => (
                              <div key={doc.id} className="bg-white border border-blue-100 rounded-lg">
                                <div className="flex items-center justify-between p-3 hover:bg-blue-50 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <FaFilePdf className="text-red-600 text-lg flex-shrink-0" />
                                    <div>
                                      <h4 className="text-sm sm:text-base font-medium text-gray-900">{doc.type}</h4>
                                      <p className="text-xs sm:text-sm text-gray-500">PDF Document</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDownload(doc.type as unknown as DocumentType)}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isGenerating ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> : <FaEye />}
                                    Ouvrir
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 py-4">Aucun document disponible</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <AIDisclaimer />
                </div>
              </TabPanel>

              {/* Garanties */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {/* Show pending/ongoing message if summarizeStatus is pending or ongoing */}
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : contract.guarantees && contract.guarantees.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Header with inline stats */}
                      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <FaShieldAlt className="text-blue-600" />
                          <span className="font-semibold text-gray-900">{contract.guarantees.length} garanties</span>
                          <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
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
                                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{guarantee.title}</h4>
                                    <p className="text-xs sm:text-sm text-gray-500">
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
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Aucune garantie spécifiée</h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          Ce contrat ne contient pas encore d'informations détaillées sur les garanties. Lancez l'analyse IA pour générer ces informations.
                        </p>
                      </div>
                    </div>
                  )}

                  <AIDisclaimer />
                </div>
              </TabPanel>

              {/* Exclusions */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {/* Show pending/ongoing message if summarizeStatus is pending or ongoing */}
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
                              <FaMagic className="h-4 w-4 text-blue-500 flex-shrink-0" title="Généré par IA" />
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

                  <AIDisclaimer />
                </div>
              </TabPanel>

              {/* Zone géographique */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {/* Show pending/ongoing message if summarizeStatus is pending or ongoing */}
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
                                  <FaMagic className="h-4 w-4 text-blue-500 flex-shrink-0" title="Généré par IA" />
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
                                              const countryName = geo.properties.name?.toLowerCase();
                                              const zoneName = zone.label.toLowerCase();

                                              // Direct name matching only
                                              return countryName === zoneName;
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
                                        const coordinates = getZoneCoordinates(zone.label);
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
                                                {capitalizeFirst(zone.label)}
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
                                        {/* Card Header */}
                                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                                          <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                              <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                  <ZoneIcon className="h-5 w-5 text-[#1e51ab]" />
                                                </div>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h5 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{capitalizeFirst(zone.label)}</h5>
                                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-white rounded-full text-xs font-medium text-[#1e51ab]">
                                                  {getZoneTypeLabel(zone.type)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Card Content */}
                                        {hasConditions && (
                                          <div className="p-4">
                                            <button onClick={() => toggleZoneExpansion(zone.id)} className="w-full flex items-center justify-between text-left group/btn">
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
                        <div className="text-center py-12">
                          <div className="w-full max-w-md mx-auto bg-white rounded-xl border border-blue-200 p-6 sm:p-8 shadow-lg">
                            <FaGlobe className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
                            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Aucune zone géographique spécifiée</h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                              Ce contrat ne spécifie pas de zones de couverture géographique. Contactez votre assureur pour plus d'informations sur les zones couvertes.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <AIDisclaimer />
                </div>
              </TabPanel>

              {/* Obligations */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {/* Show pending/ongoing message if summarizeStatus is pending or ongoing */}
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <FaClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
                        Mes obligations
                        <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
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
                                      <h4 className="text-sm sm:text-base font-semibold text-gray-900">{getObligationTypeLabel(type as ObligationType)}</h4>
                                      <p className="text-xs sm:text-sm text-gray-500">
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
                                              <span className="text-sm sm:text-base text-gray-900">{obligation.description}</span>
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
                        <div className="text-sm sm:text-base text-center text-gray-500 py-8">Aucune obligation spécifiée</div>
                      )}
                    </div>
                  )}

                  <AIDisclaimer />
                </div>
              </TabPanel>

              {/* Résiliation */}
              <TabPanel className="p-4 sm:p-6">
                <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
                  {/* Show pending/ongoing message if summarizeStatus is pending or ongoing */}
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-8 rounded-2xl border border-yellow-100">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                        <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 mr-2 sm:mr-3" />
                        Questions fréquentes sur la résiliation
                        <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
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
                          <div className="text-center py-8">
                            <FaExclamationTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-sm sm:text-base text-gray-500">Aucune information de résiliation disponible</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <AIDisclaimer />
                </div>
              </TabPanel>

              {/* Contacts */}
              <TabPanel className="p-6">
                <div className="max-w-7xl mx-auto">
                  {/* Show pending/ongoing message if summarizeStatus is pending or ongoing */}
                  {contract?.summarizeStatus === 'pending' || contract?.summarizeStatus === 'ongoing' ? (
                    <PendingSummarizationMessage />
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                        <FaPhone className="h-6 w-6 text-[#1e51ab] mr-3" />
                        Qui contacter
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contract.contacts && contract.contacts.length > 0 ? (
                          contract.contacts.map((contact) => (
                            <div key={contact.id} className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                              <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <FaClipboardList className="h-5 w-5 text-blue-600 mr-2" />
                                {getContactTypeLabel(contact.type)}
                              </h4>
                              <div className="space-y-4">
                                {contact.name && (
                                  <div>
                                    <p className="font-semibold text-gray-900">{contact.name}</p>
                                  </div>
                                )}
                                {contact.phone && (
                                  <div className="flex items-center space-x-3">
                                    <FaPhone className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-900">{contact.phone}</span>
                                  </div>
                                )}
                                {contact.email && (
                                  <div className="flex items-center space-x-3">
                                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-900">{contact.email}</span>
                                  </div>
                                )}
                                {contact.openingHours && (
                                  <div className="flex items-center space-x-3">
                                    <FaClock className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-900">{contact.openingHours}</span>
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

      {/* Mobile-only sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 z-50 safe-area-inset-bottom">
        <button
          onClick={handleSummarize}
          disabled={isSummarizing || contract?.summarizeStatus !== 'pending'}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Avatar isAssistant />
          <span className="text-sm font-medium">Résumer</span>
        </button>
        <button onClick={handleEdit} className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg">
          <FaEdit />
        </button>
        {contract?.documents && contract.documents.length > 0 && (
          <button
            onClick={() => handleDownload(contract.documents[0].type as unknown as DocumentType)}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaFileAlt />
          </button>
        )}
      </div>

      {/* Edit Contract Modal */}
      {contract && <EditContractModal contract={contractForEdit!} isOpen={isEditModalOpen} onClose={handleCloseEditModal} onSuccess={handleEditSuccess} />}

      {/* Guarantee Detail Modal */}
      {selectedGuarantee && <GuaranteeDetailModal isOpen={isGuaranteeModalOpen} onClose={handleCloseGuaranteeModal} guarantee={selectedGuarantee} />}

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        isOpen={insufficientCredits.isModalOpen}
        onClose={insufficientCredits.closeModal}
        operation={insufficientCredits.errorDetails.operation}
        requiredCredits={insufficientCredits.errorDetails.requiredCredits}
        currentCredits={insufficientCredits.currentCredits}
      />

      {/* Summarize Confirmation Modal */}
      <SummarizeConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmSummarize}
        currentCredits={currentUser?.creditBalance ?? 0}
        requiredCredits={5}
        isProcessing={isSummarizing}
      />
    </div>
  );
};

export default ContractDetailsPage;
