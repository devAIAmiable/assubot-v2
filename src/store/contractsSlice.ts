import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface Contract {
	id: string;
	name: string;
	insurer: string;
	type: 'auto' | 'habitation' | 'sante' | 'autre';
	premium: number;
	startDate: string;
	endDate: string;
	status: 'active' | 'expired' | 'pending';
	description?: string;
	coverageAmount?: number;
	deductible?: number;
	documents?: {
		name: string;
		url: string;
		uploadDate: string;
	}[];
}

interface ContractsState {
	contracts: Contract[];
	loading: boolean;
	error: string | null;
	searchQuery: string;
	selectedType: string;
	selectedStatus: string;
}

const initialState: ContractsState = {
	contracts: [
		{
			id: '1',
			name: 'Assurance Auto Citroën C3',
			insurer: 'MAIF',
			type: 'auto',
			premium: 549.6,
			startDate: '2024-01-15',
			endDate: '2025-01-15',
			status: 'active',
			description: 'Assurance tous risques pour Citroën C3',
			coverageAmount: 20000,
			deductible: 500,
			documents: [
				{
					name: 'Contrat_Auto_MAIF_2024.pdf',
					url: '/documents/contrat_auto_maif.pdf',
					uploadDate: '2024-01-15',
				},
			],
		},
		{
			id: '2',
			name: 'Assurance Habitation',
			insurer: 'Groupama',
			type: 'habitation',
			premium: 390,
			startDate: '2023-06-01',
			endDate: '2024-06-01',
			status: 'active',
			description: 'Assurance multirisque habitation',
			coverageAmount: 50000,
			deductible: 300,
			documents: [
				{
					name: 'Contrat_Habitation_Groupama.pdf',
					url: '/documents/contrat_habitation_groupama.pdf',
					uploadDate: '2023-06-01',
				},
			],
		},
		{
			id: '3',
			name: 'Mutuelle Santé',
			insurer: 'Harmonie Mutuelle',
			type: 'sante',
			premium: 1536,
			startDate: '2024-03-01',
			endDate: '2025-03-01',
			status: 'active',
			description: 'Complémentaire santé famille',
			coverageAmount: 0,
			deductible: 0,
			documents: [
				{
					name: 'Contrat_Sante_Harmonie.pdf',
					url: '/documents/contrat_sante_harmonie.pdf',
					uploadDate: '2024-03-01',
				},
			],
		},
	],
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
			const index = state.contracts.findIndex(c => c.id === action.payload.id);
			if (index !== -1) {
				state.contracts[index] = action.payload;
			}
		},
		
		deleteContract: (state, action: PayloadAction<string>) => {
			state.contracts = state.contracts.filter(c => c.id !== action.payload);
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
		
		// Document management
		addDocument: (state, action: PayloadAction<{
			contractId: string;
			document: {
				name: string;
				url: string;
				uploadDate: string;
			};
		}>) => {
			const contract = state.contracts.find(c => c.id === action.payload.contractId);
			if (contract) {
				if (!contract.documents) {
					contract.documents = [];
				}
				contract.documents.push(action.payload.document);
			}
		},
		
		removeDocument: (state, action: PayloadAction<{
			contractId: string;
			documentName: string;
		}>) => {
			const contract = state.contracts.find(c => c.id === action.payload.contractId);
			if (contract && contract.documents) {
				contract.documents = contract.documents.filter(
					doc => doc.name !== action.payload.documentName
				);
			}
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
	addDocument,
	removeDocument,
} = contractsSlice.actions;

export default contractsSlice.reducer; 