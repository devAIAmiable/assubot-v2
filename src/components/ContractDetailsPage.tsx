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
	FaTimes as FaTimesIcon,
} from 'react-icons/fa';
import { getStatusColor, getStatusLabel, getTypeIcon, getTypeLabel, isExpired } from '../utils/contract';
import { useNavigate, useParams } from 'react-router-dom';

import { Tab } from '@headlessui/react';
import { capitalizeFirst } from '../utils/text';
import { getInsurerLogo } from '../utils/insurerLogo';
import { useAppSelector } from '../store/hooks';
import { useState } from 'react';

function highlightKeywords(text: string) {
	const keywords = [
		'Modalité', 'Justificatif', 'Preuve', 'Effet', 'Délai', 'Prise d’effet', 'Contact',
		'Oui', 'Non', 'R :', 'Q :'
	];
	const regex = new RegExp(`(${keywords.map(k => k.replace(/([.*+?^=!:${}()|[\]\\])/g, "\\$1")).join('|')})`, 'g');
	const parts = text.split(regex);
	return parts.map((part, i) =>
		keywords.includes(part) ? <strong key={i}>{part}</strong> : part
	);
}

const ContractDetailsPage = () => {
	const { contractId } = useParams<{ contractId: string }>();
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);

	// Get contract from Redux store
	const { contracts } = useAppSelector((state) => state.contracts);
	const contract = contracts.find((c) => c.id === contractId);

	const isContractExpired = isExpired(contract!);

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
								{getInsurerLogo(contract.insurer) ? (
									<img
										src={getInsurerLogo(contract.insurer)}
										alt={contract.insurer}
										className="w-12 h-12 object-contain rounded bg-white border border-gray-100"
									/>
								) : (
									<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
										{(() => {
											const TypeIcon = getTypeIcon(contract.type);
											return <TypeIcon className="h-6 w-6 text-[#1e51ab]" />;
										})()}
									</div>
								)}
								<div>
									<h1 className="text-2xl font-bold text-gray-900">{contract.name}</h1>
									<p className="text-gray-600">
										{contract.insurer} - {getTypeLabel(contract.type)}
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
								{/* Mon contrat en un coup d'œil: full width */}
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
														{capitalizeFirst(contract.overview.planType)}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Début de contrat</span>
													<span className="font-semibold text-gray-900">
														{new Date(contract.overview.startDate).toLocaleDateString('fr-FR')}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Fin de contrat</span>
													<span className="font-semibold text-gray-900">
														{new Date(contract.overview.endDate).toLocaleDateString('fr-FR')}
													</span>
												</div>
											</div>
											<div className="space-y-4">
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Prime annuelle</span>
													<span className="font-semibold text-[#1e51ab]">
														{contract.overview.annualPremium}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Renouvellement tacite</span>
													<span className="font-semibold text-gray-900">
														{contract.overview.hasTacitRenewal ? 'Oui' : 'Non'}
													</span>
												</div>
												{contract.overview.hasTacitRenewal && (
													<div className="flex items-center justify-between py-3">
														<span className="text-gray-600 font-medium">
														Date limite
														</span>
														<span className="font-semibold text-gray-900">
															{new Date(contract.overview.tacitRenewalDeadline).toLocaleDateString('fr-FR')}
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
												{contract.overview.subscribedCoverages.map((garantie, index) => (
													<div
														key={index}
														className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100"
													>
														<FaCheck className="h-5 w-5 text-green-600" />
														<span className="font-medium text-gray-900">
															{capitalizeFirst(garantie)}
														</span>
													</div>
												))}
											</div>
										</div>
									</div>
									{/* Sidebar (1/3) */}
									<div className="space-y-6">
										{/* Documents */}
										<div className="bg-white border border-gray-200 rounded-2xl p-6">
											<h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
											<div className="space-y-3">
												{/* Conditions Générales */}
												<div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
													<div className="flex items-center space-x-3">
														<FaFileAlt className="h-5 w-5 text-blue-600" />
														<div>
															<p className="text-sm font-medium text-gray-900">
																{contract.documents.generalConditions.name}
															</p>
															<p className="text-xs text-gray-500">
																Ajouté le {contract.documents.generalConditions.uploadDate}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-3">
														<a
															href={contract.documents.generalConditions.url}
															target="_blank"
															rel="noopener noreferrer"
															className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium"
														>
															<FaEye className="h-4 w-4" />
														</a>
														<a
															href={contract.documents.generalConditions.url}
															download={contract.documents.generalConditions.name}
															className="text-gray-500 hover:text-[#1e51ab] text-sm font-medium"
															title="Télécharger"
														>
															<FaDownload className="inline h-4 w-4" />
														</a>
													</div>
												</div>
												{/* Conditions Particulières */}
												<div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
													<div className="flex items-center space-x-3">
														<FaFileAlt className="h-5 w-5 text-green-600" />
														<div>
															<p className="text-sm font-medium text-gray-900">
																{contract.documents.particularConditions.name}
															</p>
															<p className="text-xs text-gray-500">
																Ajouté le {contract.documents.particularConditions.uploadDate}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-6">
														<a
															href={contract.documents.particularConditions.url}
															target="_blank"
															rel="noopener noreferrer"
															className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium"
														>
															<FaEye className="h-4 w-4" />
														</a>
														<a
															href={contract.documents.particularConditions.url}
															download={contract.documents.particularConditions.name}
															className="text-gray-500 hover:text-[#1e51ab] text-sm font-medium"
															title="Télécharger"
														>
															<FaDownload className="inline h-4 w-4" />
														</a>
													</div>
												</div>
												{/* Autres Documents */}
												{contract.documents.otherDocs &&
													contract.documents.otherDocs.map((doc, index) => (
														<div
															key={index}
															className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
														>
															<div className="flex items-center space-x-6">
																<FaFileAlt className="h-5 w-5 text-gray-400" />
																<div>
																	<p className="text-sm font-medium text-gray-900">{doc.name}</p>
																	<p className="text-xs text-gray-500">
																		Ajouté le {doc.uploadDate}
																	</p>
																</div>
															</div>
															<div className="flex items-center space-x-6">
																<a
																	href={doc.url}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium"
																>
																	<FaEye className="h-4 w-4" />
																</a>
																<a
																	href={doc.url}
																	download={doc.name}
																	className="text-gray-500 hover:text-[#1e51ab] text-sm font-medium"
																	title="Télécharger"
																>
																	<FaDownload className="inline h-4 w-4" />
																</a>
															</div>
														</div>
													))}
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
									{contract.coverages.map((garantie, index) => (
										<div key={index} className="bg-white border border-gray-200 rounded-2xl p-8">
											<h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
												<FaShieldAlt className="h-6 w-6 text-[#1e51ab] mr-3" />
												{capitalizeFirst(garantie.name)}
											</h3>

											{/* Détails des prestations */}
											{garantie.details && garantie.details.length > 0 && (
												<div className="mb-8">
													<h4 className="text-xl font-semibold text-gray-900 mb-6">
														Détails des prestations
													</h4>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														{garantie.details.map((detail, detailIndex) => (
															<div
																key={detailIndex}
																className="bg-gray-50 p-6 rounded-xl border border-gray-200"
															>
																<h5 className="text-lg font-semibold text-gray-900 mb-4">
																	{capitalizeFirst(detail.service)}
																</h5>
																<div className="grid grid-cols-2 gap-4">
																	<div>
																		<span className="text-gray-600 text-sm">Plafond</span>
																		<p className="font-semibold text-gray-900">
																			{capitalizeFirst(detail.limit)}
																		</p>
																	</div>
																	<div>
																		<span className="text-gray-600 text-sm">Franchise</span>
																		<p className="font-semibold text-gray-900">
																			{capitalizeFirst(detail.deductible)}
																		</p>
																	</div>
																	<div className="col-span-2">
																		<span className="text-gray-600 text-sm">Limite</span>
																		<p className="font-semibold text-gray-900">
																			{capitalizeFirst(detail.restrictions)}
																		</p>
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											{/* Non couvert */}
											{garantie.details && garantie.details.some(detail => detail.excludedItems && detail.excludedItems.length > 0) && (
												<div className="mb-8">
													<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
														Non couvert
													</h4>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														{garantie.details.map((detail, detailIndex) =>
															detail.excludedItems && detail.excludedItems.length > 0
																? detail.excludedItems.map((item: string, index: number) => (
																	<div
																		key={`${detailIndex}-${index}`}
																		className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-100"
																	>
																		<FaTimesIcon className="h-5 w-5 text-red-600" />
																		<span className="font-medium text-gray-900">
																			{capitalizeFirst(item)}
																		</span>
																	</div>
																))
																: null
														)}
													</div>
												</div>
											)}

											{/* Ce qui est couvert */}
											{garantie.details && garantie.details.some(detail => detail.coveredItems && detail.coveredItems.length > 0) && (
												<div className="mb-8">
													<h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
														Ce qui est couvert
													</h4>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														{garantie.details.map((detail, detailIndex) =>
															detail.coveredItems && detail.coveredItems.length > 0
																? detail.coveredItems.map((item: string, index: number) => (
																	<div
																		key={`${detailIndex}-${index}`}
																		className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100"
																	>
																		<FaCheck className="h-5 w-5 text-green-600" />
																		<span className="font-medium text-gray-900">
																			{capitalizeFirst(item)}
																		</span>
																	</div>
																))
																: null
														)}
													</div>
												</div>
											)}
										</div>
									))}
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
										{contract.generalExclusions.map((exclusion, index) => (
											<div
												key={index}
												className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-red-100"
											>
												<span className="text-gray-900 font-medium">
													{capitalizeFirst(exclusion)}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</Tab.Panel>

						{/* Zone géographique (new tab) */}
						<Tab.Panel className="p-6">
							<div className="max-w-7xl mx-auto">
								<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
									<h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
										<FaGlobe className="h-6 w-6 text-blue-600 mr-3" />
										Zone de couverture géographique
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{contract.geographicCoverage.countries.map((pays, index) => (
											<div
												key={index}
												className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center"
											>
												<span className="font-medium text-gray-900">{capitalizeFirst(pays)}</span>
											</div>
										))}
									</div>
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
									<div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
										<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaClipboardList className="h-5 w-5 text-blue-600 mr-2" />
											Souscription
										</h4>
										<ul className="list-disc list-inside space-y-2">
											{contract.obligations.atSubscription.map((item: string, idx: number) => (
												<li key={idx} className="text-gray-900 text-base">{capitalizeFirst(item)}</li>
											))}
										</ul>
									</div>
									<div className="bg-green-50 p-8 rounded-2xl border border-green-100">
										<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaClipboardList className="h-5 w-5 text-green-600 mr-2" />
											Pendant le contrat
										</h4>
										<ul className="list-disc list-inside space-y-2">
											{contract.obligations.duringContract.map((item: string, idx: number) => (
												<li key={idx} className="text-gray-900 text-base">{capitalizeFirst(item)}</li>
											))}
										</ul>
									</div>
									<div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-100">
										<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaClipboardList className="h-5 w-5 text-yellow-600 mr-2" />
											En cas de sinistre
										</h4>
										<ul className="list-disc list-inside space-y-2">
											{contract.obligations.inCaseOfClaim.map((item: string, idx: number) => (
												<li key={idx} className="text-gray-900 text-base">{capitalizeFirst(item)}</li>
											))}
										</ul>
									</div>
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
										{contract.cancellation.map((qa, idx) => (
											<div key={idx} className="bg-white p-6 rounded-xl border border-yellow-200">
												<h4 className="text-xl font-semibold text-gray-900 mb-2">{qa.question}</h4>
												{/* Improved Q&A formatting */}
												{(() => {
													// Split answer into lines
													const lines: string[] = qa.answer.split('\n').map(l => l.trim()).filter(Boolean);
													// Detect if this answer contains a numbered list (e.g., '1- ...')
													const numberedListIndices: number[] = lines
														.map((line: string, i: number) => (/^\d+- /.test(line) ? i : -1))
														.filter((i: number) => i !== -1);
													if (numberedListIndices.length > 0) {
														// Find the intro (before the list)
														const intro: string[] = lines.slice(0, numberedListIndices[0]);
														// Group list items and their sub-lines
														type Item = { main: string; sub: string[] };
														const items: Item[] = [];
														let currentItem: Item | null = null;
														lines.slice(numberedListIndices[0]).forEach((line: string) => {
															if (/^\d+- /.test(line)) {
																if (currentItem) items.push(currentItem);
																currentItem = { main: line.replace(/^\d+- /, ''), sub: [] };
															} else if (currentItem) {
																currentItem.sub.push(line);
															}
														});
														if (currentItem) items.push(currentItem);
														return (
															<div className="space-y-2">
																{intro.map((line: string, i: number) => (
																	<p key={i} className="text-gray-900 text-lg">
																		{highlightKeywords(line)}
																	</p>
																))}
																<ul className="list-decimal list-inside ml-4 space-y-2">
																	{items.map((item: Item, i: number) => (
																		<li key={i} className="text-gray-900 text-lg">
																			{highlightKeywords(item.main)}
																			{item.sub.length > 0 && (
																				<ul className="ml-4 list-none space-y-1">
																					{item.sub.map((sub: string, j: number) => (
																						<li key={j} className="text-gray-900 text-base">
																							{highlightKeywords(sub)}
																						</li>
																					))}
																				</ul>
																			)}
																		</li>
																	))}
																</ul>
															</div>
														);
													} else {
														// No numbered list, just paragraphs
														return lines.map((line: string, i: number) => (
															<p key={i} className="text-gray-900 text-lg">
																{highlightKeywords(line)}
															</p>
														));
													}
												})()}
											</div>
										))}
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
									{/* Gestion contrat */}
									<div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
										<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaClipboardList className="h-5 w-5 text-blue-600 mr-2" />
											Gestion contrat
										</h4>
										<div className="space-y-4">
											<div>
												<span className="text-gray-600 text-sm">Nom</span>
												<p className="font-semibold text-gray-900">
													{capitalizeFirst(contract.contacts.contractManagement.name)}
												</p>
											</div>
											<div className="flex items-center space-x-3">
												<FaPhone className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">
													{capitalizeFirst(contract.contacts.contractManagement.phone)}
												</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaEnvelope className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">
													{capitalizeFirst(contract.contacts.contractManagement.email)}
												</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaClock className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">
													{capitalizeFirst(contract.contacts.contractManagement.hours)}
												</span>
											</div>
										</div>
									</div>

									{/* Assistance */}
									<div className="bg-green-50 p-8 rounded-2xl border border-green-100">
										<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaShieldAlt className="h-5 w-5 text-green-600 mr-2" />
											Assistance
										</h4>
										<div className="space-y-4">
											<div>
												<span className="text-gray-600 text-sm">Nom</span>
												<p className="font-semibold text-gray-900">
													{capitalizeFirst(contract.contacts.assistance.name)}
												</p>
											</div>
											<div className="flex items-center space-x-3">
												<FaPhone className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">
													{capitalizeFirst(contract.contacts.assistance.phone)}
												</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaEnvelope className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">
													{capitalizeFirst(contract.contacts.assistance.email)}
												</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaClock className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">
													{capitalizeFirst(contract.contacts.assistance.availability)}
												</span>
											</div>
										</div>
									</div>

									{/* Urgences */}
									<div className="bg-red-50 p-8 rounded-2xl border border-red-100">
										<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaExclamationTriangle className="h-5 w-5 text-red-600 mr-2" />
											Urgences
										</h4>
										<div className="space-y-4">
											<div>
												<span className="text-gray-600 text-sm">Nom</span>
												<p className="font-semibold text-gray-900">
													{capitalizeFirst(contract.contacts.emergency.name)}
												</p>
											</div>
											<div className="flex items-center space-x-3">
												<FaPhone className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">
													{capitalizeFirst(contract.contacts.emergency.phone)}
												</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaEnvelope className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">
													{capitalizeFirst(contract.contacts.emergency.email)}
												</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaClock className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">
													{capitalizeFirst(contract.contacts.emergency.availability)}
												</span>
											</div>
										</div>
									</div>
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
