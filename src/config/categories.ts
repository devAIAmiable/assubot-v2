import { FaBuilding, FaCar, FaGavel, FaGlassCheers, FaHeart, FaHeartbeat, FaHome, FaLaptop, FaMotorcycle, FaPaw, FaPiggyBank, FaPlane, FaTractor, FaUserTie } from 'react-icons/fa';

import type { ContractCategory } from '../types/contract';

export const CATEGORY_CONFIG = {
  auto: { label: 'Auto', icon: FaCar, description: 'Assurance automobile' },
  health: { label: 'Santé', icon: FaHeart, description: 'Assurance santé et prévoyance' },
  home: { label: 'Habitation', icon: FaHome, description: 'Assurance habitation' },
  moto: { label: 'Moto', icon: FaMotorcycle, description: 'Assurance motocycle' },
  electronic_devices: { label: 'Objets Électroniques', icon: FaLaptop, description: 'Assurance électronique' },
  other: { label: 'Autre', icon: FaBuilding, description: 'Autres assurances' },
  loan: { label: 'Prêt', icon: FaPiggyBank, description: 'Assurance prêt' },
  travel: { label: 'Voyage', icon: FaPlane, description: 'Assurance voyage' },
  life: { label: 'Vie', icon: FaHeartbeat, description: 'Assurance vie' },
  professional: { label: 'Professionnelle', icon: FaUserTie, description: 'Assurance professionnelle' },
  legal: { label: 'Juridique', icon: FaGavel, description: 'Protection juridique' },
  agriculture: { label: 'Agricole', icon: FaTractor, description: 'Assurance agricole' },
  event: { label: 'Événement', icon: FaGlassCheers, description: 'Assurance événement' },
  pet: { label: 'Animaux', icon: FaPaw, description: 'Assurance animaux' },
} as const;

export const getCategoryLabel = (category: ContractCategory): string => {
  return CATEGORY_CONFIG[category]?.label || category;
};

export const getCategoryIcon = (category: ContractCategory) => {
  return CATEGORY_CONFIG[category]?.icon || FaBuilding;
};

export const getCategoryDescription = (category: ContractCategory): string => {
  return CATEGORY_CONFIG[category]?.description || '';
};

export const getAllCategories = () => {
  return Object.keys(CATEGORY_CONFIG) as ContractCategory[];
};
