import type { ContractsState } from './index';
import type { PersistPartial } from 'redux-persist/es/persistReducer';
import type { UserState } from './index';

// Base state interfaces
export interface BaseRootState {
	contracts: ContractsState;
	user: UserState;
}

// Persisted state type that handles redux-persist
export type PersistedRootState = PersistPartial & Partial<BaseRootState>;

// Type-safe selectors that handle the persistence layer
export const selectContracts = (state: PersistedRootState) => 
	state.contracts || {
		contracts: [],
		searchQuery: '',
		selectedType: 'all',
		selectedStatus: 'all',
		loading: false,
		error: null
	};

export const selectUser = (state: PersistedRootState) => 
	state.user || {
		currentUser: null,
		isAuthenticated: false,
		loading: false,
		error: null,
		loginAttempts: 0
	};

export const selectCurrentUser = (state: PersistedRootState) => 
	selectUser(state).currentUser;

export const selectIsAuthenticated = (state: PersistedRootState) => 
	selectUser(state).isAuthenticated;

export const selectContractsList = (state: PersistedRootState) => 
	selectContracts(state).contracts; 