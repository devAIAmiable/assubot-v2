import type { RawFormFieldDefinition } from '../../types/comparison.types';

// Common personal information fields
export const personalInfoFields: RawFormFieldDefinition[] = [
  {
    name: 'civility',
    type: 'select',
    required: true,
    label: 'Civilité',
    subsection: {
      id: 'personal_info',
      label: 'Informations personnelles',
    },
    options: [
      { value: 'M.', label: 'M.' },
      { value: 'Mme', label: 'Mme' },
    ],
  },
  {
    name: 'firstName',
    type: 'text',
    required: true,
    label: 'Prénom',
    subsection: {
      id: 'personal_info',
      label: 'Informations personnelles',
    },
    validation: { minLength: 2, maxLength: 50 },
    placeholder: 'Prénom',
  },
  {
    name: 'lastName',
    type: 'text',
    required: true,
    label: 'Nom',
    subsection: {
      id: 'personal_info',
      label: 'Informations personnelles',
    },
    validation: { minLength: 2, maxLength: 50 },
    placeholder: 'Nom',
  },
  {
    name: 'birthDate',
    type: 'date',
    required: true,
    label: 'Date de naissance',
    subsection: {
      id: 'personal_info',
      label: 'Informations personnelles',
    },
    helperText: 'Votre date de naissance complète (JJ/MM/AAAA)',
    mask: {
      pattern: '99/99/9999',
      placeholder: 'JJ/MM/AAAA',
      guide: true,
    },
  },
  {
    name: 'postalCode',
    type: 'text',
    required: true,
    label: 'Code postal',
    subsection: {
      id: 'address_info',
      label: 'Adresse',
    },
    validation: { pattern: '^[0-9]{5}$' },
    placeholder: 'Code postal',
  },
  {
    name: 'city',
    type: 'text',
    required: true,
    label: 'Ville',
    subsection: {
      id: 'address_info',
      label: 'Adresse',
    },
    validation: { minLength: 2, maxLength: 100 },
    placeholder: 'Ville',
  },
  {
    name: 'maritalStatus',
    type: 'select',
    required: true,
    label: 'Situation matrimoniale',
    subsection: {
      id: 'personal_info',
      label: 'Informations personnelles',
    },
    options: [
      { value: 'single', label: 'Célibataire' },
      { value: 'married', label: 'Marié(e)' },
      { value: 'divorced', label: 'Divorcé(e)' },
      { value: 'widowed', label: 'Veuf/Veuve' },
      { value: 'other', label: 'Autre' },
    ],
  },
  {
    name: 'numberOfChildren',
    type: 'number',
    required: true,
    label: "Nombre d'enfants",
    subsection: {
      id: 'family_info',
      label: 'Situation familiale',
    },
    validation: { min: 0, max: 10 },
    helperText: 'Incluez tous les enfants vivant à votre domicile',
  },
];

// Common profession fields
export const professionFields: RawFormFieldDefinition[] = [
  {
    name: 'profession',
    type: 'select',
    required: true,
    label: 'Profession',
    subsection: {
      id: 'professional_info',
      label: 'Informations professionnelles',
    },
    options: [
      { value: 'professional', label: 'Activité professionnelle' },
      { value: 'student', label: 'Étudiant' },
      { value: 'job_seeker', label: "Recherche d'emploi" },
      { value: 'retired', label: 'Retraité' },
      { value: 'unemployed', label: 'Sans profession' },
    ],
  },
  {
    name: 'professionalStatus',
    type: 'select',
    required: true,
    label: 'Statut professionnel',
    subsection: {
      id: 'professional_info',
      label: 'Informations professionnelles',
    },
    options: [
      { value: 'employee', label: 'Salarié' },
      { value: 'student', label: 'Étudiant' },
      { value: 'retired', label: 'Retraité' },
      { value: 'unemployed', label: 'Chômeur' },
      { value: 'other', label: 'Autre' },
    ],
  },
];

// Common contract preference fields
export const contractPreferenceFields: RawFormFieldDefinition[] = [
  {
    name: 'contractStartDate',
    type: 'date',
    required: true,
    label: 'Date de début souhaitée',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
    helperText: 'Date de début du contrat souhaitée',
    mask: {
      pattern: '99/99/9999',
      placeholder: 'JJ/MM/AAAA',
      guide: true,
    },
    shortcuts: [
      { value: 'asap', label: 'Dès que possible', description: 'Début immédiat du contrat' },
      { value: 'tomorrow', label: 'Demain', description: 'Début demain' },
      { value: 'next_month', label: 'Mois prochain', description: 'Début le 1er du mois prochain' },
    ],
  },
  {
    name: 'optionalGuarantees_assistance0km',
    type: 'checkbox',
    required: false,
    label: 'Assistance 0 km',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
  },
  {
    name: 'optionalGuarantees_replacementVehicle',
    type: 'checkbox',
    required: false,
    label: 'Véhicule de remplacement',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
  },
  {
    name: 'optionalGuarantees_extendedDriverProtection',
    type: 'checkbox',
    required: false,
    label: 'Protection du conducteur étendue',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
  },
  {
    name: 'optionalGuarantees_legalDefense',
    type: 'checkbox',
    required: false,
    label: 'Défense juridique',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
  },
  {
    name: 'optionalGuarantees_theftFire',
    type: 'checkbox',
    required: false,
    label: 'Vol & incendie',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
  },
  {
    name: 'deductiblePreference',
    type: 'radio',
    required: true,
    label: 'Préférence de franchise',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
    options: [
      { value: 'low', label: 'Faible' },
      { value: 'medium', label: 'Moyenne' },
      { value: 'high', label: 'Élevée' },
    ],
  },
  {
    name: 'paymentFrequency',
    type: 'radio',
    required: true,
    label: 'Fréquence de paiement',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
    options: [
      { value: 'monthly', label: 'Mensuel' },
      { value: 'annual', label: 'Annuel' },
    ],
  },
  {
    name: 'maxAnnualPremium',
    type: 'number',
    required: true,
    label: 'Budget maximum annuel',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
    showWhen: { field: 'paymentFrequency', equals: 'annual' },
    validation: { min: 0, max: 5000 },
    helperText: 'Budget maximum que vous souhaitez consacrer par an à votre assurance',
  },
  {
    name: 'maxMonthlyPremium',
    type: 'number',
    required: true,
    label: 'Budget maximum mensuel',
    subsection: {
      id: 'contract_preferences',
      label: 'Préférences du contrat',
    },
    showWhen: { field: 'paymentFrequency', equals: 'monthly' },
    validation: { min: 0, max: 500 },
    helperText: 'Budget maximum que vous souhaitez consacrer par mois à votre assurance',
  },
];

// Common preference fields
export const preferenceFields: RawFormFieldDefinition[] = [
  {
    name: 'acceptTerms',
    type: 'checkbox',
    required: true,
    label: "Accepter les conditions d'utilisation",
    subsection: {
      id: 'final_preferences',
      label: 'Finalisation',
    },
    helperText: "J'accepte les conditions générales d'utilisation et d'être rappelé par nos partenaires assureurs si je demande à être mis en relation.",
  },
];
