import { useCallback, useMemo } from 'react';

import type { ContractDownloadDocument } from '../types/contract';
import { useGenerateDownloadUrlsMutation } from '../store/contractsApi';

interface UseContractDownloadReturn {
	generateDownloadUrls: (contractId: string) => Promise<ContractDownloadDocument[]>;
	isGenerating: boolean;
	error: any;
}

export const useContractDownload = (): UseContractDownloadReturn => {
	const [generateDownloadUrlsMutation, { isLoading: isGenerating, error }] =
		useGenerateDownloadUrlsMutation();

	// Cache for storing download URLs with expiration
	const cache = useMemo(() => new Map<string, { data: ContractDownloadDocument[]; expiresAt: number }>(), []);

	const generateDownloadUrls = useCallback(
		async (contractId: string): Promise<ContractDownloadDocument[]> => {
			const now = Date.now();
			const cacheKey = `download_${contractId}`;
			const cached = cache.get(cacheKey);

			// Check if we have cached data that's still valid (5 minutes = 300,000ms)
			if (cached && cached.expiresAt > now) {
				return cached.data;
			}

			try {
				const response = await generateDownloadUrlsMutation(contractId).unwrap();
				const documents = response.documents;

				// Cache the result for 5 minutes
				const expiresAt = now + 5 * 60 * 1000; // 5 minutes from now
				cache.set(cacheKey, { data: documents, expiresAt });

				return documents;
			} catch (error) {
				console.error('Failed to generate download URLs:', error);
				throw error;
			}
		},
		[generateDownloadUrlsMutation, cache]
	);

	return {
		generateDownloadUrls,
		isGenerating,
		error,
	};
};
