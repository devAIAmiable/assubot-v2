import { useState, useEffect, useCallback } from 'react';
import { transactionService, type Transaction, type TransactionFilters, type TransactionResponse } from '../services/transactionService';

interface UseTransactionsOptions {
	page?: number;
	limit?: number;
	filters?: TransactionFilters;
	autoFetch?: boolean;
}

interface UseTransactionsReturn {
	transactions: Transaction[];
	pagination: TransactionResponse['pagination'] | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	fetchPage: (page: number) => Promise<void>;
	updateFilters: (filters: TransactionFilters) => void;
}

export const useTransactions = (options: UseTransactionsOptions = {}): UseTransactionsReturn => {
	const {
		page: initialPage = 1,
		limit = 10,
		filters: initialFilters = {},
		autoFetch = true
	} = options;

	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [pagination, setPagination] = useState<TransactionResponse['pagination'] | null>(null);
	const [loading, setLoading] = useState(autoFetch);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [filters, setFilters] = useState<TransactionFilters>(initialFilters);

	const fetchTransactions = useCallback(async (page: number = currentPage, newFilters: TransactionFilters = filters) => {
		try {
			setLoading(true);
			setError(null);

			const response = await transactionService.getTransactions(page, limit, newFilters);

			if (response.success && response.data) {
				setTransactions(response.data.transactions);
				setPagination(response.data.pagination);
			} else {
				setError(response.error || 'Failed to fetch transactions');
				setTransactions([]);
				setPagination(null);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			setTransactions([]);
			setPagination(null);
		} finally {
			setLoading(false);
		}
	}, [currentPage, filters, limit]);

	const fetchPage = useCallback(async (page: number) => {
		setCurrentPage(page);
		await fetchTransactions(page, filters);
	}, [fetchTransactions, filters]);

	const updateFilters = useCallback((newFilters: TransactionFilters) => {
		setFilters(newFilters);
		setCurrentPage(1);
		fetchTransactions(1, newFilters);
	}, [fetchTransactions]);

	const refetch = useCallback(async () => {
		await fetchTransactions(currentPage, filters);
	}, [fetchTransactions, currentPage, filters]);

	useEffect(() => {
		if (autoFetch) {
			fetchTransactions();
		}
	}, [fetchTransactions, autoFetch]);

	return {
		transactions,
		pagination,
		loading,
		error,
		refetch,
		fetchPage,
		updateFilters,
	};
};

// Hook for recent transactions (used on credit page)
export const useRecentTransactions = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRecentTransactions = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await transactionService.getRecentTransactions(5);

			if (response.success && response.data) {
				setTransactions(response.data);
			} else {
				setError(response.error || 'Failed to fetch recent transactions');
				setTransactions([]);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			setTransactions([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const refetch = useCallback(async () => {
		await fetchRecentTransactions();
	}, [fetchRecentTransactions]);

	useEffect(() => {
		fetchRecentTransactions();
	}, [fetchRecentTransactions]);

	return {
		transactions,
		loading,
		error,
		refetch,
	};
}; 