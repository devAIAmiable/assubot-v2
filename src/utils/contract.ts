import { FaFileAlt, FaFileContract } from 'react-icons/fa';

import type { Contract } from '../types';

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
	switch (type) {
		case 'auto':
			return 'Automobile';
		case 'habitation':
			return 'Habitation';
		case 'sante':
			return 'Santé';
		case 'autre':
			return 'Autre';
		default:
			return 'Autre';
	}
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
