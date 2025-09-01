import type { DashboardStats } from '../types/contract';
import { useGetDashboardStatsQuery } from '../store/contractsApi';

interface UseDashboardStatsReturn {
	dashboardStats: DashboardStats | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useDashboardStats(): UseDashboardStatsReturn {
	const { data: dashboardStats, isLoading, error, refetch } = useGetDashboardStatsQuery();

	return {
		dashboardStats: dashboardStats || null,
		isLoading,
		error: error ? (error as { message: string }).message || 'Erreur lors de la récupération des statistiques' : null,
		refetch,
	};
}
