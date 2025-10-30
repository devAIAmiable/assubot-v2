/**
 * Transform form data to match backend API schema requirements
 */

/**
 * Convert date from DD/MM/YYYY or MM/YYYY format to YYYY-MM-DD
 */
export function normalizeDate(dateString: string | undefined | null): string | undefined {
  if (!dateString || typeof dateString !== 'string') return undefined;

  // Handle YYYY-MM-DD (already correct format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Handle DD/MM/YYYY format
  const ddMMyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddMMyyyyMatch) {
    const [, day, month, year] = ddMMyyyyMatch;
    return `${year}-${month}-${day}`;
  }

  // Handle MM/YYYY format (set to first day of month)
  const mmYyyyMatch = dateString.match(/^(\d{2})\/(\d{4})$/);
  if (mmYyyyMatch) {
    const [, month, year] = mmYyyyMatch;
    return `${year}-${month}-01`;
  }

  // Try to parse as Date object
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch {
    // Invalid date, return undefined
  }

  return undefined;
}

/**
 * Map frontend enum values to backend expected values
 */
export function mapEnumValue(fieldName: string, value: unknown): unknown {
  if (typeof value !== 'string') return value;

  const enumMappings: Record<string, Record<string, string>> = {
    cardHolder: {
      me: 'you',
      spouse: 'spouse',
      parent: 'parent',
      other: 'other',
      both: 'you', // Default to 'you' for both
    },
    bonusMalus: {
      '50_more_3_years': '50_3_years',
      // Add more mappings as needed
    },
    desiredCoverageLevel: {
      third_party_glass_theft: 'third_party_glass',
      third_party_basic: 'third_party_basic',
      comprehensive: 'comprehensive',
      tous_risques: 'comprehensive',
      tiers: 'third_party_basic',
      tiers_plus: 'third_party_glass',
    },
    licenseType: {
      // Map lowercase form values to uppercase backend values
      b: 'B', // Form uses 'b', backend expects 'B'
      b_accompanied: 'b_accompanied', // Keep as is, already in backend enum
      // For foreign licenses, map to appropriate values
      // Note: 'foreign_eu' and 'foreign_non_eu' may need specific backend values
      // For now, keeping them as-is if backend accepts them, otherwise they'll need proper mapping
    },
  };

  const mapping = enumMappings[fieldName];
  if (mapping && mapping[value]) {
    return mapping[value];
  }

  return value;
}

/**
 * Add missing required fields with sensible defaults
 */
