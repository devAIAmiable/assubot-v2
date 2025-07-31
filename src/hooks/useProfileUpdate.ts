import { updateProfileFailure, updateProfileStart, updateProfileSuccess } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { getUserState } from '../utils/stateHelpers';
import { useCallback } from 'react';
import { userService } from '../services/coreApi';

interface ProfileUpdateData {
	firstName?: string;
	lastName?: string;
	birthDate?: string;
	gender?: string;
	profession?: string;
	address?: string;
	zip?: string;
	city?: string;
}

export const useProfileUpdate = () => {
	const dispatch = useAppDispatch();
	const { loading, error } = useAppSelector(getUserState);

	const updateProfile = useCallback(
		async (profileData: ProfileUpdateData) => {
			dispatch(updateProfileStart());

			try {
				const response = await userService.updateProfile(profileData);

				if (response.success && response.data) {
					dispatch(updateProfileSuccess(response.data));
					return { success: true, message: response.data.message };
				} else {
					dispatch(
						updateProfileFailure(response.error || 'Erreur lors de la mise à jour du profil')
					);
					return { success: false, error: response.error };
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Erreur de connexion au serveur';
				dispatch(updateProfileFailure(errorMessage));
				return { success: false, error: errorMessage };
			}
		},
		[dispatch]
	);

	return {
		updateProfile,
		loading,
		error,
	};
};
