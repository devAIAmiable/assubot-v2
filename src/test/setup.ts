import '@testing-library/jest-dom';

import React from 'react';
import { vi } from 'vitest';

// Mock React Router
vi.mock('react-router-dom', () => ({
	useNavigate: () => vi.fn(),
	useLocation: () => ({ state: {} }),
	Link: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) =>
		React.createElement('a', props, children),
	BrowserRouter: ({ children }: { children: React.ReactNode }) =>
		React.createElement('div', {}, children),
}));

// Mock Redux
vi.mock('../store/hooks', () => ({
	useAppDispatch: () => vi.fn(),
	useAppSelector: vi.fn(),
}));

// Mock services
vi.mock('../services/coreApi', () => ({
	authService: {
		signup: vi.fn(),
		login: vi.fn(),
		getUserProfile: vi.fn(),
	},
}));

// Mock hooks
vi.mock('../hooks/useGoogleAuth', () => ({
	useGoogleAuth: () => ({
		handleGoogleSignup: vi.fn(),
		handleGoogleLogin: vi.fn(),
		isLoading: false,
	}),
}));
