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
import { getStatusColor, getStatusLabel, getTypeIcon, getTypeLabel, isExpired } from '../utils/contract';
import { useNavigate, useParams } from 'react-router-dom';

import { Tab } from '@headlessui/react';
import { capitalizeFirst } from '../utils/text';
import { getInsurerLogo } from '../utils/insurerLogo';
import { useAppSelector } from '../store/hooks';
import { useState } from 'react';

function highlightKeywords(text: string) {
	const keywords = [
		'Modalité', 'Justificatif', 'Preuve', 'Effet', 'Délai', 'Prise d\'effet', 'Contact',
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
								{getInsurerLogo(contract.insurerName) ? (
									<img
										src={getInsurerLogo(contract.insurerName)}
										alt={contract.insurerName}
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
										{contract.insurerName} - {getTypeLabel(contract.category)}
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
														{new Date(contract.startDate).toLocaleDateString('fr-FR')}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 border-b border-blue-200">
													<span className="text-gray-600 font-medium">Fin de contrat</span>
													<span className="font-semibold text-gray-900">
														{new Date(contract.endDate).toLocaleDateString('fr-FR')}
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
														<span className="text-gray-600 font-medium">
														Date limite
														</span>
														<span className="font-semibold text-gray-900">
															{new Date(contract.cancellationDeadline).toLocaleDateString('fr-FR')}
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
																<FaFileAlt className={`h-5 w-5 ${
																	doc.type === 'CG' 
																		? 'text-blue-600' 
																		: doc.type === 'CP' 
																			? 'text-green-600' 
																			: 'text-gray-400'
																}`} />
																<div>
																	<p className="text-sm font-medium text-gray-900">
																		Document {doc.type}
																	</p>
																	<p className="text-xs text-gray-500">
																		Ajouté le {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
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
											<div key={garantie.id} className="bg-white border border-gray-200 rounded-2xl p-8">
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
														<h4 className="text-lg font-semibold text-gray-900 mb-3">Ce qui est couvert</h4>
														<p className="text-gray-700">{garantie.covered}</p>
													</div>
												)}
												{garantie.notCovered && (
													<div className="mb-6">
														<h4 className="text-lg font-semibold text-gray-900 mb-3">Non couvert</h4>
														<p className="text-gray-700">{garantie.notCovered}</p>
													</div>
												)}
											</div>
										))
									) : (
										<div className="text-center text-gray-500 py-8">
											Aucune garantie disponible
										</div>
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
									<h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
										<FaGlobe className="h-6 w-6 text-blue-600 mr-3" />
										Zone de couverture géographique
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{contract.zones && contract.zones.length > 0 ? (
											contract.zones.map((zone) => (
												<div
													key={zone.id}
													className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center"
												>
													<span className="font-medium text-gray-900">{capitalizeFirst(zone.label)}</span>
												</div>
											))
										) : (
											<div className="col-span-full text-center text-gray-500 py-4">
												Aucune zone géographique spécifiée
											</div>
										)}
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
									{contract.obligations && contract.obligations.length > 0 ? (
										contract.obligations.map((obligation) => (
											<div key={obligation.id} className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
												<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
													<FaClipboardList className="h-5 w-5 text-blue-600 mr-2" />
													{capitalizeFirst(obligation.type)}
												</h4>
												<p className="text-gray-900 text-base">{capitalizeFirst(obligation.description)}</p>
											</div>
										))
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
														<p className="text-yellow-800 font-medium">Délai de préavis : {contract.termination.notice}</p>
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
											<div key={contact.id} className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
												<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
													<FaClipboardList className="h-5 w-5 text-blue-600 mr-2" />
													{capitalizeFirst(contact.type)}
												</h4>
												<div className="space-y-4">
													{contact.name && (
														<div>
															<span className="text-gray-600 text-sm">Nom</span>
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
