import type { Contract } from '../types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface ContractsState {
	contracts: Contract[];
	loading: boolean;
	error: string | null;
	searchQuery: string;
	selectedType: string;
	selectedStatus: string;
}

const initialState: ContractsState = {
	contracts: [], // Start with empty contracts - they will be loaded from the database
	loading: false,
	error: null,
	searchQuery: '',
	selectedType: 'all',
	selectedStatus: 'all',
};

const contractsSlice = createSlice({
	name: 'contracts',
	initialState,
	reducers: {
		// Contract CRUD operations
		addContract: (state, action: PayloadAction<Omit<Contract, 'id'>>) => {
			const newContract: Contract = {
				...action.payload,
				id: Date.now().toString(),
			};
			state.contracts.push(newContract);
		},

		updateContract: (state, action: PayloadAction<Contract>) => {
			const index = state.contracts.findIndex((c) => c.id === action.payload.id);
			if (index !== -1) {
				state.contracts[index] = action.payload;
			}
		},

		deleteContract: (state, action: PayloadAction<string>) => {
			state.contracts = state.contracts.filter((c) => c.id !== action.payload);
		},

		// Filter and search operations
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
		},

		setSelectedType: (state, action: PayloadAction<string>) => {
			state.selectedType = action.payload;
		},

		setSelectedStatus: (state, action: PayloadAction<string>) => {
			state.selectedStatus = action.payload;
		},

		// Loading and error states
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},

		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},

		// Load contracts from database
		loadContracts: (state, action: PayloadAction<Contract[]>) => {
			state.contracts = action.payload;
			state.loading = false;
			state.error = null;
		},

		// Clear all contracts
		clearContracts: (state) => {
			state.contracts = [];
			state.searchQuery = '';
			state.selectedType = '';
			state.selectedStatus = '';
			state.loading = false;
			state.error = null;
		},
	},
});

export const {
	addContract,
	updateContract,
	deleteContract,
	setSearchQuery,
	setSelectedType,
	setSelectedStatus,
	setLoading,
	setError,
	loadContracts,
	clearContracts,
} = contractsSlice.actions;

export default contractsSlice.reducer;
