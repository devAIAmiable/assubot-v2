import type { ContactType, Contract, ContractListItem } from '../types';

/**
 * Adapter functions to work with Contract in legacy components
 * These functions provide the interface expected by components still using the old contract structure
 */

// Convert Contract to legacy properties for display
export const getContractInsurer = (contract: Contract): string => {
	return contract.insurerName;
};

export const getContractType = (contract: Contract): string => {
	// Map new categories to legacy type strings
	const typeMap: Record<typeof contract.category, string> = {
		auto: 'auto',
		health: 'sante',
		home: 'habitation',
		motorcycle: 'auto', // Map motorcycle to auto for compatibility
		electronic_devices: 'electronique',
		other: 'autre',
	};
	return typeMap[contract.category] || 'autre';
};

export const getContractPremium = (contract: Contract): number => {
	return contract.annualPremiumCents / 100; // Convert cents to euros
};

// Create a legacy-style overview object
export const getContractOverview = (contract: Contract) => {
	return {
		startDate: new Date(contract.startDate).toLocaleDateString('fr-FR'),
		endDate: new Date(contract.endDate).toLocaleDateString('fr-FR'),
		annualPremium: `${(contract.annualPremiumCents / 100).toFixed(2)}€`,
		hasTacitRenewal: contract.tacitRenewal,
		tacitRenewalDeadline: contract.cancellationDeadline
			? new Date(contract.cancellationDeadline).toLocaleDateString('fr-FR')
			: '',
		planType: contract.formula || 'Formule standard',
		subscribedCoverages: contract.guarantees?.map((g) => g.title) || [],
	};
};

// Create legacy-style documents object
export const getContractDocuments = (contract: Contract) => {
	const cpDoc = contract.documents?.find((d) => d.type === 'CP');
	const cgDoc = contract.documents?.find((d) => d.type === 'CG');
	const otherDocs = contract.documents?.filter((d) => d.type === 'OTHER') || [];

	return {
		generalConditions: {
			name: cgDoc?.fileUrl.split('/').pop() || 'Conditions Générales',
			url: cgDoc?.fileUrl || '',
			uploadDate: cgDoc?.createdAt || contract.createdAt,
			required: true,
		},
		particularConditions: {
			name: cpDoc?.fileUrl.split('/').pop() || 'Conditions Particulières',
			url: cpDoc?.fileUrl || '',
			uploadDate: cpDoc?.createdAt || contract.createdAt,
			required: true,
		},
		otherDocs: otherDocs.map((doc) => ({
			name: doc.fileUrl.split('/').pop() || 'Document annexe',
			url: doc.fileUrl,
			uploadDate: doc.createdAt,
			required: false,
		})),
	};
};

// Create legacy-style coverages array
export const getContractCoverages = (contract: Contract) => {
	return (
		contract.guarantees?.map((guarantee) => ({
			name: guarantee.title,
			details: [
				{
					service: guarantee.title,
					limit: guarantee.details || 'Non spécifié',
					deductible: 'Non spécifié',
					restrictions: 'Voir conditions générales',
					coveredItems: guarantee.covered ? [guarantee.covered] : [],
					excludedItems: guarantee.notCovered ? [guarantee.notCovered] : [],
				},
			],
			coveredItems: guarantee.covered ? [guarantee.covered] : [],
			excludedItems: guarantee.notCovered ? [guarantee.notCovered] : [],
		})) || []
	);
};

// Get general exclusions
export const getContractExclusions = (contract: Contract): string[] => {
	return contract.exclusions?.map((e) => e.description) || [];
};

// Create geographic coverage object
export const getContractGeographicCoverage = (contract: Contract) => {
	return {
		countries: contract.zones?.map((z) => z.label) || ['France'],
	};
};

