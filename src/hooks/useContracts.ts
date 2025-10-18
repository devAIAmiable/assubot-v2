import type { ContractCategory, ContractListItem, ContractStatus } from '../types/contract';
import { useCallback, useMemo, useState } from 'react';

// No transformation needed - using backend data directly
import { useGetContractsQuery } from '../store/contractsApi';

interface UseContractsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialCategory?: ContractCategory | 'all';
  initialStatus?: ContractStatus | 'all';
  initialSearch?: string;
  initialSortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'annualPremiumCents' | 'name' | 'category' | 'status';
  initialSortOrder?: 'asc' | 'desc';
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
  selectedSortBy: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'annualPremiumCents' | 'name' | 'category' | 'status';
  selectedSortOrder: 'asc' | 'desc';

  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: ContractCategory | 'all') => void;
  setStatus: (status: ContractStatus | 'all') => void;
  setSortBy: (sortBy: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'annualPremiumCents' | 'name' | 'category' | 'status') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
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
    initialSortBy = 'createdAt',
    initialSortOrder = 'desc',
  } = options;

  // Local state for filters
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<ContractCategory | 'all'>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<ContractStatus | 'all'>(initialStatus);
  const [selectedSortBy, setSelectedSortBy] = useState<'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'annualPremiumCents' | 'name' | 'category' | 'status'>(initialSortBy);
  const [selectedSortOrder, setSelectedSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  // API query
  const { data, isLoading, isFetching, error } = useGetContractsQuery({
    page,
    limit,
    search: searchQuery,
    category: selectedCategory,
    sortBy: selectedSortBy,
    sortOrder: selectedSortOrder,
  });

  // Use backend data directly (no transformation needed)
  const contracts = useMemo(() => {
    if (!data?.data) return [];
    return data.data;
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
        searchQuery === '' || contract.name.toLowerCase().includes(searchQuery.toLowerCase()) || contract.insurer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;

      const matchesCategory = selectedCategory === 'all' || contract.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [contracts, searchQuery, selectedCategory]);

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

  const setSortByHandler = useCallback((sortBy: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'annualPremiumCents' | 'name' | 'category' | 'status') => {
    setSelectedSortBy(sortBy);
    setPage(1); // Reset to first page when changing sort
  }, []);

  const setSortOrderHandler = useCallback((sortOrder: 'asc' | 'desc') => {
    setSelectedSortOrder(sortOrder);
    setPage(1); // Reset to first page when changing sort order
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSortBy('createdAt');
    setSelectedSortOrder('desc');
    setPage(1);
  }, []);

  return {
    // Data
    contracts,
    pagination,

    // Loading and error states
    isLoading,
    isFetching,
    error: error ? (error as { message?: string })?.message || 'Une erreur est survenue' : null,

    // Filters
    searchQuery,
    selectedCategory,
    selectedStatus,
    selectedSortBy,
    selectedSortOrder,

    // Actions
    setPage: setPageHandler,
    setLimit: setLimitHandler,
    setSearchQuery: setSearchQueryHandler,
    setCategory: setCategoryHandler,
    setStatus: setStatusHandler,
    setSortBy: setSortByHandler,
    setSortOrder: setSortOrderHandler,
    resetFilters,

    // Computed values
    filteredContracts,
    contractStats,
  };
}
