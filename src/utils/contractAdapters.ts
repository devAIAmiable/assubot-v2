import type { ContactType, Contract, ContractCategory, ContractListItem } from '../types';

/**
 * Adapter functions to work with Contract in legacy components
 * These functions provide the interface expected by components still using the old contract structure
 */

// Convert Contract to legacy properties for display
export const getContractInsurer = (contract: Contract): string => {
  return contract.insurer?.name || 'Assureur inconnu';
};

export const getContractType = (contract: Contract): string => {
  // Map new categories to legacy type strings for backward compatibility
  const legacyTypeMap: Record<ContractCategory, string> = {
    auto: 'auto',
    health: 'sante',
    home: 'habitation',
    moto: 'moto',
    electronic_devices: 'electronique',
    other: 'autre',
    loan: 'pret',
    travel: 'voyage',
    life: 'vie',
    professional: 'professionnel',
    legal: 'juridique',
    agriculture: 'agricole',
    event: 'evenement',
    pet: 'animaux',
  };
  return legacyTypeMap[contract.category as ContractCategory] || 'autre';
};

export const getContractPremium = (contract: Contract): number => {
  return contract.annualPremiumCents / 100; // Convert cents to euros
};

// Create a legacy-style overview object
export const getContractOverview = (contract: Contract) => {
  return {
    startDate: contract.startDate ? new Date(contract.startDate).toLocaleDateString('fr-FR') : 'Non défini',
    endDate: contract.endDate ? new Date(contract.endDate).toLocaleDateString('fr-FR') : 'Non défini',
    annualPremium: `${(contract.annualPremiumCents / 100).toFixed(2)}€`,
    hasTacitRenewal: false, // Not available in new structure
    tacitRenewalDeadline: '', // Not available in new structure
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
      uploadDate: contract.createdAt,
      required: true,
    },
    particularConditions: {
      name: cpDoc?.fileUrl.split('/').pop() || 'Conditions Particulières',
      url: cpDoc?.fileUrl || '',
      uploadDate: contract.createdAt,
      required: true,
    },
    otherDocs: otherDocs.map((doc) => ({
      name: doc.fileUrl.split('/').pop() || 'Document annexe',
      url: doc.fileUrl,
      uploadDate: contract.createdAt,
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
    duringContract: obligations.filter((o) => o.type === 'during_contract').map((o) => o.description),
    inCaseOfClaim: obligations.filter((o) => o.type === 'claim').map((o) => o.description),
  };
};

// Create legacy-style cancellation array
export const getContractCancellation = (contract: Contract) => {
  if (!contract.cancellations || contract.cancellations.length === 0) return [];

  return contract.cancellations.map((termination) => ({
    question: termination.question,
    answer: termination.response,
  }));
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
  return contract.annualPremiumCents / 100 / 12; // Calculate from annual premium
};

// Adapter functions for ContractListItem (lightweight contract for lists)
export const getContractListItemInsurer = (contract: ContractListItem): string => {
  return contract.insurer?.slug || 'Assureur inconnu';
};

export const getContractListItemType = (contract: ContractListItem): string => {
  // Map new categories to legacy type strings for backward compatibility
  const legacyTypeMap: Record<ContractCategory, string> = {
    auto: 'auto',
    health: 'sante',
    home: 'habitation',
    moto: 'moto',
    electronic_devices: 'electronique',
    other: 'autre',
    loan: 'pret',
    travel: 'voyage',
    life: 'vie',
    professional: 'professionnel',
    legal: 'juridique',
    agriculture: 'agricole',
    event: 'evenement',
    pet: 'animaux',
  };
  return legacyTypeMap[contract.category as ContractCategory] || 'autre';
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
      uploadDate: contract.createdAt,
      required: true,
    },
    particularConditions: {
      name: cpDoc?.fileUrl.split('/').pop() || 'Conditions Particulières',
      url: cpDoc?.fileUrl || '',
      uploadDate: contract.createdAt,
      required: true,
    },
    otherDocs: otherDocs.map((doc) => ({
      name: doc.fileUrl.split('/').pop() || 'Document annexe',
      url: doc.fileUrl,
      uploadDate: contract.createdAt,
      required: false,
    })),
  };
};