function addMissingRequiredFields(category: string, formData: Record<string, unknown>): void {
  if (category === 'auto') {
    // Personal info defaults
    if (!formData.civility && formData.gender) {
      const gender = String(formData.gender).toLowerCase();
      formData.civility = gender === 'male' || gender === 'm' || gender === 'homme' ? 'M.' : 'Mme';
    }
    if (!formData.civility) {
      formData.civility = 'M.'; // Default
    }
    // Don't add empty strings for firstName, lastName, postalCode, city
    // These should be provided by the user or omitted
    // If they're empty strings, we'll filter them out later
    if (!formData.professionalStatus && formData.profession) {
      // Try to map profession to professionalStatus
      const profession = String(formData.profession).toLowerCase();
      if (profession.includes('salarié') || profession.includes('employee')) {
        formData.professionalStatus = 'employee';
      } else if (profession.includes('étudiant') || profession.includes('student')) {
        formData.professionalStatus = 'student';
      } else if (profession.includes('retraité') || profession.includes('retired')) {
        formData.professionalStatus = 'retired';
      } else if (profession.includes('chômeur') || profession.includes('unemployed')) {
        formData.professionalStatus = 'unemployed';
      } else {
        formData.professionalStatus = 'other';
      }
    }
    if (!formData.professionalStatus) {
      formData.professionalStatus = 'employee'; // Default
    }

    // Vehicle defaults
    if (!formData.vehicleValue) {
      // Try to derive from other fields or set reasonable default
      formData.vehicleValue = 15000; // Default average vehicle value
    }
    if (!formData.owner && formData.cardHolder) {
      formData.owner = mapEnumValue('cardHolder', formData.cardHolder) as string;
    }
    if (!formData.owner) {
      formData.owner = 'you';
    }
    if (!formData.isSoleOwner) {
      const hasSecondary = formData.hasSecondaryDriver && formData.hasSecondaryDriver !== 'no';
      formData.isSoleOwner = hasSecondary ? 'no' : 'yes';
    }

    // Usage defaults
    if (!formData.plannedTrips && formData.usageType) {
      formData.plannedTrips = formData.usageType;
    }
    if (!formData.plannedTrips) {
      formData.plannedTrips = 'private_only';
    }
    if (formData.distanceHomeToWork === undefined || formData.distanceHomeToWork === null) {
      formData.distanceHomeToWork = 0;
    }
    if (!formData.vehicleUsageFrequency) {
      formData.vehicleUsageFrequency = 'daily';
    }
    if (!formData.parkingLocation && formData.nightParkingType) {
      // Map nightParkingType to parkingLocation
      const parking = String(formData.nightParkingType);
      if (parking.includes('garage')) {
        formData.parkingLocation = 'garage';
      } else if (parking.includes('closed')) {
        formData.parkingLocation = 'covered_parking';
      } else {
        formData.parkingLocation = 'street';
      }
    }
    if (!formData.parkingLocation) {
      formData.parkingLocation = 'street';
    }
    if (!formData.nightParkingMode && formData.nightParkingType) {
      const parking = String(formData.nightParkingType);
      if (parking.includes('individual')) {
        formData.nightParkingMode = 'individual';
      } else if (parking.includes('collective') || parking.includes('closed')) {
        formData.nightParkingMode = 'collective_closed';
      } else {
        formData.nightParkingMode = 'public_road';
      }
    }
    if (!formData.nightParkingMode) {
      formData.nightParkingMode = 'public_road';
    }
    // Don't add empty string for nightParkingCity
    // If it's needed, it should be provided by the user or derived from postal code
    if (!formData.workInFrance) {
      formData.workInFrance = 'yes';
    }

    // Insurance history defaults
    if (!formData.hasBeenInsured && formData.isCurrentlyInsured) {
      formData.hasBeenInsured = formData.isCurrentlyInsured;
    }
    if (!formData.hasBeenInsured) {
      formData.hasBeenInsured = 'no';
    }
    if (formData.isSecondaryDriverOtherVehicle === undefined || formData.isSecondaryDriverOtherVehicle === null) {
      const isSecondary = formData.isCurrentlyInsured === 'secondary_driver';
      formData.isSecondaryDriverOtherVehicle = isSecondary ? 'yes' : 'no';
    }
    if (formData.claimsLast3To5Years === undefined || formData.claimsLast3To5Years === null) {
      // Try to map from claimsLast3Years
      if (formData.claimsLast3Years) {
        const count = typeof formData.claimsLast3Years === 'string' ? parseInt(formData.claimsLast3Years, 10) || 0 : (formData.claimsLast3Years as number);
        formData.claimsLast3To5Years = count;
      } else {
        formData.claimsLast3To5Years = 0;
      }
    }
    if (!formData.pointsLost) {
      formData.pointsLost = '0';
    }

    // Coverage level
    if (!formData.coverageLevel && formData.desiredCoverageLevel) {
      formData.coverageLevel = mapEnumValue('desiredCoverageLevel', formData.desiredCoverageLevel) as string;
    }
    if (!formData.coverageLevel) {
      formData.coverageLevel = 'third_party_basic';
    }

    // Additional drivers
    if (formData.hasAdditionalDrivers === undefined || formData.hasAdditionalDrivers === null) {
      const hasSecondary = formData.hasSecondaryDriver && formData.hasSecondaryDriver !== 'no';
      formData.hasAdditionalDrivers = hasSecondary;
    }
  }
}

