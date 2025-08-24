import type { ContractWithRelations } from '../types/contract';
import { transformBackendContract } from '../utils/contractTransformers';
import { useGetContractByIdQuery } from '../store/contractsApi';
import { useMemo } from 'react';

interface UseContractDetailsOptions {
	contractId: string;
	enabled?: boolean;
}

interface UseContractDetailsReturn {
	contract: ContractWithRelations | undefined;
	isLoading: boolean;
	isFetching: boolean;
	error: any;
	isError: boolean;
}

export function useContractDetails({ contractId, enabled = true }: UseContractDetailsOptions): UseContractDetailsReturn {
	const { data, isLoading, isFetching, error, isError } = useGetContractByIdQuery(contractId, {
		skip: !enabled || !contractId,
	});

	// Transform backend contract to frontend format
	const contract = useMemo(() => {
		if (!data) return undefined;
		return transformBackendContract(data);
	}, [data]);

	return {
		contract,
		isLoading,
		isFetching,
		error,
		isError,
	};
}
