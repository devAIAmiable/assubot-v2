import { useEffect } from 'react';

type ContractSummarizedEvent = CustomEvent<{ contractId: string; status: string }>;

export const useContractSummarizationListener = (contractId: string | undefined, refetch: () => void) => {
  useEffect(() => {
    if (!contractId) {
      return undefined;
    }

    const handleContractSummarized = (event: Event) => {
      const customEvent = event as ContractSummarizedEvent;

      if (customEvent.detail.contractId === contractId && customEvent.detail.status === 'success') {
        refetch();
      }
    };

    window.addEventListener('contract_summarized', handleContractSummarized);

    return () => {
      window.removeEventListener('contract_summarized', handleContractSummarized);
    };
  }, [contractId, refetch]);
};
