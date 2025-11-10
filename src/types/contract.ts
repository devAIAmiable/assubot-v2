// Contract-related constants
export const ContractCategory = {
  AUTO: 'auto',
  HEALTH: 'health',
  HOME: 'home',
  MOTORCYCLE: 'moto',
  ELECTRONIC_DEVICES: 'electronic_devices',
  OTHER: 'other',
  LOAN: 'loan',
  TRAVEL: 'travel',
  LIFE: 'life',
  PROFESSIONAL: 'professional',
  LEGAL: 'legal',
  AGRICULTURE: 'agriculture',
  EVENT: 'event',
  PET: 'pet',
} as const;

export const ContractStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
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

export const ZoneType = {
  COUNTRY: 'country',
  ZONE: 'zone',
  REGION: 'region',
  CITY: 'city',
} as const;

// Type definitions for the constants
export type ContractCategory = (typeof ContractCategory)[keyof typeof ContractCategory];
export type ContractStatus = (typeof ContractStatus)[keyof typeof ContractStatus];
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];
export type ObligationType = (typeof ObligationType)[keyof typeof ObligationType];
export type ContactType = (typeof ContactType)[keyof typeof ContactType];
export type ZoneType = (typeof ZoneType)[keyof typeof ZoneType];

// Core contract model (matches backend response exactly)
export interface Contract {
  id: string;
  name: string;
  insurerId: string;
  version?: string | null;
  isTemplate: boolean;
  category: ContractCategory;
  subject?: string | null;
  startDate?: string;
  endDate?: string;
  formula?: string;
  annualPremiumCents: number;
  tacitRenewal?: boolean;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;

  // Optional summarization fields
  summarizeStatus?: 'pending' | 'ongoing' | 'done' | 'failed';
  summarizedAt?: string | null;

  // Relations
  insurer?: {
    id: string;
    name: string;
    slug: string;
  };
  documents?: ContractDocument[];
  guarantees?: ContractGuarantee[];
  exclusions?: ContractExclusion[];
  obligations?: ContractObligation[];
  zones?: ContractZone[];
  cancellations?: ContractCancellation[];
  contacts?: ContractContact[];
}

// Contract document model
export interface ContractDocument {
  id: string;
  type: DocumentType;
  fileUrl: string;
}

// Contract guarantee model
export interface ContractGuarantee {
  id: string;
  contractId: string;
  title: string;
  details?: BackendGuaranteeDetail[];
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
  type: ZoneType;
  name: string;
  code: string;
  label: string;
  latitude?: string | null;
  longitude?: string | null;
  conditions?: string[] | null;
  createdAt: Date;

  // Relations
  contract?: Contract;
}

// Contract termination model
export interface ContractCancellation {
  id: string;
  contractId: string;
  question: string;
  response: string;
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
  'id' | 'createdAt' | 'updatedAt' | 'user' | 'documents' | 'guarantees' | 'exclusions' | 'obligations' | 'zones' | 'termination' | 'contacts'
>;

// Type for updating contracts (all fields optional except id)
export type UpdateContractData = Partial<
  Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'documents' | 'guarantees' | 'exclusions' | 'obligations' | 'zones' | 'termination' | 'contacts'>
>;

// Type for contract with all relations loaded
export interface ContractWithRelations extends Contract {
  user: User;
  documents: ContractDocument[];
  guarantees: ContractGuarantee[];
  exclusions: ContractExclusion[];
  obligations: ContractObligation[];
  zones: ContractZone[];
  cancellations?: ContractCancellation[];
  contacts: ContractContact[];
}

// Lightweight contract interface for list endpoints (matches backend response exactly)
export interface ContractListItem {
  id: string;
  name: string;
  insurerId: string;
  version?: string | null;
  isTemplate: boolean;
  category: ContractCategory;
  subject?: string | null;
  startDate?: string;
  endDate?: string;
  formula?: string;
  annualPremiumCents: number;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;

  // Optional summarization fields
  summarizeStatus?: 'pending' | 'ongoing' | 'done' | 'failed';
  summarizedAt?: string | null;

