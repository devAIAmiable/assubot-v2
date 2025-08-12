import type { FormConfig } from '../types/formTypes';

export const autoFormConfig: FormConfig = {
	totalSteps: 4,
	steps: [
		{
			id: 'personal',
			title: 'Informations personnelles',
			description: 'Renseignez vos informations de base',
			fields: ['age', 'profession', 'location', 'postalCode', 'monthlyBudget', 'drivingExperience'],
		},
		{
			id: 'vehicle',
			title: 'Votre véhicule',
			description: 'Détails sur le véhicule à assurer',
			fields: [
				'vehicleType', 'brand', 'model', 'version',
				'energyType', 'transmission', 'firstRegistrationDate',
				'purchaseDate', 'purchaseType', 'vehicleValue', 'registrationCountry'
			],
		},
		{
			id: 'usage',
			title: 'Utilisation du véhicule',
			description: 'Comment utilisez-vous votre véhicule ?',
			fields: [
				'vehicleUse', 'annualMileage', 'parkingLocation',
				'hasModifications', 'modificationsDetails'
			],
		},
		{
			id: 'coverage',
			title: 'Couverture souhaitée',
			description: 'Choisissez votre niveau de protection',
			fields: ['coverageLevel', 'previousInsurer', 'claimsHistory'],
		},
	],
};

export const habitationFormConfig: FormConfig = {
	totalSteps: 4,
	steps: [
		{
			id: 'personal',
			title: 'Informations personnelles',
			description: 'Renseignez vos informations de base',
			fields: ['age', 'profession', 'location', 'postalCode', 'monthlyBudget'],
		},
		{
			id: 'property',
			title: 'Votre logement',
			description: 'Caractéristiques de votre bien immobilier',
			fields: [
				'propertyType', 'propertyStatus', 'constructionYear',
				'propertySize', 'numberOfRooms', 'propertyValue'
			],
		},
		{
			id: 'location_security',
			title: 'Localisation et sécurité',
			description: 'Environnement et équipements de sécurité',
			fields: [
				'floorLevel', 'buildingType', 'neighborhood',
				'hasGarden', 'hasSwimmingPool', 'hasAlarm', 'securityLevel'
			],
		},
		{
			id: 'coverage',
			title: 'Couverture souhaitée',
			description: 'Définissez vos besoins de protection',
			fields: [
				'coverageLevel', 'contentsValue', 'hasValuables',
				'valuablesValue', 'previousClaims'
			],
		},
	],
};

export const santeFormConfig: FormConfig = {
	totalSteps: 4,
	steps: [
		{
			id: 'personal',
			title: 'Informations personnelles',
			description: 'Renseignez vos informations de base',
			fields: ['age', 'profession', 'location', 'postalCode', 'monthlyBudget'],
		},
		{
			id: 'family',
			title: 'Situation familiale',
			description: 'Composition de votre famille',
			fields: [
				'familyStatus', 'numberOfDependents', 'dependentsAges',
				'hasCurrentInsurance', 'currentInsurer'
			],
		},
		{
			id: 'health_needs',
			title: 'Besoins de santé',
			description: 'Vos habitudes et besoins médicaux',
			fields: [
				'frequentDoctor', 'hasChronicCondition', 'wearGlasses',
				'needsDental', 'practicesSport', 'sportType'
			],
		},
		{
			id: 'coverage',
			title: 'Couverture souhaitée',
			description: 'Personnalisez votre protection santé',
			fields: [
				'coverageLevel', 'priorityTreatments', 'preferredHospitals',
				'wantsThirdPartyPayment', 'overseas_coverage'
			],
		},
	],
};

export const motoFormConfig: FormConfig = {
	totalSteps: 4,
	steps: [
		{
			id: 'personal',
			title: 'Informations personnelles',
			description: 'Renseignez vos informations de base',
			fields: ['age', 'profession', 'location', 'postalCode', 'monthlyBudget'],
		},
		{
			id: 'motorcycle',
			title: 'Votre motorcycle',
			description: 'Caractéristiques de votre deux-roues',
			fields: [
				'motorcycleType', 'engineSize', 'brand', 'model',
				'enginePower', 'firstRegistrationDate', 'purchaseDate',
				'purchaseType', 'vehicleValue'
			],
		},
		{
			id: 'usage_driver',
			title: 'Utilisation et permis',
			description: 'Usage du véhicule et expérience de conduite',
			fields: [
				'vehicleUse', 'annualMileage', 'parkingLocation',
				'hasAntiTheft', 'antiTheftType', 'licenseType',
				'licenseDate', 'ridingExperience', 'hasTraining'
			],
		},
		{
			id: 'coverage',
			title: 'Couverture souhaitée',
			description: 'Définissez votre protection',
			fields: [
				'coverageLevel', 'equipmentCoverage', 'equipmentValue', 'previousClaims'
			],
		},
	],
};

