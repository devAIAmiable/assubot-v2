import {
	FaTimes,
	FaFilter,
	FaChevronLeft,
	FaChevronRight,
	FaPlus,
	FaMinus,
	FaExclamationTriangle,
	FaInbox,
} from 'react-icons/fa';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import { transactionService, type TransactionFilters, type Transaction } from '../services/transactionService';
import Button from './ui/Button';
import Input from './ui/Input';
import Dropdown, { type DropdownOption } from './ui/Dropdown';

interface TransactionHistoryModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const TransactionHistoryModal = ({ isOpen, onClose }: TransactionHistoryModalProps) => {
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState<TransactionFilters>({
		type: 'all',
		dateFrom: '',
		dateTo: '',
	});

	const { transactions, pagination, loading, error, fetchPage, updateFilters, refetch } = useTransactions({
		limit: 10,
		autoFetch: isOpen,
	});

	const typeOptions: DropdownOption[] = [
		{ value: 'all', label: 'Tous les types' },
		{ value: 'purchase', label: 'Achats de crédits' },
		{ value: 'usage', label: 'Utilisation de crédits' },
	];

	const handleFilterChange = (field: keyof TransactionFilters, value: string) => {
		const newFilters = { ...filters, [field]: value };
		setFilters(newFilters);
	};

	const applyFilters = () => {
		updateFilters(filters);
		setShowFilters(false);
	};

	const clearFilters = () => {
		const clearedFilters = { type: 'all' as const, dateFrom: '', dateTo: '' };
		setFilters(clearedFilters);
		updateFilters(clearedFilters);
		setShowFilters(false);
	};

	const handlePageChange = (page: number) => {
		fetchPage(page);
	};

	const renderPagination = () => {
		if (!pagination || pagination.totalPages <= 1) return null;

		const pages = [];
		const maxVisiblePages = 5;
		const startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
		const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return (
			<div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
				<div className="text-sm text-gray-600">
					Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
					{Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} transactions
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handlePageChange(pagination.page - 1)}
						disabled={pagination.page <= 1}
						className="flex items-center"
					>
						<FaChevronLeft className="h-3 w-3 mr-1" />
						Précédent
					</Button>
					
					{pages.map((page) => (
						<Button
							key={page}
							variant={page === pagination.page ? 'primary' : 'ghost'}
							size="sm"
							onClick={() => handlePageChange(page)}
							className="w-8 h-8 p-0"
						>
							{page}
						</Button>
					))}
					
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handlePageChange(pagination.page + 1)}
						disabled={pagination.page >= pagination.totalPages}
						className="flex items-center"
					>
						Suivant
						<FaChevronRight className="h-3 w-3 ml-1" />
					</Button>
				</div>
			</div>
		);
	};

	const renderTransactionItem = (transaction: Transaction, index: number) => (
		<motion.div
			key={transaction.id}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.05 }}
			className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
		>
			<div className="flex items-center">
				{transaction.type === 'purchase' ? (
					<FaPlus className="h-4 w-4 text-green-500 mr-3" />
				) : (
					<FaMinus className="h-4 w-4 text-red-500 mr-3" />
				)}
				<div>
					<p className="text-sm font-medium text-gray-900">{transaction.action}</p>
					<p className="text-xs text-gray-500">
						{transactionService.formatDate(transaction.date)}
					</p>
				</div>
			</div>
			<span
				className={`text-sm font-medium ${
					transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'
				}`}
			>
				{transaction.type === 'purchase' ? '+' : ''}{transaction.credits} crédits
			</span>
		</motion.div>
	);

	const renderEmptyState = () => (
		<div className="flex flex-col items-center justify-center py-12 px-6">
			<FaInbox className="h-12 w-12 text-gray-300 mb-4" />
			<h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction</h3>
			<p className="text-gray-500 text-center">
				Aucune transaction ne correspond à vos critères de recherche.
			</p>
			{(filters.type !== 'all' || filters.dateFrom || filters.dateTo) && (
				<Button variant="secondary" size="sm" onClick={clearFilters} className="mt-4">
					Effacer les filtres
				</Button>
			)}
		</div>
	);

	const renderErrorState = () => (
		<div className="flex flex-col items-center justify-center py-12 px-6">
			<FaExclamationTriangle className="h-12 w-12 text-red-300 mb-4" />
			<h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
			<p className="text-gray-500 text-center mb-4">{error}</p>
			<Button variant="secondary" size="sm" onClick={refetch}>
				Réessayer
			</Button>
		</div>
	);

	const renderLoadingState = () => (
		<div className="py-8">
			{Array.from({ length: 5 }).map((_, index) => (
				<div key={index} className="flex items-center justify-between p-4 animate-pulse">
					<div className="flex items-center">
						<div className="w-4 h-4 bg-gray-200 rounded mr-3"></div>
						<div>
							<div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
							<div className="w-20 h-3 bg-gray-200 rounded"></div>
						</div>
					</div>
					<div className="w-16 h-4 bg-gray-200 rounded"></div>
				</div>
			))}
		</div>
	);

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
								{/* Header */}
								<div className="flex items-center justify-between p-6 border-b border-gray-200">
									<div>
										<Dialog.Title className="text-xl font-semibold text-gray-900">
											Historique des transactions
										</Dialog.Title>
										<p className="text-sm text-gray-600 mt-1">
											Consultez toutes vos transactions de crédits
										</p>
									</div>
									<div className="flex items-center space-x-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowFilters(!showFilters)}
											className="flex items-center"
										>
											<FaFilter className="h-4 w-4 mr-2" />
											Filtres
										</Button>
										<button
											onClick={onClose}
											className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
										>
											<FaTimes className="h-5 w-5 text-gray-500" />
										</button>
									</div>
								</div>

								{/* Filters */}
								<AnimatePresence>
									{showFilters && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: 'auto', opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="border-b border-gray-200 overflow-hidden"
										>
											<div className="p-6 bg-gray-50">
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<Dropdown
														label="Type de transaction"
														options={typeOptions}
														value={filters.type || 'all'}
														onChange={(value) => handleFilterChange('type', value)}
													/>
													<Input
														label="Date de début"
														type="date"
														value={filters.dateFrom || ''}
														onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
													/>
													<Input
														label="Date de fin"
														type="date"
														value={filters.dateTo || ''}
														onChange={(e) => handleFilterChange('dateTo', e.target.value)}
													/>
												</div>
												<div className="flex justify-end space-x-3 mt-4">
													<Button variant="secondary" size="sm" onClick={clearFilters}>
														Effacer
													</Button>
													<Button size="sm" onClick={applyFilters}>
														Appliquer les filtres
													</Button>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Content */}
								<div className="min-h-96 max-h-96 overflow-y-auto">
									{loading ? (
										renderLoadingState()
									) : error ? (
										renderErrorState()
									) : transactions.length === 0 ? (
										renderEmptyState()
									) : (
										<div className="divide-y divide-gray-100">
											{transactions.map(renderTransactionItem)}
										</div>
									)}
								</div>

								{/* Pagination */}
								{!loading && !error && transactions.length > 0 && renderPagination()}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default TransactionHistoryModal; 