import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { trackAccountCreationError, trackAccountCreationSuccess } from '@/services/analytics/gtm';

// Dropdown components removed for simplicity
import GoogleLoginButton from './ui/GoogleLoginButton';
import Logo from './ui/Logo';
import PasswordStrengthMeter from './ui/PasswordStrengthMeter';
import Spinner from './ui/Spinner';
import { authService } from '../services/coreApi';
import { calculateAge } from '../utils/ageValidation';
import { useForm } from 'react-hook-form';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema pour l'étape 1
const step1Schema = z
  .object({
    email: z.string().trim().email('Adresse email invalide'),
    password: z
      .string()
      .trim()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Le mot de passe doit contenir au moins: une majuscule, une minuscule, un chiffre et un caractère spécial'
      ),
    confirmPassword: z.string().trim().min(1, 'La confirmation du mot de passe est requise'),
    acceptedTerms: z.boolean().refine((val: boolean) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
      });
    }
  });

// Schema pour l'étape 2
const step2Schema = z.object({
  firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères'),
  birthDate: z.string().refine((date) => {
    const age = calculateAge(date);
    return age >= 18;
  }, 'Vous devez avoir au moins 18 ans pour créer un compte'),
  gender: z.enum(['male', 'female', 'other']),
  profession: z.enum(['student', 'unemployed', 'executive', 'non-executive', 'entrepreneur']),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [countdown, setCountdown] = useState(30);
  const { handleGoogleSignup, isLoading: isGoogleLoading } = useGoogleAuth();

  // Options removed for simplicity - will be added back when step 2 is implemented

  // Form pour l'étape 1
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onSubmit',
    defaultValues: {
      acceptedTerms: false,
    },
  });

  // Form pour l'étape 2
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onSubmit',
    defaultValues: {
      gender: 'male',
      profession: 'student',
    },
  });

  // Watch password for PasswordStrengthMeter
  const password = step1Form.watch('password');
  const isTermsAccepted = step1Form.watch('acceptedTerms');

  const handleNextStep = async () => {
    setStep1Error(null);
    if (!step1Form.getValues('acceptedTerms')) {
      setStep1Error("Vous devez accepter les conditions d'utilisation");
      step1Form.setError('acceptedTerms', { type: 'manual', message: "Vous devez accepter les conditions d'utilisation" });
      return;
    }

    const ok = await step1Form.trigger();

    if (ok) {
      setCurrentStep(2);
    } else {
      const { errors } = step1Form.formState;
      // Check for specific errors
      if (errors.confirmPassword) {
        setStep1Error('Les mots de passe ne correspondent pas');
      } else if (errors.acceptedTerms) {
        setStep1Error("Vous devez accepter les conditions d'utilisation");
      } else {
        setStep1Error('Veuillez corriger les erreurs ci-dessus');
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
    setStep1Error(null);
  };

  const onSubmit = async (step2Data: Step2Data) => {
    if (!step1Form.getValues('acceptedTerms')) {
      setStep1Error("Vous devez accepter les conditions d'utilisation");
      setCurrentStep(1);
      step1Form.setError('acceptedTerms', { type: 'manual', message: "Vous devez accepter les conditions d'utilisation" });
      return;
    }

    if (!step1Form.formState.isValid) return;

    setSubmitError(null);
    try {
      // Fusion des données des deux étapes
      const step1Data = step1Form.getValues();
      const completeData = {
        ...step1Data,
        ...step2Data,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...signupData } = completeData;
      const payload = {
        ...signupData,
        email: signupData.email.trim().toLowerCase(),
        birthDate: new Date(`${signupData.birthDate}T00:00:00Z`).toISOString(),
      };
      const response = await authService.signup(payload);
      if (response.success) {
        const userData = (response.data?.user ?? null) as { id?: string } | null;
        trackAccountCreationSuccess({
          method: 'email',
          userId: userData && typeof userData === 'object' ? userData.id : undefined,
        });
        setSubmitSuccess(true);
      } else {
        trackAccountCreationError({
          method: 'email',
          errorMessage: response.error,
        });
        setSubmitError("Une erreur s'est produite. Veuillez réessayer ou contacter le support.");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Erreur réseau';
      trackAccountCreationError({
        method: 'email',
        errorMessage,
      });
      setSubmitError(errorMessage);
    }
  };

  const onGoogleSubmit = async () => {
    // Check if user has accepted terms
    if (!step1Form.getValues('acceptedTerms')) {
      setStep1Error("Vous devez accepter les conditions d'utilisation");
      step1Form.setError('acceptedTerms', { type: 'manual', message: "Vous devez accepter les conditions d'utilisation" });
      return;
    }
    await handleGoogleSignup(true);
  };

  // Countdown redirect
  useEffect(() => {
    if (submitSuccess && countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    } else if (submitSuccess && countdown === 0) {
      navigate('/login');
    }
  }, [submitSuccess, countdown, navigate]);

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg mx-auto p-8">
          <FaCheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Demande d'inscription envoyée !</h1>
          <div className="text-gray-600 mb-8 space-y-4">
            <p>Si l'adresse email est valide, vous recevrez un email de confirmation dans votre boîte de réception.</p>
            <p className="font-medium text-gray-800">Veuillez cliquer sur le lien de confirmation pour activer votre compte.</p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Redirection automatique vers la page de connexion dans <span className="font-bold text-blue-900">{countdown}</span> secondes
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Aller à la page de connexion maintenant
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Logo size="md" className="mb-6" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Créer votre compte</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Rejoignez AssuBot pour gérer vos contrats d'assurance</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={step2Form.handleSubmit(onSubmit)}>
          {currentStep === 1 ? (
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <input
                  {...step1Form.register('email')}
                  type="email"
                  id="email"
                  autoComplete="email"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    step1Form.formState.errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="user@example.com"
                />
                {step1Form.formState.errors.email && <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    {...step1Form.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      step1Form.formState.errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                <PasswordStrengthMeter password={password || ''} />
                {step1Form.formState.errors.password && <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    {...step1Form.register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    autoComplete="new-password"
                    className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      step1Form.formState.errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {step1Form.formState.errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.confirmPassword.message}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  data-testid="terms-toggle"
                  onClick={() => step1Form.setValue('acceptedTerms', !step1Form.watch('acceptedTerms'))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    step1Form.watch('acceptedTerms') ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${step1Form.watch('acceptedTerms') ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
                <div className="flex-1 text-sm">
                  <label className="text-gray-700">
                    J'accepte les{' '}
                    <button type="button" onClick={() => window.open('/general-terms', '_blank')} className="text-blue-600 hover:text-blue-500 underline">
                      conditions d'utilisation
                    </button>{' '}
                    et la{' '}
                    <button type="button" onClick={() => window.open('/privacy-policy', '_blank')} className="text-blue-600 hover:text-blue-500 underline">
                      politique de confidentialité
                    </button>
                  </label>
                  {step1Form.formState.errors.acceptedTerms && <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.acceptedTerms.message}</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <input
                    {...step2Form.register('firstName')}
                    type="text"
                    id="firstName"
                    autoComplete="given-name"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      step2Form.formState.errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Jean"
                  />
                  {step2Form.formState.errors.firstName && <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.firstName.message}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    {...step2Form.register('lastName')}
                    type="text"
                    id="lastName"
                    autoComplete="family-name"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      step2Form.formState.errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Dupont"
                  />
                  {step2Form.formState.errors.lastName && <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.lastName.message}</p>}
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  Date de naissance
                </label>
                <input
                  {...step2Form.register('birthDate')}
                  type="date"
                  id="birthDate"
                  autoComplete="bday"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    step2Form.formState.errors.birthDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step2Form.formState.errors.birthDate && <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.birthDate.message}</p>}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <select
                  {...step2Form.register('gender')}
                  id="gender"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    step2Form.formState.errors.gender ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
                {step2Form.formState.errors.gender && <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.gender.message}</p>}
              </div>

              {/* Profession */}
              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                  Catégorie professionnelle
                </label>
                <select
                  {...step2Form.register('profession')}
                  id="profession"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    step2Form.formState.errors.profession ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="student">Étudiant</option>
                  <option value="unemployed">Sans emploi</option>
                  <option value="executive">Employé cadre</option>
                  <option value="non-executive">Employé non cadre</option>
                  <option value="entrepreneur">Entrepreneur</option>
                </select>
                {step2Form.formState.errors.profession && <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.profession.message}</p>}
              </div>
            </div>
          )}

          {currentStep === 1 ? (
            <div>
              <button
                type="button"
                onClick={handleNextStep}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                disabled={!isTermsAccepted}
              >
                Continuer
              </button>
            </div>
          ) : (
            <>
              <div>
                <button
                  type="submit"
                  disabled={step2Form.formState.isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {step2Form.formState.isSubmitting ? (
                    <>
                      <Spinner size="sm" color="white" className="mr-2" />
                      Création du compte...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Retour
                </button>
              </div>
            </>
          )}

          <GoogleLoginButton onClick={onGoogleSubmit} loading={isGoogleLoading} disabled={step2Form.formState.isSubmitting || !isTermsAccepted} isLogin={false} />

          {submitError && <p className="mt-2 text-sm text-red-600">{submitError}</p>}

          {!isTermsAccepted && step1Error && step1Error.includes("conditions d'utilisation") && (
            <p className="mt-2 text-sm text-red-600">Vous devez accepter les conditions d'utilisation pour vous inscrire avec Google</p>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <button type="button" onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:text-blue-500 underline">
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
