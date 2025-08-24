import type {
	BackendContract,
	BackendContractContact,
	BackendContractDocument,
	BackendContractExclusion,
	BackendContractGuarantee,
	BackendContractObligation,
	BackendContractTermination,
	BackendContractZone,
	ContractContact,
	ContractDocument,
	ContractExclusion,
	ContractGuarantee,
	ContractObligation,
	ContractTermination,
	ContractWithRelations,
	ContractZone,
	GetContractByIdResponse
} from '../types/contract';

/**
 * Transform a backend contract document to frontend format
 */
export function transformBackendDocument(backendDoc: BackendContractDocument): ContractDocument {
	return {
		id: backendDoc.id,
		contractId: backendDoc.contractId,
		type: backendDoc.type,
		fileUrl: backendDoc.fileUrl,
		createdAt: new Date(backendDoc.createdAt),
	};
}

/**
 * Transform a backend contract guarantee to frontend format
 */
export function transformBackendGuarantee(backendGuarantee: BackendContractGuarantee): ContractGuarantee {
	return {
		id: backendGuarantee.id,
		contractId: '', // Will be set by parent contract
		title: backendGuarantee.title,
		details: backendGuarantee.details?.map(detail => 
			`${detail.service || ''} ${detail.limit || ''} ${detail.deductible || ''} ${detail.limitation || ''}`
		).join('; ').trim() || undefined,
		covered: backendGuarantee.details?.filter(d => d.coverages?.some(c => c.type === 'covered'))
			.map(d => d.service).join(', ') || undefined,
		notCovered: backendGuarantee.details?.filter(d => d.coverages?.some(c => c.type === 'not_covered'))
			.map(d => d.service).join(', ') || undefined,
		createdAt: new Date(), // Backend doesn't provide this, use current date
	};
}

/**
 * Transform a backend contract exclusion to frontend format
 */
export function transformBackendExclusion(backendExclusion: BackendContractExclusion): ContractExclusion {
	return {
		id: backendExclusion.id,
		contractId: '', // Will be set by parent contract
		description: backendExclusion.description,
		createdAt: new Date(), // Backend doesn't provide this, use current date
	};
}

/**
 * Transform a backend contract obligation to frontend format
 */
export function transformBackendObligation(backendObligation: BackendContractObligation): ContractObligation {
	return {
		id: backendObligation.id,
		contractId: '', // Will be set by parent contract
		type: backendObligation.type,
		description: backendObligation.description,
		createdAt: new Date(), // Backend doesn't provide this, use current date
	};
}

/**
 * Transform a backend contract zone to frontend format
 */
export function transformBackendZone(backendZone: BackendContractZone): ContractZone {
	return {
		id: backendZone.id,
		contractId: '', // Will be set by parent contract
		label: backendZone.label,
		coordinates: backendZone.coordinates,
		createdAt: new Date(), // Backend doesn't provide this, use current date
	};
}

/**
 * Transform a backend contract termination to frontend format
 */
export function transformBackendTermination(backendTermination: BackendContractTermination): ContractTermination {
	return {
		id: backendTermination.id,
		contractId: '', // Will be set by parent contract
		mode: backendTermination.mode,
		notice: backendTermination.notice,
		details: backendTermination.details,
		createdAt: new Date(), // Backend doesn't provide this, use current date
	};
}

/**
 * Transform a backend contract contact to frontend format
 */
export function transformBackendContact(backendContact: BackendContractContact): ContractContact {
	return {
		id: backendContact.id,
		contractId: '', // Will be set by parent contract
		type: backendContact.type,
		name: backendContact.name,
		phone: backendContact.phone,
		email: backendContact.email,
		openingHours: backendContact.openingHours,
		createdAt: new Date(), // Backend doesn't provide this, use current date
	};
}

/**
 * Transform a backend contract to frontend format
 */
export function transformBackendContract(backendContract: GetContractByIdResponse): ContractWithRelations {
	const contract: ContractWithRelations = {
		id: backendContract.id,
		userId: backendContract.userId,
		insurerName: backendContract.insurerName,
		name: backendContract.name,
		category: backendContract.category,
		formula: backendContract.formula,
		startDate: backendContract.startDate ? new Date(backendContract.startDate) : undefined,
		endDate: backendContract.endDate ? new Date(backendContract.endDate) : undefined,
		annualPremiumCents: backendContract.annualPremiumCents,
		monthlyPremiumCents: backendContract.monthlyPremiumCents,
		tacitRenewal: backendContract.tacitRenewal,
		cancellationDeadline: backendContract.cancellationDeadline ? new Date(backendContract.cancellationDeadline) : undefined,
		status: backendContract.status,
		createdAt: new Date(backendContract.createdAt),
		updatedAt: new Date(backendContract.updatedAt),

		// Transform relations
		user: { id: backendContract.userId, contracts: [] }, // Minimal user object
		documents: backendContract.documents.map(doc => transformBackendDocument(doc)),
		guarantees: backendContract.guarantees?.map(guarantee => ({
			...transformBackendGuarantee(guarantee),
			contractId: backendContract.id,
		})) || [],
		exclusions: backendContract.exclusions?.map(exclusion => ({
			...transformBackendExclusion(exclusion),
			contractId: backendContract.id,
		})) || [],
		obligations: backendContract.obligations?.map(obligation => ({
			...transformBackendObligation(obligation),
			contractId: backendContract.id,
		})) || [],
		zones: backendContract.zones?.map(zone => ({
			...transformBackendZone(zone),
			contractId: backendContract.id,
		})) || [],
		termination: backendContract.termination ? {
			...transformBackendTermination(backendContract.termination),
			contractId: backendContract.id,
		} : undefined,
		contacts: backendContract.contacts?.map(contact => ({
			...transformBackendContact(contact),
			contractId: backendContract.id,
		})) || [],
	};

	return contract;
}

/**
 * Transform an array of backend contracts to frontend format
 */
export function transformBackendContracts(backendContracts: BackendContract[]): ContractWithRelations[] {
	return backendContracts.map(transformBackendContract);
}