/**
 * Transform form data to match backend schema requirements
 */
export function transformFormDataForBackend(category: string, formData: Record<string, unknown>): Record<string, unknown> {
  const transformed: Record<string, unknown> = { ...formData };

  // Date field transformations
  const dateFields = ['birthDate', 'drivingLicenseDate', 'firstRegistrationDate', 'purchaseDate', 'contractStartDate', 'spouseLicenseDate', 'spouseBirthDate'];

  dateFields.forEach((field) => {
    if (transformed[field]) {
      const normalized = normalizeDate(transformed[field] as string);
      if (normalized) {
        transformed[field] = normalized;
      } else {
        delete transformed[field]; // Remove invalid dates
      }
    }
  });

  // Enum value mappings
  Object.keys(transformed).forEach((fieldName) => {
    transformed[fieldName] = mapEnumValue(fieldName, transformed[fieldName]);
  });

  // Assemble optionalGuarantees object from individual checkbox fields if present
  if (category === 'auto') {
    const ogPrefix = 'optionalGuarantees_';
    const ogKeys = Object.keys(transformed).filter((k) => k.startsWith(ogPrefix));
    if (ogKeys.length > 0) {
      const og: Record<string, boolean> = {
        assistance0km: false,
        replacementVehicle: false,
        extendedDriverProtection: false,
        legalDefense: false,
        theftFire: false,
      };
      ogKeys.forEach((k) => {
        const shortKey = k.substring(ogPrefix.length);
        og[shortKey] = Boolean(transformed[k]);
        delete transformed[k];
      });
      transformed.optionalGuarantees = og;
    }
  }

  // Add missing required fields with defaults
  addMissingRequiredFields(category, transformed);

  // Coerce string numbers to numbers for fields that require numeric values
  // (Backend schema uses z.coerce.number() but we should send proper types)
  if (category === 'auto') {
    const numericFields: string[] = [
      'numberOfChildren',
      'vehicleValue',
      'distanceHomeToWork',
      'claimsLast3To5Years',
      'claimsLast3Years',
      'yearsInsured',
      'additionalDriverAge',
      'maxAnnualPremium',
      'maxMonthlyPremium',
      'power',
      'doorCount',
      'modelYear',
      'vehicleOwnershipYears',
    ];

    numericFields.forEach((field) => {
      if (transformed[field] !== undefined && transformed[field] !== null) {
        const value = transformed[field];
        if (typeof value === 'string') {
          // Special handling for numberOfChildren - handle '3_plus' -> 3
          if (field === 'numberOfChildren' && value === '3_plus') {
            transformed[field] = 3;
          } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              transformed[field] = numValue;
            }
          }
        }
      }
    });

    // Special handling for vehicleOwnershipYears - handle string options like '4', '5_plus'
    if (transformed.vehicleOwnershipYears !== undefined && transformed.vehicleOwnershipYears !== null) {
      const value = transformed.vehicleOwnershipYears;
      if (typeof value === 'string') {
        if (value === '5_plus') {
          transformed.vehicleOwnershipYears = 5;
        } else if (value === 'less_1') {
          transformed.vehicleOwnershipYears = 0;
        } else if (value.includes('_')) {
          // Handle other underscore values - extract first number
          const match = value.match(/^(\d+)/);
          if (match) {
            transformed.vehicleOwnershipYears = parseInt(match[1], 10);
          }
        } else {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue)) {
            transformed.vehicleOwnershipYears = numValue;
          }
        }
      }
    }

    // Filter out empty strings for required string fields
    // Backend rejects empty strings, so we should omit them
    const stringFieldsToFilter = ['firstName', 'lastName', 'postalCode', 'city', 'nightParkingCity'];

    stringFieldsToFilter.forEach((field) => {
      if (transformed[field] === '' || transformed[field] === null) {
        delete transformed[field];
      }
    });
  }

  return transformed;
}
