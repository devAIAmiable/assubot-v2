import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import SignupForm from './SignupForm';
import { authService } from '../services/coreApi';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';

// Mock the authService
vi.mocked(authService.signup).mockResolvedValue({
  success: true,
  data: {
    user: { id: '1', email: 'test@example.com' },
    message: 'Account created successfully',
  },
});

// Create a mock store
const mockStore = configureStore({
  reducer: {
    user: (state = {}) => state,
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Password Requirements Display', () => {
    it('should display password fields', () => {
      renderWithProviders(<SignupForm />);

      // Password fields are rendered
      expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument();
    });
  });

  describe('Age Validation', () => {
    it('should reject users under 18 years old', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      // Fill step 1
      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'ValidPass1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPass1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Go to step 2
      await user.click(screen.getByText('Continuer'));

      // Fill personal info with underage date
      await user.type(screen.getByLabelText('Prénom'), 'Jean');
      await user.type(screen.getByLabelText('Nom'), 'Dupont');

      // Set birth date to make user 17 years old (born in 2008, current year 2025)
      const birthDateInput = screen.getByLabelText(/date de naissance/i);
      await user.clear(birthDateInput);
      await user.type(birthDateInput, '2008-08-10');

      // Try to submit
      await user.click(screen.getByText('Créer mon compte'));

      await waitFor(() => {
        expect(screen.getByText('Vous devez avoir au moins 18 ans pour créer un compte')).toBeInTheDocument();
      });
    });

    it('should accept users who are exactly 18 years old', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      // Fill step 1
      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'ValidPass1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPass1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Go to step 2
      await user.click(screen.getByText('Continuer'));

      // Fill personal info with exactly 18 years old
      await user.type(screen.getByLabelText('Prénom'), 'Jean');
      await user.type(screen.getByLabelText('Nom'), 'Dupont');

      // Set birth date to make user exactly 18 years old
      const birthDateInput = screen.getByLabelText(/date de naissance/i);
      await user.clear(birthDateInput);
      await user.type(birthDateInput, '2007-01-01');

      // Submit should work
      await user.click(screen.getByText('Créer mon compte'));

      await waitFor(() => {
        expect(authService.signup).toHaveBeenCalled();
      });
    });

    it('should accept users over 18 years old', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      // Fill step 1
      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'ValidPass1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPass1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Go to step 2
      await user.click(screen.getByText('Continuer'));

      // Fill personal info with over 18 years old
      await user.type(screen.getByLabelText('Prénom'), 'Jean');
      await user.type(screen.getByLabelText('Nom'), 'Dupont');

      // Set birth date to make user 25 years old
      const birthDateInput = screen.getByLabelText(/date de naissance/i);
      await user.clear(birthDateInput);
      await user.type(birthDateInput, '1999-01-01');

      // Submit should work
      await user.click(screen.getByText('Créer mon compte'));

      await waitFor(() => {
        expect(authService.signup).toHaveBeenCalled();
      });
    });

    it('should show clear error message for age validation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      // Fill step 1
      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'ValidPass1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPass1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Go to step 2
      await user.click(screen.getByText('Continuer'));

      // Fill personal info with underage date
      await user.type(screen.getByLabelText('Prénom'), 'Jean');
      await user.type(screen.getByLabelText('Nom'), 'Dupont');

      // Set birth date to make user 17 years old
      const birthDateInput = screen.getByLabelText(/date de naissance/i);
      await user.clear(birthDateInput);
      await user.type(birthDateInput, '2008-08-10');

      // Try to submit
      await user.click(screen.getByText('Créer mon compte'));

      await waitFor(() => {
        const errorMessage = screen.getByText('Vous devez avoir au moins 18 ans pour créer un compte');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('18 ans');
      });
    });
  });

  describe('Password Validation', () => {
    it('should not show confirm password error when only new password is changed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      // Fill email and password fields
      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'ValidPass123!');

      // The confirm password error should not appear when only password is changed
      expect(screen.queryByText('Les mots de passe ne correspondent pas')).not.toBeInTheDocument();
    });

    it('should show error for password without uppercase letter', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'password1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'password1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Try to continue
      await user.click(screen.getByText('Continuer'));

      await waitFor(() => {
        expect(screen.getByText(/Le mot de passe doit contenir au moins: une majuscule/)).toBeInTheDocument();
      });
    });

    it('should show error for password without lowercase letter', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'PASSWORD1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'PASSWORD1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Try to continue
      await user.click(screen.getByText('Continuer'));

      await waitFor(() => {
        expect(screen.getByText(/Le mot de passe doit contenir au moins: une majuscule/)).toBeInTheDocument();
      });
    });

    it('should show error for password without number', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'Password!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Password!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Try to continue
      await user.click(screen.getByText('Continuer'));

      await waitFor(() => {
        expect(screen.getByText(/Le mot de passe doit contenir au moins: une majuscule/)).toBeInTheDocument();
      });
    });

    it('should show error for password without special character', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'Password1');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Password1');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Try to continue
      await user.click(screen.getByText('Continuer'));

      await waitFor(() => {
        expect(screen.getByText(/Le mot de passe doit contenir au moins: une majuscule/)).toBeInTheDocument();
      });
    });

    it('should show error for password shorter than 8 characters', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'Pass1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Pass1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Try to continue
      await user.click(screen.getByText('Continuer'));

      await waitFor(() => {
        expect(screen.getByText('Le mot de passe doit contenir au moins 8 caractères')).toBeInTheDocument();
      });
    });
  });

  describe('Form Navigation', () => {
    it('should show step 1 initially', () => {
      renderWithProviders(<SignupForm />);

      expect(screen.getByText('Adresse email')).toBeInTheDocument();
      expect(screen.getByText('Mot de passe')).toBeInTheDocument();
      expect(screen.getByText('Confirmer le mot de passe')).toBeInTheDocument();
      expect(screen.queryByText('Prénom')).not.toBeInTheDocument();
    });

    it('should navigate to step 2 when step 1 is valid', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      // Fill step 1
      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'ValidPass1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPass1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Wait for button to be enabled and go to step 2
      const continueButton = screen.getByText('Continuer');
      await waitFor(() => {
        expect(continueButton).not.toBeDisabled();
      });
      await user.click(continueButton);

      await waitFor(() => {
        expect(screen.getByText('Prénom')).toBeInTheDocument();
        expect(screen.getByText('Nom')).toBeInTheDocument();
        expect(screen.getByText('Date de naissance')).toBeInTheDocument();
      });
    });

    it('should go back to step 1 from step 2', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      // Fill step 1 and go to step 2
      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'ValidPass1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPass1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Wait for button to be enabled and go to step 2
      const continueButton = screen.getByText('Continuer');
      await waitFor(() => {
        expect(continueButton).not.toBeDisabled();
      });
      await user.click(continueButton);

      // Go back to step 1
      await user.click(screen.getByText('Retour'));

      await waitFor(() => {
        expect(screen.getByText('Adresse email')).toBeInTheDocument();
        expect(screen.getByText('Mot de passe')).toBeInTheDocument();
      });
    });
  });

  describe('Success Flow', () => {
    it('should show success message after successful signup', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      // Fill step 1
      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'ValidPass1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPass1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Wait for button to be enabled and go to step 2
      const continueButton = screen.getByText('Continuer');
      await waitFor(() => {
        expect(continueButton).not.toBeDisabled();
      });
      await user.click(continueButton);

      // Fill step 2
      await user.type(screen.getByLabelText('Prénom'), 'Jean');
      await user.type(screen.getByLabelText('Nom'), 'Dupont');

      const birthDateInput = screen.getByLabelText(/date de naissance/i);
      await user.clear(birthDateInput);
      await user.type(birthDateInput, '1990-01-01');

      // Submit
      await user.click(screen.getByText('Créer mon compte'));

      await waitFor(() => {
        expect(screen.getByText("Demande d'inscription envoyée !")).toBeInTheDocument();
        expect(screen.getByText(/Si l'adresse email est valide/)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error message when signup fails', async () => {
      vi.mocked(authService.signup).mockResolvedValueOnce({
        success: false,
        error: 'Email déjà utilisé',
      });

      const user = userEvent.setup();
      renderWithProviders(<SignupForm />);

      // Fill step 1
      await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
      await user.type(screen.getByLabelText('Mot de passe'), 'ValidPass1!');
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPass1!');

      // Accept terms
      const termsToggle = screen.getByTestId('terms-toggle');
      await user.click(termsToggle);

      // Wait for button to be enabled and go to step 2
      const continueButton = screen.getByText('Continuer');
      await waitFor(() => {
        expect(continueButton).not.toBeDisabled();
      });
      await user.click(continueButton);

      // Fill step 2
      await user.type(screen.getByLabelText('Prénom'), 'Jean');
      await user.type(screen.getByLabelText('Nom'), 'Dupont');

      const birthDateInput = screen.getByLabelText(/date de naissance/i);
      await user.clear(birthDateInput);
      await user.type(birthDateInput, '1990-01-01');

      // Submit
      await user.click(screen.getByText('Créer mon compte'));

      await waitFor(() => {
        expect(screen.getByText("Une erreur s'est produite. Veuillez réessayer ou contacter le support.")).toBeInTheDocument();
      });
    });
  });
});
