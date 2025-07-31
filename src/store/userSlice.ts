import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	name?: string; // Computed from firstName + lastName
	email: string;
	password?: string; // Optional in frontend for security
	avatar?: string;
	createdAt?: string;
	updatedAt?: string;
	birthDate?: string;
	gender?: string;
	professionalCategory?: string;
	is_google_account?: boolean;
	isFirstLogin: boolean;
	address?: string;
	city?: string;
	zip?: string;
}

interface UserState {
	currentUser: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
	loginAttempts: number;
	lastLoginAt?: string;
}

const initialState: UserState = {
	currentUser: null,
	isAuthenticated: false,
	loading: false,
	error: null,
	loginAttempts: 0,
	lastLoginAt: undefined,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// Authentication actions
		loginStart: (state) => {
			state.loading = true;
			state.error = null;
		},

		loginSuccess: (state, action: PayloadAction<{ user: User; lastLoginAt: string }>) => {
			state.loading = false;
			state.currentUser = action.payload.user;
			state.isAuthenticated = true;
			state.error = null;
			state.loginAttempts = 0;
			state.lastLoginAt = action.payload.lastLoginAt;

			// Update first time login flag
			if (state.currentUser) {
				state.currentUser.isFirstLogin = false;
			}
		},

		loginFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
			state.loginAttempts += 1;
			state.isAuthenticated = false;
		},

		logout: (state) => {
			state.currentUser = null;
			state.isAuthenticated = false;
			state.error = null;
			state.loginAttempts = 0;
			state.lastLoginAt = undefined;
		},

		logoutStart: (state) => {
			state.loading = true;
			state.error = null;
		},

		logoutSuccess: (state) => {
			state.currentUser = null;
			state.isAuthenticated = false;
			state.error = null;
			state.loginAttempts = 0;
			state.lastLoginAt = undefined;
			state.loading = false;
		},

		logoutFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		// User profile actions
		updateProfile: (state, action: PayloadAction<Partial<User>>) => {
			if (state.currentUser) {
				state.currentUser = {
					...state.currentUser,
					...action.payload,
					updatedAt: new Date().toISOString(),
				};
			}
		},

		updateProfileStart: (state) => {
			state.loading = true;
			state.error = null;
		},

		updateProfileSuccess: (
			state,
			action: PayloadAction<{
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
		) => {
			state.loading = false;
			if (state.currentUser) {
				const updatedUser = {
					...state.currentUser,
					...action.payload.user,
					// Map profession to professionalCategory for frontend compatibility
					professionalCategory:
						action.payload.user.profession || state.currentUser.professionalCategory,
					// Ensure all address fields are properly mapped
					address: action.payload.user.address || state.currentUser.address,
					city: action.payload.user.city || state.currentUser.city,
					zip: action.payload.user.zip || state.currentUser.zip,
					// Ensure other fields are properly mapped
					firstName: action.payload.user.firstName || state.currentUser.firstName,
					lastName: action.payload.user.lastName || state.currentUser.lastName,
					birthDate: action.payload.user.birthDate || state.currentUser.birthDate,
					gender: action.payload.user.gender || state.currentUser.gender,
					updatedAt: action.payload.user.updatedAt,
				};
				console.log('Updated user state:', updatedUser);
				state.currentUser = updatedUser;
			}
			state.error = null;
		},

		updateProfileFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		updatePersonalInfo: (
			state,
			action: PayloadAction<{
				firstName?: string;
				lastName?: string;
				birthDate?: string;
				gender?: string;
				professionalCategory?: string;
			}>
		) => {
			if (state.currentUser) {
				const updates = action.payload;
				state.currentUser = {
					...state.currentUser,
					...updates,
					name:
						updates.firstName && updates.lastName
							? `${updates.firstName} ${updates.lastName}`
							: state.currentUser.name,
					updatedAt: new Date().toISOString(),
				};
			}
		},

		updateAddress: (
			state,
			action: PayloadAction<{
				address?: string;
				city?: string;
				zip?: string;
			}>
		) => {
			if (state.currentUser) {
				state.currentUser = {
					...state.currentUser,
					...action.payload,
					updatedAt: new Date().toISOString(),
				};
			}
		},

		updateAvatar: (state, action: PayloadAction<string>) => {
			if (state.currentUser) {
				state.currentUser.avatar = action.payload;
				state.currentUser.updatedAt = new Date().toISOString();
			}
		},

		updateEmail: (state, action: PayloadAction<string>) => {
			if (state.currentUser) {
				state.currentUser.email = action.payload;
				state.currentUser.updatedAt = new Date().toISOString();
			}
		},

		// Account management
		markEmailVerified: (state) => {
			if (state.currentUser) {
				state.currentUser.updatedAt = new Date().toISOString();
			}
		},

		setFirstTimeLogin: (state, action: PayloadAction<boolean>) => {
			if (state.currentUser) {
				state.currentUser.isFirstLogin = action.payload;
				state.currentUser.updatedAt = new Date().toISOString();
			}
		},

		// Error handling
		clearError: (state) => {
			state.error = null;
		},

		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},

		// Password management (for local state only, never store actual passwords)
		changePasswordStart: (state) => {
			state.loading = true;
			state.error = null;
		},

		changePasswordSuccess: (state) => {
			state.loading = false;
			if (state.currentUser) {
				state.currentUser.updatedAt = new Date().toISOString();
			}
			state.error = null;
		},

		changePasswordFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		// Google account integration
		linkGoogleAccount: (state) => {
			if (state.currentUser) {
				state.currentUser.is_google_account = true;
				state.currentUser.updatedAt = new Date().toISOString();
			}
		},

		unlinkGoogleAccount: (state) => {
			if (state.currentUser) {
				state.currentUser.is_google_account = false;
				state.currentUser.updatedAt = new Date().toISOString();
			}
		},

		// Reset login attempts (for security)
		resetLoginAttempts: (state) => {
			state.loginAttempts = 0;
		},
	},
});

export const {
	loginStart,
	loginSuccess,
	loginFailure,
	logout,
	logoutStart,
	logoutSuccess,
	logoutFailure,
	updateProfile,
	updateProfileStart,
	updateProfileSuccess,
	updateProfileFailure,
	updatePersonalInfo,
	updateAddress,
	updateAvatar,
	updateEmail,
	markEmailVerified,
	setFirstTimeLogin,
	clearError,
	setLoading,
	changePasswordStart,
	changePasswordSuccess,
	changePasswordFailure,
	linkGoogleAccount,
	unlinkGoogleAccount,
	resetLoginAttempts,
} = userSlice.actions;

export default userSlice.reducer;
