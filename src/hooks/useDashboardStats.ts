import { useEffect, useState } from 'react';

import type { DashboardStats } from '../types/contract';
import { contractsService } from '../services/coreApi';

interface UseDashboardStatsReturn {
	dashboardStats: DashboardStats | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsReturn {
	const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDashboardStats = async () => {
		try {
			setIsLoading(true);
			setError(null);
			
			const response = await contractsService.getDashboardStats();
			
			if (response.success && response.data) {
				setDashboardStats(response.data);
			} else {
				setError(response.error || 'Erreur lors de la récupération des statistiques');
			}
		} catch (err) {
			console.error('Dashboard stats error:', err);
			setError('Erreur de connexion au serveur');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardStats();
	}, []);

	return {
		dashboardStats,
		isLoading,
		error,
		refetch: fetchDashboardStats,
	};
}
