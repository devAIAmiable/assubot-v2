import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

import { trackAccountCreationSuccess, trackLoginError, trackLoginSuccess } from '@/services/analytics/gtm';

import { authService } from '../services/coreApi';
import { useAppDispatch } from '../store/hooks';
import { loginFailure, loginStart, loginSuccess, type User } from '../store/userSlice';

const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trackGoogleSuccess = (user: { id?: string; isFirstLogin?: boolean }) => {
    trackLoginSuccess({
      method: 'google',
      userId: user.id,
    });

    if (user.isFirstLogin) {
      trackAccountCreationSuccess({
        method: 'google',
        userId: user.id,
      });
    }
  };

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const success = searchParams.get('success');
      const userData = searchParams.get('user');

      if (error) {
        setError("Échec de l'authentification Google");
        trackLoginError({
          method: 'google',
          errorMessage: "Échec de l'authentification Google",
        });
        setLoading(false);
        return;
      }

      // If backend redirects with success and user data
      if (success === 'true' && userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));

          // Prepare user data with computed name
          const userDataWithName = {
            ...user,
            name: `${user.firstName} ${user.lastName}`,
          };

          // Update Redux state with user data
          dispatch(
            loginSuccess({
              user: userDataWithName as User,
              lastLoginAt: new Date().toISOString(),
            })
          );

          trackGoogleSuccess(user);

          // Check if this is a first-time login (Google or regular)
          if (user.isFirstLogin) {
            // Redirect to profile page for first-time users
            navigate('/app/profil', { replace: true });
          } else {
            // Redirect to dashboard for existing users
            navigate('/app', { replace: true });
          }
          return;
        } catch (err) {
          console.error('Error parsing user data:', err);
          trackLoginError({
            method: 'google',
            errorMessage: 'Erreur lors de la récupération des informations utilisateur',
          });
        }
      }

      // Fallback: try to check auth status from backend
      if (code) {
        dispatch(loginStart());

        try {
          const authResponse = await authService.checkGoogleAuthStatus();

          if (authResponse.success && authResponse.data?.user) {
            // Get the full user profile
            const profileResponse = await authService.getUserProfile();

            if (profileResponse.success && profileResponse.data?.user) {
              // Prepare user data with computed name and map profession to professionalCategory
              const userData = {
                ...profileResponse.data.user,
                name: `${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`,
                professionalCategory: profileResponse.data.user.profession, // Map profession to professionalCategory
              };

              // Update Redux state with complete user data
              dispatch(
                loginSuccess({
                  user: userData as User,
                  lastLoginAt: new Date().toISOString(),
                })
              );

              trackGoogleSuccess(profileResponse.data.user);

              // Check if this is a first-time login (Google or regular)
              if (profileResponse.data.user.isFirstLogin) {
                // Redirect to profile page for first-time users
                navigate('/app/profil', { replace: true });
              } else {
                // Redirect to dashboard for existing users
                navigate('/app', { replace: true });
              }
            } else {
              // Fallback to basic auth data if profile fetch fails
              const userData = {
                ...authResponse.data.user,
                name: `${authResponse.data.user.firstName} ${authResponse.data.user.lastName}`,
              };

              dispatch(
                loginSuccess({
                  user: userData as User,
                  lastLoginAt: new Date().toISOString(),
                })
              );

              trackGoogleSuccess(authResponse.data.user);

              // Check if this is a first-time login (Google or regular)
              if (authResponse.data.user.isFirstLogin) {
                // Redirect to profile page for first-time users
                navigate('/app/profil', { replace: true });
              } else {
                // Redirect to dashboard for existing users
                navigate('/app', { replace: true });
              }
            }
          } else {
            const errorMessage = authResponse.error || "Échec de l'authentification Google";
            dispatch(loginFailure(errorMessage));
            trackLoginError({
              method: 'google',
              errorMessage,
            });
            setError(errorMessage);
          }
        } catch (err) {
          console.error('Google callback error:', err);
          const errorMessage = 'Erreur de connexion au serveur';
          dispatch(loginFailure(errorMessage));
          trackLoginError({
            method: 'google',
            errorMessage,
          });
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      } else {
        setError("Code d'autorisation manquant");
        trackLoginError({
          method: 'google',
          errorMessage: "Code d'autorisation manquant",
        });
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentification en cours...</h1>
          <p className="text-gray-600">Veuillez patienter pendant la finalisation de votre connexion Google.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallbackPage;
