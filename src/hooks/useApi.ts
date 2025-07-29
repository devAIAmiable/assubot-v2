import { useCallback, useState } from 'react';

import type { ApiResponse } from '../services/api';

interface UseApiState<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
	execute: (...args: unknown[]) => Promise<void>;
	reset: () => void;
}

export function useApi<T = unknown>(
	apiCall: (...args: unknown[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> {
	const [state, setState] = useState<UseApiState<T>>({
		data: null,
		loading: false,
		error: null,
	});

	const execute = useCallback(
		async (...args: unknown[]) => {
			setState((prev) => ({ ...prev, loading: true, error: null }));

			try {
				const response = await apiCall(...args);

				if (response.success && response.data) {
					setState({
						data: response.data.resource,
						loading: false,
						error: null,
					});
				} else {
					setState({
						data: null,
						loading: false,
						error: response.error?.message || 'Une erreur est survenue',
					});
				}
			} catch (error) {
				setState({
					data: null,
					loading: false,
					error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
				});
			}
		},
		[apiCall]
	);

	const reset = useCallback(() => {
		setState({
			data: null,
			loading: false,
			error: null,
		});
	}, []);

	return {
		...state,
		execute,
		reset,
	};
}
