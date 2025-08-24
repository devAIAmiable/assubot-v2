// Contract-related constants
export const ContractCategory = {
	AUTO: 'auto',
	HEALTH: 'health',
	HOME: 'home',
	MOTORCYCLE: 'motorcycle',
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

// Type for contract list items (without heavy relations)
export type ContractListItem = Pick<
	Contract,
	| 'id'
	| 'name'
	| 'category'
	| 'insurerName'
	| 'status'
	| 'startDate'
	| 'endDate'
	| 'annualPremiumCents'
	| 'createdAt'
>;

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