// Create legacy-style obligations object
export const getContractObligations = (contract: Contract) => {
	const obligations = contract.obligations || [];
	return {
		atSubscription: obligations.filter((o) => o.type === 'subscription').map((o) => o.description),
		duringContract: obligations
			.filter((o) => o.type === 'during_contract')
			.map((o) => o.description),
		inCaseOfClaim: obligations.filter((o) => o.type === 'claim').map((o) => o.description),
	};
};

// Create legacy-style cancellation array
export const getContractCancellation = (contract: Contract) => {
	if (!contract.termination) return [];

	return [
		{
			question: 'Mode de résiliation',
			answer: contract.termination.mode || 'Non spécifié',
		},
		{
			question: 'Préavis',
			answer: contract.termination.notice || 'Non spécifié',
		},
		{
			question: 'Détails',
			answer: contract.termination.details || 'Voir conditions générales',
		},
	];
};

// Create legacy-style contacts object
export const getContractContacts = (contract: Contract) => {
	const contacts = contract.contacts || [];

	const getContactByType = (type: ContactType) => contacts.find((c) => c.type === type);

	const managementContact = getContactByType('management');
	const assistanceContact = getContactByType('assistance');
	const emergencyContact = getContactByType('emergency');

	return {
		contractManagement: {
			name: managementContact?.name || 'Service client',
			phone: managementContact?.phone || '',
			email: managementContact?.email || '',
			hours: managementContact?.openingHours || 'Lun-Ven 9h-18h',
		},
		assistance: {
			name: assistanceContact?.name || 'Assistance',
			phone: assistanceContact?.phone || '',
			email: assistanceContact?.email || '',
			availability: assistanceContact?.openingHours || '24h/24 7j/7',
		},
		emergency: {
			name: emergencyContact?.name || 'Urgences',
			phone: emergencyContact?.phone || '',
			email: emergencyContact?.email || '',
			availability: emergencyContact?.openingHours || '24h/24 7j/7',
		},
	};
};

// Helper to get monthly premium
export const getContractMonthlyPremium = (contract: Contract): number => {
	if (contract.monthlyPremiumCents) {
		return contract.monthlyPremiumCents / 100;
	}
	return contract.annualPremiumCents / 100 / 12;
};

// Adapter functions for ContractListItem (lightweight contract for lists)
export const getContractListItemInsurer = (contract: ContractListItem): string => {
	return contract.insurerName || '';
};

export const getContractListItemType = (contract: ContractListItem): string => {
	// Map new categories to legacy type strings
	const typeMap: Record<typeof contract.category, string> = {
		auto: 'auto',
		health: 'sante',
		home: 'habitation',
		moto: 'auto', // Map moto to auto for compatibility
		electronic_devices: 'electronique',
		other: 'autre',
	};
	return typeMap[contract.category] || 'autre';
};

export const getContractListItemPremium = (contract: ContractListItem): number => {
	return contract.annualPremiumCents / 100; // Convert cents to euros
};

// Create legacy-style documents object for ContractListItem
export const getContractListItemDocuments = (contract: ContractListItem) => {
	const cpDoc = contract.documents?.find((d) => d.type === 'CP');
	const cgDoc = contract.documents?.find((d) => d.type === 'CG');
	const otherDocs = contract.documents?.filter((d) => d.type === 'OTHER') || [];

	return {
		generalConditions: {
			name: cgDoc?.fileUrl.split('/').pop() || 'Conditions Générales',
			url: cgDoc?.fileUrl || '',
			uploadDate: cgDoc?.createdAt || contract.createdAt,
			required: true,
		},
		particularConditions: {
			name: cpDoc?.fileUrl.split('/').pop() || 'Conditions Particulières',
			url: cpDoc?.fileUrl || '',
			uploadDate: cpDoc?.createdAt || contract.createdAt,
			required: true,
		},
		otherDocs: otherDocs.map((doc) => ({
			name: doc.fileUrl.split('/').pop() || 'Document annexe',
			url: doc.fileUrl,
			uploadDate: doc.createdAt,
			required: false,
		})),
	};
};
