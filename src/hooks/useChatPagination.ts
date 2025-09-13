import { useCallback } from 'react';
import { useChats } from './useChats';
import { useGetChatsQuery } from '../store/chatsApi';

export const useChatPagination = () => {
	const { filters, updateFilters } = useChats();

	// Use RTK Query for data fetching
	const { data: chatsData, isLoading: loading } = useGetChatsQuery(filters || {});

	// Extract data from response
	const chats = chatsData?.chats || [];
	const pagination = chatsData?.pagination;

	// Aller à la page suivante
	const goToNextPage = useCallback(() => {
		if (pagination?.hasNext && !loading) {
			updateFilters({ page: (filters.page || 1) + 1 });
		}
	}, [pagination, loading, filters, updateFilters]);

	// Aller à la page précédente
	const goToPrevPage = useCallback(() => {
		if (pagination?.hasPrev && !loading) {
			updateFilters({ page: (filters.page || 1) - 1 });
		}
	}, [pagination, loading, filters, updateFilters]);

	// Aller à une page spécifique
	const goToPage = useCallback(
		(page: number) => {
			if (page >= 1 && page <= (pagination?.totalPages || 1) && !loading) {
				updateFilters({ page });
			}
		},
		[pagination, loading, updateFilters]
	);

	// Changer la limite d'éléments par page
	const changeLimit = useCallback(
		(limit: number) => {
			updateFilters({ limit, page: 1 });
		},
		[updateFilters]
	);

	// Changer le tri
	const changeSort = useCallback(
		(sortBy: string, sortOrder: 'asc' | 'desc') => {
			updateFilters({ sortBy: sortBy as any, sortOrder, page: 1 });
		},
		[updateFilters]
	);

	// Rechercher
	const search = useCallback(
		(searchTerm: string) => {
			updateFilters({ search: searchTerm, page: 1 });
		},
		[updateFilters]
	);

	// Réinitialiser les filtres
	const resetFilters = useCallback(() => {
		const defaultFilters = {
			page: 1,
			limit: 10,
			sortBy: 'createdAt' as const,
			sortOrder: 'desc' as const,
		};
		updateFilters(defaultFilters);
	}, [updateFilters]);

	return {
		chats,
		loading,
		pagination,
		filters,
		goToNextPage,
		goToPrevPage,
		goToPage,
		changeLimit,
		changeSort,
		search,
		resetFilters,
	};
};
