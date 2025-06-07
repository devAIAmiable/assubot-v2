import type { Contract } from '../store/contractsSlice';
import type React from 'react';
import type { User } from '../store/userSlice';

// Re-export types for convenience
export type { User, Contract };

// Application State Types
export interface UserState {
	currentUser: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
	loginAttempts: number;
	lastLoginAt?: string;
}

export interface ContractsState {
	contracts: Contract[];
	loading: boolean;
	error: string | null;
	searchQuery: string;
	selectedType: string;
	selectedStatus: string;
}

// Root State Type (from Redux store)
export interface RootState {
	contracts: ContractsState;
	user: UserState;
}

// Component Props Types
export interface ContractCardProps {
	contract: Contract;
	index: number;
	onEdit: (contract: Contract) => void;
	onView: (contract: Contract) => void;
	onDelete: (contractId: string) => void;
}

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

// Insurance Types for Comparator
export type InsuranceType = 'auto' | 'habitation' | 'sante' | 'moto';

export interface InsuranceTypeInfo {
	id: InsuranceType;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	description: string;
	features: string[];
}

export interface InsuranceFormData {
	// Auto insurance
	vehicleType?: string;
	vehicleYear?: number;
	vehicleBrand?: string;
	vehicleModel?: string;
	usage?: string;
	driverAge?: number;
	licenseYears?: number;
	previousClaims?: number;
	
	// Home insurance
	propertyType?: string;
	propertySize?: number;
	propertyValue?: number;
	location?: string;
	securityFeatures?: string[];
	
	// Health insurance
	age?: number;
	familySize?: number;
	healthConditions?: string[];
	preferredCoverage?: string;
	
	// Common fields
	budget?: number;
	coverageLevel?: string;
	deductible?: number;
}

export interface InsuranceOffer {
	id: string;
	insurer: string;
	name: string;
	price: number;
	monthlyPrice: number;
	rating: number;
	features: string[];
	coverageAmount: number;
	deductible: number;
	type: InsuranceType;
	description: string;
	logo?: string;
}

// AI Analysis Types
export interface AIAnalysis {
	summary: string;
	recommendations: string[];
	profileMatch: number;
	riskAssessment: string;
	costBenefit: string;
}

// Comparison Filter Types
export interface ComparisonFilters {
	priceRange: [number, number];
	minRating: number;
	insurers: string[];
	features: string[];
}

// Notification Types
export interface Notification {
	id: string;
	title: string;
	message: string;
	type: 'info' | 'warning' | 'success' | 'error';
	timestamp: string;
	read: boolean;
	actionUrl?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
	total: number;
	active: number;
	expiring: number;
	monthlyPremium: number;
}

export interface InsuranceStats {
	type: string;
	name: string;
	amount: number;
	count: number;
	color: string;
	icon: React.ComponentType<{ className?: string }>;
} 