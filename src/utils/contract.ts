import type { ContactType, ContractCategory, ObligationType } from '../types';
import { FaFileAlt, FaFileContract } from 'react-icons/fa';

import type { Contract } from '../types';
import { getCategoryLabel } from '../config/categories';

export const isExpired = (contract: Contract) => new Date(contract.endDate) < new Date();

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'auto':
      return FaFileContract;
    case 'habitation':
      return FaFileContract;
    case 'sante':
      return FaFileAlt;
    default:
      return FaFileContract;
  }
};

export const getTypeLabel = (type: string) => {
  // Map legacy types to new category labels
  const legacyToCategory: Record<string, ContractCategory> = {
    auto: 'auto',
    habitation: 'home',
    sante: 'health',
    moto: 'moto',
    electronique: 'electronic_devices',
    autre: 'other',
    pret: 'loan',
    voyage: 'travel',
    vie: 'life',
    professionnel: 'professional',
    juridique: 'legal',
    agricole: 'agriculture',
    evenement: 'event',
    animaux: 'pet',
  };

  const category = legacyToCategory[type] || 'other';
  return getCategoryLabel(category);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'expired':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'expired':
      return 'Expiré';
    case 'pending':
      return 'En attente';
    default:
      return 'Inconnu';
  }
};

/**
 * Get French label for contract contact type
 * @param contactType - The contact type enum value
 * @returns French label for the contact type
 */
export function getContactTypeLabel(contactType: ContactType): string {
  switch (contactType) {
    case 'management':
      return 'Gestion du contrat';
    case 'assistance':
      return 'Assistance';
    case 'emergency':
      return 'Urgence';
    default:
      return 'Contact';
  }
}

/**
 * Get French label for contract obligation type
 * @param obligationType - The obligation type enum value
 * @returns French label for the obligation type
 */
export function getObligationTypeLabel(obligationType: ObligationType): string {
  switch (obligationType) {
    case 'subscription':
      return 'À la souscription';
    case 'during_contract':
      return 'En cours de contrat';
    case 'claim':
      return 'En cas de sinistre';
    default:
      return 'Obligation';
  }
}
