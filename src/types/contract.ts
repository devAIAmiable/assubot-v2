// Contract-related constants
export const ContractCategory = {
	AUTO: 'auto',
	HEALTH: 'health',
	HOME: 'home',
	MOTORCYCLE: 'moto', // Backend uses 'moto' instead of 'motorcycle'
	ELECTRONIC_DEVICES: 'electronic_devices',
	OTHER: 'other',
} as const;

export const ContractStatus = {
	ACTIVE: 'active',
	EXPIRED: 'expired',
	PENDING: 'pending',
} as const;

export const DocumentType = {
	CP: 'CP',
	CG: 'CG',
	AA: 'AA', // Additional document type from backend
	OTHER: 'OTHER',
} as const;

export const ObligationType = {
	SUBSCRIPTION: 'subscription',
	DURING_CONTRACT: 'during_contract',
	CLAIM: 'claim',
} as const;

export const ContactType = {
	MANAGEMENT: 'management',
	ASSISTANCE: 'assistance',
	EMERGENCY: 'emergency',
} as const;

// Type definitions for the constants
export type ContractCategory = (typeof ContractCategory)[keyof typeof ContractCategory];
export type ContractStatus = (typeof ContractStatus)[keyof typeof ContractStatus];
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];
export type ObligationType = (typeof ObligationType)[keyof typeof ObligationType];
export type ContactType = (typeof ContactType)[keyof typeof ContactType];

// Core contract model
export interface Contract {
	id: string;
	userId: string;
	insurerName?: string;
	name: string;
	category: ContractCategory;
	formula?: string;
	startDate?: Date;
	endDate?: Date;
	annualPremiumCents: number;
	monthlyPremiumCents?: number;
	tacitRenewal: boolean;
	cancellationDeadline?: Date;
	status: ContractStatus;
	createdAt: Date;
	updatedAt: Date;

	// Relations (optional for partial data)
	user?: User;
	documents?: ContractDocument[];
	guarantees?: ContractGuarantee[];
	exclusions?: ContractExclusion[];
	obligations?: ContractObligation[];
	zones?: ContractZone[];
	termination?: ContractTermination;
	contacts?: ContractContact[];
}

// Contract document model
export interface ContractDocument {
	id: string;
	contractId: string;
	type: DocumentType;
	fileUrl: string;
	createdAt: Date;

	// Relations
	contract?: Contract;
}

// Contract guarantee model
export interface ContractGuarantee {
	id: string;
	contractId: string;
	title: string;
	details?: string;
	covered?: string;
	notCovered?: string;
	createdAt: Date;

	// Relations
	contract?: Contract;
}

// Contract exclusion model
export interface ContractExclusion {
	id: string;
	contractId: string;
	description: string;
	createdAt: Date;

	// Relations
	contract?: Contract;
}

// Contract obligation model
export interface ContractObligation {
	id: string;
	contractId: string;
	type: ObligationType;
	description: string;
	createdAt: Date;

	// Relations
	contract?: Contract;
}

// Contract zone model
export interface ContractZone {
	id: string;
	contractId: string;
	label: string;
	coordinates?: Record<string, unknown>; // JSON data for coordinates
	createdAt: Date;

	// Relations
	contract?: Contract;
}

// Contract termination model
export interface ContractTermination {
	id: string;
	contractId: string;
	mode?: string;
	notice?: string;
	details?: string;
	createdAt: Date;

	// Relations
	contract?: Contract;
}

// Contract contact model
export interface ContractContact {
	id: string;
	contractId: string;
	type: ContactType;
	name?: string;
	phone?: string;
	email?: string;
	openingHours?: string;
	createdAt: Date;

	// Relations
	contract?: Contract;
}

// User model (referenced by Contract)
export interface User {
	id: string;
	// Add other user fields as needed
	contracts?: Contract[];
}

// Type for creating new contracts (without auto-generated fields)
export type CreateContractData = Omit<
	Contract,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'user'
	| 'documents'
	| 'guarantees'
	| 'exclusions'
	| 'obligations'
	| 'zones'
	| 'termination'
	| 'contacts'
>;

// Type for updating contracts (all fields optional except id)
export type UpdateContractData = Partial<
	Omit<
		Contract,
		| 'id'
		| 'createdAt'
		| 'updatedAt'
		| 'user'
		| 'documents'
		| 'guarantees'
		| 'exclusions'
		| 'obligations'
		| 'zones'
		| 'termination'
		| 'contacts'
	>
>;

// Type for contract with all relations loaded
export interface ContractWithRelations extends Contract {
	user: User;
	documents: ContractDocument[];
	guarantees: ContractGuarantee[];
	exclusions: ContractExclusion[];
	obligations: ContractObligation[];
	zones: ContractZone[];
	termination?: ContractTermination;
	contacts: ContractContact[];
}

// Lightweight contract interface for list endpoints
export interface ContractListItem {
	id: string;
	name: string;
	insurerName: string | null;
	category: ContractCategory;
	startDate: Date | null;
	endDate: Date | null;
	annualPremiumCents: number;
	status: ContractStatus;
	createdAt: Date;
	updatedAt: Date;
	documents: Omit<ContractDocument, 'contractId' | 'createdAt'>[];
}

