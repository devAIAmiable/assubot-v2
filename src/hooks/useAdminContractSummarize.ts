import { startProcessing, stopProcessing } from '../store/contractProcessingSlice';

import { showToast } from '../components/ui/Toast';
import { useAppDispatch } from '../store/hooks';
import { useRealtimeUpdates } from './useRealtimeUpdates';
import { useState } from 'react';
import { useSummarizeAdminTemplateContractMutation } from '../store/contractsApi';

interface UseAdminContractSummarizeReturn {
  isSummarizing: boolean;
  error: string | null;
  summarizeContract: (contractId: string) => Promise<void>;
  getContractProcessingStatus: (contractId: string) => 'idle' | 'processing' | 'completed' | 'failed' | null;
  isContractProcessing: (contractId: string) => boolean;
}

/**
 * Hook for summarizing an admin template contract with real-time status tracking
 * Calls the /api/v1/admin/contracts/{id}/summarize endpoint and tracks progress via Socket.IO
 * Note: Admin operations don't require credits
 */
export const useAdminContractSummarize = (): UseAdminContractSummarizeReturn => {
  const dispatch = useAppDispatch();
  const [summarizeMutation] = useSummarizeAdminTemplateContractMutation();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getContractProcessingStatus, isContractProcessing } = useRealtimeUpdates();

  const summarizeContract = async (contractId: string): Promise<void> => {
    if (isSummarizing) return;

    setIsSummarizing(true);
    setError(null);

    try {
      dispatch(startProcessing(contractId));

      await summarizeMutation(contractId).unwrap();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération du résumé du contrat';
      setError(errorMessage);

      // Show error toast for admin operations (no credit checking needed)
      showToast.error(errorMessage);

      dispatch(stopProcessing(contractId));

      throw err;
    } finally {
      setIsSummarizing(false);
    }
  };

  return {
    isSummarizing,
    error,
    summarizeContract,
    getContractProcessingStatus,
    isContractProcessing,
  };
};
