import type { ContractCategory, ContractListItem, ContractStatus } from '../types';
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
	FaTrash,
} from 'react-icons/fa';
import {
	getContractListItemDocuments,
	getContractListItemInsurer,
	getContractListItemPremium,
	getContractListItemType,
} from '../utils/contractAdapters';
import {
	getStatusColor,
	getStatusLabel,
	getTypeIcon,
	getTypeLabel,
} from '../utils/contract';

import CreateContractModal from './CreateContractModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditContractModal from './EditContractModal';
import { Link } from 'react-router-dom';
import Pagination from './ui/Pagination';
import Spinner from './ui/Spinner';
import { getInsurerLogo } from '../utils/insurerLogo';
import { motion } from 'framer-motion';
import { useContractOperations } from '../hooks/useContractOperations';
import { useContracts } from '../hooks/useContracts';
import { useState } from 'react';

const ContractsModule = () => {
	const {
		pagination,
		isLoading,
		isFetching,
		error,
		searchQuery,
		selectedCategory,
		selectedStatus,
		setPage,
		setLimit,
		setSearchQuery,
		setCategory,
		setStatus,
		filteredContracts,
		contractStats,
	} = useContracts({
		initialPage: 1,
		initialLimit: 10,
	});

	const { deleteContract, isDeleting } = useContractOperations();
	const [editingContract, setEditingContract] = useState<ContractListItem | null>(null);
	const [deletingContract, setDeletingContract] = useState<ContractListItem | null>(null);
	const [isCreateContractModalOpen, setIsCreateContractModalOpen] = useState(false);

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
	};

	const handleTypeFilter = (category: string) => {
		setCategory(category === 'all' ? 'all' : (category as ContractCategory));
	};

	const handleStatusFilter = (status: string) => {
		setStatus(status === 'all' ? 'all' : (status as ContractStatus));
	};

	const handleDeleteContract = (contract: ContractListItem) => {
		setDeletingContract(contract);
	};

	const handleConfirmDelete = async () => {
		if (!deletingContract) return;

		try {
			await deleteContract(deletingContract.id);
			setDeletingContract(null);
		} catch (error) {
			console.error('Failed to delete contract:', error);
		}
	};

	const handleCancelDelete = () => {
		setDeletingContract(null);
	};

	const handleEditSuccess = () => {
		setEditingContract(null);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<Spinner size="lg" color="blue" className="mx-auto mb-4" />
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
					onClick={() => setIsCreateContractModalOpen(true)}
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
							<p className="text-3xl font-bold text-gray-900">
								{isFetching ? '...' : contractStats.total}
							</p>
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
								{(contractStats.totalPremium / 100).toLocaleString('fr-FR', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
								€
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
								value={selectedCategory}
								onChange={(e) => handleTypeFilter(e.target.value)}
								className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
							>
								<option value="all">Tous les types</option>
								<option value="auto">Automobile</option>
								<option value="home">Habitation</option>
								<option value="health">Santé</option>
								<option value="moto">Moto</option>
								<option value="electronic_devices">Équipements électroniques</option>
								<option value="other">Autre</option>
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
							onClick={() => setIsCreateContractModalOpen(true)}
							className="bg-[#1e51ab] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#163d82] transition-colors"
						>
							Ajouter un contrat
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredContracts.map((contract, index) => {
							const TypeIcon = getTypeIcon(getContractListItemType(contract));
							const isContractExpired = contract.endDate
								? new Date(contract.endDate) < new Date()
								: false;
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
												{getInsurerLogo(getContractListItemInsurer(contract)) ? (
													<img
														src={getInsurerLogo(getContractListItemInsurer(contract))}
														alt={getContractListItemInsurer(contract)}
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
												<p className="text-xs text-gray-600">
													{getTypeLabel(getContractListItemType(contract))}
												</p>
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
											<span className="text-sm font-medium text-gray-900">
												{getContractListItemInsurer(contract) || 'Non spécifié'}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-600">Prime annuelle</span>
											<span className="text-sm font-bold text-[#1e51ab]">
												{getContractListItemPremium(contract).toLocaleString()}€
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-600">Échéance</span>
											<span className="text-sm font-medium text-gray-900">
												{contract.endDate
													? new Date(contract.endDate).toLocaleDateString('fr-FR')
													: 'Non spécifiée'}
											</span>
										</div>
									</div>

									{/* Documents */}
									<div className="mb-4">
										<p className="text-xs text-gray-600 mb-2">
											Documents (
											{getContractListItemDocuments(contract).otherDocs
												? getContractListItemDocuments(contract).otherDocs.length + 2
												: 2}
											)
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
											{getContractListItemDocuments(contract).otherDocs &&
												getContractListItemDocuments(contract)
													.otherDocs.slice(0, 1)
													.map((doc, docIndex: number) => (
														<span
															key={docIndex}
															className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
														>
															<FaFileAlt className="h-3 w-3 mr-1" />
															{doc.name.length > 15 ? `${doc.name.substring(0, 15)}...` : doc.name}
														</span>
													))}
											{getContractListItemDocuments(contract).otherDocs &&
												getContractListItemDocuments(contract).otherDocs.length > 1 && (
													<span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
														+{getContractListItemDocuments(contract).otherDocs.length - 1}
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
												onClick={() => handleDeleteContract(contract)}
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

			{/* Edit Contract Modal */}
			{editingContract && (
				<EditContractModal
					contract={editingContract}
					isOpen={!!editingContract}
					onClose={() => setEditingContract(null)}
					onSuccess={handleEditSuccess}
				/>
			)}

			{/* Delete Confirmation Modal */}
			{deletingContract && (
				<DeleteConfirmationModal
					isOpen={!!deletingContract}
					onClose={handleCancelDelete}
					onConfirm={handleConfirmDelete}
					contractName={deletingContract.name}
					isDeleting={isDeleting}
				/>
			)}

			{/* Pagination */}
			<Pagination
				currentPage={pagination.page}
				totalPages={pagination.totalPages}
				totalItems={pagination.total}
				itemsPerPage={pagination.limit}
				onPageChange={setPage}
				onItemsPerPageChange={setLimit}
				className="mt-8"
			/>

			<CreateContractModal
				open={isCreateContractModalOpen}
				onClose={() => setIsCreateContractModalOpen(false)}
			/>
		</div>
	);
};

export default ContractsModule;
