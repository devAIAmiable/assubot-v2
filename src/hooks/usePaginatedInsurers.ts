import { useState, useEffect, useCallback, useRef } from 'react';
import { useGetInsurersQuery, type Insurer } from '../store/insurersApi';

interface UsePaginatedInsurersOptions {
  searchQuery: string;
  limit?: number;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'rating' | 'country' | 'isActive';
  sortOrder?: 'asc' | 'desc';
}

interface UsePaginatedInsurersReturn {
  insurers: Insurer[];
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

/**
 * Custom hook for paginated insurer data fetching with search and infinite scroll support
 */
export const usePaginatedInsurers = ({ searchQuery, limit = 20, isActive = true, sortBy = 'name', sortOrder = 'asc' }: UsePaginatedInsurersOptions): UsePaginatedInsurersReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allInsurers, setAllInsurers] = useState<Insurer[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isMountedRef = useRef(true);

  // RTK Query hook for fetching insurers
  const {
    data: insurersData,
    isLoading,
    error,
  } = useGetInsurersQuery(
    {
      page: currentPage,
      limit,
      search: searchQuery.trim() || undefined,
      isActive,
      sortBy,
      sortOrder,
    },
    {
      skip: false,
    }
  );

  // Reset pagination state when search query changes
  useEffect(() => {
    setCurrentPage(1);
    setAllInsurers([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [searchQuery]);

  // Update insurers data when new data arrives
  useEffect(() => {
    if (insurersData?.data && isMountedRef.current) {
      if (currentPage === 1) {
        // First page - replace all insurers
        setAllInsurers(insurersData.data);
      } else {
        // Subsequent page - append new insurers, avoiding duplicates
        setAllInsurers((prev) => {
          const existingIds = new Set(prev.map((insurer) => insurer.id));
          const newInsurers = insurersData.data.filter((insurer) => !existingIds.has(insurer.id));
          return [...prev, ...newInsurers];
        });
      }
      setHasMore(insurersData.pagination?.hasNext || false);
    }
  }, [insurersData, currentPage]);

  // Reset loading more state when data arrives
  useEffect(() => {
    if (insurersData && isLoadingMore && isMountedRef.current) {
      setIsLoadingMore(false);
    }
  }, [insurersData, isLoadingMore]);

  // Load more function for pagination
  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading && isMountedRef.current) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore, isLoadingMore, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    insurers: allInsurers,
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore,
    error: error ? 'An error occurred while fetching insurers' : null,
  };
};
