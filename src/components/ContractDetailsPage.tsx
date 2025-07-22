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
	FaFileContract,
	FaGlobe,
	FaPhone,
	FaPrint,
	FaShare,
	FaShieldAlt,
	FaTimes,
	FaTimes as FaTimesIcon,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import type { Contract } from '../types';
import { Tab } from '@headlessui/react';
import { useAppSelector } from '../store/hooks';
import { useState } from 'react';

const ContractDetailsPage = () => {
	const { contractId } = useParams<{ contractId: string }>();
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);

	// Get contract from Redux store
	const { contracts } = useAppSelector((state) => state.contracts);
	const contract = contracts.find(c => c.id === contractId);

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

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'auto':
				return FaFileContract;
			case 'habitation':
				return FaFileContract;
			case 'sante':
				return FaFileAlt;
			default:
				return FaFileContract;
		}
	};

	const getTypeLabel = (type: string) => {
		switch (type) {
			case 'auto':
				return 'Automobile';
			case 'habitation':
				return 'Habitation';
			case 'sante':
				return 'Santé';
			case 'autre':
				return 'Autre';
			default:
				return 'Autre';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'expired':
				return 'bg-red-100 text-red-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'active':
				return 'Actif';
			case 'expired':
				return 'Expiré';
			case 'pending':
				return 'En attente';
			default:
				return 'Inconnu';
		}
	};

	const tabs = [
		{ name: 'Vue d\'ensemble', icon: FaEye },
		{ name: 'Garanties', icon: FaShieldAlt },
		{ name: 'Exclusions', icon: FaExclamationTriangle },
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
								<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
									{(() => {
										const TypeIcon = getTypeIcon(contract.type);
										return <TypeIcon className="h-6 w-6 text-[#1e51ab]" />;
									})()}
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900">
										{contract.name}
									</h1>
									<p className="text-gray-600">
										{getTypeLabel(contract.type)} - {contract.insurer}
									</p>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
								{getStatusLabel(contract.status)}
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
								key={tab.name}
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
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
									{/* Mon contrat en un coup d'œil */}
									<div className="lg:col-span-2 space-y-6">
										<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
											<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
												<FaShieldAlt className="h-6 w-6 text-[#1e51ab] mr-3" />
												Mon contrat en un coup d'œil
											</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div className="space-y-4">
													<div className="flex items-center justify-between py-3 border-b border-blue-200">
														<span className="text-gray-600 font-medium">Formule</span>
														<span className="font-semibold text-gray-900">{contract.overview.planType}</span>
													</div>
													<div className="flex items-center justify-between py-3 border-b border-blue-200">
														<span className="text-gray-600 font-medium">Début de contrat</span>
														<span className="font-semibold text-gray-900">{contract.overview.startDate}</span>
													</div>
													<div className="flex items-center justify-between py-3 border-b border-blue-200">
														<span className="text-gray-600 font-medium">Fin de contrat</span>
														<span className="font-semibold text-gray-900">{contract.overview.endDate}</span>
													</div>
												</div>
												<div className="space-y-4">
													<div className="flex items-center justify-between py-3 border-b border-blue-200">
														<span className="text-gray-600 font-medium">Prime annuelle</span>
														<span className="font-bold text-[#1e51ab] text-xl">{contract.overview.annualPremium}</span>
													</div>
													<div className="flex items-center justify-between py-3 border-b border-blue-200">
														<span className="text-gray-600 font-medium">Renouvellement tacite</span>
														<span className="font-semibold text-gray-900">
															{contract.overview.hasTacitRenewal ? 'Oui' : 'Non'}
														</span>
													</div>
													{contract.overview.hasTacitRenewal && (
														<div className="flex items-center justify-between py-3">
															<span className="text-gray-600 font-medium">Date limite de résiliation</span>
															<span className="font-semibold text-gray-900">{contract.overview.tacitRenewalDeadline}</span>
														</div>
													)}
												</div>
											</div>
										</div>

										<div className="bg-white border border-gray-200 rounded-2xl p-6">
											<h3 className="text-xl font-semibold text-gray-900 mb-6">Garanties souscrites</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												{contract.overview.subscribedCoverages.map((garantie, index) => (
													<div key={index} className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
														<FaCheck className="h-5 w-5 text-green-600" />
														<span className="font-medium text-gray-900">{garantie}</span>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Sidebar */}
									<div className="space-y-6">
										{/* Informations générales */}
										<div className="bg-white border border-gray-200 rounded-2xl p-6">
											<h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
											<div className="space-y-4">
												<div className="flex items-center justify-between py-3 border-b border-gray-100">
													<span className="text-gray-600">Statut</span>
													<span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
														{getStatusLabel(contract.status)}
													</span>
												</div>
												<div className="flex items-center justify-between py-3 border-b border-gray-100">
													<span className="text-gray-600">Prime mensuelle</span>
													<span className="font-semibold text-gray-900">{contract.premium.toFixed(2)}€</span>
												</div>
												{contract.coverageAmount && (
													<div className="flex items-center justify-between py-3 border-b border-gray-100">
														<span className="text-gray-600">Montant de couverture</span>
														<span className="font-semibold text-gray-900">{contract.coverageAmount.toLocaleString()}€</span>
													</div>
												)}
												{contract.deductible && (
													<div className="flex items-center justify-between py-3">
														<span className="text-gray-600">Franchise</span>
														<span className="font-semibold text-gray-900">{contract.deductible}€</span>
													</div>
												)}
											</div>
										</div>

																			{/* Documents */}
									<div className="bg-white border border-gray-200 rounded-2xl p-6">
										<h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
										<div className="space-y-3">
											{/* Conditions Générales */}
											<div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
												<div className="flex items-center space-x-3">
													<FaFileAlt className="h-5 w-5 text-blue-600" />
													<div>
														<p className="text-sm font-medium text-gray-900">{contract.documents.generalConditions.name}</p>
														<p className="text-xs text-gray-500">Ajouté le {contract.documents.generalConditions.uploadDate}</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Obligatoire</span>
													<a
														href={contract.documents.generalConditions.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium"
													>
														Voir
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
														<p className="text-sm font-medium text-gray-900">{contract.documents.particularConditions.name}</p>
														<p className="text-xs text-gray-500">Ajouté le {contract.documents.particularConditions.uploadDate}</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Obligatoire</span>
													<a
														href={contract.documents.particularConditions.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium"
													>
														Voir
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
											{contract.documents.otherDocs && contract.documents.otherDocs.map((doc, index) => (
												<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
													<div className="flex items-center space-x-3">
														<FaFileAlt className="h-5 w-5 text-gray-400" />
														<div>
															<p className="text-sm font-medium text-gray-900">{doc.name}</p>
															<p className="text-xs text-gray-500">Ajouté le {doc.uploadDate}</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Optionnel</span>
														<a
															href={doc.url}
															target="_blank"
															rel="noopener noreferrer"
															className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium"
														>
															Voir
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
												{garantie.name}
											</h3>
											
											{/* Détails des prestations */}
											{garantie.details && garantie.details.length > 0 && (
												<div className="mb-8">
													<h4 className="text-xl font-semibold text-gray-900 mb-6">Détails des prestations</h4>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														{garantie.details.map((detail, detailIndex) => (
															<div key={detailIndex} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
																<h5 className="text-lg font-semibold text-gray-900 mb-4">{detail.service}</h5>
																<div className="grid grid-cols-2 gap-4">
																	<div>
																		<span className="text-gray-600 text-sm">Plafond</span>
																		<p className="font-semibold text-gray-900">{detail.limit}</p>
																	</div>
																	<div>
																		<span className="text-gray-600 text-sm">Franchise</span>
																		<p className="font-semibold text-gray-900">{detail.deductible}</p>
																	</div>
																	<div className="col-span-2">
																		<span className="text-gray-600 text-sm">Limite</span>
																		<p className="font-semibold text-gray-900">{detail.restrictions}</p>
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
												{/* Ce qui est couvert */}
												{garantie.coveredItems && garantie.coveredItems.length > 0 && (
													<div>
														<h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
															<FaCheck className="h-5 w-5 text-green-600 mr-2" />
															Ce qui est couvert
														</h4>
														<div className="space-y-3">
															{garantie.coveredItems.map((item, itemIndex) => (
																<div key={itemIndex} className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
																	<FaCheck className="h-5 w-5 text-green-600" />
																	<span className="font-medium text-gray-900">{item}</span>
																</div>
															))}
														</div>
													</div>
												)}

												{/* Non couvert */}
												{garantie.excludedItems && garantie.excludedItems.length > 0 && (
													<div>
														<h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
															<FaTimesIcon className="h-5 w-5 text-red-600 mr-2" />
															Non couvert
														</h4>
														<div className="space-y-3">
															{garantie.excludedItems.map((item, itemIndex) => (
																<div key={itemIndex} className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-100">
																	<FaTimesIcon className="h-5 w-5 text-red-600" />
																	<span className="font-medium text-gray-900">{item}</span>
																</div>
															))}
														</div>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</Tab.Panel>

						{/* Exclusions */}
						<Tab.Panel className="p-6">
							<div className="max-w-7xl mx-auto">
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
									<div>
										<h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaExclamationTriangle className="h-6 w-6 text-red-600 mr-3" />
											Exclusions générales
										</h3>
										<div className="space-y-4">
											{contract.generalExclusions.map((exclusion, index) => (
												<div key={index} className="flex items-start space-x-4 p-6 bg-red-50 rounded-2xl border border-red-100">
													<FaTimesIcon className="h-5 w-5 text-red-600 mt-0.5" />
													<span className="text-gray-900 font-medium">{exclusion}</span>
												</div>
											))}
										</div>
									</div>

									<div>
										<h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaGlobe className="h-6 w-6 text-blue-600 mr-3" />
											Zone de couverture géographique
										</h3>
										<div className="grid grid-cols-1 gap-3">
											{contract.geographicCoverage.countries.map((pays, index) => (
												<div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
													<span className="font-medium text-gray-900">{pays}</span>
												</div>
											))}
										</div>
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
											<FaCheck className="h-5 w-5 text-blue-600 mr-2" />
											À la souscription
										</h4>
										<div className="space-y-4">
											{contract.obligations.atSubscription.map((obligation, index) => (
												<div key={index} className="flex items-start space-x-3">
													<FaCheck className="h-5 w-5 text-blue-600 mt-0.5" />
													<span className="text-gray-900">{obligation}</span>
												</div>
											))}
										</div>
									</div>

									<div className="bg-green-50 p-8 rounded-2xl border border-green-100">
										<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaCheck className="h-5 w-5 text-green-600 mr-2" />
											En cours de contrat
										</h4>
										<div className="space-y-4">
											{contract.obligations.duringContract.map((obligation, index) => (
												<div key={index} className="flex items-start space-x-3">
													<FaCheck className="h-5 w-5 text-green-600 mt-0.5" />
													<span className="text-gray-900">{obligation}</span>
												</div>
											))}
										</div>
									</div>

									<div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
										<h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
											<FaCheck className="h-5 w-5 text-orange-600 mr-2" />
											En cas de sinistre
										</h4>
										<div className="space-y-4">
											{contract.obligations.inCaseOfClaim.map((obligation, index) => (
												<div key={index} className="flex items-start space-x-3">
													<FaCheck className="h-5 w-5 text-orange-600 mt-0.5" />
													<span className="text-gray-900">{obligation}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</Tab.Panel>

						{/* Résiliation */}
						<Tab.Panel className="p-6">
							<div className="max-w-4xl mx-auto">
								<div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-100">
									<h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
										<FaExclamationTriangle className="h-6 w-6 text-yellow-600 mr-3" />
										Comment résilier mon contrat
									</h3>
									
									<div className="space-y-8">
										<div>
											<h4 className="text-xl font-semibold text-gray-900 mb-4">Modalités</h4>
											<p className="text-gray-900 bg-white p-6 rounded-xl border border-yellow-200 text-lg">
												{contract.cancellation.procedures}
											</p>
										</div>
										
										<div>
											<h4 className="text-xl font-semibold text-gray-900 mb-4">Délais</h4>
											<p className="text-gray-900 bg-white p-6 rounded-xl border border-yellow-200 text-lg">
												{contract.cancellation.deadlines}
											</p>
										</div>
										
										<div>
											<h4 className="text-xl font-semibold text-gray-900 mb-4">Contacts utiles</h4>
											<div className="space-y-3">
												{contract.cancellation.usefulContacts.map((contact, index) => (
													<div key={index} className="bg-white p-4 rounded-xl border border-yellow-200">
														<span className="font-medium text-gray-900">{contact}</span>
													</div>
												))}
											</div>
										</div>
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
												<p className="font-semibold text-gray-900">{contract.contacts.contractManagement.name}</p>
											</div>
											<div className="flex items-center space-x-3">
												<FaPhone className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">{contract.contacts.contractManagement.phone}</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaEnvelope className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">{contract.contacts.contractManagement.email}</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaClock className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">{contract.contacts.contractManagement.hours}</span>
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
												<p className="font-semibold text-gray-900">{contract.contacts.assistance.name}</p>
											</div>
											<div className="flex items-center space-x-3">
												<FaPhone className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">{contract.contacts.assistance.phone}</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaEnvelope className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">{contract.contacts.assistance.email}</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaClock className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">{contract.contacts.assistance.availability}</span>
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
												<p className="font-semibold text-gray-900">{contract.contacts.emergency.name}</p>
											</div>
											<div className="flex items-center space-x-3">
												<FaPhone className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">{contract.contacts.emergency.phone}</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaEnvelope className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">{contract.contacts.emergency.email}</span>
											</div>
											<div className="flex items-center space-x-3">
												<FaClock className="h-4 w-4 text-gray-400" />
												<span className="font-medium text-gray-900">{contract.contacts.emergency.availability}</span>
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