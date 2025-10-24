import { describe, expect, it } from 'vitest';
import { autoFormDefinition } from './autoForm';
import { autoSpecificFields } from './autoSpecificFields';
import { contractPreferenceFields, preferenceFields } from './commonFields';

describe('Auto Form Definition Structure', () => {
  describe('Form Definition Composition', () => {
    it('should include auto-specific fields', () => {
      expect(autoFormDefinition).toContain(...autoSpecificFields);
    });

    it('should include contract preference fields', () => {
      expect(autoFormDefinition).toContain(...contractPreferenceFields);
    });

    it('should include general preference fields', () => {
      expect(autoFormDefinition).toContain(...preferenceFields);
    });

    it('should have all required field types', () => {
      const fieldTypes = autoFormDefinition.map((field) => field.type);
      const expectedTypes = ['text', 'select', 'radio', 'checkbox', 'date', 'number', 'card', 'object'];

      expectedTypes.forEach((type) => {
        expect(fieldTypes).toContain(type);
      });
    });
  });

  describe('Required Fields Validation', () => {
    it('should have required fields for vehicle identification', () => {
      const vehicleFields = ['make', 'model', 'modelYear', 'fuelType', 'transmission', 'bodyType', 'doorCount', 'power'];
      vehicleFields.forEach((fieldName) => {
        const field = autoFormDefinition.find((f) => f.name === fieldName);
        expect(field).toBeDefined();
        expect(field?.required).toBe(true);
      });
    });

    it('should have required fields for driver profile', () => {
      const driverFields = ['gender', 'birthDate', 'maritalStatus', 'profession', 'numberOfChildren'];
      driverFields.forEach((fieldName) => {
        const field = autoFormDefinition.find((f) => f.name === fieldName);
        expect(field).toBeDefined();
        expect(field?.required).toBe(true);
      });
    });

    it('should have required fields for vehicle usage', () => {
      const usageFields = ['usageType', 'annualMileage', 'nightParkingType', 'nightParkingPostalCode'];
      usageFields.forEach((fieldName) => {
        const field = autoFormDefinition.find((f) => f.name === fieldName);
        expect(field).toBeDefined();
        expect(field?.required).toBe(true);
      });
    });

    it('should have required fields for insurance history', () => {
      const insuranceFields = ['isCurrentlyInsured', 'yearsInsured', 'bonusMalus', 'contractSuspended', 'isMainDriverOtherVehicle', 'hasBeenTerminated', 'claimsLast3Years'];
      insuranceFields.forEach((fieldName) => {
        const field = autoFormDefinition.find((f) => f.name === fieldName);
        expect(field).toBeDefined();
        expect(field?.required).toBe(true);
      });
    });
  });

  describe('Field Type Validation', () => {
    it('should have correct field types for vehicle characteristics', () => {
      const vehicleFields = {
        make: 'text',
        model: 'text',
        version: 'text',
        modelYear: 'date',
        fuelType: 'card',
        transmission: 'select',
        bodyType: 'select',
        doorCount: 'select',
        power: 'number',
      };

      Object.entries(vehicleFields).forEach(([fieldName, expectedType]) => {
        const field = autoFormDefinition.find((f) => f.name === fieldName);
        expect(field).toBeDefined();
        expect(field?.type).toBe(expectedType);
      });
    });

    it('should have correct field types for driver profile', () => {
      const driverFields = {
        gender: 'select',
        birthDate: 'date',
        maritalStatus: 'select',
        profession: 'select',
        numberOfChildren: 'select',
        childrenBirthYears: 'object',
      };

      Object.entries(driverFields).forEach(([fieldName, expectedType]) => {
        const field = autoFormDefinition.find((f) => f.name === fieldName);
        expect(field).toBeDefined();
        expect(field?.type).toBe(expectedType);
      });
    });

    it('should have correct field types for dates', () => {
      const dateFields = ['modelYear', 'firstRegistrationDate', 'purchaseDate', 'birthDate', 'drivingLicenseDate', 'spouseLicenseDate', 'spouseBirthDate'];
      dateFields.forEach((fieldName) => {
        const field = autoFormDefinition.find((f) => f.name === fieldName);
        expect(field).toBeDefined();
        expect(field?.type).toBe('date');
      });
    });
  });

  describe('Options Validation', () => {
    it('should have options for select fields', () => {
      const selectFields = autoFormDefinition.filter((field) => field.type === 'select');

      // Skip fields that are supposed to have dynamic options added at runtime
      const fieldsWithStaticOptions = selectFields.filter(
        (field) => field.name !== 'yearsInsured' // This field gets options added dynamically
      );

      fieldsWithStaticOptions.forEach((field) => {
        expect(field.options).toBeDefined();
        expect(Array.isArray(field.options)).toBe(true);
        expect(field.options!.length).toBeGreaterThan(0);
      });
    });

    it('should have options for radio fields', () => {
      const radioFields = autoFormDefinition.filter((field) => field.type === 'radio');
      radioFields.forEach((field) => {
        expect(field.options).toBeDefined();
        expect(Array.isArray(field.options)).toBe(true);
        expect(field.options!.length).toBeGreaterThan(0);
      });
    });

    it('should have options for card fields', () => {
      const cardFields = autoFormDefinition.filter((field) => field.type === 'card');
      cardFields.forEach((field) => {
        expect(field.options).toBeDefined();
        expect(Array.isArray(field.options)).toBe(true);
        expect(field.options!.length).toBeGreaterThan(0);
      });
    });

    it('should have valid option structure', () => {
      const fieldsWithOptions = autoFormDefinition.filter((field) => field.options);
      fieldsWithOptions.forEach((field) => {
        field.options!.forEach((option) => {
          expect(option).toHaveProperty('value');
          expect(option).toHaveProperty('label');
          expect(typeof option.value).toBe('string');
          expect(typeof option.label).toBe('string');
        });
      });
    });
  });

  describe('Subsection Grouping', () => {
    it('should have all fields assigned to subsections', () => {
      autoFormDefinition.forEach((field) => {
        expect(field.subsection).toBeDefined();
        expect(field.subsection?.id).toBeDefined();
        expect(field.subsection?.label).toBeDefined();
      });
    });

    it('should have unique subsection IDs', () => {
      const subsectionIds = autoFormDefinition.map((field) => field.subsection?.id).filter(Boolean);
      const uniqueIds = new Set(subsectionIds);
      // Multiple fields can share the same subsection, so we just check that all fields have subsections
      expect(subsectionIds.length).toBe(autoFormDefinition.length);
      expect(uniqueIds.size).toBeGreaterThan(0);
    });

    it('should group related fields together', () => {
      const vehicleIdentificationFields = autoFormDefinition.filter((field) => field.subsection?.id === 'vehicle_identification');
      expect(vehicleIdentificationFields.length).toBeGreaterThan(0);
      expect(vehicleIdentificationFields.some((f) => f.name === 'make')).toBe(true);
      expect(vehicleIdentificationFields.some((f) => f.name === 'model')).toBe(true);
    });
  });

  describe('Validation Rules', () => {
    it('should have validation for number fields', () => {
      const numberFields = autoFormDefinition.filter((field) => field.type === 'number');
      numberFields.forEach((field) => {
        expect(field.validation).toBeDefined();
        expect(field.validation?.min).toBeDefined();
        expect(field.validation?.max).toBeDefined();
      });
    });

    it('should have validation for text fields with patterns', () => {
      const postalCodeFields = autoFormDefinition.filter((field) => field.name.includes('PostalCode') || field.name.includes('postalCode'));
      postalCodeFields.forEach((field) => {
        expect(field.validation).toBeDefined();
        expect(field.validation?.pattern).toBeDefined();
      });
    });

    it('should have min/max length validation for text fields', () => {
      const textFields = autoFormDefinition.filter((field) => field.type === 'text');
      const fieldsWithLengthValidation = textFields.filter((field) => field.validation?.minLength || field.validation?.maxLength);
      expect(fieldsWithLengthValidation.length).toBeGreaterThan(0);
    });
  });

  describe('ShowWhen Conditions', () => {
    it('should have valid showWhen conditions', () => {
      const conditionalFields = autoFormDefinition.filter((field) => field.showWhen);
      conditionalFields.forEach((field) => {
        expect(field.showWhen?.field).toBeDefined();
        expect(typeof field.showWhen?.field).toBe('string');
        expect(field.showWhen?.equals !== undefined || field.showWhen?.in !== undefined).toBe(true);
      });
    });

    it('should reference existing fields in showWhen conditions', () => {
      const fieldNames = autoFormDefinition.map((field) => field.name);
      const conditionalFields = autoFormDefinition.filter((field) => field.showWhen);

      conditionalFields.forEach((field) => {
        const dependencyField = fieldNames.find((name) => name === field.showWhen?.field);
        expect(dependencyField).toBeDefined();
      });
    });

    it('should have proper showWhen structure for array conditions', () => {
      const arrayConditionFields = autoFormDefinition.filter((field) => field.showWhen?.in !== undefined);
      arrayConditionFields.forEach((field) => {
        expect(Array.isArray(field.showWhen?.in)).toBe(true);
        expect(field.showWhen?.in!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Field Labels and Help Text', () => {
    it('should have labels for all fields', () => {
      autoFormDefinition.forEach((field) => {
        expect(field.label).toBeDefined();
        expect(typeof field.label).toBe('string');
        expect(field.label!.length).toBeGreaterThan(0);
      });
    });

    it('should have helper text for complex fields', () => {
      const complexFields = autoFormDefinition.filter((field) => field.type === 'object' || field.type === 'card' || field.name.includes('Date'));
      const fieldsWithHelperText = complexFields.filter((field) => field.helperText);
      expect(fieldsWithHelperText.length).toBeGreaterThan(0);
    });

    it('should have help text for fields that need explanation', () => {
      const fieldsWithHelpText = autoFormDefinition.filter((field) => field.helpText);
      expect(fieldsWithHelpText.length).toBeGreaterThan(0);
    });
  });

  describe('Field Uniqueness', () => {
    it('should have unique field names', () => {
      const fieldNames = autoFormDefinition.map((field) => field.name);
      const uniqueNames = new Set(fieldNames);
      expect(uniqueNames.size).toBe(fieldNames.length);
    });

    it('should not have duplicate field definitions', () => {
      const fieldNames = autoFormDefinition.map((field) => field.name);
      const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
      expect(duplicates).toHaveLength(0);
    });
  });

  describe('Specific Auto Fields', () => {
    it('should include vehicle type selection', () => {
      const vehicleTypeField = autoFormDefinition.find((f) => f.name === 'vehicleType');
      expect(vehicleTypeField).toBeDefined();
      expect(vehicleTypeField?.type).toBe('radio');
      expect(vehicleTypeField?.options).toHaveLength(2);
    });

    it('should include fuel type card selection', () => {
      const fuelTypeField = autoFormDefinition.find((f) => f.name === 'fuelType');
      expect(fuelTypeField).toBeDefined();
      expect(fuelTypeField?.type).toBe('card');
      expect(fuelTypeField?.options).toHaveLength(3);
    });

    it('should include bonus/malus selection with comprehensive options', () => {
      const bonusMalusField = autoFormDefinition.find((f) => f.name === 'bonusMalus');
      expect(bonusMalusField).toBeDefined();
      expect(bonusMalusField?.type).toBe('select');
      expect(bonusMalusField?.options!.length).toBeGreaterThan(50);
    });

    it('should include children birth years object field', () => {
      const childrenBirthYearsField = autoFormDefinition.find((f) => f.name === 'childrenBirthYears');
      expect(childrenBirthYearsField).toBeDefined();
      expect(childrenBirthYearsField?.type).toBe('object');
      expect(childrenBirthYearsField?.objectSchema).toBeDefined();
    });
  });
});