// Utility types for form handling
export interface ContractFormData {
	name: string;
	category: ContractCategory;
	insurerName?: string;
	formula?: string;
	startDate?: Date;
	endDate?: Date;
	annualPremiumCents: number;
	monthlyPremiumCents?: number;
	tacitRenewal: boolean;
	cancellationDeadline?: Date;
	documents?: File[];
}

// API response types
// Backend API response types
export interface ContractApiResponse {
	success: boolean;
	data: {
		message: string;
		resource: Contract | Contract[] | ContractWithRelations;
	};
}

export interface ContractErrorResponse {
	status: 'error';
	error: {
		code: string;
		message: string;
	};
}

// Pagination types
export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

// Backend contract response with pagination
export interface GetContractsResponse {
	status: 'success';
	message: string;
	data: BackendContractListItem[];
	pagination: PaginationInfo;
	metadata: ContractMetadata;
}

// Update contract request
export interface UpdateContractRequest {
	insurerName?: string;
	name?: string;
	category?: ContractCategory;
	formula?: string;
	startDate?: string;
	endDate?: string;
	annualPremiumCents?: number;
	monthlyPremiumCents?: number;
	tacitRenewal?: boolean;
	cancellationDeadline?: string;
}

// Update contract response
export interface UpdateContractResponse {
	status: 'success';
	data: BackendContract;
}

// Delete contract response
export interface DeleteContractResponse {
	status: 'success';
	data: {
		message: string;
	};
}

// Contract metadata for dashboard
export interface ContractMetadata {
	totalContracts: number;
	totalValid: number;
	totalExpired: number;
	totalAnnualPremiumCents: number;
}

// Lightweight backend contract interface for list endpoints
export interface BackendContractListItem {
	id: string;
	name: string;
	insurerName: string | null;
	category: ContractCategory;
	startDate: string | null; // ISO string from backend
	endDate: string | null; // ISO string from backend
	annualPremiumCents: number;
	status: ContractStatus;
	createdAt: string; // ISO string from backend
	updatedAt: string; // ISO string from backend
	documents: Omit<BackendContractDocument, 'contractId' | 'createdAt'>[];
}

// Backend contract response for single contract
export interface GetContractByIdResponse {
	status: string;
	message: string;
	id: string;
	userId: string;
	name: string;
	insurerName?: string;
	category: ContractCategory;
	formula?: string;
	startDate?: string;
	endDate?: string;
	annualPremiumCents: number;
	monthlyPremiumCents?: number;
	tacitRenewal: boolean;
	cancellationDeadline?: string | null;
	documentLabel?: string;
	documents: BackendContractDocument[];
	guarantees?: BackendContractGuarantee[];
	exclusions?: BackendContractExclusion[];
	obligations?: BackendContractObligation[];
	zones?: BackendContractZone[];
	termination?: BackendContractTermination;
	contacts?: BackendContractContact[];
	createdAt: string;
	updatedAt: string;
}

// Backend contract model (matches API response)
export interface BackendContract {
	id: string;
	userId: string;
	insurerName?: string;
	name: string;
	category: ContractCategory;
	formula?: string;
	startDate?: string; // ISO string from backend
	endDate?: string; // ISO string from backend
	annualPremiumCents: number;
	monthlyPremiumCents?: number;
	tacitRenewal: boolean;
	cancellationDeadline?: string | null; // ISO string from backend or null
	documentLabel?: string;
	coveredCountries?: string[] | null;
	rawJsonData?: Record<string, unknown>;
	status: ContractStatus;
	createdAt: string; // ISO string from backend
	updatedAt: string; // ISO string from backend

	// Relations
	documents: BackendContractDocument[];
	guarantees?: BackendContractGuarantee[];
	exclusions?: BackendContractExclusion[];
	obligations?: BackendContractObligation[];
	zones?: BackendContractZone[];
	termination?: BackendContractTermination;
	contacts?: BackendContractContact[];
}

// Backend document model
export interface BackendContractDocument {
	id: string;
	contractId: string;
	type: DocumentType;
	fileUrl: string;
	createdAt: string; // ISO string from backend
}

// Backend guarantee model with detailed structure
export interface BackendContractGuarantee {
	id: string;
	title: string;
	details?: BackendGuaranteeDetail[];
}

export interface BackendGuaranteeDetail {
	service?: string;
	limit?: string;
	coverages?: BackendCoverage[];
}

export interface BackendCoverage {
	type: 'covered' | 'not_covered';
	description: string;
}

// Backend exclusion model
export interface BackendContractExclusion {
	id: string;
	description: string;
}

// Backend obligation model
export interface BackendContractObligation {
	id: string;
	type: ObligationType;
	description: string;
}

// Backend zone model
export interface BackendContractZone {
	id: string;
	label: string;
	type: 'country' | 'zone';
	coordinates?: Record<string, unknown>;
}

// Backend termination model
export interface BackendContractTermination {
	id: string;
	mode?: string;
	notice?: string;
	details?: string;
}

// Backend contact model
export interface BackendContractContact {
	id: string;
	type: ContactType;
	name?: string | null;
	phone?: string;
	email?: string;
	openingHours?: string;
}

// Query parameters for getting contracts
export interface GetContractsParams {
	page?: number;
	limit?: number;
}
