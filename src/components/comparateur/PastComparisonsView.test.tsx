import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ComparisonSession } from '../../types/comparison';
import PastComparisonsView from './PastComparisonsView';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mockUser } from '../../test/mocks';

// Mock the comparison API
const mockUseGetComparisonSessionsQuery = vi.fn();

vi.mock('../../store/comparisonApi', () => ({
  useGetComparisonSessionsQuery: (params: unknown) => mockUseGetComparisonSessionsQuery(params),
}));

// Mock react-router navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<unknown>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
  },
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      user: () => ({ currentUser: mockUser }),
    },
  });
};

const mockSessions: ComparisonSession[] = [
  {
    id: 'session-1',
    userId: 'user-1',
    category: 'auto',
    status: 'completed',
    formData: { make: 'BMW', model: 'X4' },
    resultOfferIds: ['offer-1', 'offer-2', 'offer-3'],
    includeUserContract: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'session-2',
    userId: 'user-1',
    category: 'home',
    status: 'active',
    formData: { propertyType: 'apartment' },
    resultOfferIds: ['offer-4', 'offer-5'],
    includeUserContract: false,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const defaultMockData = {
  sessions: mockSessions,
  total: 2,
};

describe('PastComparisonsView', () => {
  const mockSetCurrentStep = vi.fn();
  const mockSetSelectedType = vi.fn();
  const mockSetFormData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGetComparisonSessionsQuery.mockReturnValue({
      data: defaultMockData,
      isLoading: false,
      error: null,
    });
  });

  it('should render loading state', () => {
    mockUseGetComparisonSessionsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    expect(screen.getByText('Chargement des comparaisons...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    mockUseGetComparisonSessionsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 'FETCH_ERROR', error: 'Network error' },
    });

    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
  });

  it('should render empty state when no sessions', () => {
    mockUseGetComparisonSessionsQuery.mockReturnValue({
      data: { sessions: [], total: 0 },
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    expect(screen.getByText('Aucune comparaison précédente')).toBeInTheDocument();
    expect(screen.getByText('Commencez votre première comparaison pour trouver la meilleure assurance.')).toBeInTheDocument();
  });

  it('should render sessions list when data is available', () => {
    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    expect(screen.getByText('Comparaisons récentes')).toBeInTheDocument();
    expect(screen.getByText('Auto')).toBeInTheDocument();
    expect(screen.getByText('Habitation')).toBeInTheDocument();
    expect(screen.getByText('3 offres trouvées')).toBeInTheDocument();
    expect(screen.getByText('2 offres trouvées')).toBeInTheDocument();
  });

  it('should render filters when sessions exist', () => {
    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    expect(screen.getByText('Toutes les catégories')).toBeInTheDocument();
    expect(screen.getByText('Tous les statuts')).toBeInTheDocument();
  });

  it('should navigate to session results on click', async () => {
    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    const sessionCard = screen.getByText('Auto').closest('div[class*="cursor-pointer"]');
    expect(sessionCard).toBeInTheDocument();

    if (sessionCard) {
      await userEvent.click(sessionCard);
      expect(mockNavigate).toHaveBeenCalledWith('/app/comparateur/session-1/resultats');
    }
  });

  it('should filter by category', async () => {
    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    const categorySelect = screen.getByDisplayValue('Toutes les catégories');
    await userEvent.selectOptions(categorySelect, 'auto');

    await waitFor(() => {
      expect(mockUseGetComparisonSessionsQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'auto',
        })
      );
    });
  });

  it('should filter by status', async () => {
    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    const statusSelect = screen.getByDisplayValue('Tous les statuts');
    await userEvent.selectOptions(statusSelect, 'completed');

    await waitFor(() => {
      expect(mockUseGetComparisonSessionsQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'completed',
        })
      );
    });
  });

  it('should handle pagination', async () => {
    mockUseGetComparisonSessionsQuery.mockReturnValue({
      data: {
        sessions: mockSessions,
        total: 10, // More than one page (4 items per page)
      },
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    // Wait for pagination to appear
    await waitFor(() => {
      expect(screen.getAllByRole('button').some((btn) => btn.textContent === '2')).toBe(true);
    });

    const nextPageButton = screen.getAllByRole('button').find((btn) => btn.textContent === '2');
    expect(nextPageButton).toBeInTheDocument();

    if (nextPageButton) {
      await userEvent.click(nextPageButton);
      await waitFor(() => {
        expect(mockUseGetComparisonSessionsQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            offset: 4, // Second page: (2-1) * 4 = 4
          })
        );
      });
    }
  });

  it('should show expiration warning for sessions expiring soon', () => {
    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    // Session 2 expires in 2 days, should show warning
    expect(screen.getByText(/Expire dans 2 jour/)).toBeInTheDocument();
  });

  it('should display status badges correctly', () => {
    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={mockUser} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    expect(screen.getByText('Terminée')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should handle user without firstName', () => {
    render(
      <Provider store={createMockStore()}>
        <PastComparisonsView user={null} setCurrentStep={mockSetCurrentStep} setSelectedType={mockSetSelectedType} setFormData={mockSetFormData} />
      </Provider>
    );

    expect(screen.getByText(/retrouvez vos comparaisons précédentes/i)).toBeInTheDocument();
    expect(screen.queryByText(mockUser.firstName)).not.toBeInTheDocument();
  });
});
