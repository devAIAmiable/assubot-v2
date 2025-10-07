import type { ContractProcessedEvent, CreditUpdateEvent, SocketEventHandlers } from '../services/socketService';
import { useCallback, useEffect, useRef } from 'react';

import { showToast } from '../components/ui/Toast';
import { socketService } from '../services/socketService';
import { updateCredits } from '../store/userSlice';
import { useAppSelector } from '../store/hooks';
import { useDispatch } from 'react-redux';

interface UseRealtimeUpdatesOptions {
  onContractProcessed?: (data: ContractProcessedEvent) => void;
  onCreditUpdate?: (data: CreditUpdateEvent) => void;
  enableNotifications?: boolean;
}

interface ContractProcessingState {
  contractId: string;
  status: 'processing' | 'completed' | 'failed';
  startTime: number;
}

export const useRealtimeUpdates = (options: UseRealtimeUpdatesOptions = {}) => {
  const dispatch = useDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const processingContractsRef = useRef<Map<string, ContractProcessingState>>(new Map());

  const { onContractProcessed, onCreditUpdate, enableNotifications = true } = options;

  // Handle contract processing events
  const handleContractProcessed = useCallback(
    (data: ContractProcessedEvent) => {
      const { contractId, status, credits, error } = data;

      if (status === 'success') {
        // Update processing state to completed
        processingContractsRef.current.set(contractId, {
          contractId,
          status: 'completed',
          startTime: processingContractsRef.current.get(contractId)?.startTime ?? Date.now(),
        });

        // Update credits if provided
        if (credits !== undefined) {
          dispatch(updateCredits(credits));
        }

        // Show success toast
        if (enableNotifications) {
          showToast.success('Résumé du contrat généré avec succès !');
        }

        // Trigger contract refetch by calling custom handler
        onContractProcessed?.(data);
      } else if (status === 'error') {
        // Update processing state to failed
        processingContractsRef.current.set(contractId, {
          contractId,
          status: 'failed',
          startTime: processingContractsRef.current.get(contractId)?.startTime ?? Date.now(),
        });

        // Show error toast
        if (enableNotifications) {
          showToast.error(error || 'Échec de la génération du résumé du contrat');
        }

        // Call custom handler for error case
        onContractProcessed?.(data);
      }
    },
    [dispatch, onContractProcessed, enableNotifications]
  );

  // Handle credit update events
  const handleCreditUpdate = useCallback(
    (data: CreditUpdateEvent) => {
      const { userId, newBalance, operation, amount } = data;

      // Only update if it's for the current user
      if (currentUser && userId === currentUser.id) {
        dispatch(updateCredits(newBalance));

        // Show notifications if enabled
        if (enableNotifications) {
          switch (operation) {
            case 'consumed':
              showToast.info(`Crédits utilisés: -${amount}. Nouveau solde: ${newBalance}`);
              break;
            case 'purchased':
              showToast.success(`Crédits achetés: +${amount}. Nouveau solde: ${newBalance}`);
              break;
            case 'refunded':
              showToast.success(`Crédits remboursés: +${amount}. Nouveau solde: ${newBalance}`);
              break;
          }
        }
      }

      // Call custom handler if provided
      onCreditUpdate?.(data);
    },
    [dispatch, currentUser, onCreditUpdate, enableNotifications]
  );

  // Handle connection events
  const handleConnect = useCallback(() => {
    // Connection established - no toast needed
  }, []);

  const handleDisconnect = useCallback(() => {}, []);

  const handleError = useCallback((error: Error) => {
    console.error('Socket error in useRealtimeUpdates:', error);
  }, []);

  // Setup socket event handlers (but don't connect - RealTimeProvider handles that)
  useEffect(() => {
    // Only set handlers if they're provided in options
    // This prevents multiple components from overwriting each other's handlers
    const handlers: SocketEventHandlers = {};

    if (onContractProcessed) {
      handlers.onContractProcessed = handleContractProcessed;
    }
    if (onCreditUpdate) {
      handlers.onCreditUpdate = handleCreditUpdate;
    }

    // Always set these global handlers (but they won't duplicate since we replace)
    handlers.onConnect = handleConnect;
    handlers.onDisconnect = handleDisconnect;
    handlers.onError = handleError;

    socketService.setEventHandlers(handlers);

    // Don't cleanup handlers on unmount since other components might be using them
    // RealTimeProvider will handle the connection lifecycle
  }, [handleContractProcessed, handleCreditUpdate, handleConnect, handleDisconnect, handleError, onContractProcessed, onCreditUpdate]);

  // Get processing status for a specific contract
  const getContractProcessingStatus = useCallback((contractId: string): 'processing' | 'completed' | 'failed' | null => {
    const state = processingContractsRef.current.get(contractId);
    return state ? state.status : null;
  }, []);

  // Check if a contract is currently being processed
  const isContractProcessing = useCallback((contractId: string): boolean => {
    const state = processingContractsRef.current.get(contractId);
    return state?.status === 'processing' || false;
  }, []);

  // Clear processing state for a contract
  const clearContractProcessing = useCallback((contractId: string): void => {
    processingContractsRef.current.delete(contractId);
  }, []);

  // Clear all processing states
  const clearAllProcessingStates = useCallback((): void => {
    processingContractsRef.current.clear();
  }, []);

  // Get connection status
  const connectionStatus = socketService.getConnectionStatus();
  const isConnected = socketService.isConnected();

  // Manual reconnection
  const reconnect = useCallback(() => {
    socketService.reconnect();
  }, []);

  return {
    // Connection status
    connectionStatus,
    isConnected,
    reconnect,

    // Contract processing
    getContractProcessingStatus,
    isContractProcessing,
    clearContractProcessing,
    clearAllProcessingStates,

    // Processing contracts count
    processingContractsCount: processingContractsRef.current.size,
  };
};
