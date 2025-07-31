import {
	changePasswordFailure,
	changePasswordStart,
	changePasswordSuccess,
} from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { getUserState } from '../utils/stateHelpers';
import { useCallback } from 'react';
import { userService } from '../services/coreApi';

interface PasswordChangeData {
	currentPassword: string;
	newPassword: string;
}

export const usePasswordChange = () => {
	const dispatch = useAppDispatch();
	const { loading, error } = useAppSelector(getUserState);

	const changePassword = useCallback(
		async (passwordData: PasswordChangeData) => {
			dispatch(changePasswordStart());

			try {
				const response = await userService.changePassword(passwordData);

				if (response.success && response.data) {
					dispatch(changePasswordSuccess());
					return { success: true, message: response.data.message };
				} else {
					dispatch(changePasswordFailure(response.error || 'Erreur lors du changement de mot de passe'));
					return { success: false, error: response.error };
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion au serveur';
				dispatch(changePasswordFailure(errorMessage));
				return { success: false, error: errorMessage };
			}
		},
		[dispatch]
	);

	return {
		changePassword,
		loading,
		error,
	};
}; 