// Helper function to get form config by insurance type
export const getFormConfig = (insuranceType: string): FormConfig => {
	switch (insuranceType) {
		case 'auto':
			return autoFormConfig;
		case 'habitation':
			return habitationFormConfig;
		case 'sante':
			return santeFormConfig;
		case 'motorcycle':
			return motoFormConfig;
		default:
			return autoFormConfig;
	}
};

// Field labels and options
export const fieldLabels: Record<string, string> = {
	// Personal
	age: 'Âge',
	profession: 'Profession',
	location: 'Ville',
	postalCode: 'Code postal',
	monthlyBudget: 'Budget mensuel maximum (€)',
	
	// Auto
	vehicleType: 'Type de véhicule',
	brand: 'Marque',
	model: 'Modèle',
	version: 'Version/Finition',
	energyType: 'Type d\'énergie',
	transmission: 'Transmission',
	firstRegistrationDate: 'Date de première immatriculation',
	purchaseDate: 'Date d\'achat',
	purchaseType: 'Type d\'achat',
	vehicleValue: 'Valeur du véhicule (€)',
	registrationCountry: 'Pays d\'immatriculation',
	vehicleUse: 'Usage du véhicule',
	annualMileage: 'Kilométrage annuel',
	parkingLocation: 'Stationnement (nuit)',
	hasModifications: 'Modifications du véhicule',
	modificationsDetails: 'Détails des modifications',
	coverageLevel: 'Niveau de couverture',
	previousInsurer: 'Assureur précédent',
	claimsHistory: 'Historique de sinistres',
	drivingExperience: 'Expérience de conduite (années)',
	
	// Habitation
	propertyType: 'Type de logement',
	propertyStatus: 'Statut d\'occupation',
	constructionYear: 'Année de construction',
	propertySize: 'Surface (m²)',
	numberOfRooms: 'Nombre de pièces',
	propertyValue: 'Valeur du bien (€)',
	hasGarden: 'Jardin',
	hasSwimmingPool: 'Piscine',
	hasAlarm: 'Système d\'alarme',
	securityLevel: 'Niveau de sécurité',
	floorLevel: 'Étage',
	buildingType: 'Type de bâtiment',
	neighborhood: 'Zone géographique',
	contentsValue: 'Valeur du mobilier (€)',
	hasValuables: 'Objets de valeur',
	valuablesValue: 'Valeur des objets précieux (€)',
	previousClaims: 'Sinistres précédents',
	
	// Santé
	familyStatus: 'Situation familiale',
	numberOfDependents: 'Nombre d\'ayants droit',
	dependentsAges: 'Âges des enfants',
	hasCurrentInsurance: 'Assurance actuelle',
	currentInsurer: 'Assureur actuel',
	frequentDoctor: 'Consultations fréquentes',
	hasChronicCondition: 'Maladie chronique',
	wearGlasses: 'Port de lunettes',
	needsDental: 'Soins dentaires fréquents',
	practicesSport: 'Pratique sportive',
	sportType: 'Type de sport',
	priorityTreatments: 'Soins prioritaires',
	preferredHospitals: 'Établissements préférés',
	wantsThirdPartyPayment: 'Tiers payant',
	overseas_coverage: 'Couverture à l\'étranger',
	
	// Moto
	motorcycleType: 'Type de deux-roues',
	engineSize: 'Cylindrée (cc)',
	enginePower: 'Puissance (CV)',
	hasAntiTheft: 'Antivol',
	antiTheftType: 'Type d\'antivol',
	licenseType: 'Type de permis',
	licenseDate: 'Date d\'obtention du permis',
	ridingExperience: 'Expérience de conduite (années)',
	hasTraining: 'Formation post-permis',
	equipmentCoverage: 'Assurance équipements',
	equipmentValue: 'Valeur des équipements (€)',
};

