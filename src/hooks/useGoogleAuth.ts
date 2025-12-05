import { loginFailure, loginStart } from '../store/userSlice';
import { trackAccountCreationError, trackLoginError } from '@/services/analytics';

import { authService } from '../services/coreApi';
import { useAppDispatch } from '../store/hooks';
import { useState } from 'react';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleGoogleAuth = async (isSignup = false) => {
    setIsLoading(true);

    if (!isSignup) {
      dispatch(loginStart());
    }

    try {
      // Direct redirect to backend endpoint
      await authService.googleSignup();

      // The redirect happens in the service, so we don't need to handle the response
      // The page will navigate away, so we don't need to set loading to false
    } catch (error) {
      console.error('Google auth init error:', error);
      const errorMessage = 'Erreur de connexion au serveur';
      if (isSignup) {
        console.error('Google signup init error:', errorMessage);
        trackAccountCreationError({
          method: 'google',
          errorMessage,
        });
      } else {
        dispatch(loginFailure(errorMessage));
        trackLoginError({
          method: 'google',
          errorMessage,
        });
      }
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => handleGoogleAuth(false);
  const handleGoogleSignup = () => handleGoogleAuth(true);

  return {
    handleGoogleLogin,
    handleGoogleSignup,
    isLoading,
  };
};
