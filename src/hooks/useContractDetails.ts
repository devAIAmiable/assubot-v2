import type { GetContractByIdResponse } from '../types/contract';
// No transformation needed - using backend data directly
import { useGetContractByIdQuery } from '../store/contractsApi';
import { useMemo } from 'react';

interface UseContractDetailsOptions {
  contractId: string;
  enabled?: boolean;
}

interface UseContractDetailsReturn {
  contract: GetContractByIdResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  isError: boolean;
}

export function useContractDetails({ contractId, enabled = true }: UseContractDetailsOptions): UseContractDetailsReturn {
  const { data, isLoading, isFetching, error, isError } = useGetContractByIdQuery(contractId, {
    skip: !enabled || !contractId,
  });

  const contract = useMemo(() => {
    if (!data) return undefined;
    return data; // Use backend data directly
  }, [data]);

  return {
    contract,
    isLoading,
    isFetching,
    error,
    isError,
  };
}
