import { logoutStart, logoutSuccess } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { authService } from '../services/coreApi';
import { clearChat } from '../store/chatSlice';
import { clearComparisons } from '../store/comparisonsSlice';
import { clearContracts } from '../store/contractsSlice';
import { getUserState } from '../utils/stateHelpers';
import { useCallback } from 'react';

export const useLogout = () => {
	const dispatch = useAppDispatch();
	const { loading, error } = useAppSelector(getUserState);

	const clearState = useCallback(() => {
		dispatch(logoutSuccess());
		dispatch(clearContracts());
		dispatch(clearChat());
		dispatch(clearComparisons());
	}, []);

	const logout = useCallback(async () => {
		dispatch(logoutStart());

		try {
			// Call the logout API endpoint
			await authService.logout();
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			clearState();
		}
	}, []);

	return {
		logout,
		loading,
		error,
	};
};
