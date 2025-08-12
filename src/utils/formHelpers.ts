import type { AutoFormData, FormData, HabitationFormData, MotoFormData, SanteFormData } from '../types/formTypes';

import type { InsuranceType } from '../types';

// Initialize form data for specific insurance type
export const initializeFormData = (
	insuranceType: InsuranceType,
	userAge: string = '',
	userProfession: string = '',
	userLocation: string = ''
): FormData => {
	const baseData = {
		age: userAge,
		profession: userProfession,
		location: userLocation,
		postalCode: '',
		monthlyBudget: '',
	};

	switch (insuranceType) {
		case 'auto':
			return {
				...baseData,
				// Vehicle information
				vehicleType: '',
				brand: '',
				model: '',
				version: '',
				energyType: '',
				transmission: '',
				firstRegistrationDate: '',
				purchaseDate: '',
				purchaseType: '',
				vehicleValue: '',
				registrationCountry: '',
				vehicleUse: '',
				annualMileage: '',
				parkingLocation: '',
				hasModifications: false,
				modificationsDetails: '',
				// Coverage preferences
				coverageLevel: '',
				previousInsurer: '',
				claimsHistory: '',
				drivingExperience: '',
			} as AutoFormData;

		case 'habitation':
			return {
				...baseData,
				// Property information
				propertyType: '',
				propertyStatus: '',
				constructionYear: '',
				propertySize: '',
				numberOfRooms: '',
				propertyValue: '',
				hasGarden: false,
				hasSwimmingPool: false,
				hasAlarm: false,
				securityLevel: '',
				// Location details
				floorLevel: '',
				buildingType: '',
				neighborhood: '',
				// Coverage preferences
				coverageLevel: '',
				contentsValue: '',
				hasValuables: false,
				valuablesValue: '',
				previousClaims: '',
			} as HabitationFormData;

		case 'sante':
			return {
				...baseData,
				// Health information
				familyStatus: '',
				numberOfDependents: '',
				dependentsAges: [],
				hasCurrentInsurance: false,
				currentInsurer: '',
				// Health needs
				frequentDoctor: false,
				hasChronicCondition: false,
				wearGlasses: false,
				needsDental: false,
				practicesSport: false,
				sportType: '',
				// Coverage preferences
				coverageLevel: '',
				priorityTreatments: [],
				preferredHospitals: [],
				wantsThirdPartyPayment: false,
				overseas_coverage: false,
			} as SanteFormData;

		case 'motorcycle':
			return {
				...baseData,
				// Vehicle information
				motorcycleType: '',
				engineSize: '',
				brand: '',
				model: '',
				enginePower: '',
				firstRegistrationDate: '',
				purchaseDate: '',
				purchaseType: '',
				vehicleValue: '',
				// Usage information
				vehicleUse: '',
				annualMileage: '',
				parkingLocation: '',
				hasAntiTheft: false,
				antiTheftType: '',
				// Driver information
				licenseType: '',
				licenseDate: '',
				ridingExperience: '',
				hasTraining: false,
				// Coverage preferences
				coverageLevel: '',
				equipmentCoverage: false,
				equipmentValue: '',
				previousClaims: '',
			} as MotoFormData;

		default:
			return initializeFormData('auto', userAge, userProfession, userLocation);
	}
};

// Update form data with prefilled values from existing contracts
export const prefillFromContract = (
	formData: FormData,
	insuranceType: InsuranceType,
	monthlyBudget: string
): FormData => {
	const updated = { ...formData, monthlyBudget };

	switch (insuranceType) {
		case 'auto':
			return {
				...updated,
				vehicleType: 'car',
				coverageLevel: 'tous_risques',
			} as AutoFormData;

		case 'habitation':
			return {
				...updated,
				coverageLevel: 'standard',
				propertyType: 'apartment',
			} as HabitationFormData;

		case 'sante':
			return {
				...updated,
				coverageLevel: 'standard',
				familyStatus: 'single',
			} as SanteFormData;

		case 'motorcycle':
			return {
				...updated,
				coverageLevel: 'tous_risques',
				motorcycleType: 'motorcycle',
			} as MotoFormData;

		default:
			return updated;
	}
};

// Create comparison data from form data for saving
export const createComparisonCriteria = (formData: FormData) => {
	// Extract common fields that all types have
	return {
		age: formData.age,
		profession: formData.profession,
		location: formData.location,
		monthlyBudget: formData.monthlyBudget,
		// Include type-specific key fields
		...(('vehicleType' in formData) && { vehicleType: formData.vehicleType }),
		...(('propertyType' in formData) && { propertyType: formData.propertyType }),
		...(('motorcycleType' in formData) && { motorcycleType: formData.motorcycleType }),
		...(('familyStatus' in formData) && { familyStatus: formData.familyStatus }),
		...(('coverageLevel' in formData) && { coverageLevel: formData.coverageLevel }),
	};
}; 