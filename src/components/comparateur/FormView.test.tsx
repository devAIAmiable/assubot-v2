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

// Mock the form definitions
vi.mock('../../config/forms', () => ({
  getFormDefinitionByCategory: (category: ComparisonCategory) => {
    const mockDefinition = {
      category,
      sections: [
        {
          title: 'Test Section',
          fields: [
            {
              name: 'hasSecondaryDriver',
              type: 'checkbox',
              label: 'Has Secondary Driver',
              required: false,
              subsection: { id: 'test', label: 'Test' },
            },
            {
              name: 'secondaryDriverName',
              type: 'text',
              label: 'Secondary Driver Name',
              required: true,
              showWhen: { field: 'hasSecondaryDriver', equals: true },
              subsection: { id: 'test', label: 'Test' },
            },
            {
              name: 'usageType',
              type: 'select',
              label: 'Usage Type',
              required: true,
              options: [
                { value: 'private_work', label: 'Private Work' },
                { value: 'private_professional', label: 'Private Professional' },
                { value: 'private_tours', label: 'Private Tours' },
                { value: 'other', label: 'Other' },
              ],
              subsection: { id: 'test', label: 'Test' },
            },
            {
              name: 'workPostalCode',
              type: 'text',
              label: 'Work Postal Code',
              required: false,
              showWhen: { field: 'usageType', in: ['private_work', 'private_professional', 'private_tours'] },
              subsection: { id: 'test', label: 'Test' },
            },
            {
              name: 'numberOfChildren',
              type: 'select',
              label: 'Number of Children',
              required: true,
              options: [
                { value: '0', label: '0' },
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3_plus', label: '3+' },
              ],
              subsection: { id: 'test', label: 'Test' },
            },
            {
              name: 'childrenBirthYears',
              type: 'object',
              label: 'Children Birth Years',
              required: false,
              showWhen: { field: 'numberOfChildren', in: ['1', '2', '3_plus'] },
              subsection: { id: 'test', label: 'Test' },
            },
            {
              name: 'maritalStatus',
              type: 'select',
              label: 'Marital Status',
              required: true,
              options: [
                { value: 'single', label: 'Single' },
                { value: 'married', label: 'Married' },
                { value: 'cohabiting', label: 'Cohabiting' },
                { value: 'pacs', label: 'PACS' },
              ],
              subsection: { id: 'test', label: 'Test' },
            },
            {
              name: 'spouseHasLicense',
              type: 'select',
              label: 'Spouse Has License',
              required: false,
              showWhen: { field: 'maritalStatus', in: ['married', 'cohabiting', 'pacs'] },
              options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ],
              subsection: { id: 'test', label: 'Test' },
            },
          ],
        },
      ],
    };
    console.log('Mock form definition:', JSON.stringify(mockDefinition, null, 2));
    return mockDefinition;
  },
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

describe('FormView Component', () => {
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

  describe('Basic Rendering', () => {
    it('should render form with correct title', () => {
      renderFormView({});

      expect(screen.getByText('Formulaire de comparaison')).toBeInTheDocument();
    });

    it('should render progress bar', () => {
      renderFormView({});

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render wizard navigation buttons', () => {
      renderFormView({});

      expect(screen.getByRole('button', { name: /suivant/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /précédent/i })).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderFormView({});

      expect(screen.getByRole('button', { name: /calculer/i })).toBeInTheDocument();
    });

    it('should render all visible fields initially', () => {
      renderFormView({});

      expect(screen.getByLabelText('Has Secondary Driver')).toBeInTheDocument();
      expect(screen.getByLabelText('Usage Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Number of Children')).toBeInTheDocument();
      expect(screen.getByLabelText('Marital Status')).toBeInTheDocument();
    });
  });

  describe('Form Field Rendering', () => {
    it('should render checkbox fields correctly', () => {
      renderFormView({});

      const checkbox = screen.getByLabelText('Has Secondary Driver');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('should render select fields with options', () => {
      renderFormView({});

      const usageTypeSelect = screen.getByLabelText('Usage Type');
      expect(usageTypeSelect).toBeInTheDocument();

      expect(screen.getByText('Private Work')).toBeInTheDocument();
      expect(screen.getByText('Private Professional')).toBeInTheDocument();
      expect(screen.getByText('Private Tours')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });

    it('should render text fields with correct attributes', () => {
      renderFormView({ hasSecondaryDriver: true });

      const textField = screen.getByLabelText('Secondary Driver Name');
      expect(textField).toBeInTheDocument();
      expect(textField).toHaveAttribute('type', 'text');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const submitButton = screen.getByRole('button', { name: /calculer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Veuillez remplir tous les champs requis')).toBeInTheDocument();
      });
    });

    it('should validate required fields on blur', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const usageTypeSelect = screen.getByLabelText('Usage Type');
      await user.click(usageTypeSelect);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });
    });

    it('should clear validation errors when fields are filled', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // First trigger validation error
      const usageTypeSelect = screen.getByLabelText('Usage Type');
      await user.click(usageTypeSelect);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
      });

      // Then fill the field
      await user.selectOptions(usageTypeSelect, 'private_work');

      await waitFor(() => {
        expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      const validFormData = {
        hasSecondaryDriver: false,
        usageType: 'private_work',
        numberOfChildren: '0',
        maritalStatus: 'single',
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
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      const validFormData = {
        hasSecondaryDriver: false,
        usageType: 'private_work',
        numberOfChildren: '0',
        maritalStatus: 'single',
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

  describe('Wizard Navigation', () => {
    it('should navigate to next step', async () => {
      const user = userEvent.setup();
      renderFormView({});

      const nextButton = screen.getByRole('button', { name: /suivant/i });
      await user.click(nextButton);

      expect(mockSetCurrentStep).toHaveBeenCalledWith(1);
    });

    it('should navigate to previous step', async () => {
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

    it('should disable previous button on first step', () => {
      renderFormView({});

      const previousButton = screen.getByRole('button', { name: /précédent/i });
      expect(previousButton).toBeDisabled();
    });

    it('should update progress bar', () => {
      renderFormView({});

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('Autofill Functionality', () => {
    it('should show autofill prompt when user data is available', () => {
      renderFormView({});

      expect(screen.getByText('Remplir automatiquement avec vos données ?')).toBeInTheDocument();
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
  });

  describe('Boolean Comparisons (equals)', () => {
    it('should show secondary driver name field when hasSecondaryDriver is true', async () => {
      renderFormView({ hasSecondaryDriver: true });

      await waitFor(() => {
        expect(screen.getByLabelText('Secondary Driver Name')).toBeInTheDocument();
      });
    });

    it('should hide secondary driver name field when hasSecondaryDriver is false', async () => {
      renderFormView({ hasSecondaryDriver: false });

      await waitFor(() => {
        expect(screen.queryByLabelText('Secondary Driver Name')).not.toBeInTheDocument();
      });
    });

    it('should hide secondary driver name field when hasSecondaryDriver is undefined', async () => {
      renderFormView({});

      await waitFor(() => {
        expect(screen.queryByLabelText('Secondary Driver Name')).not.toBeInTheDocument();
      });
    });
  });

  describe('Array Comparisons (in)', () => {
    it('should show work postal code when usageType is in allowed values', async () => {
      renderFormView({ usageType: 'private_work' });

      await waitFor(() => {
        expect(screen.getByLabelText('Work Postal Code')).toBeInTheDocument();
      });
    });

    it('should show work postal code for private_professional usage', async () => {
      renderFormView({ usageType: 'private_professional' });

      await waitFor(() => {
        expect(screen.getByLabelText('Work Postal Code')).toBeInTheDocument();
      });
    });

    it('should show work postal code for private_tours usage', async () => {
      renderFormView({ usageType: 'private_tours' });

      await waitFor(() => {
        expect(screen.getByLabelText('Work Postal Code')).toBeInTheDocument();
      });
    });

    it('should hide work postal code when usageType is not in allowed values', async () => {
      renderFormView({ usageType: 'other' });

      await waitFor(() => {
        expect(screen.queryByLabelText('Work Postal Code')).not.toBeInTheDocument();
      });
    });

    it('should hide work postal code when usageType is undefined', async () => {
      renderFormView({});

      await waitFor(() => {
        expect(screen.queryByLabelText('Work Postal Code')).not.toBeInTheDocument();
      });
    });
  });

  describe('Mixed Type Array Comparisons', () => {
    it('should show children birth years when numberOfChildren is 1', async () => {
      renderFormView({ numberOfChildren: '1' });

      await waitFor(() => {
        expect(screen.getByLabelText('Children Birth Years')).toBeInTheDocument();
      });
    });

    it('should show children birth years when numberOfChildren is 2', async () => {
      renderFormView({ numberOfChildren: '2' });

      await waitFor(() => {
        expect(screen.getByLabelText('Children Birth Years')).toBeInTheDocument();
      });
    });

    it('should show children birth years when numberOfChildren is 3_plus', async () => {
      renderFormView({ numberOfChildren: '3_plus' });

      await waitFor(() => {
        expect(screen.getByLabelText('Children Birth Years')).toBeInTheDocument();
      });
    });

    it('should hide children birth years when numberOfChildren is 0', async () => {
      renderFormView({ numberOfChildren: '0' });

      await waitFor(() => {
        expect(screen.queryByLabelText('Children Birth Years')).not.toBeInTheDocument();
      });
    });
  });

  describe('Marital Status Conditional Fields', () => {
    it('should show spouse has license when marital status is married', async () => {
      renderFormView({ maritalStatus: 'married' });

      await waitFor(() => {
        expect(screen.getByLabelText('Spouse Has License')).toBeInTheDocument();
      });
    });

    it('should show spouse has license when marital status is cohabiting', async () => {
      renderFormView({ maritalStatus: 'cohabiting' });

      await waitFor(() => {
        expect(screen.getByLabelText('Spouse Has License')).toBeInTheDocument();
      });
    });

    it('should show spouse has license when marital status is pacs', async () => {
      renderFormView({ maritalStatus: 'pacs' });

      await waitFor(() => {
        expect(screen.getByLabelText('Spouse Has License')).toBeInTheDocument();
      });
    });

    it('should hide spouse has license when marital status is single', async () => {
      renderFormView({ maritalStatus: 'single' });

      await waitFor(() => {
        expect(screen.queryByLabelText('Spouse Has License')).not.toBeInTheDocument();
      });
    });
  });

  describe('Dynamic Field Visibility Updates', () => {
    it('should show/hide fields when form data changes', async () => {
      const user = userEvent.setup();
      renderFormView({});

      // Initially, secondary driver name should be hidden
      await waitFor(() => {
        expect(screen.queryByLabelText('Secondary Driver Name')).not.toBeInTheDocument();
      });

      // Check the hasSecondaryDriver checkbox
      const hasSecondaryDriverCheckbox = screen.getByLabelText('Has Secondary Driver');
      await user.click(hasSecondaryDriverCheckbox);

      // Should trigger updateFormField
      expect(mockUpdateFormField).toHaveBeenCalledWith('hasSecondaryDriver', true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined dependency values gracefully', async () => {
      renderFormView({ hasSecondaryDriver: undefined });

      await waitFor(() => {
        expect(screen.queryByLabelText('Secondary Driver Name')).not.toBeInTheDocument();
      });
    });

    it('should handle null dependency values gracefully', async () => {
      renderFormView({ hasSecondaryDriver: null });

      await waitFor(() => {
        expect(screen.queryByLabelText('Secondary Driver Name')).not.toBeInTheDocument();
      });
    });

    it('should show fields without showWhen conditions', async () => {
      renderFormView({});

      await waitFor(() => {
        expect(screen.getByLabelText('Has Secondary Driver')).toBeInTheDocument();
        expect(screen.getByLabelText('Usage Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Number of Children')).toBeInTheDocument();
        expect(screen.getByLabelText('Marital Status')).toBeInTheDocument();
      });
    });
  });

  describe('Complex Conditional Logic', () => {
    it('should handle multiple conditions correctly', async () => {
      // Test with multiple fields having different conditions
      renderFormView({
        hasSecondaryDriver: true,
        usageType: 'private_work',
        numberOfChildren: '2',
        maritalStatus: 'married',
      });

      await waitFor(() => {
        // All conditional fields should be visible
        expect(screen.getByLabelText('Secondary Driver Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Work Postal Code')).toBeInTheDocument();
        expect(screen.getByLabelText('Children Birth Years')).toBeInTheDocument();
        expect(screen.getByLabelText('Spouse Has License')).toBeInTheDocument();
      });
    });

    it('should handle partial conditions correctly', async () => {
      // Test with some conditions met, others not
      renderFormView({
        hasSecondaryDriver: false,
        usageType: 'other',
        numberOfChildren: '0',
        maritalStatus: 'single',
      });

      await waitFor(() => {
        // No conditional fields should be visible
        expect(screen.queryByLabelText('Secondary Driver Name')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Work Postal Code')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Children Birth Years')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Spouse Has License')).not.toBeInTheDocument();
      });
    });
  });
});
