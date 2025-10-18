import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import ContractSummarizationStatus from '../components/ui/ContractSummarizationStatus';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { socketService } from '../services/socketService';
import { useRealtimeUpdates } from '../hooks/useRealtimeUpdates';
import userSlice from '../store/userSlice';

// Mock Socket.IO
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
  })),
}));

// Mock the socket service
vi.mock('../services/socketService', () => ({
  socketService: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    isConnected: vi.fn(() => false),
    getConnectionStatus: vi.fn(() => 'disconnected'),
    setEventHandlers: vi.fn(),
    clearEventHandlers: vi.fn(),
    reconnect: vi.fn(),
  },
}));

// Mock the API service
vi.mock('../services/coreApi', () => ({
  userService: {
    getCredits: vi.fn().mockResolvedValue({
      success: true,
      data: { credits: 100 },
    }),
  },
}));

// Mock the toast
vi.mock('../components/ui/Toast', () => ({
  showToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Test component that uses the hook
const TestComponent = () => {
  const { connectionStatus, isConnected } = useRealtimeUpdates();
  return (
    <div>
      <div data-testid="connection-status">{connectionStatus}</div>
      <div data-testid="is-connected">{isConnected.toString()}</div>
    </div>
  );
};

describe('Real-time Updates', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userSlice,
      },
      preloadedState: {
        user: {
          currentUser: {
            id: '1',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            creditBalance: 100,
            isFirstLogin: false,
          },
          isAuthenticated: true,
          loading: false,
          error: null,
          loginAttempts: 0,
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize real-time updates hook', () => {
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );

    expect(screen.getByTestId('connection-status')).toBeInTheDocument();
    expect(screen.getByTestId('is-connected')).toBeInTheDocument();
  });

  it('should render contract summarization status component with pending status', () => {
    render(
      <Provider store={store}>
        <ContractSummarizationStatus summarizeStatus="pending" />
      </Provider>
    );

    // Should show pending status
    expect(screen.getByText('Résumé en attente')).toBeInTheDocument();
  });

  it('should render contract summarization status component with ongoing status', () => {
    render(
      <Provider store={store}>
        <ContractSummarizationStatus summarizeStatus="ongoing" />
      </Provider>
    );

    // Should show ongoing status
    expect(screen.getByText('Génération du résumé...')).toBeInTheDocument();
  });

  it('should not render anything when no status is provided', () => {
    const { container } = render(
      <Provider store={store}>
        <ContractSummarizationStatus />
      </Provider>
    );

    // Should not render anything
    expect(container.firstChild).toBeNull();
  });
});

describe('Socket.IO Integration', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userSlice,
      },
      preloadedState: {
        user: {
          currentUser: {
            id: '1',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            creditBalance: 100,
            isFirstLogin: false,
          },
          isAuthenticated: true,
          loading: false,
          error: null,
          loginAttempts: 0,
        },
      },
    });
  });

  it('should call socket service methods on initialization', () => {
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );

    expect(socketService.setEventHandlers).toHaveBeenCalled();
  });

  it('should handle connection status changes', async () => {
    // Mock connected state
    vi.mocked(socketService.isConnected).mockReturnValue(true);
    vi.mocked(socketService.getConnectionStatus).mockReturnValue('connected');

    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-connected')).toHaveTextContent('true');
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });
  });
});
