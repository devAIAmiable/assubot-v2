import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface User {
	id: string;
	first_name: string;
	last_name: string;
	name: string;
	email: string;
	password?: string; // Optional in frontend for security
	avatar?: string;
	created_at?: string;
	updated_at?: string;
	birth_date?: string;
	gender?: string;
	professional_category?: string;
	is_google_account: boolean;
	is_first_time_login: boolean;
	email_verification_token?: string;
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
	currentUser: {
		id: '1',
		first_name: 'Mario',
		last_name: 'Gbokede',
		name: 'Mario Gbokede',
		email: 'mario.gbokede@a-lamiable.com',
		avatar: '/avatars/avatar.png',
		created_at: '2024-01-15T10:30:00Z',
		updated_at: '2024-11-20T14:22:00Z',
		birth_date: '1993-06-15',
		gender: 'Homme',
		professional_category: 'Cadre',
		is_google_account: false,
		is_first_time_login: false,
		address: '123 Rue de la République',
		city: 'Vélizy-Villacoublay',
		zipcode: '78140',
	},
	isAuthenticated: true,
	loading: false,
	error: null,
	loginAttempts: 0,
	lastLoginAt: '2024-11-20T14:22:00Z',
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
				state.currentUser.is_first_time_login = false;
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
					updated_at: new Date().toISOString(),
				};
			}
		},
		
		updatePersonalInfo: (state, action: PayloadAction<{
			first_name?: string;
			last_name?: string;
			birth_date?: string;
			gender?: string;
			professional_category?: string;
		}>) => {
			if (state.currentUser) {
				const updates = action.payload;
				state.currentUser = {
					...state.currentUser,
					...updates,
					name: updates.first_name && updates.last_name 
						? `${updates.first_name} ${updates.last_name}`
						: state.currentUser.name,
					updated_at: new Date().toISOString(),
				};
			}
		},
		
		updateAddress: (state, action: PayloadAction<{
			address?: string;
			city?: string;
			zipcode?: string;
		}>) => {
			if (state.currentUser) {
				state.currentUser = {
					...state.currentUser,
					...action.payload,
					updated_at: new Date().toISOString(),
				};
			}
		},
		
		updateAvatar: (state, action: PayloadAction<string>) => {
			if (state.currentUser) {
				state.currentUser.avatar = action.payload;
				state.currentUser.updated_at = new Date().toISOString();
			}
		},
		
		updateEmail: (state, action: PayloadAction<string>) => {
			if (state.currentUser) {
				state.currentUser.email = action.payload;
				state.currentUser.updated_at = new Date().toISOString();
			}
		},
		
		// Account management
		markEmailVerified: (state) => {
			if (state.currentUser) {
				state.currentUser.email_verification_token = undefined;
				state.currentUser.updated_at = new Date().toISOString();
			}
		},
		
		setFirstTimeLogin: (state, action: PayloadAction<boolean>) => {
			if (state.currentUser) {
				state.currentUser.is_first_time_login = action.payload;
				state.currentUser.updated_at = new Date().toISOString();
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
				state.currentUser.updated_at = new Date().toISOString();
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
				state.currentUser.updated_at = new Date().toISOString();
			}
		},
		
		unlinkGoogleAccount: (state) => {
			if (state.currentUser) {
				state.currentUser.is_google_account = false;
				state.currentUser.updated_at = new Date().toISOString();
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