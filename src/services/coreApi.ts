import type { ServiceResponse } from './api';
import config from '../config/env';
import { coreApi } from './api';

// Auth endpoints
export const authService = {
	verify: async (token: string): Promise<ServiceResponse<{ message: string }>> => {
		try {
			const response = await coreApi.get<{ message: string }>(`/auth/verify/${token}`);

			if (response.success && response.status === 'success') {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || 'Verification failed',
			};
		} catch (error) {
			console.error('Auth service error:', error);
			return {
				success: false,
				error: 'Network error occurred',
			};
		}
	},

	login: async (credentials: {
		email: string;
		password: string;
	}): Promise<
		ServiceResponse<{
			user: {
				id: string;
				email: string;
				firstName: string;
				lastName: string;
				isFirstLogin: boolean;
			};
			message: string;
		}>
	> => {
		try {
			const response = await coreApi.post<{
				message: string;
				user: {
					id: string;
					email: string;
					firstName: string;
					lastName: string;
					isFirstLogin: boolean;
				};
			}>('/auth/login', credentials);
			console.log('🚀 ~ response:', response);

			if (response.success && response.status === 'success') {
				return {
					success: true,
					data: null,
				};
			}

			return {
				success: false,
				error: response.error?.message || 'Email ou mot de passe incorrect',
			};
		} catch (error) {
			console.error('Login error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	logout: async (): Promise<ServiceResponse<void>> => {
		try {
			const response = await coreApi.post('/auth/logout');

			if (response.success) {
				return { success: true };
			}

			return {
				success: false,
				error: response.error?.message || 'Logout failed',
			};
		} catch (error) {
			console.error('Logout error:', error);
			return {
				success: false,
				error: 'Network error occurred',
			};
		}
	},

	// Get full user profile after login
	getUserProfile: async (): Promise<
		ServiceResponse<{
			user: {
				id: string;
				email: string;
				firstName: string;
				lastName: string;
				birthDate?: string;
				gender?: string;
				profession?: string;
				provider: string;
				isFirstLogin: boolean;
				isActive: boolean;
				isVerified: boolean;
				acceptedTerms: boolean;
				termsAcceptedAt?: string;
				createdAt: string;
				updatedAt: string;
				address?: string;
				city?: string;
				zip?: string;
			};
			message: string;
		}>
	> => {
		try {
			const response = await coreApi.get<{
				message: string;
				user: {
					id: string;
					email: string;
					firstName: string;
					lastName: string;
					birthDate?: string;
					gender?: string;
					profession?: string;
					provider: string;
					isFirstLogin: boolean;
					isActive: boolean;
					isVerified: boolean;
					acceptedTerms: boolean;
					termsAcceptedAt?: string;
					createdAt: string;
					updatedAt: string;
					address?: string;
					city?: string;
					zip?: string;
				};
			}>('/auth/me');

			if (response.success && response.status === 'success' && response.data?.user) {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || 'Impossible de récupérer le profil utilisateur',
			};
		} catch (error) {
			console.error('Get user profile error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	// Alternative session check endpoint (if /auth/session doesn't work)
	checkAuthStatus: async (): Promise<
		ServiceResponse<{
			user: {
				id: string;
				email: string;
				firstName: string;
				lastName: string;
				isFirstLogin: boolean;
			};
			message: string;
		}>
	> => {
		try {
			const response = await coreApi.get<{
				message: string;
				user: {
					id: string;
					email: string;
					firstName: string;
					lastName: string;
					isFirstLogin: boolean;
				};
			}>('/auth/me');

			if (response.success && response.status === 'success' && response.data?.user) {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || 'Session non valide',
			};
		} catch (error) {
			console.error('Auth status check error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	forgotPassword: async (email: string): Promise<ServiceResponse<{ message: string }>> => {
		try {
			const response = await coreApi.post<{ message: string }>('/auth/forgot-password', { email });

			if (response.success && response.status === 'success') {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || "Erreur lors de l'envoi de l'email",
			};
		} catch (error) {
			console.error('Forgot password error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	resetPassword: async (
		token: string,
		password: string
	): Promise<ServiceResponse<{ message: string }>> => {
		try {
			const response = await coreApi.post<{ message: string }>('/auth/reset-password', {
				token,
				password,
			});

			console.log('🔧 Raw API response:', response);

			if (response.success && response.status === 'success') {
				console.log('✅ Service response success');
				return {
					success: true,
					data: response.data,
				};
			}

			console.log('❌ Service response failed:', response.error);
			return {
				success: false,
				error: response.error?.message || 'Erreur lors de la réinitialisation du mot de passe',
			};
		} catch (error) {
			console.error('🚨 Reset password service error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	refresh: async (): Promise<ServiceResponse<{ token: string }>> => {
		try {
			const response = await coreApi.post<{ token: string }>('/auth/refresh');

			if (response.success && response.data) {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || 'Token refresh failed',
			};
		} catch (error) {
			console.error('Refresh error:', error);
			return {
				success: false,
				error: 'Network error occurred',
			};
		}
	},

	signup: async (userData: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		birthDate: string;
		gender: string;
		profession: string;
		acceptedTerms: boolean;
	}): Promise<ServiceResponse<{ user: unknown; message: string }>> => {
		try {
			const response = await coreApi.post<{ user: unknown; message: string }>(
				'/auth/register',
				userData
			);

			if (response.success && response.status === 'success') {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || "Erreur lors de l'inscription",
			};
		} catch (error) {
			console.error('Signup error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	googleSignup: async (): Promise<ServiceResponse<{ redirectUrl: string }>> => {
		try {
			// Use window.location.href to directly redirect to the backend endpoint
			// This avoids CORS issues since it's a full page navigation
			window.location.href = `${config.coreApiUrl}/auth/google`;

			// This return statement won't be reached due to the redirect
			return {
				success: false,
				error: 'Redirecting...',
			};
		} catch (error) {
			console.error('Google signup init error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	checkGoogleAuthStatus: async (): Promise<
		ServiceResponse<{
			user: {
				id: string;
				email: string;
				firstName: string;
				lastName: string;
				isFirstLogin: boolean;
			};
			message: string;
		}>
	> => {
		try {
			const response = await coreApi.get<{
				message: string;
				user: {
					id: string;
					email: string;
					firstName: string;
					lastName: string;
					isFirstLogin: boolean;
				};
			}>('/auth/google/status');

			if (response.success && response.status === 'success' && response.data?.user) {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || 'Échec de la vérification Google',
			};
		} catch (error) {
			console.error('Google auth status check error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},
};

// Contract endpoints
export const contractsService = {
	getAll: () => coreApi.get<unknown[]>('/contracts'),
	getById: (id: string) => coreApi.get<unknown>(`/contracts/${id}`),
	create: (contractData: unknown) => coreApi.post<unknown>('/contracts', contractData),
	update: (id: string, contractData: unknown) =>
		coreApi.put<unknown>(`/contracts/${id}`, contractData),
	delete: (id: string) => coreApi.delete(`/contracts/${id}`),
	uploadDocument: (contractId: string, documentData: FormData) =>
		coreApi.post<unknown>(`/contracts/${contractId}/documents`, documentData),
};

// Comparison endpoints
export const comparisonService = {
	create: (comparisonData: unknown) => coreApi.post<unknown>('/comparisons', comparisonData),
	getById: (id: string) => coreApi.get<unknown>(`/comparisons/${id}`),
	getAll: () => coreApi.get<unknown[]>('/comparisons'),
	delete: (id: string) => coreApi.delete(`/comparisons/${id}`),
};

// Notification endpoints
export const notificationsService = {
	getAll: () => coreApi.get<unknown[]>('/notifications'),
	markAsRead: (id: string) => coreApi.patch<unknown>(`/notifications/${id}/read`),
	markAllAsRead: () => coreApi.patch<unknown>('/notifications/read-all'),
	delete: (id: string) => coreApi.delete(`/notifications/${id}`),
	updatePreferences: (preferences: unknown) =>
		coreApi.put<unknown>('/notifications/preferences', preferences),
};

// User profile endpoints
export const userService = {
	getProfile: () => coreApi.get<unknown>('/user/profile'),
	updateProfile: async (profileData: {
		firstName?: string;
		lastName?: string;
		birthDate?: string;
		gender?: string;
		profession?: string;
		address?: string;
		zip?: string;
		city?: string;
	}): Promise<
		ServiceResponse<{
			message: string;
			user: {
				id: string;
				email: string;
				firstName: string;
				lastName: string;
				birthDate?: string;
				gender?: string;
				profession?: string;
				provider: string;
				isFirstLogin: boolean;
				isActive: boolean;
				isVerified: boolean;
				acceptedTerms: boolean;
				termsAcceptedAt?: string;
				createdAt: string;
				updatedAt: string;
				address?: string;
				city?: string;
				zip?: string;
			};
		}>
	> => {
		try {
			const response = await coreApi.patch<{
				message: string;
				user: {
					id: string;
					email: string;
					firstName: string;
					lastName: string;
					birthDate?: string;
					gender?: string;
					profession?: string;
					provider: string;
					isFirstLogin: boolean;
					isActive: boolean;
					isVerified: boolean;
					acceptedTerms: boolean;
					termsAcceptedAt?: string;
					createdAt: string;
					updatedAt: string;
					address?: string;
					city?: string;
					zip?: string;
				};
			}>('/users/profile', profileData);

			if (response.success && response.status === 'success') {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || 'Erreur lors de la mise à jour du profil',
			};
		} catch (error) {
			console.error('Profile update error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},
	changePassword: async (passwordData: {
		currentPassword: string;
		newPassword: string;
	}): Promise<ServiceResponse<{ message: string }>> => {
		try {
			const response = await coreApi.patch<{ message: string }>(
				'/users/change-password',
				passwordData
			);

			if (response.success && response.status === 'success') {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || 'Erreur lors du changement de mot de passe',
			};
		} catch (error) {
			console.error('Change password error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	// Avatar upload endpoints
	getAvatarUploadUrl: async (
		contentType: string
	): Promise<
		ServiceResponse<{
			uploadUrl: string;
			blobName: string;
		}>
	> => {
		try {
			const response = await coreApi.post<{
				uploadUrl: string;
				blobName: string;
			}>('/users/avatar/upload-url', { contentType });

			if (response.success && response.status === 'success') {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || "Erreur lors de la génération de l'URL d'upload",
			};
		} catch (error) {
			console.error('Avatar upload URL error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	confirmAvatarUpload: async (
		blobName: string
	): Promise<
		ServiceResponse<{
			message: string;
			avatarUrl: string;
		}>
	> => {
		try {
			const response = await coreApi.post<{
				message: string;
				avatarUrl: string;
			}>('/users/avatar/confirm', { blobName });

			if (response.success && response.status === 'success') {
				return {
					success: true,
					data: response.data,
				};
			}

			return {
				success: false,
				error: response.error?.message || "Erreur lors de la confirmation de l'upload",
			};
		} catch (error) {
			console.error('Avatar confirm error:', error);
			return {
				success: false,
				error: 'Erreur de connexion au serveur',
			};
		}
	},

	deleteAccount: () => coreApi.delete('/user/account'),
};
