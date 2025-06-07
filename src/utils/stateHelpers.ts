import type { Contract, ContractsState, User, UserState } from '../types';

// Type for the persisted state (with optional properties due to redux-persist)
type PersistedState = {
	user?: UserState;
	contracts?: ContractsState;
	_persist?: {
		version: number;
		rehydrated: boolean;
	};
};

// Type-safe state accessors that handle redux-persist
export const getUser = (state: PersistedState): User | null => {
	return state.user?.currentUser || null;
};

export const getUserState = (state: PersistedState): UserState => {
	return state.user || { 
		currentUser: null, 
		isAuthenticated: false, 
		loading: false, 
		error: null, 
		loginAttempts: 0 
	};
};

export const getContracts = (state: PersistedState): Contract[] => {
	return state.contracts?.contracts || [];
};

export const getContractsState = (state: PersistedState): ContractsState => {
	return state.contracts || {
		contracts: [],
		searchQuery: '',
		selectedType: 'all',
		selectedStatus: 'all',
		loading: false,
		error: null
	};
}; 