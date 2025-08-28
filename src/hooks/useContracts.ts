import type {
	ContractCategory,
	ContractListItem,
	ContractStatus,
} from '../types/contract';
import { useCallback, useMemo, useState } from 'react';

import { transformBackendContractListItems } from '../utils/contractTransformers';
import { useGetContractsQuery } from '../store/contractsApi';

interface UseContractsOptions {
	initialPage?: number;
	initialLimit?: number;
	initialCategory?: ContractCategory | 'all';
	initialStatus?: ContractStatus | 'all';
	initialSearch?: string;
}

interface UseContractsReturn {
	// Data
	contracts: ContractListItem[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};

	// Loading and error states
	isLoading: boolean;
	isFetching: boolean;
	error: string | null;

	// Filters
	searchQuery: string;
	selectedCategory: ContractCategory | 'all';
	selectedStatus: ContractStatus | 'all';

	// Actions
	setPage: (page: number) => void;
	setLimit: (limit: number) => void;
	setSearchQuery: (query: string) => void;
	setCategory: (category: ContractCategory | 'all') => void;
	setStatus: (status: ContractStatus | 'all') => void;
	resetFilters: () => void;

	// Computed values
	filteredContracts: ContractListItem[];
	contractStats: {
		total: number;
		active: number;
		expired: number;
		totalPremium: number;
	};
}

export function useContracts(options: UseContractsOptions = {}): UseContractsReturn {
	const {
		initialPage = 1,
		initialLimit = 10,
		initialCategory = 'all',
		initialStatus = 'all',
		initialSearch = '',
	} = options;

	// Local state for filters
	const [page, setPage] = useState(initialPage);
	const [limit, setLimit] = useState(initialLimit);
	const [searchQuery, setSearchQuery] = useState(initialSearch);
	const [selectedCategory, setSelectedCategory] = useState<ContractCategory | 'all'>(
		initialCategory
	);
	const [selectedStatus, setSelectedStatus] = useState<ContractStatus | 'all'>(initialStatus);

	// API query
	const { data, isLoading, isFetching, error } = useGetContractsQuery({
		page,
		limit,
	});

	// Extract data from API response
	const contracts = useMemo(() => {
		if (!data?.data) return [];
		return transformBackendContractListItems(data.data);
	}, [data]);

	const pagination = useMemo(() => {
		if (!data?.pagination) {
			return {
				page: 1,
				limit: 10,
				total: 0,
				totalPages: 0,
				hasNext: false,
				hasPrev: false,
			};
		}
		return data.pagination;
	}, [data]);

	// Filter contracts based on local filters
	const filteredContracts = useMemo(() => {
		return contracts.filter((contract) => {
			const matchesSearch =
				searchQuery === '' ||
				contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				contract.insurerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				false;

			const matchesCategory = selectedCategory === 'all' || contract.category === selectedCategory;
			const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus;

			return matchesSearch && matchesCategory && matchesStatus;
		});
	}, [contracts, searchQuery, selectedCategory, selectedStatus]);

	// Contract statistics from API metadata
	const contractStats = useMemo(() => {
		if (!data?.metadata) {
			return {
				total: 0,
				active: 0,
				expired: 0,
				totalPremium: 0,
			};
		}

		return {
			total: data.metadata.totalContracts,
			active: data.metadata.totalValid,
			expired: data.metadata.totalExpired,
			totalPremium: data.metadata.totalAnnualPremiumCents,
		};
	}, [data?.metadata]);

	// Actions
	const setPageHandler = useCallback((newPage: number) => {
		setPage(Math.max(1, newPage));
	}, []);

	const setLimitHandler = useCallback((newLimit: number) => {
		setLimit(Math.min(Math.max(1, newLimit), 100));
		setPage(1); // Reset to first page when changing limit
	}, []);

	const setSearchQueryHandler = useCallback((query: string) => {
		setSearchQuery(query);
		setPage(1); // Reset to first page when searching
	}, []);

	const setCategoryHandler = useCallback((category: ContractCategory | 'all') => {
		setSelectedCategory(category);
		setPage(1); // Reset to first page when changing category
	}, []);

	const setStatusHandler = useCallback((status: ContractStatus | 'all') => {
		setSelectedStatus(status);
		setPage(1); // Reset to first page when changing status
	}, []);

	const resetFilters = useCallback(() => {
		setSearchQuery('');
		setSelectedCategory('all');
		setSelectedStatus('all');
		setPage(1);
	}, []);

	return {
		// Data
		contracts,
		pagination,

		// Loading and error states
		isLoading,
		isFetching,
		error: error ? (error as any)?.message || 'Une erreur est survenue' : null,

		// Filters
		searchQuery,
		selectedCategory,
		selectedStatus,

		// Actions
		setPage: setPageHandler,
		setLimit: setLimitHandler,
		setSearchQuery: setSearchQueryHandler,
		setCategory: setCategoryHandler,
		setStatus: setStatusHandler,
		resetFilters,

		// Computed values
		filteredContracts,
		contractStats,
	};
}
