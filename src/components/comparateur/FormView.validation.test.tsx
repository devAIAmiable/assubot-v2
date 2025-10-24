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

// Mock the form definitions with validation rules
vi.mock('../../config/forms', () => ({
  getFormDefinitionByCategory: (category: ComparisonCategory) => ({
    category,
    sections: [
      {
        id: 'test_section',
        label: 'Test Section',
        fields: [
          // Required fields
          {
            name: 'make',
            type: 'text',
            label: 'Marque',
            required: true,
            validation: {
              minLength: 2,
              maxLength: 50,
            },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'model',
            type: 'text',
            label: 'Modèle',
            required: true,
            validation: {
              minLength: 1,
              maxLength: 50,
            },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'power',
            type: 'number',
            label: 'Puissance (CV)',
            required: true,
            validation: {
              min: 1,
              max: 1000,
            },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'nightParkingPostalCode',
            type: 'text',
            label: 'Code postal du stationnement nocturne',
            required: true,
            validation: {
              pattern: '^[0-9]{5}$',
            },
            subsection: { id: 'vehicle_usage', label: 'Usage du véhicule' },
          },
          {
            name: 'workPostalCode',
            type: 'text',
            label: 'Code postal du travail',
            required: false,
            showWhen: { field: 'usageType', in: ['private_work', 'private_professional', 'private_tours'] },
            validation: {
              pattern: '^[0-9]{5}$',
            },
            subsection: { id: 'vehicle_usage', label: 'Usage du véhicule' },
          },
          {
            name: 'purchasePrice',
            type: 'number',
            label: "Prix d'achat",
            required: false,
            validation: {
              min: 0,
              max: 1000000,
            },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'currentValue',
            type: 'number',
            label: 'Valeur actuelle',
            required: false,
            validation: {
              min: 0,
              max: 1000000,
            },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          {
            name: 'mileage',
            type: 'number',
            label: 'Kilométrage',
            required: false,
            validation: {
              min: 0,
              max: 1000000,
            },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
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
            name: 'drivingLicenseDate',
            type: 'date',
            label: "Date d'obtention du permis",
            required: true,
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

describe('Auto Form Validation', () => {
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

  describe('Required Field Validation', () => {
    it('should show error for empty required text field', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Try to submit form with empty required field
      const makeInput = screen.getByLabelText('Marque');
      await user.clear(makeInput);
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });
    });

    it('should show error for empty required select field', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Try to submit form with empty required select
      const genderSelect = screen.getByLabelText('Sexe');
      await user.selectOptions(genderSelect, '');
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });
    });

    it('should show error for empty required number field', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Try to submit form with empty required number field
      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.clear(powerInput);
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });
    });

    it('should clear error when required field is filled', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // First, trigger error
      const makeInput = screen.getByLabelText('Marque');
      await user.clear(makeInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });

      // Then fill the field
      await user.type(makeInput, 'Toyota');

      await waitFor(() => {
        expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
      });
    });
  });

  describe('Text Field Validation', () => {
    it('should validate minimum length for text fields', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'A'); // Too short
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Minimum 2 caractères requis')).toBeInTheDocument();
      });
    });

    it('should validate maximum length for text fields', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'A'.repeat(51)); // Too long
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Maximum 50 caractères autorisés')).toBeInTheDocument();
      });
    });

    it('should accept valid length text', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'Toyota');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/caractères/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Postal Code Pattern Validation', () => {
    it('should validate postal code pattern for night parking', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const postalCodeInput = screen.getByLabelText('Code postal du stationnement nocturne');
      await user.type(postalCodeInput, '1234'); // Invalid - too short
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Format invalide')).toBeInTheDocument();
      });
    });

    it('should validate postal code pattern for work postal code', async () => {
      renderFormView({ usageType: 'private_work' });

      await waitFor(() => {
        const workPostalCodeInput = screen.getByLabelText('Code postal du travail');
        expect(workPostalCodeInput).toBeInTheDocument();
      });

      const user2 = userEvent.setup();
      const workPostalCodeInput = screen.getByLabelText('Code postal du travail');
      await user2.type(workPostalCodeInput, '12345a'); // Invalid - contains letter
      await user2.tab();

      await waitFor(() => {
        expect(screen.getByText('Format invalide')).toBeInTheDocument();
      });
    });

    it('should accept valid postal code format', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const postalCodeInput = screen.getByLabelText('Code postal du stationnement nocturne');
      await user.type(postalCodeInput, '75001');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('Format invalide')).not.toBeInTheDocument();
      });
    });

    it('should reject postal code with wrong length', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const postalCodeInput = screen.getByLabelText('Code postal du stationnement nocturne');
      await user.type(postalCodeInput, '123456'); // Too long
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Format invalide')).toBeInTheDocument();
      });
    });
  });

  describe('Number Field Validation', () => {
    it('should validate minimum value for power field', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, '0'); // Below minimum
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Valeur minimale : 1')).toBeInTheDocument();
      });
    });

    it('should validate maximum value for power field', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, '1001'); // Above maximum
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Valeur maximale : 1000')).toBeInTheDocument();
      });
    });

    it('should validate minimum value for purchase price', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const priceInput = screen.getByLabelText("Prix d'achat");
      await user.type(priceInput, '-100'); // Below minimum
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Valeur minimale : 0')).toBeInTheDocument();
      });
    });

    it('should validate maximum value for purchase price', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const priceInput = screen.getByLabelText("Prix d'achat");
      await user.type(priceInput, '1000001'); // Above maximum
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Valeur maximale : 1000000')).toBeInTheDocument();
      });
    });

    it('should accept valid number values', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, '150');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/Valeur/)).not.toBeInTheDocument();
      });
    });

    it('should reject non-numeric input for number fields', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, 'abc');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Veuillez entrer un nombre valide')).toBeInTheDocument();
      });
    });
  });

  describe('Date Field Validation', () => {
    it('should validate date format for birth date', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const birthDateInput = screen.getByLabelText('Date de naissance');
      await user.type(birthDateInput, 'invalid-date');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Format de date invalide')).toBeInTheDocument();
      });
    });

    it('should accept valid date format', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const birthDateInput = screen.getByLabelText('Date de naissance');
      await user.type(birthDateInput, '01/01/1990');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('Format de date invalide')).not.toBeInTheDocument();
      });
    });

    it('should validate future dates are not allowed for birth date', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const birthDateInput = screen.getByLabelText('Date de naissance');
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toLocaleDateString('fr-FR');

      await user.type(birthDateInput, futureDateString);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('La date ne peut pas être dans le futur')).toBeInTheDocument();
      });
    });
  });

  describe('Hidden Field Validation', () => {
    it('should not validate hidden required fields', async () => {
      const user = userEvent.setup();
      renderFormView({ usageType: 'private' }); // workPostalCode should be hidden

      // Try to submit form - workPostalCode should not trigger validation
      const submitButton = screen.getByRole('button', { name: /calculer/i });
      await user.click(submitButton);

      await waitFor(() => {
        // Should not show validation error for hidden field
        expect(screen.queryByText('Code postal du travail')).not.toBeInTheDocument();
      });
    });

    it('should validate fields when they become visible', async () => {
      const user = userEvent.setup();
      renderFormView({ usageType: 'private' });

      // Change usage type to show work postal code
      const usageTypeSelect = screen.getByLabelText("Type d'usage");
      await user.selectOptions(usageTypeSelect, 'private_work');

      await waitFor(() => {
        expect(screen.getByLabelText('Code postal du travail')).toBeInTheDocument();
      });

      // Now the field should be validated if it's required
      const workPostalCodeInput = screen.getByLabelText('Code postal du travail'); // eslint-disable-line @typescript-eslint/no-unused-vars
      await user.tab(); // Trigger validation

      // Since it's not required, no error should appear
      await waitFor(() => {
        expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission Validation', () => {
    it('should prevent submission when required fields are empty', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const submitButton = screen.getByRole('button', { name: /calculer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCalculateComparison).not.toHaveBeenCalled();
        expect(screen.getByText('Veuillez remplir tous les champs requis')).toBeInTheDocument();
      });
    });

    it('should allow submission when all required fields are valid', async () => {
      const user = userEvent.setup();
      const validFormData = {
        make: 'Toyota',
        model: 'Corolla',
        power: 150,
        gender: 'male',
        birthDate: '01/01/1990',
        maritalStatus: 'single',
        profession: 'student',
        numberOfChildren: '0',
        drivingLicenseDate: '01/01/2010',
        usageType: 'private',
        annualMileage: '10000_15000',
        nightParkingType: 'garage',
        nightParkingPostalCode: '75001',
        isCurrentlyInsured: 'not_insured',
        yearsInsured: '0',
        bonusMalus: '0',
        contractSuspended: 'never',
        isMainDriverOtherVehicle: 'no',
        hasBeenTerminated: 'never',
        claimsLast3Years: '0',
      };

      renderFormView(validFormData);

      const submitButton = screen.getByRole('button', { name: /calculer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCalculateComparison).toHaveBeenCalledWith(validFormData);
      });
    });

    it('should show validation errors for multiple invalid fields', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Fill some fields with invalid data
      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'A'); // Too short

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, '0'); // Below minimum

      const postalCodeInput = screen.getByLabelText('Code postal du stationnement nocturne');
      await user.type(postalCodeInput, '1234'); // Invalid format

      const submitButton = screen.getByRole('button', { name: /calculer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Minimum 2 caractères requis')).toBeInTheDocument();
        expect(screen.getByText('Valeur minimale : 1')).toBeInTheDocument();
        expect(screen.getByText('Format invalide')).toBeInTheDocument();
        expect(mockCalculateComparison).not.toHaveBeenCalled();
      });
    });
  });

  describe('Real-time Validation', () => {
    it('should validate fields on blur', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'A');
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(screen.getByText('Minimum 2 caractères requis')).toBeInTheDocument();
      });
    });

    it('should clear validation errors when field becomes valid', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'A');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Minimum 2 caractères requis')).toBeInTheDocument();
      });

      // Fix the field
      await user.type(makeInput, 'bc'); // Now "Abc" - valid length

      await waitFor(() => {
        expect(screen.queryByText('Minimum 2 caractères requis')).not.toBeInTheDocument();
      });
    });

    it('should validate on change for number fields', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, '0');

      await waitFor(() => {
        expect(screen.getByText('Valeur minimale : 1')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values', async () => {
      const user = userEvent.setup();
      renderFormView({ make: '' });

      const makeInput = screen.getByLabelText('Marque'); // eslint-disable-line @typescript-eslint/no-unused-vars
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });
    });

    it('should handle null values gracefully', async () => {
      const user = userEvent.setup();
      renderFormView({ make: null });

      const makeInput = screen.getByLabelText('Marque'); // eslint-disable-line @typescript-eslint/no-unused-vars
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });
    });

    it('should handle undefined values gracefully', async () => {
      const user = userEvent.setup();
      renderFormView({ make: undefined });

      const makeInput = screen.getByLabelText('Marque'); // eslint-disable-line @typescript-eslint/no-unused-vars
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });
    });

    it('should handle whitespace-only values', async () => {
      const user = userEvent.setup();
      renderFormView({ make: '   ' });

      const makeInput = screen.getByLabelText('Marque'); // eslint-disable-line @typescript-eslint/no-unused-vars
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });
    });
  });
});
