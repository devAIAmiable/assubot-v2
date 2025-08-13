import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import ProfileCompletionGuard from './ProfileCompletionGuard';
import React from 'react';
// Import after mocking
import { useAppSelector } from '../store/hooks';

// Mock Redux hooks
vi.mock('../store/hooks', () => ({
	useAppSelector: vi.fn(),
}));


// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		Navigate: ({ to }: { to: string }) => {
			mockNavigate(to);
			return <div data-testid="navigate" data-to={to}>Redirecting to {to}</div>;
		},
		useLocation: () => ({ pathname: '/app/dashboard' }),
	};
});

// Mock Redux hooks
vi.mock('../store/hooks', () => ({
	useAppSelector: vi.fn(),
}));


const renderWithProviders = (component: React.ReactElement) => {
	return render(
		<BrowserRouter>
			{component}
		</BrowserRouter>
	);
};

describe('ProfileCompletionGuard', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should redirect to profile when user has incomplete profile', () => {
		// Mock the user state
		vi.mocked(useAppSelector).mockReturnValue({
			currentUser: {
				id: '1',
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				// Missing required fields
				birthDate: undefined,
				gender: undefined,
				professionalCategory: undefined,
			},
			isAuthenticated: true,
			loading: false,
			error: null,
			loginAttempts: 0,
		});

		renderWithProviders(
			<ProfileCompletionGuard>
				<div>Dashboard Content</div>
			</ProfileCompletionGuard>
		);

		expect(mockNavigate).toHaveBeenCalledWith('/app/profil');
		expect(screen.getByTestId('navigate')).toBeInTheDocument();
	});

	it('should redirect when user has partially complete profile', () => {
		// Mock the user state
		vi.mocked(useAppSelector).mockReturnValue({
			currentUser: {
				id: '1',
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				// Partially complete - missing some required fields
				birthDate: '1990-01-01',
				gender: undefined, // Missing
				professionalCategory: 'student',
			},
			isAuthenticated: true,
			loading: false,
			error: null,
			loginAttempts: 0,
		});

		renderWithProviders(
			<ProfileCompletionGuard>
				<div>Dashboard Content</div>
			</ProfileCompletionGuard>
		);

		expect(mockNavigate).toHaveBeenCalledWith('/app/profil');
		expect(screen.getByTestId('navigate')).toBeInTheDocument();
	});

	it('should not redirect when user has complete profile', () => {
		// Mock the user state
		vi.mocked(useAppSelector).mockReturnValue({
			currentUser: {
				id: '1',
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				// All required fields are present
				birthDate: '1990-01-01',
				gender: 'male',
				professionalCategory: 'student',
			},
			isAuthenticated: true,
			loading: false,
			error: null,
			loginAttempts: 0,
		});

		renderWithProviders(
			<ProfileCompletionGuard>
				<div>Dashboard Content</div>
			</ProfileCompletionGuard>
		);

		expect(mockNavigate).not.toHaveBeenCalled();
		expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
	});

	it('should not redirect when user has complete profile', () => {
		// Mock the user state
		vi.mocked(useAppSelector).mockReturnValue({
			currentUser: {
				id: '1',
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				isFirstLogin: true,
				isGoogleAccount: true,
				// All required fields are present
				birthDate: '1990-01-01',
				gender: 'male',
				professionalCategory: 'student',
				address: '123 Main St',
				city: 'Paris',
				zip: '75001',
			},
			isAuthenticated: true,
			loading: false,
			error: null,
			loginAttempts: 0,
		});

		renderWithProviders(
			<ProfileCompletionGuard>
				<div>Dashboard Content</div>
			</ProfileCompletionGuard>
		);

		expect(mockNavigate).not.toHaveBeenCalled();
		expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
	});
});
