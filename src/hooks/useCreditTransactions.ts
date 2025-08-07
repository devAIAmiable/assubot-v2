import { useGetCreditTransactionsQuery, useLazyGetCreditTransactionsQuery, type CreditTransactionsFilters } from '../store/creditTransactionsApi';

export const useCreditTransactions = (filters?: CreditTransactionsFilters) => {
	const { data, isLoading, error, refetch } = useGetCreditTransactionsQuery(filters);

	return {
		transactions: data?.transactions || [],
		pagination: data?.pagination,
		filters: data?.filters,
		loading: isLoading,
		error: error ? (error as { data?: { message?: string } })?.data?.message || 'Erreur lors du chargement des transactions' : null,
		refetch,
	};
};

export const useLazyCreditTransactions = () => {
	const [getCreditTransactions, { data, isLoading, error }] = useLazyGetCreditTransactionsQuery();

	return {
		getCreditTransactions,
		transactions: data?.transactions || [],
		pagination: data?.pagination,
		filters: data?.filters,
		loading: isLoading,
		error: error ? (error as { data?: { message?: string } })?.data?.message || 'Erreur lors du chargement des transactions' : null,
	};
}; 