  // Relations
  insurer?: {
    id: string;
    name: string;
    slug: string;
  };
  documents?: ContractDocument[];
}

// Utility types for form handling
// This interface is for backward compatibility - use ContractFormData from types/index.ts instead
export interface ContractFormDataLegacy {
  name: string;
  category: ContractCategory;
  subject?: string;
  insurerId?: string;
  insurerName?: string;
  version?: string;
  isTemplate?: boolean;
  formula?: string;
  startDate?: Date;
  endDate?: Date;
  annualPremiumCents: number;
  monthlyPremiumCents?: number;
  tacitRenewal?: boolean;
  cancellationDeadline?: string;
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
  insurerId?: string;
  name?: string;
  category?: ContractCategory;
  subject?: string;
  formula?: string;
  startDate?: string;
  endDate?: string;
  annualPremiumCents?: number;
}

// Update contract response
export interface UpdateContractResponse {
  status: 'success';
  data: BackendContract;
}

// Delete contract response
export interface DeleteContractResponse {
  status: 'success';
  message: string;
}

// Contract download types
export interface ContractDownloadDocument {
  id: string;
  type: DocumentType;
  url: string;
  expiresAt: string;
}

export interface ContractDownloadResponse {
  status: 'success';
  documents: ContractDownloadDocument[];
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
  insurerId: string;
  version?: string | null;
  isTemplate: boolean;
  category: ContractCategory;
  subject?: string | null;
  formula?: string;
  startDate?: string; // ISO string from backend
  endDate?: string; // ISO string from backend
  annualPremiumCents: number;
  status: ContractStatus;
  createdAt: string; // ISO string from backend
  updatedAt: string; // ISO string from backend
  summarizeStatus?: 'pending' | 'ongoing' | 'done' | 'failed';
  summarizedAt?: string | null; // ISO string from backend
  insurer?: {
    id: string;
    name: string;
    slug: string;
  };
  documents?: BackendContractDocument[];
}

// Backend contract response for single contract (matches actual API response)
export interface GetContractByIdResponse {
  id: string;
  name: string;
  insurerId: string;
  version?: string | null;
  isTemplate: boolean;
  category: ContractCategory;
  subject?: string | null;
  formula?: string;
  startDate?: string;
  endDate?: string;
  annualPremiumCents: number;
  tacitRenewal?: boolean;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
  summarizeStatus?: 'pending' | 'ongoing' | 'done' | 'failed';
  summarizedAt?: string | null;
  insurer?: {
    id: string;
    name: string;
    slug: string;
  };
  documents: BackendContractDocument[];
  guarantees?: BackendContractGuarantee[];
  exclusions?: BackendContractExclusion[];
  obligations?: BackendContractObligation[];
  zones?: BackendContractZone[];
  cancellations?: BackendContractCancellation[];
  contacts?: BackendContractContact[];
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

  // Optional summarization fields
  summarizeStatus?: 'pending' | 'ongoing' | 'done' | 'failed';
  summarizedAt?: string; // ISO string from backend

  // Relations
  documents: BackendContractDocument[];
  guarantees?: BackendContractGuarantee[];
  exclusions?: BackendContractExclusion[];
  obligations?: BackendContractObligation[];
  zones?: BackendContractZone[];
  cancellations?: BackendContractCancellation[];
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
  deductible?: string | null;
  limitation?: string | null;
  ceiling?: string | null;
  coverages?: BackendCoverage[];
  details?: BackendGuaranteeDetail[];
}

export interface BackendGuaranteeDetail {
  service?: string;
  ceiling?: string;
  plafond?: string;
  franchise?: string;
  deductible?: string;
  limitation?: string;
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
  type: ZoneType;
  name: string;
  code: string;
  latitude?: string | null;
  longitude?: string | null;
  conditions?: string[] | null;
}

// Backend termination model
export interface BackendContractCancellation {
  id: string;
  question: string;
  response: string;
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
  sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'annualPremiumCents' | 'monthlyPremiumCents' | 'name' | 'insurerName' | 'category' | 'status';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: ContractCategory | 'all';
  status?: ContractStatus[];
  insurerId?: string;
}

// Dashboard statistics types
export interface DashboardCategoryBreakdown {
  count: number;
  totalAnnualCostCents: number;
  percentage: number;
}

export interface DashboardStats {
  status: string;
  message: string;
  totalAnnualCostCents: number;
  availableContracts: number;
  monthlyPremiumCents: number;
  expiringSoonContracts: number;
  categoryBreakdown: Record<string, DashboardCategoryBreakdown>;
}

export interface DashboardStatsResponse {
  status: string;
  message: string;
  totalAnnualCostCents: number;
  availableContracts: number;
  monthlyPremiumCents: number;
  expiringSoonContracts: number;
  categoryBreakdown: Record<string, DashboardCategoryBreakdown>;
}
