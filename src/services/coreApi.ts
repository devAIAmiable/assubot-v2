import { coreApi } from './api';

// Auth endpoints
export const authService = {
	verify: (token: string) => coreApi.get<{ message: string }>(`/auth/verify/${token}`),
	login: (credentials: { email: string; password: string }) =>
		coreApi.post<{ user: unknown; token: string }>('/auth/login', credentials),
	logout: () => coreApi.post('/auth/logout'),
	refresh: () => coreApi.post<{ token: string }>('/auth/refresh'),
	register: (userData: { email: string; password: string; name: string }) =>
		coreApi.post<{ user: unknown }>('/auth/register', userData),
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
	updateProfile: (profileData: unknown) => coreApi.put<unknown>('/user/profile', profileData),
	changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
		coreApi.put<unknown>('/user/password', passwordData),
	deleteAccount: () => coreApi.delete('/user/account'),
};
