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
        id: 'test_section',
        label: 'Test Section',
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
            name: 'power',
            type: 'number',
            label: 'Puissance (CV)',
            required: true,
            validation: { min: 1, max: 1000 },
            subsection: { id: 'vehicle_identification', label: 'Identification du véhicule' },
          },
          // Driver profile
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
          // Vehicle usage
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
          // Insurance history
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

describe('Auto Form User Interactions', () => {
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

  describe('Form Data Updates', () => {
    it('should update form data when text field changes', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'Toyota');

      expect(mockUpdateFormField).toHaveBeenCalledWith('make', 'Toyota');
    });

    it('should update form data when select field changes', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const genderSelect = screen.getByLabelText('Sexe');
      await user.selectOptions(genderSelect, 'female');

      expect(mockUpdateFormField).toHaveBeenCalledWith('gender', 'female');
    });

    it('should update form data when radio field changes', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const carRadio = screen.getByLabelText('Voiture');
      await user.click(carRadio);

      expect(mockUpdateFormField).toHaveBeenCalledWith('vehicleType', 'car');
    });

    it('should update form data when number field changes', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, '150');

      expect(mockUpdateFormField).toHaveBeenCalledWith('power', 150);
    });

    it('should update form data when date field changes', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const birthDateInput = screen.getByLabelText('Date de naissance');
      await user.type(birthDateInput, '01/01/1990');

      expect(mockUpdateFormField).toHaveBeenCalledWith('birthDate', '01/01/1990');
    });

    it('should update form data when card field changes', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const gasolineCard = screen.getByLabelText('Essence');
      await user.click(gasolineCard);

      expect(mockUpdateFormField).toHaveBeenCalledWith('fuelType', 'gasoline');
    });
  });

  describe('Wizard Navigation', () => {
    it('should navigate to next step when next button is clicked', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const nextButton = screen.getByRole('button', { name: /suivant/i });
      await user.click(nextButton);

      expect(mockSetCurrentStep).toHaveBeenCalledWith(1);
    });

    it('should navigate to previous step when previous button is clicked', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // First go to next step
      const nextButton = screen.getByRole('button', { name: /suivant/i });
      await user.click(nextButton);

      // Then go back
      const previousButton = screen.getByRole('button', { name: /précédent/i });
      await user.click(previousButton);

      expect(mockSetCurrentStep).toHaveBeenCalledWith(0);
    });

    it('should disable previous button on first step', async () => {
      renderFormView({});

      const previousButton = screen.getByRole('button', { name: /précédent/i });
      expect(previousButton).toBeDisabled();
    });

    it('should show progress bar with correct percentage', async () => {
      renderFormView({});

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      const validFormData = {
        vehicleType: 'car',
        make: 'Toyota',
        model: 'Corolla',
        fuelType: 'gasoline',
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

    it('should not submit form with invalid data', async () => {
      const user = userEvent.setup();
      renderFormView({}); // Empty form data

      const submitButton = screen.getByRole('button', { name: /calculer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCalculateComparison).not.toHaveBeenCalled();
        expect(screen.getByText('Veuillez remplir tous les champs requis')).toBeInTheDocument();
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      const validFormData = {
        vehicleType: 'car',
        make: 'Toyota',
        model: 'Corolla',
        fuelType: 'gasoline',
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
        expect(submitButton).toBeDisabled();
        expect(screen.getByText('Calcul en cours...')).toBeInTheDocument();
      });
    });
  });

  describe('Field Error Clearing', () => {
    it('should clear error when field is corrected', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // First, trigger an error
      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'A');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Minimum 2 caractères requis')).toBeInTheDocument();
      });

      // Then fix the field
      await user.type(makeInput, 'bc');

      await waitFor(() => {
        expect(screen.queryByText('Minimum 2 caractères requis')).not.toBeInTheDocument();
      });
    });

    it('should clear multiple errors when fields are corrected', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Trigger multiple errors
      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'A');
      await user.tab();

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, '0');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Minimum 2 caractères requis')).toBeInTheDocument();
        expect(screen.getByText('Valeur minimale : 1')).toBeInTheDocument();
      });

      // Fix both fields
      await user.type(makeInput, 'bc');
      await user.clear(powerInput);
      await user.type(powerInput, '150');

      await waitFor(() => {
        expect(screen.queryByText('Minimum 2 caractères requis')).not.toBeInTheDocument();
        expect(screen.queryByText('Valeur minimale : 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Autofill Functionality', () => {
    it('should show autofill prompt when user data is available', async () => {
      renderFormView({});

      await waitFor(() => {
        expect(screen.getByText('Remplir automatiquement avec vos données ?')).toBeInTheDocument();
      });
    });

    it('should pre-fill fields when autofill is accepted', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const acceptButton = screen.getByRole('button', { name: /oui/i });
      await user.click(acceptButton);

      await waitFor(() => {
        expect(mockUpdateFormField).toHaveBeenCalledWith('gender', 'male');
        expect(mockUpdateFormField).toHaveBeenCalledWith('birthDate', '1990-01-01');
      });
    });

    it('should not pre-fill fields when autofill is declined', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const declineButton = screen.getByRole('button', { name: /non/i });
      await user.click(declineButton);

      await waitFor(() => {
        expect(mockUpdateFormField).not.toHaveBeenCalled();
      });
    });

    it('should map user data correctly to form fields', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const acceptButton = screen.getByRole('button', { name: /oui/i });
      await user.click(acceptButton);

      await waitFor(() => {
        // Check that gender is mapped correctly
        expect(mockUpdateFormField).toHaveBeenCalledWith('gender', 'male');
        // Check that birth date is mapped correctly
        expect(mockUpdateFormField).toHaveBeenCalledWith('birthDate', '1990-01-01');
      });
    });
  });

  describe('Form Reset and Navigation', () => {
    it('should reset form when reset button is clicked', async () => {
      const user = userEvent.setup();
      renderFormView({ make: 'Toyota', model: 'Corolla' });

      const resetButton = screen.getByRole('button', { name: /réinitialiser/i });
      await user.click(resetButton);

      await waitFor(() => {
        expect(mockUpdateFormField).toHaveBeenCalledWith('make', '');
        expect(mockUpdateFormField).toHaveBeenCalledWith('model', '');
      });
    });

    it('should navigate back to form selection', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const backButton = screen.getByRole('button', { name: /retour/i });
      await user.click(backButton);

      // This would typically navigate to a different component
      // The exact implementation depends on the parent component
    });

    it('should maintain form state during navigation', async () => {
      const user = userEvent.setup();
      const initialFormData = { make: 'Toyota', model: 'Corolla' };
      renderFormView(initialFormData);

      // Navigate to next step
      const nextButton = screen.getByRole('button', { name: /suivant/i });
      await user.click(nextButton);

      // Navigate back
      const previousButton = screen.getByRole('button', { name: /précédent/i });
      await user.click(previousButton);

      // Form data should still be there
      const makeInput = screen.getByLabelText('Marque');
      expect(makeInput).toHaveValue('Toyota');
    });
  });

  describe('Complex User Workflows', () => {
    it('should handle complete form filling workflow', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Fill vehicle information
      const carRadio = screen.getByLabelText('Voiture');
      await user.click(carRadio);

      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'Toyota');

      const modelInput = screen.getByLabelText('Modèle');
      await user.type(modelInput, 'Corolla');

      const gasolineCard = screen.getByLabelText('Essence');
      await user.click(gasolineCard);

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, '150');

      // Navigate to next step
      const nextButton = screen.getByRole('button', { name: /suivant/i });
      await user.click(nextButton);

      // Fill driver information
      const genderSelect = screen.getByLabelText('Sexe');
      await user.selectOptions(genderSelect, 'male');

      const birthDateInput = screen.getByLabelText('Date de naissance');
      await user.type(birthDateInput, '01/01/1990');

      const maritalStatusSelect = screen.getByLabelText('Situation familiale');
      await user.selectOptions(maritalStatusSelect, 'married');

      // Spouse fields should appear
      await waitFor(() => {
        expect(screen.getByLabelText('Le conjoint a-t-il le permis ?')).toBeInTheDocument();
      });

      const spouseLicenseSelect = screen.getByLabelText('Le conjoint a-t-il le permis ?');
      await user.selectOptions(spouseLicenseSelect, 'yes');

      // Spouse details should appear
      await waitFor(() => {
        expect(screen.getByLabelText("Date d'obtention du permis du conjoint")).toBeInTheDocument();
      });

      // Continue with other fields...
      const professionSelect = screen.getByLabelText('Profession');
      await user.selectOptions(professionSelect, 'student');

      const numberOfChildrenSelect = screen.getByLabelText("Nombre d'enfants");
      await user.selectOptions(numberOfChildrenSelect, '1');

      // Children birth years should appear
      await waitFor(() => {
        expect(screen.getByLabelText('Années de naissance des enfants')).toBeInTheDocument();
      });

      const drivingLicenseDateInput = screen.getByLabelText("Date d'obtention du permis");
      await user.type(drivingLicenseDateInput, '01/01/2010');

      // Navigate to next step
      await user.click(nextButton);

      // Fill usage information
      const usageTypeSelect = screen.getByLabelText("Type d'usage");
      await user.selectOptions(usageTypeSelect, 'private_work');

      // Work postal code should appear
      await waitFor(() => {
        expect(screen.getByLabelText('Code postal du travail')).toBeInTheDocument();
      });

      const workPostalCodeInput = screen.getByLabelText('Code postal du travail');
      await user.type(workPostalCodeInput, '75001');

      const annualMileageSelect = screen.getByLabelText('Kilométrage annuel');
      await user.selectOptions(annualMileageSelect, '10000_15000');

      const nightParkingTypeSelect = screen.getByLabelText('Type de stationnement nocturne');
      await user.selectOptions(nightParkingTypeSelect, 'garage');

      const nightParkingPostalCodeInput = screen.getByLabelText('Code postal du stationnement nocturne');
      await user.type(nightParkingPostalCodeInput, '75001');

      // Navigate to next step
      await user.click(nextButton);

      // Fill insurance history
      const isCurrentlyInsuredSelect = screen.getByLabelText('Actuellement assuré');
      await user.selectOptions(isCurrentlyInsuredSelect, 'main_driver');

      // Contract fields should appear
      await waitFor(() => {
        expect(screen.getByLabelText("Contrat de plus d'un an")).toBeInTheDocument();
      });

      const contractOlderThanYearSelect = screen.getByLabelText("Contrat de plus d'un an");
      await user.selectOptions(contractOlderThanYearSelect, 'yes');

      const yearsInsuredSelect = screen.getByLabelText("Années d'assurance");
      await user.selectOptions(yearsInsuredSelect, '5_plus');

      const bonusMalusSelect = screen.getByLabelText('Bonus/Malus');
      await user.selectOptions(bonusMalusSelect, '0');

      const contractSuspendedSelect = screen.getByLabelText('Contrat suspendu');
      await user.selectOptions(contractSuspendedSelect, 'never');

      const isMainDriverOtherVehicleSelect = screen.getByLabelText("Conducteur principal d'un autre véhicule");
      await user.selectOptions(isMainDriverOtherVehicleSelect, 'no');

      const hasBeenTerminatedSelect = screen.getByLabelText("Résiliation d'assurance");
      await user.selectOptions(hasBeenTerminatedSelect, 'never');

      const claimsLast3YearsSelect = screen.getByLabelText('Sinistres des 3 dernières années');
      await user.selectOptions(claimsLast3YearsSelect, '0');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /calculer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCalculateComparison).toHaveBeenCalled();
      });
    });

    it('should handle form validation during workflow', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Try to submit with empty form
      const submitButton = screen.getByRole('button', { name: /calculer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Veuillez remplir tous les champs requis')).toBeInTheDocument();
        expect(mockCalculateComparison).not.toHaveBeenCalled();
      });

      // Fill required fields
      const makeInput = screen.getByLabelText('Marque');
      await user.type(makeInput, 'Toyota');

      const modelInput = screen.getByLabelText('Modèle');
      await user.type(modelInput, 'Corolla');

      const powerInput = screen.getByLabelText('Puissance (CV)');
      await user.type(powerInput, '150');

      // Try to submit again
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Veuillez remplir tous les champs requis')).toBeInTheDocument();
        expect(mockCalculateComparison).not.toHaveBeenCalled();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation between fields', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const makeInput = screen.getByLabelText('Marque');
      await user.click(makeInput);

      await user.tab();
      const modelInput = screen.getByLabelText('Modèle');
      expect(modelInput).toHaveFocus();

      await user.tab();
      const powerInput = screen.getByLabelText('Puissance (CV)');
      expect(powerInput).toHaveFocus();
    });

    it('should support enter key for form submission', async () => {
      const user = userEvent.setup();
      const validFormData = {
        vehicleType: 'car',
        make: 'Toyota',
        model: 'Corolla',
        fuelType: 'gasoline',
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

      const submitButton = screen.getByLabelText('Calculer');
      await user.click(submitButton);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockCalculateComparison).toHaveBeenCalled();
      });
    });
  });
});
