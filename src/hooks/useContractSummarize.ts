import { contractsService } from '../services/coreApi';
import { showToast } from '../components/ui/Toast';
import { useInsufficientCredits } from './useInsufficientCredits';
import { useRealtimeUpdates } from './useRealtimeUpdates';
import { useState } from 'react';

interface UseContractSummarizeReturn {
  isSummarizing: boolean;
  error: string | null;
  summarizeContract: (contractId: string) => Promise<void>;
  getContractProcessingStatus: (contractId: string) => 'idle' | 'processing' | 'completed' | 'failed' | null;
  isContractProcessing: (contractId: string) => boolean;
  insufficientCredits: {
    isModalOpen: boolean;
    errorDetails: { operation?: string; requiredCredits?: number };
    currentCredits: number;
    closeModal: () => void;
  };
}

/**
 * Hook for summarizing a contract with real-time status tracking
 * Calls the /api/v1/contracts/{id}/summarize endpoint and tracks progress via Socket.IO
 */
export const useContractSummarize = (): UseContractSummarizeReturn => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getContractProcessingStatus, isContractProcessing } = useRealtimeUpdates();

  const insufficientCredits = useInsufficientCredits();

  const summarizeContract = async (contractId: string): Promise<void> => {
    if (isSummarizing) return;

    setIsSummarizing(true);
    setError(null);

    try {
      showToast.loading('Démarrage de la génération du résumé...');

      await contractsService.summarize(contractId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération du résumé du contrat';
      setError(errorMessage);

      const handled = insufficientCredits.handleInsufficientCredits(err as Error, 'la génération du résumé du contrat', 1);

      if (!handled) {
        showToast.error(errorMessage);
      }

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
    insufficientCredits,
  };
};
