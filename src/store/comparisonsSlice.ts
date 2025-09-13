import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type InsuranceType = 'auto' | 'habitation' | 'sante' | 'moto';

export interface PastComparison {
	id: string;
	date: string;
	expiresAt: string; // ISO date string for expiration (1 week from creation)
	insuranceType: InsuranceType;
	criteria: {
		age: string;
		profession: string;
		location: string;
		monthlyBudget: string;
		vehicleType?: string;
		coverageLevel?: string;
	};
	resultsCount: number;
	topOffer?: {
		insurer: string;
		price: number;
		rating: number;
	};
}

interface ComparisonsState {
	comparisons: PastComparison[];
	loading: boolean;
	error: string | null;
}

const initialState: ComparisonsState = {
	comparisons: [
		// Mock initial data (recent comparisons)
		{
			id: '1',
			date: '2024-12-15',
			expiresAt: '2024-12-22', // 1 week from creation
			insuranceType: 'auto',
			criteria: {
				age: '28',
				profession: 'Cadre',
				location: 'Paris',
				monthlyBudget: '50',
				vehicleType: 'berline',
				coverageLevel: 'tous-risques',
			},
			resultsCount: 7,
			topOffer: {
				insurer: 'Direct Assurance',
				price: 32,
				rating: 4.2,
			},
		},
		{
			id: '2',
			date: '2024-12-10',
			expiresAt: '2024-12-17', // 1 week from creation
			insuranceType: 'habitation',
			criteria: {
				age: '28',
				profession: 'Cadre',
				location: 'Paris',
				monthlyBudget: '35',
				coverageLevel: 'standard',
			},
			resultsCount: 5,
			topOffer: {
				insurer: 'MAIF',
				price: 28,
				rating: 4.3,
			},
		},
		{
			id: '3',
			date: '2024-12-12',
			expiresAt: '2024-12-19', // Expires soon
			insuranceType: 'sante',
			criteria: {
				age: '28',
				profession: 'Cadre',
				location: 'Lyon',
				monthlyBudget: '45',
				coverageLevel: 'premium',
			},
			resultsCount: 3,
			topOffer: {
				insurer: 'MAIF',
				price: 45,
				rating: 4.5,
			},
		},
		{
			id: '4',
			date: '2024-12-08',
			expiresAt: '2024-12-15', // Expired
			insuranceType: 'moto',
			criteria: {
				age: '25',
				profession: 'Étudiant',
				location: 'Marseille',
				monthlyBudget: '30',
				coverageLevel: 'standard',
			},
			resultsCount: 3,
			topOffer: {
				insurer: 'Direct Assurance',
				price: 24,
				rating: 4.3,
			},
		},
		{
			id: '5',
			date: '2024-12-13',
			expiresAt: '2024-12-20', // Valid
			insuranceType: 'auto',
			criteria: {
				age: '35',
				profession: 'Profession libérale',
				location: 'Toulouse',
				monthlyBudget: '60',
				vehicleType: 'suv',
				coverageLevel: 'tous-risques',
			},
			resultsCount: 7,
			topOffer: {
				insurer: 'Allianz',
				price: 45,
				rating: 4.5,
			},
		},
		{
			id: '6',
			date: '2024-12-14',
			expiresAt: '2024-12-21', // Valid
			insuranceType: 'habitation',
			criteria: {
				age: '32',
				profession: 'Employé',
				location: 'Nice',
				monthlyBudget: '40',
				coverageLevel: 'premium',
			},
			resultsCount: 4,
			topOffer: {
				insurer: 'Groupama',
				price: 35,
				rating: 4.2,
			},
		},
	],
	loading: false,
	error: null,
};

const comparisonsSlice = createSlice({
	name: 'comparisons',
	initialState,
	reducers: {
		// Add a new comparison to history
		addComparison: (state, action: PayloadAction<Omit<PastComparison, 'id' | 'date' | 'expiresAt'>>) => {
			const now = new Date();
			const expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
			
			const newComparison: PastComparison = {
				...action.payload,
				id: Date.now().toString(),
				date: now.toISOString().split('T')[0],
				expiresAt: expirationDate.toISOString().split('T')[0],
			};
			// Add to beginning of array (most recent first)
			state.comparisons.unshift(newComparison);
		},

		// Remove a comparison from history
		removeComparison: (state, action: PayloadAction<string>) => {
			state.comparisons = state.comparisons.filter(c => c.id !== action.payload);
		},

		// Clear all comparisons
		clearComparisons: (state) => {
			state.comparisons = [];
		},

		// Clear expired comparisons
		clearExpiredComparisons: (state) => {
			const now = new Date().toISOString().split('T')[0];
			state.comparisons = state.comparisons.filter(c => c.expiresAt >= now);
		},

		// Update an existing comparison
		updateComparison: (state, action: PayloadAction<PastComparison>) => {
			const index = state.comparisons.findIndex(c => c.id === action.payload.id);
			if (index !== -1) {
				state.comparisons[index] = action.payload;
			}
		},

		// Loading and error states
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},

		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	addComparison,
	removeComparison,
	clearComparisons,
	clearExpiredComparisons,
	updateComparison,
	setLoading,
	setError,
} = comparisonsSlice.actions;

export default comparisonsSlice.reducer; 