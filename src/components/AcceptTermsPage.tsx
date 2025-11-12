import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from './ui/Button';
import Logo from './ui/Logo';
import Spinner from './ui/Spinner';
import { authService, userService } from '@/services/coreApi';
import { loginSuccess, updateProfileSuccess, type User } from '../store/userSlice';
import { showToast } from './ui/Toast';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const AcceptTermsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<User | null>(currentUser);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(currentUser?.acceptedTerms ?? false);

  useEffect(() => {
    if (currentUser?.acceptedTerms) {
      navigate('/app', { replace: true });
    }
  }, [currentUser?.acceptedTerms, navigate]);

  useEffect(() => {
    const bootstrapUser = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getUserProfile();

        if (response.success && response.data?.user) {
          const userData = {
            ...response.data.user,
            name: `${response.data.user.firstName} ${response.data.user.lastName}`,
            professionalCategory: response.data.user.profession,
          };

          dispatch(
            loginSuccess({
              user: userData as User,
              lastLoginAt: new Date().toISOString(),
            })
          );

          if (response.data.user.acceptedTerms) {
            navigate('/app', { replace: true });
            return;
          }

          setLocalUser(userData as User);
          setHasAcceptedTerms(false);
        } else if (response.error) {
          setError(response.error);
        } else {
          setError("Impossible de récupérer les informations de l'utilisateur");
        }
      } catch (err) {
        console.error('Accept terms bootstrap error:', err);
        setError('Erreur de connexion au serveur');
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapUser();
  }, [dispatch, navigate]);

  const handleConfirm = async () => {
    if (!localUser) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const response = await userService.acceptTerms(localUser.id, {
        acceptedTerms: true,
        termsAcceptedAt: now,
      });

      if (response.success && response.data?.user) {
        dispatch(updateProfileSuccess(response.data));
        showToast.success('Merci, vos conditions sont acceptées.');
        navigate('/app', { replace: true });
      } else {
        setError(response.error || "Erreur lors de l'acceptation des conditions");
      }
    } catch (err) {
      console.error('Accept terms submission error:', err);
      setError('Erreur lors de la validation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Spinner size="xl" color="blue" className="mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre compte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-4">
          <Logo size="md" className="mx-auto" />
          <h1 className="text-3xl font-semibold text-gray-900">Finaliser votre connexion</h1>
          <p className="text-gray-600">Merci d'avoir choisi AssuBot. Pour accéder à votre espace, merci de confirmer que vous acceptez nos conditions générales.</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
              <button
                type="button"
                data-testid="terms-toggle"
                onClick={() => setHasAcceptedTerms((prev) => !prev)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e51ab] focus-visible:ring-offset-2 ${
                  hasAcceptedTerms ? 'bg-[#1e51ab]' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${hasAcceptedTerms ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
              <div className="text-sm text-gray-700">
                <p className="font-medium text-gray-900">
                  J'accepte les{' '}
                  <button type="button" onClick={() => window.open('/general-terms', '_blank')} className="text-[#1e51ab] underline-offset-2 hover:underline">
                    conditions générales d'utilisation
                  </button>{' '}
                  et la{' '}
                  <button type="button" onClick={() => window.open('/privacy-policy', '_blank')} className="text-[#1e51ab] underline-offset-2 hover:underline">
                    politique de confidentialité
                  </button>
                  .
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Cette confirmation est nécessaire uniquement lors de votre première connexion via Google. Vous pourrez consulter ces documents à tout moment depuis votre profil.
            </p>
          </div>

          <Button type="button" size="lg" disabled={!hasAcceptedTerms || isSubmitting} onClick={handleConfirm} className="w-full">
            {isSubmitting ? (
              <>
                <Spinner size="sm" color="white" className="mr-2" />
                Validation en cours...
              </>
            ) : (
              'Continuer vers mon espace'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcceptTermsPage;
