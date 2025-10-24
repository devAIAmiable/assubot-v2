import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addComparison, removeComparison, clearComparisons, clearExpiredComparisons, type PastComparison } from '../store/comparisonsSlice';

export const useComparisons = () => {
  const dispatch = useAppDispatch();
  const allComparisons = useAppSelector((state) => state.comparisons?.comparisons || []);
  const loading = useAppSelector((state) => state.comparisons?.loading || false);
  const error = useAppSelector((state) => state.comparisons?.error || null);

  // Filter out expired comparisons automatically
  const validComparisons = useMemo(() => {
    const now = new Date().toISOString().split('T')[0];
    return allComparisons.filter((comparison) => comparison.expiresAt >= now);
  }, [allComparisons]);

  const saveComparison = useCallback(
    (comparisonData: Omit<PastComparison, 'id' | 'date' | 'expiresAt'>) => {
      dispatch(addComparison(comparisonData));
    },
    [dispatch]
  );

  const deleteComparison = useCallback(
    (id: string) => {
      dispatch(removeComparison(id));
    },
    [dispatch]
  );

  const clearAllComparisons = useCallback(() => {
    dispatch(clearComparisons());
  }, [dispatch]);

  const clearExpired = useCallback(() => {
    dispatch(clearExpiredComparisons());
  }, [dispatch]);

  const getComparisonById = useCallback(
    (id: string) => {
      return validComparisons.find((comparison) => comparison.id === id);
    },
    [validComparisons]
  );

  const getComparisonsByType = useCallback(
    (type: string) => {
      return validComparisons.filter((comparison) => comparison.category === type);
    },
    [validComparisons]
  );

  const getRecentComparisons = useCallback(
    (limit = 5) => {
      return validComparisons.slice(0, limit);
    },
    [validComparisons]
  );

  // Pagination utilities
  const getPaginatedComparisons = useCallback(
    (page: number, itemsPerPage: number) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return {
        items: validComparisons.slice(startIndex, endIndex),
        totalItems: validComparisons.length,
        totalPages: Math.ceil(validComparisons.length / itemsPerPage),
        currentPage: page,
        hasNextPage: endIndex < validComparisons.length,
        hasPreviousPage: page > 1,
      };
    },
    [validComparisons]
  );

  // Check if comparison is expired
  const isExpired = useCallback((comparison: PastComparison) => {
    const now = new Date().toISOString().split('T')[0];
    return comparison.expiresAt < now;
  }, []);

  // Get days until expiration
  const getDaysUntilExpiration = useCallback((comparison: PastComparison) => {
    const now = new Date();
    const expirationDate = new Date(comparison.expiresAt);
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, []);

  return {
    // State
    comparisons: validComparisons,
    allComparisons, // Include expired ones if needed
    loading,
    error,

    // Actions
    saveComparison,
    deleteComparison,
    clearAllComparisons,
    clearExpired,

    // Utilities
    getComparisonById,
    getComparisonsByType,
    getRecentComparisons,
    getPaginatedComparisons,
    isExpired,
    getDaysUntilExpiration,
  };
};
