import { FaFlag, FaGlobe, FaMapMarkedAlt } from 'react-icons/fa';

import type { ContractZone } from '../types/contract';

export const getZoneCoordinates = (zone: ContractZone): [number, number] | null => {
  const latitudeValue = zone.latitude ?? undefined;
  const longitudeValue = zone.longitude ?? undefined;

  const latitude = latitudeValue !== undefined && latitudeValue !== '' ? Number(latitudeValue) : undefined;
  const longitude = longitudeValue !== undefined && longitudeValue !== '' ? Number(longitudeValue) : undefined;

  if (typeof latitude === 'number' && Number.isFinite(latitude) && typeof longitude === 'number' && Number.isFinite(longitude)) {
    if (latitude === 0 && longitude === 0) {
      return null;
    }
    return [longitude, latitude];
  }

  return null;
};

export const getZoneIcon = (type: ContractZone['type']) => {
  switch (type) {
    case 'country':
      return FaFlag;
    case 'zone':
    case 'region':
    case 'city':
      return FaMapMarkedAlt;
    default:
      return FaGlobe;
  }
};

export const getZoneTypeLabel = (type: ContractZone['type']): string => {
  switch (type) {
    case 'country':
      return 'Pays';
    case 'zone':
      return 'Zone';
    case 'region':
      return 'Région';
    case 'city':
      return 'Ville';
    default:
      return 'Zone';
  }
};
