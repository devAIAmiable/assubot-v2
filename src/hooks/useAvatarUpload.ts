import { uploadAvatarFailure, uploadAvatarStart, uploadAvatarSuccess } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { getUserState } from '../utils/stateHelpers';
import { useCallback } from 'react';
import { userService } from '../services/coreApi';

export const useAvatarUpload = () => {
	const dispatch = useAppDispatch();
	const { loading, error } = useAppSelector(getUserState);

	const uploadAvatar = useCallback(
		async (file: File) => {
			dispatch(uploadAvatarStart());

			try {
				// Step 1: Get signed upload URL from backend
				const uploadUrlResponse = await userService.getAvatarUploadUrl(file.type);

				if (!uploadUrlResponse.success || !uploadUrlResponse.data) {
					dispatch(
						uploadAvatarFailure(
							uploadUrlResponse.error || "Erreur lors de la génération de l'URL d'upload"
						)
					);
					return { success: false, error: uploadUrlResponse.error };
				}

				const { uploadUrl, blobName } = uploadUrlResponse.data;

				// Step 2: Upload file directly to Azure Blob Storage
				const uploadResponse = await fetch(uploadUrl, {
					method: 'PUT',
					body: file,
					headers: {
						'Content-Type': file.type,
						'x-ms-blob-type': 'BlockBlob',
					},
				});

				if (!uploadResponse.ok) {
					dispatch(uploadAvatarFailure("Erreur lors de l'upload du fichier"));
					return { success: false, error: "Erreur lors de l'upload du fichier" };
				}

				// Step 3: Confirm upload with backend
				const confirmResponse = await userService.confirmAvatarUpload(blobName);

				if (!confirmResponse.success || !confirmResponse.data) {
					dispatch(
						uploadAvatarFailure(
							confirmResponse.error || "Erreur lors de la confirmation de l'upload"
						)
					);
					return { success: false, error: confirmResponse.error };
				}

				// Step 4: Update Redux state with new avatar URL
				dispatch(uploadAvatarSuccess({ avatarUrl: confirmResponse.data.avatarUrl }));

				// Small delay to ensure backend processing is complete
				await new Promise((resolve) => setTimeout(resolve, 100));

				return {
					success: true,
					message: confirmResponse.data.message,
					avatarUrl: confirmResponse.data.avatarUrl,
				};
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Erreur de connexion au serveur';
				dispatch(uploadAvatarFailure(errorMessage));
				return { success: false, error: errorMessage };
			}
		},
		[dispatch]
	);

	return {
		uploadAvatar,
		loading,
		error,
	};
};
