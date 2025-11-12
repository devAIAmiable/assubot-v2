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
  isGoogleAccount?: boolean; // Changed from is_google_account to isGoogleAccount
  isFirstLogin: boolean;
  address?: string;
  city?: string;
  zip?: string;
  phone?: string;
  creditBalance?: number;
  acceptedTerms?: boolean;
  termsAcceptedAt?: string;
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
          acceptedTerms: action.payload.user.acceptedTerms ?? state.currentUser.acceptedTerms,
          termsAcceptedAt: action.payload.user.termsAcceptedAt ?? state.currentUser.termsAcceptedAt,
          // Map profession to professionalCategory for frontend compatibility
          professionalCategory: action.payload.user.profession || state.currentUser.professionalCategory,
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
          name: updates.firstName && updates.lastName ? `${updates.firstName} ${updates.lastName}` : state.currentUser.name,
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

    // Avatar upload actions
    uploadAvatarStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    uploadAvatarSuccess: (state, action: PayloadAction<{ avatarUrl: string }>) => {
      state.loading = false;
      if (state.currentUser) {
        // Add cache-busting parameter to force image refresh
        const avatarUrl = action.payload.avatarUrl.includes('?') ? `${action.payload.avatarUrl}&t=${Date.now()}` : `${action.payload.avatarUrl}?t=${Date.now()}`;

        state.currentUser.avatar = avatarUrl;
        state.currentUser.updatedAt = new Date().toISOString();
      }
      state.error = null;
    },

    uploadAvatarFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
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

    // Clear all errors and loading states
    clearAllErrors: (state) => {
      state.error = null;
      state.loading = false;
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
        state.currentUser.isGoogleAccount = true;
        state.currentUser.updatedAt = new Date().toISOString();
      }
    },

    unlinkGoogleAccount: (state) => {
      if (state.currentUser) {
        state.currentUser.isGoogleAccount = false;
        state.currentUser.updatedAt = new Date().toISOString();
      }
    },

    // Reset login attempts (for security)
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
    },

    // Update user credits
    updateCredits: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.creditBalance = action.payload;
        state.currentUser.updatedAt = new Date().toISOString();
      }
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
  uploadAvatarStart,
  uploadAvatarSuccess,
  uploadAvatarFailure,
  updateEmail,
  markEmailVerified,
  setFirstTimeLogin,
  clearError,
  clearAllErrors,
  setLoading,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
  linkGoogleAccount,
  unlinkGoogleAccount,
  resetLoginAttempts,
  updateCredits,
} = userSlice.actions;

export default userSlice.reducer;
