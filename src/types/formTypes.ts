export interface BaseFormData {
	// Personal information (common to all types)
	age: string;
	profession: string;
	location: string;
	postalCode: string;
	monthlyBudget: string;
}

export interface AutoFormData extends BaseFormData {
	// Vehicle information
	vehicleType: 'car' | 'van' | 'motorcycle' | '';
	brand: string;
	model: string;
	version: string; // Optional trim/version
	energyType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | '';
	transmission: 'manual' | 'automatic' | '';
	firstRegistrationDate: string; // MM/YYYY
	purchaseDate: string;
	purchaseType: 'new' | 'used' | 'leasing' | '';
	vehicleValue: string;
	registrationCountry: 'france' | 'other' | '';
	vehicleUse: 'private' | 'professional' | 'mixed' | '';
	annualMileage: string;
	parkingLocation: 'public_street' | 'private_garage' | 'gated_residence' | 'other' | '';
	hasModifications: boolean;
	modificationsDetails: string;
	
	// Coverage preferences
	coverageLevel: 'tiers' | 'tiers_plus' | 'tous_risques' | '';
	previousInsurer: string;
	claimsHistory: 'none' | '1_claim' | '2_claims' | '3_plus_claims' | '';
	drivingExperience: string; // years
}

export interface HabitationFormData extends BaseFormData {
	// Property information
	propertyType: 'apartment' | 'house' | 'studio' | 'loft' | '';
	propertyStatus: 'owner' | 'tenant' | 'shared_ownership' | '';
	constructionYear: string;
	propertySize: string; // m²
	numberOfRooms: string;
	propertyValue: string;
	hasGarden: boolean;
	hasSwimmingPool: boolean;
	hasAlarm: boolean;
	securityLevel: 'none' | 'basic' | 'advanced' | '';
	
	// Location details
	floorLevel: string; // for apartments
	buildingType: 'individual' | 'collective' | 'residence' | '';
	neighborhood: 'city_center' | 'suburb' | 'rural' | '';
	
	// Coverage preferences
	coverageLevel: 'basic' | 'standard' | 'premium' | '';
	contentsValue: string;
	hasValuables: boolean;
	valuablesValue: string;
	previousClaims: 'none' | '1_claim' | '2_claims' | '3_plus_claims' | '';
}

export interface SanteFormData extends BaseFormData {
	// Health information
	familyStatus: 'single' | 'couple' | 'family' | '';
	numberOfDependents: string;
	dependentsAges: string[]; // for children
	hasCurrentInsurance: boolean;
	currentInsurer: string;
	
	// Health needs
	frequentDoctor: boolean;
	hasChronicCondition: boolean;
	wearGlasses: boolean;
	needsDental: boolean;
	practicesSport: boolean;
	sportType: string;
	
	// Coverage preferences
	coverageLevel: 'basic' | 'standard' | 'premium' | 'luxury' | '';
	priorityTreatments: string[]; // dental, optical, alternative_medicine, etc.
	preferredHospitals: string[];
	wantsThirdPartyPayment: boolean;
	overseas_coverage: boolean;
}

export interface MotoFormData extends BaseFormData {
	// Vehicle information
	motorcycleType: 'scooter' | 'motorcycle' | 'trail' | 'sport' | 'cruiser' | '';
	engineSize: string; // cc
	brand: string;
	model: string;
	enginePower: string; // CV or kW
	firstRegistrationDate: string; // MM/YYYY
	purchaseDate: string;
	purchaseType: 'new' | 'used' | '';
	vehicleValue: string;
	
	// Usage information
	vehicleUse: 'leisure' | 'daily' | 'professional' | 'mixed' | '';
	annualMileage: string;
	parkingLocation: 'public_street' | 'private_garage' | 'gated_residence' | '';
	hasAntiTheft: boolean;
	antiTheftType: 'alarm' | 'immobilizer' | 'mechanical' | 'gps' | '';
	
	// Driver information
	licenseType: 'A1' | 'A2' | 'A' | 'other' | '';
	licenseDate: string;
	ridingExperience: string; // years
	hasTraining: boolean;
	
	// Coverage preferences
	coverageLevel: 'tiers' | 'tiers_plus' | 'tous_risques' | '';
	equipmentCoverage: boolean;
	equipmentValue: string;
	previousClaims: 'none' | '1_claim' | '2_claims' | '3_plus_claims' | '';
}

export type FormData = AutoFormData | HabitationFormData | SanteFormData | MotoFormData;

export interface FormStep {
	id: string;
	title: string;
	description: string;
	fields: string[];
	validation?: (data: Partial<FormData>) => string[];
}

export interface FormConfig {
	steps: FormStep[];
	totalSteps: number;
} 