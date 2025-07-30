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
	zipcode?: string;
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
				zipcode?: string;
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
		changePasswordSuccess: (state) => {
			if (state.currentUser) {
				state.currentUser.updatedAt = new Date().toISOString();
			}
			state.error = null;
		},

		changePasswordFailure: (state, action: PayloadAction<string>) => {
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
	updateProfile,
	updatePersonalInfo,
	updateAddress,
	updateAvatar,
	updateEmail,
	markEmailVerified,
	setFirstTimeLogin,
	clearError,
	setLoading,
	changePasswordSuccess,
	changePasswordFailure,
	linkGoogleAccount,
	unlinkGoogleAccount,
	resetLoginAttempts,
} = userSlice.actions;

export default userSlice.reducer;
