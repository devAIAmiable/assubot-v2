import { useState, useEffect } from 'react';
import { creditService, type CreditPack } from '../services/creditService';

interface UseCreditPacksReturn {
	creditPacks: CreditPack[];
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export const useCreditPacks = (): UseCreditPacksReturn => {
	const [creditPacks, setCreditPacks] = useState<CreditPack[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCreditPacks = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await creditService.getCreditPacks();

			if (response.success && response.data) {
				setCreditPacks(response.data);
			} else {
				setError(response.error || 'Failed to fetch credit packs');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCreditPacks();
	}, []);

	return {
		creditPacks,
		loading,
		error,
		refetch: fetchCreditPacks,
	};
}; 