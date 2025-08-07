import { FaCoins, FaCreditCard, FaHistory, FaInfoCircle, FaMinus, FaPlus } from 'react-icons/fa';

import Button from './ui/Button';
import TransactionHistoryModal from './TransactionHistoryModal';
import { creditService } from '../services/creditService';
import { getUserState } from '../utils/stateHelpers';
import { motion } from 'framer-motion';
import { paymentService } from '../services/paymentService';
import { showToast } from './ui/Toast';
import { useAppSelector } from '../store/hooks';
import { useCreditTransactions } from '../hooks/useCreditTransactions';
import { useGetCreditPacksQuery } from '../store/creditPacksApi';
import { useState } from 'react';

// Helper function to get French label for transaction type
const getTransactionLabel = (type: string, source: string) => {
	switch (type) {
		case 'purchase':
			return 'Achat de crédits';
		case 'usage':
			switch (source) {
				case 'chatbot':
					return 'Utilisation du chatbot';
				case 'comparator':
					return "Comparaison d'assurances";
				default:
					return 'Utilisation de crédits';
			}
		case 'adjustment':
			return 'Ajustement de crédits';
		default:
			return 'Transaction';
	}
};

const CreditPage = () => {
	const { currentUser } = useAppSelector(getUserState);
	const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
	const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

	const { data: creditPacks = [], isLoading: loading, error, refetch } = useGetCreditPacksQuery();
	const {
		transactions: recentTransactions,
		loading: transactionsLoading,
		error: transactionsError,
		refetch: refetchTransactions,
	} = useCreditTransactions({ limit: 5 });

	const handlePurchase = async (packageId: string) => {
		try {
			setPurchaseLoading(packageId);

			const response = await paymentService.createCheckout(packageId);

			if (response.success && response.data) {
				// Store the credit pack ID in sessionStorage for use on success page
				sessionStorage.setItem('selectedCreditPackId', packageId);

				// Redirect to Stripe Checkout
				window.location.href = response.data.url;
			} else {
				showToast.error(response.error || 'Erreur lors de la création du paiement');
				setPurchaseLoading(null);
			}
		} catch {
			showToast.error('Erreur lors de la création du paiement');
			setPurchaseLoading(null);
		}
	};

	if (!currentUser) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<FaCoins className="h-16 w-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur connecté</h3>
					<p className="text-gray-600">Veuillez vous connecter pour accéder à vos crédits.</p>
				</div>
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
				className="flex items-center justify-between"
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Crédits</h1>
					<p className="text-gray-600 text-lg">
						Gérez votre solde de crédits et accédez aux fonctionnalités premium
					</p>
				</div>
			</motion.div>

			{/* Credit Balance Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-3">
							<FaCoins className="h-6 w-6 text-white" />
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Solde de crédits</p>
							<p className="text-2xl font-bold text-gray-900">
								{currentUser.creditBalance || 0} crédits
							</p>
						</div>
					</div>
					<div className="text-right">
						<p className="text-xs text-gray-500 mb-1">Disponible</p>
						<p className="text-sm font-medium text-green-600">
							{currentUser.creditBalance || 0 > 0 ? 'Actif' : 'Épuisé'}
						</p>
					</div>
				</div>
			</motion.div>

			{/* Purchase Packages */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="bg-white border border-gray-100 rounded-2xl p-6"
			>
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-gray-900 flex items-center">
						<FaCreditCard className="h-5 w-5 mr-3 text-[#1e51ab]" />
						Acheter des crédits
					</h3>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-12">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e51ab]"></div>
						<span className="ml-3 text-gray-600">Chargement des packs de crédits...</span>
					</div>
				) : error ? (
					<div className="text-center py-8">
						<p className="text-red-600 mb-4">
							{'data' in error &&
							error.data &&
							typeof error.data === 'object' &&
							'message' in error.data
								? (error.data as { message: string }).message
								: 'Erreur lors du chargement des packs de crédits'}
						</p>
						<Button onClick={refetch} variant="secondary">
							Réessayer
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{creditPacks.map((pkg) => (
							<motion.div
								key={pkg.id}
								whileHover={{ scale: 1.02 }}
								className={`relative border rounded-xl p-6 cursor-pointer transition-all ${
									purchaseLoading === pkg.id
										? 'border-[#1e51ab] bg-blue-50'
										: 'border-gray-200 hover:border-[#1e51ab]'
								} ${pkg.isFeatured ? 'ring-2 ring-[#1e51ab]' : ''}`}
								onClick={() => handlePurchase(pkg.id)}
							>
								{pkg.isFeatured && (
									<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
										<span className="bg-[#1e51ab] text-white text-xs px-3 py-1 rounded-full">
											Populaire
										</span>
									</div>
								)}
								<div className="text-center">
									<h4 className="font-semibold text-gray-900 mb-2">{pkg.name}</h4>
									<p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
									<div className="text-3xl font-bold text-[#1e51ab] mb-2">{pkg.creditAmount}</div>
									<p className="text-sm text-gray-600 mb-4">crédits</p>
									<div className="text-2xl font-bold text-gray-900 mb-4">
										{creditService.formatPrice(pkg.priceCents)}€
									</div>
									{purchaseLoading === pkg.id ? (
										<div className="flex items-center justify-center space-x-2 py-2">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1e51ab]"></div>
											<span className="text-sm text-[#1e51ab]">Chargement...</span>
										</div>
									) : (
										<Button
											variant="secondary"
											size="sm"
											className="w-full"
										>
											Sélectionner
										</Button>
									)}
								</div>
							</motion.div>
						))}
					</div>
				)}
			</motion.div>

			{/* Usage History */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="bg-white border border-gray-100 rounded-2xl p-6"
			>
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-gray-900 flex items-center">
						<FaHistory className="h-5 w-5 mr-3 text-[#1e51ab]" />
						Historique d'utilisation
					</h3>
				</div>

				{transactionsLoading ? (
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse"
							>
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
				) : transactionsError ? (
					<div className="text-center py-8">
						<p className="text-red-600 mb-4">{transactionsError}</p>
						<Button variant="secondary" size="sm" onClick={refetchTransactions}>
							Réessayer
						</Button>
					</div>
				) : recentTransactions.length === 0 ? (
					<div className="text-center py-8">
						<FaHistory className="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500">Aucune transaction récente</p>
					</div>
				) : (
					<div className="space-y-3">
						{recentTransactions.map((transaction, index) => (
							<motion.div
								key={transaction.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<div className="flex items-center">
									{transaction.type === 'purchase' ? (
										<FaPlus className="h-4 w-4 text-green-500 mr-3" />
									) : (
										<FaMinus className="h-4 w-4 text-red-500 mr-3" />
									)}
									<div>
										<p className="text-sm font-medium text-gray-900">
											{getTransactionLabel(transaction.type, transaction.source)}
										</p>
										<p className="text-xs text-gray-500">
											{new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
											})}
										</p>
									</div>
								</div>
								<span
									className={`text-sm font-medium ${
										transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'
									}`}
								>
									{transaction.type === 'purchase' ? '+' : ''}
									{transaction.amount} crédits
								</span>
							</motion.div>
						))}
						{recentTransactions.length >= 5 && (
							<div className="text-center pt-4">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsHistoryModalOpen(true)}
									className="text-[#1e51ab]"
								>
									Voir plus
								</Button>
							</div>
						)}
					</div>
				)}
			</motion.div>

			{/* Credit Information */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
			>
				<div className="flex items-start">
					<FaInfoCircle className="h-5 w-5 text-[#1e51ab] mr-3 mt-0.5" />
					<div>
						<h3 className="text-lg font-semibold text-blue-900 mb-3">
							Comment fonctionnent les crédits ?
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
							<div>
								<h4 className="font-medium mb-2">Fonctionnalités premium :</h4>
								<ul className="space-y-1">
									<li>• 1 question = 1 crédit (ex: 3 questions = 3 crédits)</li>
									<li>• Recommandations personnalisées : 1 crédit</li>
								</ul>
							</div>
							<div>
								<h4 className="font-medium mb-2">Informations importantes :</h4>
								<ul className="space-y-1">
									<li>• Crédits valables 1 an après achat</li>
									<li>• Paiement sécurisé par carte bancaire</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Transaction History Modal */}
			<TransactionHistoryModal
				isOpen={isHistoryModalOpen}
				onClose={() => setIsHistoryModalOpen(false)}
			/>
		</div>
	);
};

export default CreditPage;
