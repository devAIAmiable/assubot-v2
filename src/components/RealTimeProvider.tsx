import type { ContractProcessedEvent, CreditUpdateEvent } from '../services/socketService';

import { showToast } from './ui/Toast';
import { socketService } from '../services/socketService';
import { stopProcessing } from '../store/contractProcessingSlice';
import { updateCredits } from '../store/userSlice';
import { useAppSelector } from '../store/hooks';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

interface RealTimeProviderProps {
  children: React.ReactNode;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const currentUser = useAppSelector((state) => state.user.currentUser);

  // Initialize socket service with event handlers ONCE on mount
  useEffect(() => {
    console.log('🔌 Initializing socket service...');

    // Set up event handlers
    socketService.setEventHandlers({
      onContractProcessed: (data: ContractProcessedEvent) => {
        console.log('🔔 RealTimeProvider handling contract_processed:', data);
        const { contractId, status, credits, error } = data;

        // Stop the loading state for this contract
        dispatch(stopProcessing(contractId));

        if (status === 'success') {
          // Update credits if provided
          if (credits !== undefined) {
            dispatch(updateCredits(credits));
          }
          // Show success toast
          showToast.success('Résumé du contrat généré avec succès !');
        } else if (status === 'error') {
          // Show error toast
          showToast.error(error || 'Échec de la génération du résumé du contrat');
        }

        // Dispatch custom event for components that need to react to contract processing
        console.log('📢 Dispatching window event for contract:', contractId);
        const customEvent = new CustomEvent('contract_processed', {
          detail: { contractId, status, credits, error },
        });
        window.dispatchEvent(customEvent);
      },
      onCreditUpdate: (data: CreditUpdateEvent) => {
        const { userId, newBalance, operation, amount } = data;

        // Get current user from Redux store directly
        const state = (dispatch as { getState?: () => { user?: { currentUser?: { id?: string } } } }).getState?.();
        const currentUserId = state?.user?.currentUser?.id;

        // Only update if it's for the current user
        if (currentUserId && userId === currentUserId) {
          dispatch(updateCredits(newBalance));

          // Show notification
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
      },
      onConnect: () => {
        console.log('✅ Socket connected');
      },
      onDisconnect: (reason) => {
        console.log('❌ Socket disconnected:', reason);
      },
      onError: (error) => {
        console.error('❌ Socket error:', error);
      },
    });

    // Cleanup on unmount (when app closes)
    return () => {
      console.log('🔌 Cleaning up socket service...');
      socketService.disconnect();
      socketService.clearEventHandlers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - runs ONLY ONCE on mount

  // Connect/disconnect socket based on authentication status
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Connect to socket when user is authenticated
      if (!socketService.isConnected()) {
        console.log('🔐 User authenticated - connecting socket...');
        socketService.connect();
      }
    } else {
      // Disconnect when user is not authenticated
      if (socketService.isConnected()) {
        console.log('🔓 User not authenticated - disconnecting socket...');
        socketService.disconnect();
      }
    }
  }, [isAuthenticated, currentUser]);

  return <>{children}</>;
};

export default RealTimeProvider;
