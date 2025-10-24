import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import type { ComparisonCategory } from '../../types/comparison';
import FormView from './FormView';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';

// Mock the comparison API
const mockCalculateComparison = vi.fn();
vi.mock('../../store/comparisonApi', () => ({
  useCalculateComparisonMutation: () => [mockCalculateComparison, { isLoading: false, error: null }],
}));

// Mock the form definitions with comprehensive auto form
vi.mock('../../config/forms', () => ({
  getFormDefinitionByCategory: (category: ComparisonCategory) => ({
    category,
    sections: [
      {
        title: 'Identification du véhicule',
        fields: [
          // Vehicle identification
          {
            name: 'vehicleType',
            type: 'radio',
            label: 'Type de véhicule',
            required: true,
            options: [
              { value: 'car', label: 'Voiture' },
              { value: 'motorcycle', label: 'Moto' },
            ],
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'make',
            type: 'text',
            label: 'Marque',
            required: true,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'model',
            type: 'text',
            label: 'Modèle',
            required: true,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'version',
            type: 'text',
            label: 'Version',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'modelYear',
            type: 'date',
            label: 'Année du modèle',
            required: true,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'fuelType',
            type: 'card',
            label: 'Type de carburant',
            required: true,
            options: [
              { value: 'gasoline', label: 'Essence', icon: '⛽' },
              { value: 'diesel', label: 'Diesel', icon: '🛢️' },
              { value: 'electric', label: 'Électrique', icon: '🔌' },
            ],
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'transmission',
            type: 'select',
            label: 'Transmission',
            required: true,
            options: [
              { value: 'manual', label: 'Manuelle' },
              { value: 'automatic', label: 'Automatique' },
            ],
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'bodyType',
            type: 'select',
            label: 'Type de carrosserie',
            required: true,
            options: [
              { value: 'sedan', label: 'Berline' },
              { value: 'hatchback', label: 'Break' },
              { value: 'suv', label: 'SUV' },
            ],
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'doorCount',
            type: 'select',
            label: 'Nombre de portes',
            required: true,
            options: [
              { value: '2', label: '2 portes' },
              { value: '3', label: '3 portes' },
              { value: '4', label: '4 portes' },
              { value: '5', label: '5 portes' },
            ],
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'power',
            type: 'number',
            label: 'Puissance (CV)',
            required: true,
            validation: { min: 1, max: 1000 },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'firstRegistrationDate',
            type: 'date',
            label: 'Date de première immatriculation',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'purchaseDate',
            type: 'date',
            label: "Date d'achat",
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'purchasePrice',
            type: 'number',
            label: "Prix d'achat",
            required: false,
            validation: { min: 0, max: 1000000 },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'currentValue',
            type: 'number',
            label: 'Valeur actuelle',
            required: false,
            validation: { min: 0, max: 1000000 },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'mileage',
            type: 'number',
            label: 'Kilométrage',
            required: false,
            validation: { min: 0, max: 1000000 },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'hasModifications',
            type: 'checkbox',
            label: 'Véhicule modifié',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'modificationDetails',
            type: 'text',
            label: 'Détails des modifications',
            required: false,
            showWhen: { field: 'hasModifications', equals: true },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'hasAntiTheftDevice',
            type: 'checkbox',
            label: 'Dispositif anti-vol',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'antiTheftDeviceType',
            type: 'select',
            label: 'Type de dispositif anti-vol',
            required: false,
            showWhen: { field: 'hasAntiTheftDevice', equals: true },
            options: [
              { value: 'alarm', label: 'Alarme' },
              { value: 'immobilizer', label: 'Antidémarreur' },
              { value: 'gps', label: 'GPS' },
            ],
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'hasTrackingDevice',
            type: 'checkbox',
            label: 'Dispositif de géolocalisation',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'trackingDeviceType',
            type: 'select',
            label: 'Type de dispositif de géolocalisation',
            required: false,
            showWhen: { field: 'hasTrackingDevice', equals: true },
            options: [
              { value: 'gps', label: 'GPS' },
              { value: 'gsm', label: 'GSM' },
              { value: 'other', label: 'Autre' },
            ],
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'hasCommercialUse',
            type: 'checkbox',
            label: 'Usage commercial',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'commercialUseDetails',
            type: 'text',
            label: "Détails de l'usage commercial",
            required: false,
            showWhen: { field: 'hasCommercialUse', equals: true },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'hasRentalUse',
            type: 'checkbox',
            label: 'Usage location',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'rentalUseDetails',
            type: 'text',
            label: "Détails de l'usage location",
            required: false,
            showWhen: { field: 'hasRentalUse', equals: true },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'hasTaxiUse',
            type: 'checkbox',
            label: 'Usage taxi',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'taxiUseDetails',
            type: 'text',
            label: "Détails de l'usage taxi",
            required: false,
            showWhen: { field: 'hasTaxiUse', equals: true },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'hasSchoolUse',
            type: 'checkbox',
            label: 'Usage école de conduite',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'schoolUseDetails',
            type: 'text',
            label: "Détails de l'usage école de conduite",
            required: false,
            showWhen: { field: 'hasSchoolUse', equals: true },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'hasOtherUse',
            type: 'checkbox',
            label: 'Autre usage',
            required: false,
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'otherUseDetails',
            type: 'text',
            label: "Détails de l'autre usage",
            required: false,
            showWhen: { field: 'hasOtherUse', equals: true },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'hasSecondaryDriver',
            type: 'checkbox',
            label: 'Conducteur secondaire',
            required: false,
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'secondaryDriverName',
            type: 'text',
            label: 'Nom du conducteur secondaire',
            required: false,
            showWhen: { field: 'hasSecondaryDriver', equals: true },
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'secondaryDriverBirthDate',
            type: 'date',
            label: 'Date de naissance du conducteur secondaire',
            required: false,
            showWhen: { field: 'hasSecondaryDriver', equals: true },
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'secondaryDriverGender',
            type: 'select',
            label: 'Sexe du conducteur secondaire',
            required: false,
            showWhen: { field: 'hasSecondaryDriver', equals: true },
            options: [
              { value: 'male', label: 'Homme' },
              { value: 'female', label: 'Femme' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'secondaryDriverProfession',
            type: 'select',
            label: 'Profession du conducteur secondaire',
            required: false,
            showWhen: { field: 'hasSecondaryDriver', equals: true },
            options: [
              { value: 'student', label: 'Étudiant' },
              { value: 'employee', label: 'Salarié' },
              { value: 'self_employed', label: 'Indépendant' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'secondaryDriverDrivingLicenseDate',
            type: 'date',
            label: "Date d'obtention du permis du conducteur secondaire",
            required: false,
            showWhen: { field: 'hasSecondaryDriver', equals: true },
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'gender',
            type: 'select',
            label: 'Sexe',
            required: true,
            options: [
              { value: 'male', label: 'Homme' },
              { value: 'female', label: 'Femme' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'birthDate',
            type: 'date',
            label: 'Date de naissance',
            required: true,
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'maritalStatus',
            type: 'select',
            label: 'Situation familiale',
            required: true,
            options: [
              { value: 'single', label: 'Célibataire' },
              { value: 'married', label: 'Marié(e)' },
              { value: 'cohabiting', label: 'En concubinage' },
              { value: 'pacs', label: 'PACS' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'spouseHasLicense',
            type: 'select',
            label: 'Le conjoint a-t-il le permis ?',
            required: false,
            showWhen: { field: 'maritalStatus', in: ['married', 'cohabiting', 'pacs'] },
            options: [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'spouseLicenseDate',
            type: 'date',
            label: "Date d'obtention du permis du conjoint",
            required: false,
            showWhen: { field: 'spouseHasLicense', equals: 'yes' },
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'spouseBirthDate',
            type: 'date',
            label: 'Date de naissance du conjoint',
            required: false,
            showWhen: { field: 'spouseHasLicense', equals: 'yes' },
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'spouseIsMainDriver',
            type: 'select',
            label: 'Le conjoint est-il le conducteur principal ?',
            required: false,
            showWhen: { field: 'spouseHasLicense', equals: 'yes' },
            options: [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'profession',
            type: 'select',
            label: 'Profession',
            required: true,
            options: [
              { value: 'student', label: 'Étudiant' },
              { value: 'employee', label: 'Salarié' },
              { value: 'self_employed', label: 'Indépendant' },
              { value: 'retired', label: 'Retraité' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'numberOfChildren',
            type: 'select',
            label: "Nombre d'enfants",
            required: true,
            options: [
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3_plus', label: '3+' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'childrenBirthYears',
            type: 'object',
            label: 'Années de naissance des enfants',
            required: false,
            showWhen: { field: 'numberOfChildren', in: ['1', '2', '3_plus'] },
            objectSchema: {
              type: 'object',
              properties: {
                child1: { type: 'date', label: 'Enfant 1' },
                child2: { type: 'date', label: 'Enfant 2' },
                child3: { type: 'date', label: 'Enfant 3' },
              },
            },
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'drivingLicenseDate',
            type: 'date',
            label: "Date d'obtention du permis",
            required: true,
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'licenseSuspension',
            type: 'select',
            label: 'Suspension du permis',
            required: true,
            options: [
              { value: 'never', label: 'Jamais' },
              { value: 'suspended_less_5', label: 'Suspendu il y a moins de 5 ans' },
              { value: 'cancelled_less_5', label: 'Annulé il y a moins de 5 ans' },
              { value: 'withdrawn_less_5', label: 'Retiré il y a moins de 5 ans' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'suspensionDuration',
            type: 'select',
            label: 'Durée de la suspension',
            required: false,
            showWhen: { field: 'licenseSuspension', in: ['suspended_less_5', 'cancelled_less_5', 'withdrawn_less_5'] },
            options: [
              { value: '1_month', label: '1 mois' },
              { value: '3_months', label: '3 mois' },
              { value: '6_months', label: '6 mois' },
              { value: '1_year', label: '1 an' },
              { value: 'more_1_year', label: "Plus d'1 an" },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'suspensionReason',
            type: 'select',
            label: 'Raison de la suspension',
            required: false,
            showWhen: { field: 'licenseSuspension', in: ['suspended_less_5', 'cancelled_less_5', 'withdrawn_less_5'] },
            options: [
              { value: 'alcohol', label: 'Alcool' },
              { value: 'drugs', label: 'Drogues' },
              { value: 'speed', label: 'Vitesse' },
              { value: 'other', label: 'Autre' },
            ],
            subsection: { id: 'driver_profile', label: 'Profil du conducteur' },
          },
          {
            name: 'usageType',
            type: 'select',
            label: "Type d'usage",
            required: true,
            options: [
              { value: 'private', label: 'Privé' },
              { value: 'private_work', label: 'Privé + travail' },
              { value: 'private_professional', label: 'Privé + professionnel' },
              { value: 'private_tours', label: 'Privé + tourisme' },
            ],
            subsection: { id: 'vehicle_usage', label: 'Usage du véhicule' },
          },
          {
            name: 'workPostalCode',
            type: 'text',
            label: 'Code postal du travail',
            required: false,
            showWhen: { field: 'usageType', in: ['private_work', 'private_professional', 'private_tours'] },
            validation: { pattern: '^[0-9]{5}$' },
            subsection: { id: 'vehicle_usage', label: 'Usage du véhicule' },
          },
          {
            name: 'annualMileage',
            type: 'select',
            label: 'Kilométrage annuel',
            required: true,
            options: [
              { value: 'less_5000', label: 'Moins de 5 000 km' },
              { value: '5000_10000', label: '5 000 à 10 000 km' },
              { value: '10000_15000', label: '10 000 à 15 000 km' },
              { value: '15000_20000', label: '15 000 à 20 000 km' },
              { value: 'more_20000', label: 'Plus de 20 000 km' },
            ],
            subsection: { id: 'vehicle_usage', label: 'Usage du véhicule' },
          },
          {
            name: 'nightParkingType',
            type: 'select',
            label: 'Type de stationnement nocturne',
            required: true,
            options: [
              { value: 'garage', label: 'Garage' },
              { value: 'carport', label: 'Carport' },
              { value: 'street', label: 'Rue' },
              { value: 'parking', label: 'Parking' },
            ],
            subsection: { id: 'vehicle_usage', label: 'Usage du véhicule' },
          },
          {
            name: 'nightParkingPostalCode',
            type: 'text',
            label: 'Code postal du stationnement nocturne',
            required: true,
            validation: { pattern: '^[0-9]{5}$' },
            subsection: { id: 'vehicle_usage', label: 'Usage du véhicule' },
          },
          {
            name: 'isCurrentlyInsured',
            type: 'select',
            label: 'Actuellement assuré',
            required: true,
            options: [
              { value: 'main_driver', label: 'Conducteur principal' },
              { value: 'secondary_driver', label: 'Conducteur secondaire' },
              { value: 'not_insured', label: 'Non assuré' },
            ],
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
          {
            name: 'contractOlderThanYear',
            type: 'select',
            label: "Contrat de plus d'un an",
            required: false,
            showWhen: { field: 'isCurrentlyInsured', in: ['main_driver', 'secondary_driver'] },
            options: [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ],
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
          {
            name: 'contractExpiryMonth',
            type: 'select',
            label: "Mois d'expiration du contrat",
            required: false,
            showWhen: { field: 'isCurrentlyInsured', in: ['main_driver', 'secondary_driver'] },
            options: [
              { value: 'january', label: 'Janvier' },
              { value: 'february', label: 'Février' },
              { value: 'march', label: 'Mars' },
              { value: 'april', label: 'Avril' },
              { value: 'may', label: 'Mai' },
              { value: 'june', label: 'Juin' },
              { value: 'july', label: 'Juillet' },
              { value: 'august', label: 'Août' },
              { value: 'september', label: 'Septembre' },
              { value: 'october', label: 'Octobre' },
              { value: 'november', label: 'Novembre' },
              { value: 'december', label: 'Décembre' },
            ],
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
          {
            name: 'yearsInsured',
            type: 'select',
            label: "Années d'assurance",
            required: true,
            options: [
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5_plus', label: '5+' },
            ],
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
          {
            name: 'bonusMalus',
            type: 'select',
            label: 'Bonus/Malus',
            required: true,
            options: Array.from({ length: 52 }, (_, i) => ({
              value: (i - 22).toString(),
              label: (i - 22).toString(),
            })),
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
          {
            name: 'contractSuspended',
            type: 'select',
            label: 'Contrat suspendu',
            required: true,
            options: [
              { value: 'never', label: 'Jamais' },
              { value: 'yes', label: 'Oui' },
            ],
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
          {
            name: 'isMainDriverOtherVehicle',
            type: 'select',
            label: "Conducteur principal d'un autre véhicule",
            required: true,
            options: [
              { value: 'no', label: 'Non' },
              { value: 'yes', label: 'Oui' },
            ],
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
          {
            name: 'hasBeenTerminated',
            type: 'select',
            label: "Résiliation d'assurance",
            required: true,
            options: [
              { value: 'never', label: 'Jamais' },
              { value: 'yes', label: 'Oui' },
              { value: 'other', label: 'Autre' },
            ],
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
          {
            name: 'terminationReason',
            type: 'select',
            label: 'Raison de la résiliation',
            required: false,
            showWhen: { field: 'hasBeenTerminated', equals: 'other' },
            options: [
              { value: 'non_payment', label: 'Non-paiement' },
              { value: 'fraud', label: 'Fraude' },
              { value: 'other', label: 'Autre' },
            ],
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
          {
            name: 'claimsLast3Years',
            type: 'select',
            label: 'Sinistres des 3 dernières années',
            required: true,
            options: [
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3_plus', label: '3+' },
            ],
            subsection: { id: 'insurance_history', label: "Historique d'assurance" },
          },
        ],
      },
    ],
  }),
}));

// Mock user data
const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  profession: 'student',
  provider: 'email',
  isFirstLogin: false,
  gender: 'male',
  birthDate: '1990-01-01',
  zip: '75001',
  city: 'Paris',
  address: '123 Test Street',
};

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      user: (state = { currentUser: mockUser }) => state,
    },
  });
};

describe('Auto Form Conditional Logic', () => {
  let mockUpdateFormField: ReturnType<typeof vi.fn>;
  let mockSetCurrentStep: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUpdateFormField = vi.fn();
    mockSetCurrentStep = vi.fn();
    mockCalculateComparison.mockClear();
  });

  const renderFormView = (formData = {}) => {
    const store = createMockStore();

    return render(
      <Provider store={store}>
        <FormView selectedType="auto" formData={formData} updateFormField={mockUpdateFormField} setCurrentStep={mockSetCurrentStep} />
      </Provider>
    );
  };

  describe('Work Postal Code Conditional Logic', () => {
    it('should show workPostalCode when usageType is private_work', async () => {
      renderFormView({ usageType: 'private_work' });

      await waitFor(() => {
        expect(screen.getByLabelText('Code postal du travail')).toBeInTheDocument();
      });
    });

    it('should show workPostalCode when usageType is private_professional', async () => {
      renderFormView({ usageType: 'private_professional' });

      await waitFor(() => {
        expect(screen.getByLabelText('Code postal du travail')).toBeInTheDocument();
      });
    });

    it('should show workPostalCode when usageType is private_tours', async () => {
      renderFormView({ usageType: 'private_tours' });

      await waitFor(() => {
        expect(screen.getByLabelText('Code postal du travail')).toBeInTheDocument();
      });
    });

    it('should hide workPostalCode when usageType is private', async () => {
      renderFormView({ usageType: 'private' });

      await waitFor(() => {
        expect(screen.queryByLabelText('Code postal du travail')).not.toBeInTheDocument();
      });
    });

    it('should hide workPostalCode when usageType is undefined', async () => {
      renderFormView({});

      await waitFor(() => {
        expect(screen.queryByLabelText('Code postal du travail')).not.toBeInTheDocument();
      });
    });
  });

  describe('Children Birth Years Conditional Logic', () => {
    it('should show childrenBirthYears when numberOfChildren is 1', async () => {
      renderFormView({ numberOfChildren: '1' });

      await waitFor(() => {
        expect(screen.getByLabelText('Années de naissance des enfants')).toBeInTheDocument();
      });
    });

    it('should show childrenBirthYears when numberOfChildren is 2', async () => {
      renderFormView({ numberOfChildren: '2' });

      await waitFor(() => {
        expect(screen.getByLabelText('Années de naissance des enfants')).toBeInTheDocument();
      });
    });

    it('should show childrenBirthYears when numberOfChildren is 3_plus', async () => {
      renderFormView({ numberOfChildren: '3_plus' });

      await waitFor(() => {
        expect(screen.getByLabelText('Années de naissance des enfants')).toBeInTheDocument();
      });
    });

    it('should hide childrenBirthYears when numberOfChildren is 0', async () => {
      renderFormView({ numberOfChildren: '0' });

      await waitFor(() => {
        expect(screen.queryByLabelText('Années de naissance des enfants')).not.toBeInTheDocument();
      });
    });

    it('should hide childrenBirthYears when numberOfChildren is undefined', async () => {
      renderFormView({});

      await waitFor(() => {
        expect(screen.queryByLabelText('Années de naissance des enfants')).not.toBeInTheDocument();
      });
    });
  });

  describe('License Suspension Conditional Logic', () => {
    it('should show suspensionDuration when licenseSuspension is suspended_less_5', async () => {
      renderFormView({ licenseSuspension: 'suspended_less_5' });

      await waitFor(() => {
        expect(screen.getByLabelText('Durée de la suspension')).toBeInTheDocument();
      });
    });

    it('should show suspensionDuration when licenseSuspension is cancelled_less_5', async () => {
      renderFormView({ licenseSuspension: 'cancelled_less_5' });

      await waitFor(() => {
        expect(screen.getByLabelText('Durée de la suspension')).toBeInTheDocument();
      });
    });

    it('should show suspensionDuration when licenseSuspension is withdrawn_less_5', async () => {
      renderFormView({ licenseSuspension: 'withdrawn_less_5' });

      await waitFor(() => {
        expect(screen.getByLabelText('Durée de la suspension')).toBeInTheDocument();
      });
    });

    it('should hide suspensionDuration when licenseSuspension is never', async () => {
      renderFormView({ licenseSuspension: 'never' });

      await waitFor(() => {
        expect(screen.queryByLabelText('Durée de la suspension')).not.toBeInTheDocument();
      });
    });

    it('should show suspensionReason when licenseSuspension is suspended_less_5', async () => {
      renderFormView({ licenseSuspension: 'suspended_less_5' });

      await waitFor(() => {
        expect(screen.getByLabelText('Raison de la suspension')).toBeInTheDocument();
      });
    });
  });

  describe('Spouse License Conditional Logic', () => {
    it('should show spouseHasLicense when maritalStatus is married', async () => {
      renderFormView({ maritalStatus: 'married' });

      await waitFor(() => {
        expect(screen.getByLabelText('Le conjoint a-t-il le permis ?')).toBeInTheDocument();
      });
    });

    it('should show spouseHasLicense when maritalStatus is cohabiting', async () => {
      renderFormView({ maritalStatus: 'cohabiting' });

      await waitFor(() => {
        expect(screen.getByLabelText('Le conjoint a-t-il le permis ?')).toBeInTheDocument();
      });
    });

    it('should show spouseHasLicense when maritalStatus is pacs', async () => {
      renderFormView({ maritalStatus: 'pacs' });

      await waitFor(() => {
        expect(screen.getByLabelText('Le conjoint a-t-il le permis ?')).toBeInTheDocument();
      });
    });

    it('should hide spouseHasLicense when maritalStatus is single', async () => {
      renderFormView({ maritalStatus: 'single' });

      await waitFor(() => {
        expect(screen.queryByLabelText('Le conjoint a-t-il le permis ?')).not.toBeInTheDocument();
      });
    });

    it('should show spouseLicenseDate when spouseHasLicense is yes', async () => {
      renderFormView({ maritalStatus: 'married', spouseHasLicense: 'yes' });

      await waitFor(() => {
        expect(screen.getByLabelText("Date d'obtention du permis du conjoint")).toBeInTheDocument();
      });
    });

    it('should show spouseBirthDate when spouseHasLicense is yes', async () => {
      renderFormView({ maritalStatus: 'married', spouseHasLicense: 'yes' });

      await waitFor(() => {
        expect(screen.getByLabelText('Date de naissance du conjoint')).toBeInTheDocument();
      });
    });

    it('should show spouseIsMainDriver when spouseHasLicense is yes', async () => {
      renderFormView({ maritalStatus: 'married', spouseHasLicense: 'yes' });

      await waitFor(() => {
        expect(screen.getByLabelText('Le conjoint est-il le conducteur principal ?')).toBeInTheDocument();
      });
    });

    it('should hide spouse fields when spouseHasLicense is no', async () => {
      renderFormView({ maritalStatus: 'married', spouseHasLicense: 'no' });

      await waitFor(() => {
        expect(screen.queryByLabelText("Date d'obtention du permis du conjoint")).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Date de naissance du conjoint')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Le conjoint est-il le conducteur principal ?')).not.toBeInTheDocument();
      });
    });
  });

  describe('Termination Reason Conditional Logic', () => {
    it('should show terminationReason when hasBeenTerminated is other', async () => {
      renderFormView({ hasBeenTerminated: 'other' });

      await waitFor(() => {
        expect(screen.getByLabelText('Raison de la résiliation')).toBeInTheDocument();
      });
    });

    it('should hide terminationReason when hasBeenTerminated is never', async () => {
      renderFormView({ hasBeenTerminated: 'never' });

      await waitFor(() => {
        expect(screen.queryByLabelText('Raison de la résiliation')).not.toBeInTheDocument();
      });
    });

    it('should hide terminationReason when hasBeenTerminated is yes', async () => {
      renderFormView({ hasBeenTerminated: 'yes' });

      await waitFor(() => {
        expect(screen.queryByLabelText('Raison de la résiliation')).not.toBeInTheDocument();
      });
    });
  });

  describe('Contract Details Conditional Logic', () => {
    it('should show contractOlderThanYear when isCurrentlyInsured is main_driver', async () => {
      renderFormView({ isCurrentlyInsured: 'main_driver' });

      await waitFor(() => {
        expect(screen.getByLabelText("Contrat de plus d'un an")).toBeInTheDocument();
      });
    });

    it('should show contractOlderThanYear when isCurrentlyInsured is secondary_driver', async () => {
      renderFormView({ isCurrentlyInsured: 'secondary_driver' });

      await waitFor(() => {
        expect(screen.getByLabelText("Contrat de plus d'un an")).toBeInTheDocument();
      });
    });

    it('should show contractExpiryMonth when isCurrentlyInsured is main_driver', async () => {
      renderFormView({ isCurrentlyInsured: 'main_driver' });

      await waitFor(() => {
        expect(screen.getByLabelText("Mois d'expiration du contrat")).toBeInTheDocument();
      });
    });

    it('should hide contract fields when isCurrentlyInsured is not_insured', async () => {
      renderFormView({ isCurrentlyInsured: 'not_insured' });

      await waitFor(() => {
        expect(screen.queryByLabelText("Contrat de plus d'un an")).not.toBeInTheDocument();
        expect(screen.queryByLabelText("Mois d'expiration du contrat")).not.toBeInTheDocument();
      });
    });
  });

  describe('Vehicle Modification Conditional Logic', () => {
    it('should show modificationDetails when hasModifications is true', async () => {
      renderFormView({ hasModifications: true });

      await waitFor(() => {
        expect(screen.getByLabelText('Détails des modifications')).toBeInTheDocument();
      });
    });

    it('should hide modificationDetails when hasModifications is false', async () => {
      renderFormView({ hasModifications: false });

      await waitFor(() => {
        expect(screen.queryByLabelText('Détails des modifications')).not.toBeInTheDocument();
      });
    });
  });

  describe('Anti-Theft Device Conditional Logic', () => {
    it('should show antiTheftDeviceType when hasAntiTheftDevice is true', async () => {
      renderFormView({ hasAntiTheftDevice: true });

      await waitFor(() => {
        expect(screen.getByLabelText('Type de dispositif anti-vol')).toBeInTheDocument();
      });
    });

    it('should hide antiTheftDeviceType when hasAntiTheftDevice is false', async () => {
      renderFormView({ hasAntiTheftDevice: false });

      await waitFor(() => {
        expect(screen.queryByLabelText('Type de dispositif anti-vol')).not.toBeInTheDocument();
      });
    });
  });

  describe('Tracking Device Conditional Logic', () => {
    it('should show trackingDeviceType when hasTrackingDevice is true', async () => {
      renderFormView({ hasTrackingDevice: true });

      await waitFor(() => {
        expect(screen.getByLabelText('Type de dispositif de géolocalisation')).toBeInTheDocument();
      });
    });

    it('should hide trackingDeviceType when hasTrackingDevice is false', async () => {
      renderFormView({ hasTrackingDevice: false });

      await waitFor(() => {
        expect(screen.queryByLabelText('Type de dispositif de géolocalisation')).not.toBeInTheDocument();
      });
    });
  });

  describe('Usage Type Conditional Logic', () => {
    it('should show commercialUseDetails when hasCommercialUse is true', async () => {
      renderFormView({ hasCommercialUse: true });

      await waitFor(() => {
        expect(screen.getByLabelText("Détails de l'usage commercial")).toBeInTheDocument();
      });
    });

    it('should show rentalUseDetails when hasRentalUse is true', async () => {
      renderFormView({ hasRentalUse: true });

      await waitFor(() => {
        expect(screen.getByLabelText("Détails de l'usage location")).toBeInTheDocument();
      });
    });

    it('should show taxiUseDetails when hasTaxiUse is true', async () => {
      renderFormView({ hasTaxiUse: true });

      await waitFor(() => {
        expect(screen.getByLabelText("Détails de l'usage taxi")).toBeInTheDocument();
      });
    });

    it('should show schoolUseDetails when hasSchoolUse is true', async () => {
      renderFormView({ hasSchoolUse: true });

      await waitFor(() => {
        expect(screen.getByLabelText("Détails de l'usage école de conduite")).toBeInTheDocument();
      });
    });

    it('should show otherUseDetails when hasOtherUse is true', async () => {
      renderFormView({ hasOtherUse: true });

      await waitFor(() => {
        expect(screen.getByLabelText("Détails de l'autre usage")).toBeInTheDocument();
      });
    });
  });

  describe('Secondary Driver Conditional Logic', () => {
    it('should show secondary driver fields when hasSecondaryDriver is true', async () => {
      renderFormView({ hasSecondaryDriver: true });

      await waitFor(() => {
        expect(screen.getByLabelText('Nom du conducteur secondaire')).toBeInTheDocument();
        expect(screen.getByLabelText('Date de naissance du conducteur secondaire')).toBeInTheDocument();
        expect(screen.getByLabelText('Sexe du conducteur secondaire')).toBeInTheDocument();
        expect(screen.getByLabelText('Profession du conducteur secondaire')).toBeInTheDocument();
        expect(screen.getByLabelText("Date d'obtention du permis du conducteur secondaire")).toBeInTheDocument();
      });
    });

    it('should hide secondary driver fields when hasSecondaryDriver is false', async () => {
      renderFormView({ hasSecondaryDriver: false });

      await waitFor(() => {
        expect(screen.queryByLabelText('Nom du conducteur secondaire')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Date de naissance du conducteur secondaire')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Sexe du conducteur secondaire')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Profession du conducteur secondaire')).not.toBeInTheDocument();
        expect(screen.queryByLabelText("Date d'obtention du permis du conducteur secondaire")).not.toBeInTheDocument();
      });
    });
  });

  describe('Complex Conditional Chains', () => {
    it('should handle spouse license chain correctly', async () => {
      // Test the full chain: maritalStatus -> spouseHasLicense -> spouse fields
      renderFormView({
        maritalStatus: 'married',
        spouseHasLicense: 'yes',
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Le conjoint a-t-il le permis ?')).toBeInTheDocument();
        expect(screen.getByLabelText("Date d'obtention du permis du conjoint")).toBeInTheDocument();
        expect(screen.getByLabelText('Date de naissance du conjoint')).toBeInTheDocument();
        expect(screen.getByLabelText('Le conjoint est-il le conducteur principal ?')).toBeInTheDocument();
      });
    });

    it('should handle license suspension chain correctly', async () => {
      // Test the full chain: licenseSuspension -> suspension fields
      renderFormView({
        licenseSuspension: 'suspended_less_5',
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Durée de la suspension')).toBeInTheDocument();
        expect(screen.getByLabelText('Raison de la suspension')).toBeInTheDocument();
      });
    });

    it('should handle insurance history chain correctly', async () => {
      // Test the full chain: isCurrentlyInsured -> contract fields
      renderFormView({
        isCurrentlyInsured: 'main_driver',
      });

      await waitFor(() => {
        expect(screen.getByLabelText("Contrat de plus d'un an")).toBeInTheDocument();
        expect(screen.getByLabelText("Mois d'expiration du contrat")).toBeInTheDocument();
      });
    });
  });

  describe('Dynamic Field Visibility Updates', () => {
    it('should show/hide fields when form data changes', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Initially, work postal code should be hidden
      await waitFor(() => {
        expect(screen.queryByLabelText('Code postal du travail')).not.toBeInTheDocument();
      });

      // Select usage type that requires work postal code
      const usageTypeSelect = screen.getByLabelText("Type d'usage");
      await user.selectOptions(usageTypeSelect, 'private_work');

      // Should trigger updateFormField
      expect(mockUpdateFormField).toHaveBeenCalledWith('usageType', 'private_work');
    });

    it('should handle multiple conditional field updates', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Test multiple field updates
      const maritalStatusSelect = screen.getByLabelText('Situation familiale');
      await user.selectOptions(maritalStatusSelect, 'married');

      expect(mockUpdateFormField).toHaveBeenCalledWith('maritalStatus', 'married');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined dependency values gracefully', async () => {
      renderFormView({ usageType: undefined });

      await waitFor(() => {
        expect(screen.queryByLabelText('Code postal du travail')).not.toBeInTheDocument();
      });
    });

    it('should handle null dependency values gracefully', async () => {
      renderFormView({ usageType: null });

      await waitFor(() => {
        expect(screen.queryByLabelText('Code postal du travail')).not.toBeInTheDocument();
      });
    });

    it('should show fields without showWhen conditions', async () => {
      renderFormView({});

      await waitFor(() => {
        expect(screen.getByLabelText('Type de véhicule')).toBeInTheDocument();
        expect(screen.getByLabelText('Marque')).toBeInTheDocument();
        expect(screen.getByLabelText('Modèle')).toBeInTheDocument();
        expect(screen.getByLabelText('Sexe')).toBeInTheDocument();
        expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
      });
    });
  });
});