export const fieldOptions: Record<string, Array<{ value: string; label: string }>> = {
	profession: [
		{ value: 'Cadre', label: 'Cadre' },
		{ value: 'Employé', label: 'Employé' },
		{ value: 'Profession libérale', label: 'Profession libérale' },
		{ value: 'Fonctionnaire', label: 'Fonctionnaire' },
		{ value: 'Étudiant', label: 'Étudiant' },
		{ value: 'Retraité', label: 'Retraité' },
		{ value: 'Artisan', label: 'Artisan/Commerçant' },
		{ value: 'Ouvrier', label: 'Ouvrier' },
		{ value: 'Sans emploi', label: 'Sans emploi' },
	],
	
	// Auto
	vehicleType: [
		{ value: 'car', label: 'Voiture' },
		{ value: 'van', label: 'Utilitaire' },
		{ value: 'motorcycle', label: 'Moto' },
	],
	energyType: [
		{ value: 'petrol', label: 'Essence' },
		{ value: 'diesel', label: 'Diesel' },
		{ value: 'electric', label: 'Électrique' },
		{ value: 'hybrid', label: 'Hybride' },
	],
	transmission: [
		{ value: 'manual', label: 'Manuelle' },
		{ value: 'automatic', label: 'Automatique' },
	],
	purchaseType: [
		{ value: 'new', label: 'Neuf' },
		{ value: 'used', label: 'Occasion' },
		{ value: 'leasing', label: 'Leasing' },
	],
	registrationCountry: [
		{ value: 'france', label: 'France' },
		{ value: 'other', label: 'Autre pays' },
	],
	vehicleUse: [
		{ value: 'private', label: 'Usage privé' },
		{ value: 'professional', label: 'Usage professionnel' },
		{ value: 'mixed', label: 'Usage mixte' },
	],
	parkingLocation: [
		{ value: 'public_street', label: 'Rue publique' },
		{ value: 'private_garage', label: 'Garage privé' },
		{ value: 'gated_residence', label: 'Résidence fermée' },
		{ value: 'other', label: 'Autre' },
	],
	coverageLevel: [
		{ value: 'tiers', label: 'Au tiers' },
		{ value: 'tiers_plus', label: 'Tiers étendu' },
		{ value: 'tous_risques', label: 'Tous risques' },
	],
	claimsHistory: [
		{ value: 'none', label: 'Aucun sinistre' },
		{ value: '1_claim', label: '1 sinistre' },
		{ value: '2_claims', label: '2 sinistres' },
		{ value: '3_plus_claims', label: '3 sinistres ou plus' },
	],
	
	// Habitation
	propertyType: [
		{ value: 'apartment', label: 'Appartement' },
		{ value: 'house', label: 'Maison' },
		{ value: 'studio', label: 'Studio' },
		{ value: 'loft', label: 'Loft' },
	],
	propertyStatus: [
		{ value: 'owner', label: 'Propriétaire' },
		{ value: 'tenant', label: 'Locataire' },
		{ value: 'shared_ownership', label: 'Copropriétaire' },
	],
	buildingType: [
		{ value: 'individual', label: 'Individuel' },
		{ value: 'collective', label: 'Collectif' },
		{ value: 'residence', label: 'Résidence' },
	],
	neighborhood: [
		{ value: 'city_center', label: 'Centre-ville' },
		{ value: 'suburb', label: 'Banlieue' },
		{ value: 'rural', label: 'Rural' },
	],
	securityLevel: [
		{ value: 'none', label: 'Aucune sécurité' },
		{ value: 'basic', label: 'Sécurité de base' },
		{ value: 'advanced', label: 'Sécurité renforcée' },
	],
	
	// Santé
	familyStatus: [
		{ value: 'single', label: 'Célibataire' },
		{ value: 'couple', label: 'En couple' },
		{ value: 'family', label: 'Famille avec enfants' },
	],
	
	// Moto
	motorcycleType: [
		{ value: 'scooter', label: 'Scooter' },
		{ value: 'motorcycle', label: 'Moto' },
		{ value: 'trail', label: 'Trail' },
		{ value: 'sport', label: 'Sportive' },
		{ value: 'cruiser', label: 'Cruiser' },
	],
	licenseType: [
		{ value: 'A1', label: 'A1 (125cc)' },
		{ value: 'A2', label: 'A2 (bridée)' },
		{ value: 'A', label: 'A (toutes motos)' },
		{ value: 'other', label: 'Autre' },
	],
	antiTheftType: [
		{ value: 'alarm', label: 'Alarme' },
		{ value: 'immobilizer', label: 'Antidémarrage' },
		{ value: 'mechanical', label: 'Antivol mécanique' },
		{ value: 'gps', label: 'Traceur GPS' },
	],
}; 