import { contractsService } from '../services/coreApi';
import { useState } from 'react';

interface UseContractSummarizeReturn {
  isSummarizing: boolean;
  error: string | null;
  summarizeContract: (contractId: string) => Promise<void>;
}

/**
 * Hook for summarizing a contract
 * Calls the /api/v1/contracts/{id}/summarize endpoint
 */
export const useContractSummarize = (): UseContractSummarizeReturn => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarizeContract = async (contractId: string): Promise<void> => {
    if (isSummarizing) return;

    setIsSummarizing(true);
    setError(null);

    try {
      await contractsService.summarize(contractId);
      // API returns no body, so we just need to handle success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération du résumé du contrat';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSummarizing(false);
    }
  };

  return {
    isSummarizing,
    error,
    summarizeContract,
  };
};
