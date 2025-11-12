import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { trackLoginError, trackLoginSuccess } from '@/services/analytics/gtm';

import GoogleLoginButton from './ui/GoogleLoginButton';
import Logo from './ui/Logo';
import { authService } from '../services/coreApi';
import { loginFailure, loginStart, loginSuccess, type User } from '../store/userSlice';
import { useAppDispatch } from '../store/hooks';
import { useForm } from 'react-hook-form';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(location.state?.message || null);
  const { handleGoogleLogin, isLoading: isGoogleLoading } = useGoogleAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginStart());
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const loginResponse = await authService.login(data);

    if (loginResponse.success) {
      // After successful login, get the full user profile
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

        trackLoginSuccess({
          method: 'email',
          userId: profileResponse.data.user.id,
        });

        // Redirect to the original intended page or dashboard
        const from = location.state?.from?.pathname || '/app';
        navigate(from, { replace: true });
      } else {
        // If we can't get the full profile, use the basic login data
        const userData = {
          ...loginResponse.data?.user,
          name: `${loginResponse.data?.user?.firstName} ${loginResponse.data?.user?.lastName}`,
        };

        dispatch(
          loginSuccess({
            user: userData as User,
            lastLoginAt: new Date().toISOString(),
          })
        );

        trackLoginSuccess({
          method: 'email',
          userId: loginResponse.data?.user?.id,
        });

        const from = location.state?.from?.pathname || '/app';
        navigate(from, { replace: true });
      }
    } else {
      const errorMessage = loginResponse.error || 'Email ou mot de passe incorrect';
      dispatch(loginFailure(errorMessage));
      trackLoginError({
        method: 'email',
        errorMessage,
      });
      setSubmitError(errorMessage);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Logo size="md" className="mb-6" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Se connecter</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Accédez à votre espace AssuBot</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-600">{submitSuccess}</p>
            </div>
          )}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="user@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Ou</span>
            </div>
          </div>

          {/* Google Login Button */}
          <GoogleLoginButton onClick={handleGoogleLogin} loading={isGoogleLoading} disabled={isSubmitting} isLogin={true} />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <button type="button" onClick={() => navigate('/signup')} className="font-medium text-blue-600 hover:text-blue-500">
                S'inscrire
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
