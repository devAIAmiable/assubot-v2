/**
 * Utility functions for handling authentication-related actions
 * Can be used outside of React components by directly accessing the store
 */

import { clearComparisons } from '../store/comparisonsSlice';
import { clearContracts } from '../store/contractsSlice';
import { clearCurrentChat } from '../store/chatSlice';
import { logoutSuccess } from '../store/userSlice';
import { store } from '../store/index';

/**
 * Handles automatic logout when a 401 Unauthorized error occurs on non-auth endpoints
 * This clears all user-related state without calling the logout API endpoint
 * to avoid potential recursion issues.
 */
export const handleUnauthorizedLogout = (): void => {
  const dispatch = store.dispatch;

  // Clear user authentication state
  dispatch(logoutSuccess());

  // Clear all user-related data
  dispatch(clearContracts());
  dispatch(clearCurrentChat());
  dispatch(clearComparisons());
};
