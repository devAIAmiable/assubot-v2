import {
	ComposableMap,
	Geographies,
	Geography,
	Graticule,
	Marker,
	ZoomableGroup,
} from 'react-simple-maps';
import {
	FaArrowLeft,
	FaCheck,
	FaClipboardList,
	FaClock,
	FaDownload,
	FaEdit,
	FaEnvelope,
	FaExclamationTriangle,
	FaEye,
	FaFileAlt,
	FaGlobe,
	FaPhone,
	FaPrint,
	FaShare,
	FaShieldAlt,
	FaTimes,
} from 'react-icons/fa';
import { formatDateForDisplayFR, getDisplayValue } from '../utils/dateHelpers';
import {
	getContactTypeLabel,
	getObligationTypeLabel,
	getStatusColor,
	getStatusLabel,
	getTypeIcon,
	getTypeLabel,
} from '../utils/contract';
import { useNavigate, useParams } from 'react-router-dom';

import type { ObligationType } from '../types';
import { Tab } from '@headlessui/react';
import { capitalizeFirst } from '../utils/text';
import { getInsurerLogo } from '../utils/insurerLogo';
import { useContractDetails } from '../hooks/useContractDetails';
import { useState } from 'react';

function highlightKeywords(text: string) {
	const keywords = [
		'Modalité',
		'Justificatif',
		'Preuve',
		'Effet',
		'Délai',
		"Prise d'effet",
		'Contact',
		'Oui',
		'Non',
		'R :',
		'Q :',
	];
	const regex = new RegExp(
		`(${keywords.map((k) => k.replace(/([.*+?^=!:${}()|[\]\\])/g, '\\$1')).join('|')})`,
		'g'
	);
	const parts = text.split(regex);
	return parts.map((part, i) => (keywords.includes(part) ? <strong key={i}>{part}</strong> : part));
}

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


	// Get contract details using the new hook
	const { contract, isLoading, isError, error } = useContractDetails({
		contractId: contractId!,
		enabled: !!contractId,
	});

	const isContractExpired = contract ? (contract.endDate ? new Date(contract.endDate) < new Date() : false) : false;

	// Show loading state
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab] mx-auto mb-4"></div>
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Chargement du contrat...</h1>
					<p className="text-gray-600">
						Veuillez patienter pendant que nous récupérons les détails.
					</p>
				</div>
			</div>
		);
	}

	// Show error state
	if (isError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-900 mb-4">Erreur lors du chargement</h1>
					<p className="text-red-600 mb-6">
						{error?.data?.message || 'Une erreur est survenue lors du chargement du contrat.'}
					</p>
					<button
						onClick={() => navigate('/app/contrats')}
						className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors"
					>
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
					<button
						onClick={() => navigate('/app/contrats')}
						className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors"
					>
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
		// Navigate to edit page or open edit modal
		// For now, we'll just go back to contracts list
		navigate('/app/contrats');
	};

	const handleClose = () => {
		navigate('/app/contrats');
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
				<div className="px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<button
								onClick={handleClose}
								className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<FaArrowLeft className="h-5 w-5" />
							</button>
							<div className="flex items-center space-x-3">
								{/* Insurer logo or type icon */}
								{getInsurerLogo(contract.insurerName!) ? (
									<img
										src={getInsurerLogo(contract.insurerName!)}
										alt={contract.insurerName!}
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
										{getDisplayValue(contract.insurerName)} - {getTypeLabel(contract.category)}
									</p>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${isContractExpired ? 'bg-red-100 text-red-800' : getStatusColor(contract.status)}`}
							>
								{isContractExpired ? 'Expiré' : getStatusLabel(contract.status)}
							</span>
							<div className="flex items-center space-x-2">
								<button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
									<FaDownload className="h-4 w-4" />
								</button>
								<button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
									<FaPrint className="h-4 w-4" />
								</button>
								<button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
									<FaShare className="h-4 w-4" />
								</button>
								<button
									onClick={handleEdit}
									className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg font-medium hover:bg-[#163d82] transition-colors flex items-center space-x-2"
								>
									<FaEdit className="h-4 w-4" />
									<span>Modifier</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs and Content */}
			<Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
				{/* Tabs */}
				<div className="px-6 border-b border-gray-200 bg-white">
					<Tab.List className="flex space-x-8">
						{tabs.map((tab, index) => (
							<Tab
								key={index}
								className={({ selected }) =>
									`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
										selected
											? 'border-[#1e51ab] text-[#1e51ab]'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`
								}
							>
								<tab.icon className="h-4 w-4" />
								<span>{tab.name}</span>
							</Tab>
						))}
					</Tab.List>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto">
					<Tab.Panels className="h-full">
						{/* Vue d'ensemble */}
						<Tab.Panel className="p-6">
							<div className="max-w-7xl mx-auto">
								{/* Mon contrat en un coup d'œil */}
								<div className="mb-8">
									<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
										<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaShieldAlt className="h-6 w-6 text-[#1e51ab] mr-3" />
											Mon contrat en un coup d'œil
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-4">
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Formule</span>
													<span className="font-semibold text-gray-900">
														{contract.formula ? capitalizeFirst(contract.formula) : 'Non spécifiée'}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Début de contrat</span>
													<span className="font-semibold text-gray-900">
														{contract.startDate ? formatDateForDisplayFR(contract.startDate.toISOString()) : '-'}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Fin de contrat</span>
													<span className="font-semibold text-gray-900">
														{contract.endDate ? formatDateForDisplayFR(contract.endDate.toISOString()) : '-'}
													</span>
												</div>
											</div>
											<div className="space-y-4">
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Prime annuelle</span>
													<span className="font-semibold text-[#1e51ab]">
														{(contract.annualPremiumCents / 100).toFixed(2)} €
													</span>
												</div>
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Renouvellement tacite</span>
													<span className="font-semibold text-gray-900">
														{contract.tacitRenewal ? 'Oui' : 'Non'}
													</span>
												</div>
												{contract.tacitRenewal && contract.cancellationDeadline && (
													<div className="flex items-center justify-between py-3">
														<span className="text-gray-600 font-medium">Date limite</span>
														<span className="font-semibold text-gray-900">
															{formatDateForDisplayFR(contract.cancellationDeadline.toISOString())}
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Garanties souscrites + Sidebar */}
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
									{/* Garanties souscrites (2/3) */}
									<div className="lg:col-span-2 space-y-6">
										<div className="bg-white border border-gray-200 rounded-2xl p-6">
											<h3 className="text-xl font-semibold text-gray-900 mb-6">
												Garanties souscrites
											</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												{contract.guarantees && contract.guarantees.length > 0 ? (
													contract.guarantees.map((garantie) => (
														<div
															key={garantie.id}
															className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100"
														>
															<FaCheck className="h-5 w-5 text-green-600" />
															<span className="font-medium text-gray-900">
																{capitalizeFirst(garantie.title)}
															</span>
														</div>
													))
												) : (
													<div className="col-span-2 text-center text-gray-500 py-4">
														Aucune garantie spécifiée
													</div>
												)}
											</div>
										</div>
									</div>

									{/* Sidebar (1/3) */}
									<div className="space-y-6">
										{/* Documents */}
										<div className="bg-white border border-gray-200 rounded-2xl p-6">
											<h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
											<div className="space-y-3">
												{contract.documents && contract.documents.length > 0 ? (
													contract.documents.map((doc) => (
														<div
															key={doc.id}
															className={`flex items-center justify-between p-3 rounded-xl border ${
																doc.type === 'CG' 
																	? 'bg-blue-50 border-blue-100' 
																	: doc.type === 'CP' 
																		? 'bg-green-50 border-green-100' 
																		: 'bg-gray-50 border-gray-100'
															}`}
														>
															<div className="flex items-center space-x-3">
																<FaFileAlt
																	className={`h-5 w-5 ${
																	doc.type === 'CG' 
																		? 'text-blue-600' 
																		: doc.type === 'CP' 
																			? 'text-green-600' 
																			: 'text-gray-400'
																	}`}
																/>
																<div>
																	<p className="text-sm font-medium text-gray-900">
																		Document {doc.type}
																	</p>
																	<p className="text-xs text-gray-500">
																		Ajouté le {formatDateForDisplayFR(doc.createdAt.toISOString())}
																	</p>
																</div>
															</div>
															<div className="flex items-center space-x-3">
																<a
																	href={doc.fileUrl}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium"
																>
																	<FaEye className="h-4 w-4" />
																</a>
																<a
																	href={doc.fileUrl}
																	download
																	className="text-gray-500 hover:text-[#1e51ab] text-sm font-medium"
																	title="Télécharger"
																>
																	<FaDownload className="inline h-4 w-4" />
																</a>
															</div>
														</div>
													))
												) : (
													<div className="text-center text-gray-500 py-4">
														Aucun document disponible
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</Tab.Panel>

						{/* Garanties */}
						<Tab.Panel className="p-6">
							<div className="max-w-7xl mx-auto">
								<div className="space-y-8">
									{contract.guarantees && contract.guarantees.length > 0 ? (
										contract.guarantees.map((garantie) => (
											<div
												key={garantie.id}
												className="bg-white border border-gray-200 rounded-2xl p-8"
											>
												<h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
													<FaShieldAlt className="h-6 w-6 text-[#1e51ab] mr-3" />
													{capitalizeFirst(garantie.title)}
												</h3>
												{garantie.details && (
													<div className="mb-6">
														<p className="text-gray-700">{garantie.details}</p>
													</div>
												)}
												{garantie.covered && (
													<div className="mb-6">
														<h4 className="text-lg font-semibold text-gray-900 mb-3">
															Ce qui est couvert
														</h4>
														<p className="text-gray-700">{garantie.covered}</p>
													</div>
												)}
												{garantie.notCovered && (
													<div className="mb-6">
														<h4 className="text-lg font-semibold text-gray-900 mb-3">
															Non couvert
														</h4>
														<p className="text-gray-700">{garantie.notCovered}</p>
													</div>
												)}
											</div>
										))
									) : (
										<div className="text-center text-gray-500 py-8">Aucune garantie disponible</div>
									)}
								</div>
							</div>
						</Tab.Panel>

						{/* Exclusions */}
						<Tab.Panel className="p-6">
							<div className="max-w-7xl mx-auto">
								<div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl border border-red-100">
									<h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
										<FaExclamationTriangle className="h-6 w-6 text-red-600 mr-3" />
										Exclusions générales
									</h3>
									<div className="space-y-4">
										{contract.exclusions && contract.exclusions.length > 0 ? (
											contract.exclusions.map((exclusion) => (
												<div
													key={exclusion.id}
													className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-red-100"
												>
													<span className="text-gray-900 font-medium">
														{capitalizeFirst(exclusion.description)}
													</span>
												</div>
											))
										) : (
											<div className="text-center text-gray-500 py-4">
												Aucune exclusion spécifiée
											</div>
										)}
									</div>
								</div>
							</div>
						</Tab.Panel>

						{/* Zone géographique */}
						<Tab.Panel className="p-6">
							<div className="max-w-7xl mx-auto">
								<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
										{contract.zones && contract.zones.length > 0 ? (
										<div className="space-y-8">
											{/* World Map */}
											<div className="">
												<h4 className="text-xl font-bold text-gray-900 mb-6">Zones couvertes</h4>
												<div className="w-full h-[600px] bg-white rounded-lg border border-blue-200 shadow-inner overflow-hidden">
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
																		const isHighlighted = contract.zones?.some(zone => {
																			const countryName = geo.properties.name?.toLowerCase();
																			const zoneName = zone.label.toLowerCase();
																			
																			// Direct name matching only
																			const isMatch = countryName === zoneName;
																			if (isMatch) {
																				console.log("🚀 ~ zone:", zoneName, countryName)
																			}
																			return isMatch;
																		});

																		if (isHighlighted) {
																			console.log("🚀 ~ geo:", geo)
																		}
																		
																		return (
																			<g key={geo.rsmKey} style={{ cursor: 'crosshair' }}>
																				<title>{geo.properties.name}</title>
																				<Geography
																					geography={geo}
																					fill={isHighlighted ? "#1e51ab" : "#cedaf0"}
																					stroke="#fff"
																					strokeWidth={1}
																					style={{
																						default: { outline: 'none' },
																						hover: {
																							fill: isHighlighted ? "#163d82" : "#e2e8f0",
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
															{contract.zones?.map((zone) => {
																const coordinates = getZoneCoordinates(zone.label);
																if (!coordinates) return null;
																
																return (
																	<Marker key={zone.id} coordinates={coordinates}>
																		<g>
																			{/* Background circle */}
																			<circle
																				r="2"
																				fill="#1e51ab"
																				stroke="#fff"
																				strokeWidth="1"
																			/>
																			{/* Zone label */}
																			<text
																				textAnchor="middle"
																				y="-15"
																				style={{
																					fontFamily: "system-ui",
																					fill: "#1e51ab",
																					fontSize: "12px",
																					fontWeight: "bold",
																					textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
																				}}
																			>
																				{zone.label}
																			</text>
																		</g>
																	</Marker>
																);
															})}
														</ZoomableGroup>
													</ComposableMap>
												</div>
												<div className="mt-4 text-sm text-gray-600 text-center">
													💡 Utilisez la molette de votre souris pour zoomer et dézoomer sur la
													carte
												</div>
											</div>

											{/* Zone List */}
											<div className="bg-white rounded-xl p-6 border border-blue-100">
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
													{contract.zones.map((zone) => (
												<div
													key={zone.id}
															className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center"
														>
															<span className="text-sm font-medium text-gray-700">
																{capitalizeFirst(zone.label)}
															</span>
														</div>
													))}
												</div>
											</div>
										</div>
										) : (
										<div className="text-center text-gray-500 py-12">
											<div className="w-full max-w-md mx-auto bg-white rounded-xl border border-blue-200 p-8 shadow-lg">
												<FaGlobe className="h-20 w-20 text-gray-300 mx-auto mb-6" />
												<h4 className="text-xl font-semibold text-gray-900 mb-3">
												Aucune zone géographique spécifiée
												</h4>
												<p className="text-gray-600 leading-relaxed">
													Ce contrat ne spécifie pas de zones de couverture géographique. Contactez
													votre assureur pour plus d'informations sur les zones couvertes.
												</p>
											</div>
											</div>
										)}
								</div>
							</div>
						</Tab.Panel>

						{/* Obligations */}
						<Tab.Panel className="p-6">
							<div className="max-w-7xl mx-auto">
								<h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
									<FaClipboardList className="h-6 w-6 text-[#1e51ab] mr-3" />
									Mes obligations
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

											// Render grouped obligations
											return Object.entries(groupedObligations).map(([type, obligations]) => (
												<div
													key={type}
													className="bg-blue-50 p-8 rounded-2xl border border-blue-100"
												>
												<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
													<FaClipboardList className="h-5 w-5 text-blue-600 mr-2" />
														{getObligationTypeLabel(type as ObligationType)}
												</h4>
													<ul className="space-y-3">
														{obligations.map((obligation) => (
															<li
																key={obligation.id}
																className="text-gray-900 text-base flex items-start"
															>
																<span className="text-blue-600 mr-2 mt-1">•</span>
																<span>{capitalizeFirst(obligation.description)}</span>
															</li>
														))}
													</ul>
											</div>
											));
										})()
									) : (
										<div className="col-span-full text-center text-gray-500 py-8">
											Aucune obligation spécifiée
										</div>
									)}
								</div>
							</div>
						</Tab.Panel>

						{/* Résiliation */}
						<Tab.Panel className="p-6">
							<div className="max-w-7xl mx-auto">
								<div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-100">
									<h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
										<FaExclamationTriangle className="h-6 w-6 text-yellow-600 mr-3" />
										Comment résilier mon contrat
									</h3>
									<div className="space-y-8">
										{contract.termination ? (
											<div className="bg-white p-6 rounded-xl border border-yellow-200">
												<h4 className="text-xl font-semibold text-gray-900 mb-2">
													{contract.termination.mode || 'Résiliation'}
												</h4>
												{contract.termination.details && (
													<div className="text-gray-900 text-lg">
														{highlightKeywords(contract.termination.details)}
													</div>
												)}
												{contract.termination.notice && (
													<div className="mt-4 p-4 bg-yellow-50 rounded-lg">
														<p className="text-yellow-800 font-medium">
															Délai de préavis : {contract.termination.notice}
														</p>
													</div>
												)}
											</div>
										) : (
											<div className="text-center text-gray-500 py-4">
												Aucune information de résiliation disponible
											</div>
										)}
									</div>
								</div>
							</div>
						</Tab.Panel>

						{/* Contacts */}
						<Tab.Panel className="p-6">
							<div className="max-w-7xl mx-auto">
								<h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
									<FaPhone className="h-6 w-6 text-[#1e51ab] mr-3" />
									Qui contacter
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
									{contract.contacts && contract.contacts.length > 0 ? (
										contract.contacts.map((contact) => (
											<div
												key={contact.id}
												className="bg-blue-50 p-8 rounded-2xl border border-blue-100"
											>
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
															<span className="font-medium text-gray-900">
																{contact.openingHours}
															</span>
														</div>
													)}
												</div>
											</div>
										))
									) : (
										<div className="col-span-full text-center text-gray-500 py-8">
											Aucun contact disponible
										</div>
									)}
								</div>
							</div>
						</Tab.Panel>
					</Tab.Panels>
				</div>
			</Tab.Group>
		</div>
	);
};

export default ContractDetailsPage;
