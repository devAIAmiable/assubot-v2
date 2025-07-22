import {
	FaCalendarAlt,
	FaCheck,
	FaChevronDown,
	FaClipboardList,
	FaClock,
	FaEdit,
	FaEnvelope,
	FaEuroSign,
	FaExclamationTriangle,
	FaEye,
	FaFileAlt,
	FaFileContract,
	FaGlobe,
	FaPhone,
	FaPlus,
	FaSearch,
	FaShieldAlt,
	FaTimes,
	FaTimes as FaTimesIcon,
	FaTrash,
	FaUpload,
} from 'react-icons/fa';
import {
	addContract,
	addDocument,
	deleteContract,
	setSearchQuery,
	setSelectedStatus,
	setSelectedType,
	updateContract,
} from '../store/contractsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import type { Contract } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ContratsModule = () => {
	const dispatch = useAppDispatch();
	const { contracts, searchQuery, selectedType, selectedStatus, loading, error } = useAppSelector(
		(state) =>
			state.contracts || {
				contracts: [],
				searchQuery: '',
				selectedType: 'all',
				selectedStatus: 'all',
				loading: false,
				error: null,
			}
	);

	const [editingContract, setEditingContract] = useState<Contract | null>(null);
	const [viewingContract, setViewingContract] = useState<Contract | null>(null);
	const [dragOver, setDragOver] = useState(false);
	const [activeTab, setActiveTab] = useState(0);

	// Filter contracts based on search and filters
	const filteredContracts = contracts.filter((contract) => {
		const matchesSearch =
			contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			contract.insurer.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = selectedType === 'all' || contract.type === selectedType;
		const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus;

		return matchesSearch && matchesType && matchesStatus;
	});

	const handleSearchChange = (query: string) => {
		dispatch(setSearchQuery(query));
	};

	const handleTypeFilter = (type: string) => {
		dispatch(setSelectedType(type));
	};

	const handleStatusFilter = (status: string) => {
		dispatch(setSelectedStatus(status));
	};

	// const handleAddContract = (contractData: Omit<Contract, 'id'>) => {
	// 	dispatch(addContract(contractData));
	// 	setShowAddModal(false);
	// };

	const handleUpdateContract = (contract: Contract) => {
		dispatch(updateContract(contract));
		setEditingContract(null);
	};

	const handleDeleteContract = (contractId: string) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
			dispatch(deleteContract(contractId));
		}
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, contractId?: string) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];

			// Simulate file upload and add to contract or create new contract
			const document = {
				name: file.name,
				url: URL.createObjectURL(file),
				uploadDate: new Date().toISOString().split('T')[0],
			};

			if (contractId) {
				dispatch(addDocument({ contractId, document }));
			} else {
				// Create new contract from uploaded file
				const newContract: Omit<Contract, 'id'> = {
					name: `Contrat ${file.name.split('.')[0]}`,
					insurer: 'À définir',
					type: 'autre',
					premium: 0,
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
					status: 'pending',
					description: 'Contrat ajouté via upload de fichier',
					documents: [document],
					overview: {
						startDate: new Date().toLocaleDateString('fr-FR'),
						endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
						annualPremium: '0,00€',
						hasTacitRenewal: true,
						tacitRenewalDeadline: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
						planType: 'À définir',
						subscribedCoverages: []
					},
					coverages: [],
					generalExclusions: [],
					geographicCoverage: {
						countries: ['France']
					},
					obligations: {
						atSubscription: [],
						duringContract: [],
						inCaseOfClaim: []
					},
					cancellation: {
						procedures: 'À définir',
						deadlines: 'À définir',
						usefulContacts: []
					},
					contacts: {
						contractManagement: {
							name: 'À définir',
							phone: 'À définir',
							email: 'À définir',
							hours: 'À définir'
						},
						assistance: {
							name: 'À définir',
							phone: 'À définir',
							email: 'À définir',
							availability: 'À définir'
						},
						emergency: {
							name: 'À définir',
							phone: 'À définir',
							email: 'À définir',
							availability: 'À définir'
						}
					}
				};
				dispatch(addContract(newContract));
			}
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragOver(false);
		const files = e.dataTransfer.files;
		if (files.length > 0) {
			// Simulate file input for drag and drop
			const fakeEvent = {
				target: { files },
			} as React.ChangeEvent<HTMLInputElement>;
			handleFileUpload(fakeEvent);
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
				return type;
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
				return status;
		}
	};

	const contractStats = {
		total: contracts.length,
		active: contracts.filter((c) => c.status === 'active').length,
		expired: contracts.filter((c) => c.status === 'expired').length,
		totalPremium: contracts
			.filter((c) => c.status === 'active')
			.reduce((sum, c) => sum + c.premium, 0),
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
				<p className="text-red-600">Erreur: {error}</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Centralisation des contrats</h1>
					<p className="text-gray-600 text-lg">
						Gérez tous vos contrats d'assurance en un seul endroit
					</p>
				</div>
				<motion.button
					onClick={() => true}
					className="mt-4 lg:mt-0 bg-[#1e51ab] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#163d82] transition-colors flex items-center space-x-2"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					<FaPlus className="h-4 w-4" />
					<span>Ajouter un contrat</span>
				</motion.button>
			</motion.div>

			{/* Stats Cards */}
			<motion.div
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
			>
				<div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 mb-1">Total des contrats</p>
							<p className="text-3xl font-bold text-gray-900">{contractStats.total}</p>
						</div>
						<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
							<FaFileContract className="h-6 w-6 text-[#1e51ab]" />
						</div>
					</div>
				</div>

				<div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 mb-1">Contrats actifs</p>
							<p className="text-3xl font-bold text-green-600">{contractStats.active}</p>
						</div>
						<div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
							<FaFileContract className="h-6 w-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 mb-1">Primes totales</p>
							<p className="text-3xl font-bold text-gray-900">
								{contractStats.totalPremium.toLocaleString()}€
							</p>
						</div>
						<div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
							<FaEuroSign className="h-6 w-6 text-purple-600" />
						</div>
					</div>
					<div className="flex items-center mt-4 text-sm">
						<span className="text-gray-500">Par an</span>
					</div>
				</div>

				<div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 mb-1">Expirés</p>
							<p className="text-3xl font-bold text-red-600">{contractStats.expired}</p>
						</div>
						<div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
							<FaCalendarAlt className="h-6 w-6 text-red-600" />
						</div>
					</div>
				</div>
			</motion.div>

			{/* File Upload Area */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
					dragOver ? 'border-[#1e51ab] bg-blue-50' : 'border-gray-300 hover:border-[#1e51ab]'
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<input
					type="file"
					id="file-upload"
					multiple
					accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
					onChange={(e) => handleFileUpload(e)}
					className="hidden"
				/>
				<FaUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
				<h3 className="text-lg font-semibold text-gray-900 mb-2">Téléchargez vos contrats</h3>
				<p className="text-gray-600 mb-4">
					Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
				</p>
				<label
					htmlFor="file-upload"
					className="inline-flex items-center px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-semibold hover:bg-[#163d82] transition-colors cursor-pointer"
				>
					<FaUpload className="h-4 w-4 mr-2" />
					Choisir des fichiers
				</label>
				<p className="text-sm text-gray-500 mt-2">
					Formats acceptés: PDF, DOC, DOCX, JPG, PNG (max 10MB)
				</p>
			</motion.div>

			{/* Search and Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="bg-white border border-gray-100 rounded-2xl p-6"
			>
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
					{/* Search */}
					<div className="relative flex-1 max-w-md">
						<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<input
							type="text"
							placeholder="Rechercher un contrat..."
							value={searchQuery}
							onChange={(e) => handleSearchChange(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
						/>
					</div>

					{/* Filters */}
					<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
						{/* Type Filter */}
						<div className="relative">
							<select
								value={selectedType}
								onChange={(e) => handleTypeFilter(e.target.value)}
								className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
							>
								<option value="all">Tous les types</option>
								<option value="auto">Automobile</option>
								<option value="habitation">Habitation</option>
								<option value="sante">Santé</option>
								<option value="autre">Autre</option>
							</select>
							<FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
						</div>

						{/* Status Filter */}
						<div className="relative">
							<select
								value={selectedStatus}
								onChange={(e) => handleStatusFilter(e.target.value)}
								className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
							>
								<option value="all">Tous les statuts</option>
								<option value="active">Actif</option>
								<option value="expired">Expiré</option>
								<option value="pending">En attente</option>
							</select>
							<FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
						</div>
					</div>
				</div>
			</motion.div>

			{/* Contracts Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
			>
				{filteredContracts.length === 0 ? (
					<div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
						<FaFileContract className="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun contrat trouvé</h3>
						<p className="text-gray-600 mb-6">
							Commencez par ajouter vos premiers contrats d'assurance.
						</p>
						<button
							onClick={() => true}
							className="bg-[#1e51ab] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#163d82] transition-colors"
						>
							Ajouter un contrat
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredContracts.map((contract, index) => {
							const TypeIcon = getTypeIcon(contract.type);
							return (
								<motion.div
									key={contract.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
									whileHover={{ scale: 1.02 }}
								>
									{/* Header */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center space-x-3">
											<div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
												<TypeIcon className="h-5 w-5 text-[#1e51ab]" />
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 text-sm">{contract.name}</h3>
												<p className="text-xs text-gray-600">{getTypeLabel(contract.type)}</p>
											</div>
										</div>
										<span
											className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}
										>
											{getStatusLabel(contract.status)}
										</span>
									</div>

									{/* Details */}
									<div className="space-y-3 mb-4">
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-600">Assureur</span>
											<span className="text-sm font-medium text-gray-900">{contract.insurer}</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-600">Prime annuelle</span>
											<span className="text-sm font-bold text-[#1e51ab]">
												{contract.premium.toLocaleString()}€
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-600">Échéance</span>
											<span className="text-sm font-medium text-gray-900">
												{new Date(contract.endDate).toLocaleDateString('fr-FR')}
											</span>
										</div>
									</div>

									{/* Documents */}
									{contract.documents && contract.documents.length > 0 && (
										<div className="mb-4">
											<p className="text-xs text-gray-600 mb-2">
												Documents ({contract.documents.length})
											</p>
											<div className="flex flex-wrap gap-1">
												{contract.documents.slice(0, 2).map((doc, docIndex) => (
													<span
														key={docIndex}
														className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
													>
														<FaFileAlt className="h-3 w-3 mr-1" />
														{doc.name.length > 15 ? `${doc.name.substring(0, 15)}...` : doc.name}
													</span>
												))}
												{contract.documents.length > 2 && (
													<span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
														+{contract.documents.length - 2}
													</span>
												)}
											</div>
										</div>
									)}

									{/* Actions */}
									<div className="flex items-center justify-between pt-4 border-t border-gray-100">
										<div className="flex items-center space-x-2">
											<button
												onClick={() => setEditingContract(contract)}
												className="text-gray-400 hover:text-[#1e51ab] transition-colors p-1"
												title="Modifier"
											>
												<FaEdit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDeleteContract(contract.id)}
												className="text-gray-400 hover:text-red-600 transition-colors p-1"
												title="Supprimer"
											>
												<FaTrash className="h-4 w-4" />
											</button>
										</div>
										<button
											onClick={() => setViewingContract(contract)}
											className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium flex items-center space-x-1"
											title="Voir détails"
										>
											<FaEye className="h-3 w-3" />
											<span>Détails</span>
										</button>
									</div>
								</motion.div>
							);
						})}
					</div>
				)}
			</motion.div>

			{/* Contract Details Modal */}
			{viewingContract && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
					>
						<div className="p-6">
							{/* Header */}
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center space-x-3">
									<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
										{(() => {
											const TypeIcon = getTypeIcon(viewingContract.type);
											return <TypeIcon className="h-6 w-6 text-[#1e51ab]" />;
										})()}
									</div>
									<div>
										<h2 className="text-2xl font-bold text-gray-900">{viewingContract.name}</h2>
										<p className="text-gray-600">
											{getTypeLabel(viewingContract.type)} - {viewingContract.insurer}
										</p>
									</div>
								</div>
								<button
									onClick={() => setViewingContract(null)}
									className="text-gray-400 hover:text-gray-600 transition-colors"
								>
									<FaTimes className="h-6 w-6" />
								</button>
							</div>

							{/* Tabs */}
							<div className="border-b border-gray-200 mb-6">
								<nav className="-mb-px flex space-x-8">
									{['Vue d\'ensemble', 'Garanties', 'Exclusions', 'Obligations', 'Résiliation', 'Contacts'].map((tab, index) => (
										<button
											key={tab}
											onClick={() => setActiveTab(index)}
											className={`py-2 px-1 border-b-2 font-medium text-sm ${
												activeTab === index
													? 'border-[#1e51ab] text-[#1e51ab]'
													: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
											}`}
										>
											{tab}
										</button>
									))}
								</nav>
							</div>

							{/* Tab Content */}
							<div className="min-h-[60vh]">
								{/* Vue d'ensemble */}
								{activeTab === 0 && (
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
										{/* Mon contrat en un coup d'œil */}
										<div className="space-y-6">
											<div className="bg-blue-50 p-6 rounded-xl">
												<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
													<FaShieldAlt className="h-5 w-5 text-[#1e51ab] mr-2" />
													Mon contrat en un coup d'œil
												</h3>
												<div className="space-y-3">
													<div className="flex items-center justify-between py-2 border-b border-blue-100">
														<span className="text-gray-600">Formule</span>
														<span className="font-medium text-gray-900">{viewingContract.overview.planType}</span>
													</div>
													<div className="flex items-center justify-between py-2 border-b border-blue-100">
														<span className="text-gray-600">Début de contrat</span>
														<span className="font-medium text-gray-900">{viewingContract.overview.startDate}</span>
													</div>
													<div className="flex items-center justify-between py-2 border-b border-blue-100">
														<span className="text-gray-600">Fin de contrat</span>
														<span className="font-medium text-gray-900">{viewingContract.overview.endDate}</span>
													</div>
													<div className="flex items-center justify-between py-2 border-b border-blue-100">
														<span className="text-gray-600">Prime annuelle</span>
														<span className="font-bold text-[#1e51ab] text-lg">{viewingContract.overview.annualPremium}</span>
													</div>
													<div className="flex items-center justify-between py-2 border-b border-blue-100">
														<span className="text-gray-600">Renouvellement tacite</span>
														<span className="font-medium text-gray-900">
															{viewingContract.overview.hasTacitRenewal ? 'Oui' : 'Non'}
														</span>
													</div>
													{viewingContract.overview.hasTacitRenewal && (
														<div className="flex items-center justify-between py-2">
															<span className="text-gray-600">Date limite de résiliation</span>
															<span className="font-medium text-gray-900">{viewingContract.overview.tacitRenewalDeadline}</span>
														</div>
													)}
												</div>
											</div>

											<div>
												<h3 className="text-lg font-semibold text-gray-900 mb-4">Garanties souscrites</h3>
												<div className="grid grid-cols-2 gap-2">
													{viewingContract.overview.subscribedCoverages.map((garantie, index) => (
														<div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
															<FaCheck className="h-4 w-4 text-green-600" />
															<span className="text-sm text-gray-700">{garantie}</span>
														</div>
													))}
												</div>
											</div>
										</div>

										{/* Informations générales */}
										<div className="space-y-6">
											<div>
												<h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
												<div className="space-y-3">
													<div className="flex items-center justify-between py-2 border-b border-gray-100">
														<span className="text-gray-600">Statut</span>
														<span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(viewingContract.status)}`}>
															{getStatusLabel(viewingContract.status)}
														</span>
													</div>
													<div className="flex items-center justify-between py-2 border-b border-gray-100">
														<span className="text-gray-600">Assureur</span>
														<span className="font-medium text-gray-900">{viewingContract.insurer}</span>
													</div>
													<div className="flex items-center justify-between py-2 border-b border-gray-100">
														<span className="text-gray-600">Type de contrat</span>
														<span className="font-medium text-gray-900">{getTypeLabel(viewingContract.type)}</span>
													</div>
													{viewingContract.coverageAmount && (
														<div className="flex items-center justify-between py-2 border-b border-gray-100">
															<span className="text-gray-600">Montant de couverture</span>
															<span className="font-medium text-gray-900">{viewingContract.coverageAmount.toLocaleString()}€</span>
														</div>
													)}
													{viewingContract.deductible && (
														<div className="flex items-center justify-between py-2">
															<span className="text-gray-600">Franchise</span>
															<span className="font-medium text-gray-900">{viewingContract.deductible.toLocaleString()}€</span>
														</div>
													)}
												</div>
											</div>

											{viewingContract.description && (
												<div>
													<h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
													<p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{viewingContract.description}</p>
												</div>
											)}

											{viewingContract.documents && viewingContract.documents.length > 0 && (
												<div>
													<h3 className="text-lg font-semibold text-gray-900 mb-4">Documents ({viewingContract.documents.length})</h3>
													<div className="space-y-3">
														{viewingContract.documents.map((doc, index) => (
															<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
																<div className="flex items-center space-x-3">
																	<FaFileAlt className="h-5 w-5 text-gray-400" />
																	<div>
																		<p className="font-medium text-gray-900">{doc.name}</p>
																		<p className="text-sm text-gray-600">
																			Ajouté le {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
																		</p>
																	</div>
																</div>
																<a
																	href={doc.url}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-[#1e51ab] hover:text-[#163d82] font-medium text-sm"
																>
																	Ouvrir
																</a>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									</div>
								)}

								{/* Garanties */}
								{activeTab === 1 && (
									<div className="space-y-6">
										{viewingContract.coverages.map((garantie, index) => (
											<div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
												<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
													<FaShieldAlt className="h-5 w-5 text-[#1e51ab] mr-2" />
													{garantie.name}
												</h3>
												
												{/* Détails des prestations */}
												{garantie.details && garantie.details.length > 0 && (
													<div className="mb-6">
														<h4 className="text-lg font-medium text-gray-900 mb-3">Détails des prestations</h4>
														<div className="space-y-4">
															{garantie.details.map((detail, detailIndex) => (
																<div key={detailIndex} className="bg-gray-50 p-4 rounded-lg">
																	<h5 className="font-medium text-gray-900 mb-2">{detail.service}</h5>
																	<div className="grid grid-cols-2 gap-4 text-sm">
																		<div>
																			<span className="text-gray-600">Plafond:</span>
																			<span className="ml-2 font-medium">{detail.limit}</span>
																		</div>
																		<div>
																			<span className="text-gray-600">Franchise:</span>
																			<span className="ml-2 font-medium">{detail.deductible}</span>
																		</div>
																		<div>
																			<span className="text-gray-600">Limite:</span>
																			<span className="ml-2 font-medium">{detail.restrictions}</span>
																		</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												)}

												{/* Ce qui est couvert */}
												{garantie.coveredItems && garantie.coveredItems.length > 0 && (
													<div className="mb-6">
														<h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
															<FaCheck className="h-4 w-4 text-green-600 mr-2" />
															Ce qui est couvert
														</h4>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
															{garantie.coveredItems.map((item, itemIndex) => (
																<div key={itemIndex} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
																	<FaCheck className="h-4 w-4 text-green-600" />
																	<span className="text-sm text-gray-700">{item}</span>
																</div>
															))}
														</div>
													</div>
												)}

												{/* Non couvert */}
												{garantie.excludedItems && garantie.excludedItems.length > 0 && (
													<div>
														<h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
															<FaTimesIcon className="h-4 w-4 text-red-600 mr-2" />
															Non couvert
														</h4>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
															{garantie.excludedItems.map((item, itemIndex) => (
																<div key={itemIndex} className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
																	<FaTimesIcon className="h-4 w-4 text-red-600" />
																	<span className="text-sm text-gray-700">{item}</span>
																</div>
															))}
														</div>
													</div>
												)}
											</div>
										))}
									</div>
								)}

								{/* Exclusions */}
								{activeTab === 2 && (
									<div className="space-y-6">
										<div>
											<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
												<FaExclamationTriangle className="h-5 w-5 text-red-600 mr-2" />
												Exclusions générales
											</h3>
											<div className="space-y-3">
												{viewingContract.generalExclusions.map((exclusion, index) => (
													<div key={index} className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl">
														<FaTimesIcon className="h-4 w-4 text-red-600 mt-0.5" />
														<span className="text-gray-700">{exclusion}</span>
													</div>
												))}
											</div>
										</div>

										<div>
											<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
												<FaGlobe className="h-5 w-5 text-blue-600 mr-2" />
												Zone de couverture géographique
											</h3>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
												{viewingContract.geographicCoverage.countries.map((pays, index) => (
													<div key={index} className="p-3 bg-blue-50 rounded-lg text-center">
														<span className="text-sm font-medium text-gray-700">{pays}</span>
													</div>
												))}
											</div>
										</div>
									</div>
								)}

								{/* Obligations */}
								{activeTab === 3 && (
									<div className="space-y-8">
										<div>
											<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
												<FaClipboardList className="h-5 w-5 text-[#1e51ab] mr-2" />
												Mes obligations
											</h3>
											
											<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
												<div className="bg-blue-50 p-6 rounded-xl">
													<h4 className="text-lg font-medium text-gray-900 mb-4">À la souscription</h4>
													<div className="space-y-2">
														{viewingContract.obligations.atSubscription.map((obligation, index) => (
															<div key={index} className="flex items-start space-x-2">
																<FaCheck className="h-4 w-4 text-blue-600 mt-0.5" />
																<span className="text-sm text-gray-700">{obligation}</span>
															</div>
														))}
													</div>
												</div>

												<div className="bg-green-50 p-6 rounded-xl">
													<h4 className="text-lg font-medium text-gray-900 mb-4">En cours de contrat</h4>
													<div className="space-y-2">
														{viewingContract.obligations.duringContract.map((obligation, index) => (
															<div key={index} className="flex items-start space-x-2">
																<FaCheck className="h-4 w-4 text-green-600 mt-0.5" />
																<span className="text-sm text-gray-700">{obligation}</span>
															</div>
														))}
													</div>
												</div>

												<div className="bg-orange-50 p-6 rounded-xl">
													<h4 className="text-lg font-medium text-gray-900 mb-4">En cas de sinistre</h4>
													<div className="space-y-2">
														{viewingContract.obligations.inCaseOfClaim.map((obligation, index) => (
															<div key={index} className="flex items-start space-x-2">
																<FaCheck className="h-4 w-4 text-orange-600 mt-0.5" />
																<span className="text-sm text-gray-700">{obligation}</span>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Résiliation */}
								{activeTab === 4 && (
									<div className="space-y-6">
										<div className="bg-yellow-50 p-6 rounded-xl">
											<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
												<FaExclamationTriangle className="h-5 w-5 text-yellow-600 mr-2" />
												Comment résilier mon contrat
											</h3>
											
											<div className="space-y-4">
												<div>
													<h4 className="text-lg font-medium text-gray-900 mb-2">Modalités</h4>
													<p className="text-gray-700 bg-white p-4 rounded-lg">{viewingContract.cancellation.procedures}</p>
												</div>
												
												<div>
													<h4 className="text-lg font-medium text-gray-900 mb-2">Délais</h4>
													<p className="text-gray-700 bg-white p-4 rounded-lg">{viewingContract.cancellation.deadlines}</p>
												</div>
												
												<div>
													<h4 className="text-lg font-medium text-gray-900 mb-2">Contacts utiles</h4>
													<div className="space-y-2">
														{viewingContract.cancellation.usefulContacts.map((contact, index) => (
															<div key={index} className="bg-white p-3 rounded-lg">
																<span className="text-sm font-medium text-gray-700">{contact}</span>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Contacts */}
								{activeTab === 5 && (
									<div className="space-y-6">
										<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
											<FaPhone className="h-5 w-5 text-[#1e51ab] mr-2" />
											Qui contacter
										</h3>
										
										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											{/* Gestion contrat */}
											<div className="bg-blue-50 p-6 rounded-xl">
												<h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
													<FaClipboardList className="h-4 w-4 text-blue-600 mr-2" />
													Gestion contrat
												</h4>
												<div className="space-y-3">
													<div>
														<span className="text-sm text-gray-600">Nom</span>
														<p className="font-medium text-gray-900">{viewingContract.contacts.contractManagement.name}</p>
													</div>
													<div className="flex items-center space-x-2">
														<FaPhone className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-700">{viewingContract.contacts.contractManagement.phone}</span>
													</div>
													<div className="flex items-center space-x-2">
														<FaEnvelope className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-700">{viewingContract.contacts.contractManagement.email}</span>
													</div>
													<div className="flex items-center space-x-2">
														<FaClock className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-700">{viewingContract.contacts.contractManagement.hours}</span>
													</div>
												</div>
											</div>

											{/* Assistance */}
											<div className="bg-green-50 p-6 rounded-xl">
												<h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
													<FaShieldAlt className="h-4 w-4 text-green-600 mr-2" />
													Assistance
												</h4>
												<div className="space-y-3">
													<div>
														<span className="text-sm text-gray-600">Nom</span>
														<p className="font-medium text-gray-900">{viewingContract.contacts.assistance.name}</p>
													</div>
													<div className="flex items-center space-x-2">
														<FaPhone className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-700">{viewingContract.contacts.assistance.phone}</span>
													</div>
													<div className="flex items-center space-x-2">
														<FaEnvelope className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-700">{viewingContract.contacts.assistance.email}</span>
													</div>
													<div className="flex items-center space-x-2">
														<FaClock className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-700">{viewingContract.contacts.assistance.availability}</span>
													</div>
												</div>
											</div>

											{/* Urgences */}
											<div className="bg-red-50 p-6 rounded-xl">
												<h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
													<FaExclamationTriangle className="h-4 w-4 text-red-600 mr-2" />
													Urgences
												</h4>
												<div className="space-y-3">
													<div>
														<span className="text-sm text-gray-600">Nom</span>
														<p className="font-medium text-gray-900">{viewingContract.contacts.emergency.name}</p>
													</div>
													<div className="flex items-center space-x-2">
														<FaPhone className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-700">{viewingContract.contacts.emergency.phone}</span>
													</div>
													<div className="flex items-center space-x-2">
														<FaEnvelope className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-700">{viewingContract.contacts.emergency.email}</span>
													</div>
													<div className="flex items-center space-x-2">
														<FaClock className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-700">{viewingContract.contacts.emergency.availability}</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Actions */}
							<div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
								<button
									onClick={() => setViewingContract(null)}
									className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
								>
									Fermer
								</button>
								<button
									onClick={() => {
										setEditingContract(viewingContract);
										setViewingContract(null);
									}}
									className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors flex items-center space-x-2"
								>
									<FaEdit className="h-4 w-4" />
									<span>Modifier</span>
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			)}

			{/* Contract Edit Modal */}
			{editingContract && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
					>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const formData = new FormData(e.currentTarget);
								const updatedContract: Contract = {
									...editingContract,
									name: formData.get('name') as string,
									insurer: formData.get('insurer') as string,
									type: formData.get('type') as Contract['type'],
									premium: parseFloat(formData.get('premium') as string),
									startDate: formData.get('startDate') as string,
									endDate: formData.get('endDate') as string,
									status: formData.get('status') as Contract['status'],
									description: formData.get('description') as string,
									coverageAmount: formData.get('coverageAmount')
										? parseFloat(formData.get('coverageAmount') as string)
										: undefined,
									deductible: formData.get('deductible')
										? parseFloat(formData.get('deductible') as string)
										: undefined,
								};
								handleUpdateContract(updatedContract);
							}}
							className="p-6"
						>
							{/* Header */}
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-gray-900">Modifier le contrat</h2>
								<button
									type="button"
									onClick={() => setEditingContract(null)}
									className="text-gray-400 hover:text-gray-600 transition-colors"
								>
									<FaTimes className="h-6 w-6" />
								</button>
							</div>

							{/* Form Fields */}
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Nom du contrat
										</label>
										<input
											type="text"
											name="name"
											defaultValue={editingContract.name}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Assureur</label>
										<input
											type="text"
											name="insurer"
											defaultValue={editingContract.insurer}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Type de contrat
										</label>
										<select
											name="type"
											defaultValue={editingContract.type}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										>
											<option value="auto">Automobile</option>
											<option value="habitation">Habitation</option>
											<option value="sante">Santé</option>
											<option value="autre">Autre</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
										<select
											name="status"
											defaultValue={editingContract.status}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										>
											<option value="active">Actif</option>
											<option value="pending">En attente</option>
											<option value="expired">Expiré</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Prime annuelle (€)
										</label>
										<input
											type="number"
											name="premium"
											defaultValue={editingContract.premium}
											min="0"
											step="0.01"
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Montant de couverture (€)
										</label>
										<input
											type="number"
											name="coverageAmount"
											defaultValue={editingContract.coverageAmount || ''}
											min="0"
											step="0.01"
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Date de début
										</label>
										<input
											type="date"
											name="startDate"
											defaultValue={editingContract.startDate}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Date de fin
										</label>
										<input
											type="date"
											name="endDate"
											defaultValue={editingContract.endDate}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Franchise (€)
										</label>
										<input
											type="number"
											name="deductible"
											defaultValue={editingContract.deductible || ''}
											min="0"
											step="0.01"
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Description
									</label>
									<textarea
										name="description"
										defaultValue={editingContract.description || ''}
										rows={4}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent resize-none"
									/>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
								<button
									type="button"
									onClick={() => setEditingContract(null)}
									className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
								>
									Annuler
								</button>
								<button
									type="submit"
									className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors"
								>
									Enregistrer
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default ContratsModule;
