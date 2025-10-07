import { useCallback, useState } from 'react';

import { showToast } from '../components/ui/Toast';
import { useAppSelector } from '../store/hooks';

interface UseInsufficientCreditsOptions {
  onInsufficientCredits?: () => void;
}

export const useInsufficientCredits = (options: UseInsufficientCreditsOptions = {}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{
    operation?: string;
    requiredCredits?: number;
  }>({});

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentCredits = currentUser?.creditBalance ?? 0;

  const handleInsufficientCredits = useCallback(
    (error: Error, operation?: string, requiredCredits?: number) => {
      // Check if the error is related to insufficient credits
      const isInsufficientCreditsError =
        error.message.toLowerCase().includes('insufficient') ||
        error.message.toLowerCase().includes('crédits') ||
        error.message.toLowerCase().includes('credits') ||
        error.message.toLowerCase().includes('solde') ||
        error.message.toLowerCase().includes('balance');

      if (isInsufficientCreditsError) {
        setErrorDetails({
          operation: operation || 'cette opération',
          requiredCredits,
        });
        setIsModalOpen(true);

        // Show warning toast
        showToast.warning('Crédits insuffisants pour cette opération');

        // Call custom handler if provided
        options.onInsufficientCredits?.();

        return true;
      }

      return false;
    },
    [options]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setErrorDetails({});
  }, []);

  const checkCreditsBeforeOperation = useCallback(
    (requiredCredits: number, operation?: string): boolean => {
      if (currentCredits < requiredCredits) {
        setErrorDetails({
          operation: operation || 'cette opération',
          requiredCredits,
        });
        setIsModalOpen(true);
        showToast.warning(`Crédits insuffisants. Nécessaire : ${requiredCredits}, disponible : ${currentCredits}`);
        return false;
      }
      return true;
    },
    [currentCredits]
  );

  const wrapOperationWithCreditCheck = useCallback(
    (operation: () => Promise<void>, requiredCredits: number, operationName?: string) => {
      return async () => {
        if (!checkCreditsBeforeOperation(requiredCredits, operationName)) {
          return;
        }

        try {
          await operation();
        } catch (error) {
          const handled = handleInsufficientCredits(error as Error, operationName, requiredCredits);

          if (!handled) {
            throw error;
          }
        }
      };
    },
    [checkCreditsBeforeOperation, handleInsufficientCredits]
  );

  return {
    isModalOpen,
    errorDetails,
    currentCredits,
    handleInsufficientCredits,
    checkCreditsBeforeOperation,
    wrapOperationWithCreditCheck,
    closeModal,
  };
};
