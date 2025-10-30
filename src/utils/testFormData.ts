/**
 * Test data generator for auto insurance form based on Zod schema
 * This generates valid test data matching autoFormDataSchema requirements
 */

export interface AutoFormTestData {
  [key: string]: unknown;
}

/**
 * Generate complete test data for auto insurance form
 * All dates are in YYYY-MM-DD format as required by the backend
 */
export function generateAutoFormTestData(): AutoFormTestData {
  const birthYear = 1990;
  const licenseYear = 2015;
  const spouseBirthYear = 1992;

  return {
    // Personal Info (required)
    civility: 'M.',
    firstName: 'Jean',
    lastName: 'Dupont',
    birthDate: `${birthYear}-05-15`,
    postalCode: '75001',
    city: 'Paris',
    gender: 'male',
    maritalStatus: 'married',
    numberOfChildren: '2', // Form uses string values '0', '1', '2', '3_plus'
    profession: 'public_employee',
    professionalStatus: 'employee',
    drivingLicenseDate: `${licenseYear}-03-20`,
    licenseType: 'B', // Backend expects capital letters: 'AM', 'A1', 'A2', 'A', 'B1', 'B', 'b', 'b_accompanied', etc.
    spouseBirthDate: `${spouseBirthYear}-08-10`,
    spouseHasLicense: 'yes',
    spouseLicenseDate: '2020-02-02', // Required when spouseHasLicense is 'yes'
    spouseIsMainDriver: 'yes', // Required when spouseHasLicense is 'yes'

    // Vehicle Info (required)
    vehicleType: 'current',
    cardHolder: 'me', // Form uses 'me', 'spouse', 'both', 'parent', 'other'
    hasSecondaryDriver: 'spouse',
    registrationNumber: 'AB123CD', // Optional but included for completeness
    make: 'Peugeot',
    model: '308',
    version: 'GT Line',
    modelYear: 2020,
    motorization: '1.6 BlueHDi 120',
    fuelType: 'diesel',
    transmission: 'manual',
    bodyType: 'hatchback',
    doorCount: '5', // Form uses string values: '2', '3', '4', '5'
    power: 120,
    firstRegistrationDate: '2020-06-15',
    purchaseDate: '2020-05-10',
    vehicleValue: 18000,
    owner: 'you',
    vehicleFinancing: 'credit',
    vehicleOwnershipYears: '4', // Form uses string options, will be coerced to number by backend
    isCurrentlyInsured: 'main_driver',
    isSoleOwner: 'no',
    previousVehicleRetention: '5_years_plus',

    // Usage (required)
    plannedTrips: 'private_work',
    usageType: 'private_work',
    distanceHomeToWork: 15,
    annualMileage: '10000_15000',
    vehicleUsageFrequency: 'daily',
    parkingLocation: 'garage',
    nightParkingMode: 'individual',
    nightParkingType: 'individual_garage',
    nightParkingCity: 'Paris',
    nightParkingPostalCode: '75001',
    workInFrance: 'yes',
    workParkingCity: 'Paris',
    securityEquipment: ['alarm', 'gps_tracker'],

    // Insurance History (required)
    hasBeenInsured: 'main_driver',
    isMainDriverOtherVehicle: 'no',
    isSecondaryDriverOtherVehicle: 'no',
    yearsInsured: '5', // Form uses string options, backend coerces to number
    bonusMalus: '0.5', // Form uses string values like '50_more_3_years', '0.5' (for 50% bonus), etc.
    previousInsurer: 'b3b2cf7c-051d-4920-b4a6-92d629f665ba',
    contractExpiryMonth: 'march',
    contractOlderThanYear: 'yes',
    contractSuspended: 'no',
    hasBeenTerminated: 'no',
    claimsLast3To5Years: 0,
    claimsLast3Years: '0', // Form uses string values: '0', '1', '2', '3', '4', '5_plus'
    pointsLost: '0',
    hasSuspensionOrCancellation: false,
    licenseSuspension: 'never',
    hitAndRun: 'never',
    drugTestPositive: 'never',
    alcoholTestPositive: 'never',

    // Residence (required)
    residenceType: 'apartment',
    residenceStatus: 'tenant',
    residenceStability: 'fixed',

    // Contract Preferences (required)
    contractStartDate: '2026-03-01',
    currentCoverageLevel: 'comprehensive',
    desiredCoverageLevel: 'comprehensive',
    coverageLevel: 'comprehensive',
    deductiblePreference: 'medium',
    optionalGuarantees: {
      assistance0km: true,
      replacementVehicle: false,
      extendedDriverProtection: true,
      legalDefense: true,
      theftFire: true,
    },
    paymentFrequency: 'monthly',

    // Additional Drivers (required - boolean)
    hasAdditionalDrivers: true,
    additionalDriverAge: 28,
    additionalDriverLicenseDate: '2016-04-15',

    // Budget (conditional - based on paymentFrequency)
    maxMonthlyPremium: 120,
    maxAnnualPremium: 1440,

    // Preferences (required)
    saveQuote: true,
    acceptTerms: true,
  };
}

/**
 * Fill form data with test values - useful for testing/preview
 */
export function fillFormWithTestData(formData: Record<string, unknown>): Record<string, unknown> {
  const testData = generateAutoFormTestData();
  return { ...formData, ...testData };
}

/**
 * Enable test mode - forms will auto-fill with test data
 * Call this in browser console: enableComparisonTestMode()
 */
export function enableComparisonTestMode(): void {
  localStorage.setItem('comparisonTestMode', 'true');
  console.log('✅ Comparison test mode enabled. Refresh the page and open the comparison form.');
}

/**
 * Disable test mode
 * Call this in browser console: disableComparisonTestMode()
 */
export function disableComparisonTestMode(): void {
  localStorage.removeItem('comparisonTestMode');
  console.log('❌ Comparison test mode disabled.');
}

// Make functions available globally for easy console access
if (typeof window !== 'undefined') {
  (window as { enableComparisonTestMode?: () => void; disableComparisonTestMode?: () => void; generateAutoFormTestData?: () => AutoFormTestData }).enableComparisonTestMode =
    enableComparisonTestMode;
  (window as { enableComparisonTestMode?: () => void; disableComparisonTestMode?: () => void; generateAutoFormTestData?: () => AutoFormTestData }).disableComparisonTestMode =
    disableComparisonTestMode;
  (window as { enableComparisonTestMode?: () => void; disableComparisonTestMode?: () => void; generateAutoFormTestData?: () => AutoFormTestData }).generateAutoFormTestData =
    generateAutoFormTestData;
}
