import {
	FaCalendarAlt,
	FaChevronDown,
	FaEdit,
	FaEuroSign,
	FaEye,
	FaFileAlt,
	FaFileContract,
	FaPlus,
	FaSearch,
	FaTimes,
	FaTrash,
} from 'react-icons/fa';
import {
	deleteContract,
	setSearchQuery,
	setSelectedStatus,
	setSelectedType,
	updateContract,
} from '../store/contractsSlice';
import { getStatusColor, getStatusLabel, getTypeIcon, getTypeLabel } from '../utils/contract';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import type { Contract } from '../types';
import CreateContractModal from './CreateContractModal';
import { Link } from 'react-router-dom';
import { getInsurerLogo } from '../utils/insurerLogo';
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
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [createStep, setCreateStep] = useState(1);
	const [form, setForm] = useState<{
		coverage: string;
		type: string;
		valid_from: string;
		valid_to: string;
		prime: string;
		renouvellement_tacite: string;
		date_limit: string;
		conditions_particulieres: File | null;
		conditions_generales: File | null;
		autres_documents: File | null;
	}>({
		coverage: '',
		type: '',
		valid_from: '',
		valid_to: '',
		prime: '',
		renouvellement_tacite: '',
		date_limit: '',
		conditions_particulieres: null,
		conditions_generales: null,
		autres_documents: null,
	});

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

	// Remove handleFileUpload if not used

	const today = new Date();
	const isExpired = (contract: Contract) => new Date(contract.endDate) < today;
	const contractStats = {
		total: contracts.length,
		active: contracts.filter((c) => c.status === 'active').length,
		expired: contracts.filter((c) => isExpired(c)).length,
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
					onClick={() => setShowCreateModal(true)}
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
							onClick={() => setShowCreateModal(true)}
							className="bg-[#1e51ab] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#163d82] transition-colors"
						>
							Ajouter un contrat
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredContracts.map((contract, index) => {
							const TypeIcon = getTypeIcon(contract.type);
							const isContractExpired = isExpired(contract);
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
											<div className="flex items-center gap-1">
												{getInsurerLogo(contract.insurer) ? (
													<img
														src={getInsurerLogo(contract.insurer)}
														alt={contract.insurer}
														className="w-8 h-8 object-contain rounded"
														style={{ background: '#fff' }}
													/>
												) : (
													<div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
														<TypeIcon className="h-5 w-5 text-[#1e51ab]" />
													</div>
												)}
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 text-sm">{contract.name}</h3>
												<p className="text-xs text-gray-600">{getTypeLabel(contract.type)}</p>
											</div>
										</div>
										<span
											className={`px-2 py-1 text-xs font-medium rounded-full ${isContractExpired ? 'bg-red-100 text-red-800' : getStatusColor(contract.status)}`}
										>
											{isContractExpired ? 'Expiré' : getStatusLabel(contract.status)}
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
									<div className="mb-4">
										<p className="text-xs text-gray-600 mb-2">
											Documents (
											{contract.documents.otherDocs ? contract.documents.otherDocs.length + 2 : 2})
										</p>
										<div className="flex flex-wrap gap-1">
											{/* Conditions Générales */}
											<span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
												<FaFileAlt className="h-3 w-3 mr-1" />
												Conditions Générales
											</span>
											{/* Conditions Particulières */}
											<span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg">
												<FaFileAlt className="h-3 w-3 mr-1" />
												Conditions Particulières
											</span>
											{/* Autres Documents */}
											{contract.documents.otherDocs &&
												contract.documents.otherDocs.slice(0, 1).map((doc, docIndex) => (
													<span
														key={docIndex}
														className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
													>
														<FaFileAlt className="h-3 w-3 mr-1" />
														{doc.name.length > 15 ? `${doc.name.substring(0, 15)}...` : doc.name}
													</span>
												))}
											{contract.documents.otherDocs && contract.documents.otherDocs.length > 1 && (
												<span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
													+{contract.documents.otherDocs.length - 1}
												</span>
											)}
										</div>
									</div>

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
										<Link
											to={`/app/contrats/${contract.id}`}
											className="text-[#1e51ab] hover:text-[#163d82] text-sm font-medium flex items-center space-x-1"
											title="Voir détails"
										>
											<FaEye className="h-3 w-3" />
											<span>Détails</span>
										</Link>
									</div>
								</motion.div>
							);
						})}
					</div>
				)}
			</motion.div>

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

			<CreateContractModal
				open={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				createStep={createStep}
				setCreateStep={setCreateStep}
				form={form}
				setForm={setForm}
			/>
		</div>
	);
};

export default ContratsModule;
