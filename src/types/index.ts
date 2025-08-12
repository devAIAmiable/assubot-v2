import type React from 'react';
import type { User } from '../store/userSlice';

// Re-export User for compatibility
export type { User };

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
	chat: ChatState;
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
export type InsuranceType = 'auto' | 'habitation' | 'sante' | 'motorcycle';

export interface InsuranceTypeInfo {
	id: InsuranceType;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	description: string;
	features: string[];
}

// Insurance Type Configuration for the selection step
export interface InsuranceTypeConfig {
	id: InsuranceType;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string; // Tailwind gradient classes like 'from-blue-500 to-blue-600'
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

// Contract Creation Types - matching Prisma schema
export type ContractCategory =
	| 'auto'
	| 'health'
	| 'home'
	| 'motorcycle'
	| 'electronic_devices'
	| 'other';
export type DocumentType = 'CP' | 'CG' | 'OTHER';
export type ContractStatus = 'active' | 'expired' | 'pending';
export type ObligationType = 'subscription' | 'during_contract' | 'claim';
export type ContactType = 'management' | 'assistance' | 'emergency';

// Contract document from database
export interface ContractDocument {
	id: string;
	contractId: string;
	type: DocumentType;
	fileUrl: string;
	createdAt: string;
}

export interface ContractGuarantee {
	id: string;
	contractId: string;
	title: string;
	details?: string;
	covered?: string;
	notCovered?: string;
	createdAt: string;
}

export interface ContractExclusion {
	id: string;
	contractId: string;
	description: string;
	createdAt: string;
}

export interface ContractObligation {
	id: string;
	contractId: string;
	type: ObligationType;
	description: string;
	createdAt: string;
}

export interface ContractZone {
	id: string;
	contractId: string;
	label: string;
	coordinates?: object; // JSON
	createdAt: string;
}

export interface ContractTermination {
	id: string;
	contractId: string;
	mode?: string;
	notice?: string;
	details?: string;
	createdAt: string;
}

export interface ContractContact {
	id: string;
	contractId: string;
	type: ContactType;
	name?: string;
	phone?: string;
	email?: string;
	openingHours?: string;
	createdAt: string;
}

// Updated Contract type to match Prisma schema
export interface Contract {
	id: string;
	userId: string;
	insurerName: string;
	name: string;
	category: ContractCategory;
	formula?: string;
	startDate: string;
	endDate: string;
	annualPremiumCents: number;
	monthlyPremiumCents?: number;
	tacitRenewal: boolean;
	cancellationDeadline?: string;
	status: ContractStatus;
	createdAt: string;
	updatedAt: string;

	// Relations (optional includes)
	documents?: ContractDocument[];
	guarantees?: ContractGuarantee[];
	exclusions?: ContractExclusion[];
	obligations?: ContractObligation[];
	zones?: ContractZone[];
	termination?: ContractTermination;
	contacts?: ContractContact[];
}

export interface ContractFormData {
	// Step 1: General Information
	insurerName: string;
	name: string;
	category: ContractCategory;

	// Step 2: Details & Specifics
	formula?: string;
	startDate: string;
	endDate: string;
	annualPremiumCents: number;
	monthlyPremiumCents?: number;
	tacitRenewal: boolean;
	cancellationDeadline?: string;

	// Step 3: Documents
	documents: ContractDocumentUpload[];
}

export interface ContractDocumentUpload {
	type: DocumentType;
	fileName: string;
	fileSize: number;
	fileType: string;
	blobPath?: string; // Set after upload to Azure
}

export interface UploadUrlRequest {
	fileName: string;
	contentType: string;
}

export interface UploadUrlResponse {
	uploadUrl: string;
	blobPath: string;
	contractId: string;
}

export interface ContractInitRequest {
	insurerName?: string;
	name: string;
	category: ContractCategory;
	formula?: string;
	startDate?: string;
	endDate?: string;
	annualPremiumCents?: number;
	monthlyPremiumCents?: number;
	tacitRenewal?: boolean;
	cancellationDeadline?: string;
	documents: Array<{
		blobPath: string;
		documentType: DocumentType;
	}>;
}

export interface ContractInitResponse {
	contractId: string;
	taskId: string;
	status: ContractStatus;
	message: string;
}

export interface ContractNotificationRequest {
	contractId: string;
	userId: string;
	status: 'success' | 'error';
	message?: string;
}

// Credit system types
export type TransactionType = 'purchase' | 'usage' | 'adjustment';
export type TransactionSource = 'stripe' | 'chatbot' | 'comparator' | 'admin' | 'system';
export type PaymentIntentStatus = 'pending' | 'succeeded' | 'canceled' | 'failed' | 'expired';

export interface UserCredit {
	id: string;
	userId: string;
	balance: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreditPack {
	id: string;
	name: string;
	description?: string;
	creditAmount: number;
	priceCents: number;
	currency: string;
	isActive: boolean;
	isFeatured: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreditTransaction {
	id: string;
	userId: string;
	type: TransactionType;
	amount: number;
	source: TransactionSource;
	referenceId?: string;
	packId?: string;
	description?: string;
	createdAt: string;
}

export interface PaymentIntent {
	id: string;
	externalPaymentIntentId: string;
	userId: string;
	creditPackId: string;
	amount: number;
	currency: string;
	status: PaymentIntentStatus;
	clientSecret?: string;
	metadata?: any;
	createdAt: string;
	updatedAt: string;
}

// Chat Types
export interface ChatMessage {
	id: string;
	content: string;
	sender: 'user' | 'bot';
	timestamp: string;
	isTyping?: boolean;
	type?: 'text' | 'quick_reply' | 'suggestion';
	contractIds?: string[]; // Associated contract IDs for context
}

export interface QuickReply {
	id: string;
	text: string;
	payload?: string;
}

export interface ChatSession {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	messages: ChatMessage[];
	selectedContractIds: string[];
	messageCount: number;
}

export interface ChatState {
	sessions: ChatSession[];
	currentSessionId: string | null;
	selectedContractIds: string[];
	isTyping: boolean;
	isConnected: boolean;
	quickReplies: QuickReply[];
	error: string | null;
	searchQuery: string;
	searchResults: ChatMessage[];
}

export interface ChatResponse {
	message: string;
	quickReplies?: QuickReply[];
	suggestions?: string[];
}
