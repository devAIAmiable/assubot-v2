import { useDeleteContractMutation, useUpdateContractMutation } from '../store/contractsApi';

import type { UpdateContractRequest } from '../types';
import { useCallback } from 'react';

interface UseContractOperationsReturn {
	// Update operations
	updateContract: (contractId: string, updates: UpdateContractRequest) => Promise<void>;
	isUpdating: boolean;
	updateError: string | null;

	// Delete operations
	deleteContract: (contractId: string) => Promise<void>;
	isDeleting: boolean;
	deleteError: string | null;
}

export function useContractOperations(): UseContractOperationsReturn {
	const [updateContractMutation, { isLoading: isUpdating, error: updateError }] =
		useUpdateContractMutation();
	const [deleteContractMutation, { isLoading: isDeleting, error: deleteError }] =
		useDeleteContractMutation();

	const updateContract = useCallback(
		async (contractId: string, updates: UpdateContractRequest) => {
			await updateContractMutation({ contractId, updates }).unwrap();
		},
		[updateContractMutation]
	);

	const deleteContract = useCallback(
		async (contractId: string) => {
			await deleteContractMutation(contractId).unwrap();
		},
		[deleteContractMutation]
	);

	return {
		// Update operations
		updateContract,
		isUpdating,
		updateError: updateError
			? (updateError as { message?: string })?.message || 'Erreur lors de la mise à jour'
			: null,

		// Delete operations
		deleteContract,
		isDeleting,
		deleteError: deleteError
			? (deleteError as { message?: string })?.message || 'Erreur lors de la suppression'
			: null,
	};
}
