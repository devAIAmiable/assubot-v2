import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { Provider } from 'react-redux';
import { authService } from '../services/coreApi';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';

// Mock the authService
vi.mocked(authService.login).mockResolvedValue({
	success: true,
	data: { 
		user: { id: '1', email: 'test@example.com', firstName: 'Jean', lastName: 'Dupont', isFirstLogin: false },
		message: 'Connexion réussie'
	},
});

vi.mocked(authService.getUserProfile).mockResolvedValue({
	success: true,
	data: {
		user: {
			id: '1',
			email: 'test@example.com',
			firstName: 'Jean',
			lastName: 'Dupont',
			profession: 'student',
			provider: 'email',
			isFirstLogin: false,
			isActive: true,
			isVerified: true,
			acceptedTerms: true,
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-01T00:00:00Z',
		},
		message: 'Profile retrieved successfully',
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

describe('LoginForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Email Verification Error Handling', () => {
		it('should show French error message for unverified email', async () => {
			// Mock login failure due to unverified email
			vi.mocked(authService.login).mockResolvedValueOnce({
				success: false,
				error: 'Veuillez vérifier votre adresse email avant de vous connecter',
			});

			const user = userEvent.setup();
			renderWithProviders(<LoginForm />);

			// Fill login form
			await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
			await user.type(screen.getByLabelText('Mot de passe'), 'password123');

			// Submit form
			await user.click(screen.getByRole('button', { name: 'Se connecter' }));

			await waitFor(() => {
				expect(screen.getByText('Veuillez vérifier votre adresse email avant de vous connecter')).toBeInTheDocument();
			});
		});

		it('should show French error message for invalid credentials', async () => {
			// Mock login failure due to invalid credentials
			vi.mocked(authService.login).mockResolvedValueOnce({
				success: false,
				error: 'Email ou mot de passe incorrect',
			});

			const user = userEvent.setup();
			renderWithProviders(<LoginForm />);

			// Fill login form
			await user.type(screen.getByLabelText(/adresse email/i), 'wrong@example.com');
			await user.type(screen.getByLabelText('Mot de passe'), 'wrongpassword');

			// Submit form
			await user.click(screen.getByRole('button', { name: 'Se connecter' }));

			await waitFor(() => {
				expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument();
			});
		});

		it('should show French error message for server error', async () => {
			// Mock login failure due to server error
			vi.mocked(authService.login).mockResolvedValueOnce({
				success: false,
				error: 'Erreur de connexion au serveur',
			});

			const user = userEvent.setup();
			renderWithProviders(<LoginForm />);

			// Fill login form
			await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
			await user.type(screen.getByLabelText('Mot de passe'), 'password123');

			// Submit form
			await user.click(screen.getByRole('button', { name: 'Se connecter' }));

			await waitFor(() => {
				expect(screen.getByText('Erreur de connexion au serveur')).toBeInTheDocument();
			});
		});

		it('should show French error message for network error', async () => {
			// Mock login failure due to network error
			vi.mocked(authService.login).mockResolvedValueOnce({
				success: false,
				error: 'Erreur de connexion réseau',
			});

			const user = userEvent.setup();
			renderWithProviders(<LoginForm />);

			// Fill login form
			await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
			await user.type(screen.getByLabelText('Mot de passe'), 'password123');

			// Submit form
			await user.click(screen.getByRole('button', { name: 'Se connecter' }));

			await waitFor(() => {
				expect(screen.getByText('Erreur de connexion réseau')).toBeInTheDocument();
			});
		});
	});

	describe('Form Validation', () => {


		it('should show error for empty password', async () => {
			const user = userEvent.setup();
			renderWithProviders(<LoginForm />);

			await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
			// Don't type password

			// Submit form
			await user.click(screen.getByRole('button', { name: 'Se connecter' }));

			await waitFor(() => {
				expect(screen.getByText('Le mot de passe est requis')).toBeInTheDocument();
			});
		});
	});

	describe('Successful Login', () => {
		it('should handle successful login', async () => {
			const user = userEvent.setup();
			renderWithProviders(<LoginForm />);

			// Fill login form
			await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
			await user.type(screen.getByLabelText('Mot de passe'), 'password123');

			// Submit form
			await user.click(screen.getByRole('button', { name: 'Se connecter' }));

			await waitFor(() => {
				expect(authService.login).toHaveBeenCalledWith({
					email: 'test@example.com',
					password: 'password123',
				});
			});
		});
	});

	describe('Password Visibility Toggle', () => {
		it('should toggle password visibility', async () => {
			const user = userEvent.setup();
			renderWithProviders(<LoginForm />);

			const passwordInput = screen.getByLabelText('Mot de passe');
			const toggleButton = screen.getByRole('button', { name: /afficher le mot de passe/i });

			// Password should be hidden by default
			expect(passwordInput).toHaveAttribute('type', 'password');

			// Click toggle to show password
			await user.click(toggleButton);
			expect(passwordInput).toHaveAttribute('type', 'text');

			// Click toggle to hide password again
			await user.click(toggleButton);
			expect(passwordInput).toHaveAttribute('type', 'password');
		});
	});

	describe('Loading States', () => {
		it('should show loading state during login', async () => {
			// Mock a delayed login response
			vi.mocked(authService.login).mockImplementationOnce(
				() => new Promise((resolve) => setTimeout(() => resolve({
					success: true,
					data: { 
						user: { id: '1', email: 'test@example.com', firstName: 'Jean', lastName: 'Dupont', isFirstLogin: false },
						message: 'Connexion réussie'
					},
				}), 100))
			);

			const user = userEvent.setup();
			renderWithProviders(<LoginForm />);

			// Fill login form
			await user.type(screen.getByLabelText(/adresse email/i), 'test@example.com');
			await user.type(screen.getByLabelText('Mot de passe'), 'password123');

			// Submit form
			await user.click(screen.getByRole('button', { name: 'Se connecter' }));

			// Should show loading state
			expect(screen.getByText('Connexion...')).toBeInTheDocument();
		});
	});
});
