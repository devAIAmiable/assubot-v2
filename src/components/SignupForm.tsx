import { FaArrowLeft, FaCheckCircle, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import React, { useState } from 'react';

import Dropdown from './ui/Dropdown';
import type { DropdownOption } from './ui/Dropdown';
import Logo from './ui/Logo';
import Spinner from './ui/Spinner';
import { authService } from '../services/coreApi';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signupSchema = z
	.object({
		email: z.string().trim().email('Adresse email invalide'),
		password: z
			.string()
			.trim()
			.min(8, 'Le mot de passe doit contenir au moins 8 caractères')
			.regex(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
				'Le mot de passe doit contenir au moins: une majuscule, une minuscule, un chiffre et un caractère spécial'
			),
		confirmPassword: z.string().trim().min(1, 'La confirmation du mot de passe est requise'),
		firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères'),
		lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères'),
		birthDate: z.string().refine((date) => {
			const birthDate = new Date(date);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();
			return age >= 18;
		}, 'Vous devez avoir minimum 18 ans'),
		gender: z.enum(['homme', 'femme', 'autre']),
		profession: z.enum(['student', 'unemployed', 'executive', 'non-executive', 'entrepreneur']),
		acceptedTerms: z.boolean().refine((val: boolean) => val === true, {
			message: "Vous devez accepter les conditions d'utilisation",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Les mots de passe ne correspondent pas',
		path: ['confirmPassword'],
	});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [currentStep, setCurrentStep] = useState(1);
	const [countdown, setCountdown] = useState(30);

	const genderOptions: DropdownOption[] = [
		{ value: 'homme', label: 'Homme' },
		{ value: 'femme', label: 'Femme' },
		{ value: 'autre', label: 'Autre' },
	];

	const professionOptions: DropdownOption[] = [
		{ value: 'student', label: 'Étudiant' },
		{ value: 'unemployed', label: 'Sans emploi' },
		{ value: 'executive', label: 'Employé cadre' },
		{ value: 'non-executive', label: 'Employé non cadre' },
		{ value: 'entrepreneur', label: 'Entrepreneur' },
	];

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			gender: 'homme',
			profession: 'student',
			acceptedTerms: false,
		},
	});

	const handleNextStep = async () => {
		const step1Fields = ['email', 'password', 'confirmPassword', 'acceptedTerms'] as const;
		const isValid = await trigger(step1Fields);

		if (isValid) {
			setCurrentStep(2);
		}
	};

	const handlePreviousStep = () => {
		setCurrentStep(1);
	};

	const onSubmit = async (data: SignupFormData) => {
		setIsSubmitting(true);
		setSubmitError(null);

		// Remove confirmPassword from the data sent to API
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { confirmPassword, ...signupData } = data;

		// Convert birthDate to ISO string format for backend
		const payload = {
			...signupData,
			birthDate: new Date(signupData.birthDate).toISOString(),
		};

		const response = await authService.signup(payload);

		if (response.success) {
			setSubmitSuccess(true);
			// Don't redirect automatically - let user know about email verification
		} else {
			setSubmitError(response.error || "Erreur lors de l'inscription");
		}

		setIsSubmitting(false);
	};

	// Countdown effect for success page
	React.useEffect(() => {
		if (submitSuccess && countdown > 0) {
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (submitSuccess && countdown === 0) {
			navigate('/login');
		}
	}, [submitSuccess, countdown, navigate]);

	if (submitSuccess) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center max-w-lg mx-auto p-8">
					<FaCheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						Votre compte a été créé avec succès !
					</h1>
					<div className="text-gray-600 mb-8 space-y-4">
						<p>
							Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour
							activer votre compte.
						</p>
						<p className="font-medium text-gray-800">
							Vous pourrez vous connecter une fois votre compte vérifié.
						</p>
						<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
							<p className="text-sm text-blue-800">
								Redirection automatique vers la page de connexion dans{' '}
								<span className="font-bold text-blue-900">{countdown}</span> secondes
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
				{/* Back Button */}
				<div className="flex justify-start">
					<button
						type="button"
						onClick={() => navigate('/')}
						className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
					>
						<FaArrowLeft className="h-4 w-4 mr-2" />
						Retour à l'accueil
					</button>
				</div>

				<div>
					<Logo size="md" className="mb-6" />
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Créer votre compte
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Rejoignez AssuBot pour gérer vos contrats d'assurance
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
					{submitError && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
							<p className="text-sm text-red-600 font-medium">{submitError}</p>
						</div>
					)}

					{currentStep === 1 ? (
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
								{errors.email && (
									<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
								)}
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
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<FaEyeSlash className="h-5 w-5 text-gray-400" />
										) : (
											<FaEye className="h-5 w-5 text-gray-400" />
										)}
									</button>
								</div>
								{errors.password && (
									<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
								)}
							</div>

							{/* Confirm Password */}
							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-medium text-gray-700"
								>
									Confirmer le mot de passe
								</label>
								<div className="relative">
									<input
										{...register('confirmPassword')}
										type={showConfirmPassword ? 'text' : 'password'}
										id="confirmPassword"
										className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
											errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
										}`}
										placeholder="••••••••"
									/>
									<button
										type="button"
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? (
											<FaEyeSlash className="h-5 w-5 text-gray-400" />
										) : (
											<FaEye className="h-5 w-5 text-gray-400" />
										)}
									</button>
								</div>
								{errors.confirmPassword && (
									<p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
								)}
							</div>

							{/* Terms and Conditions */}
							<div className="flex items-start space-x-3">
								<button
									type="button"
									onClick={() => setValue('acceptedTerms', !watch('acceptedTerms'))}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
										watch('acceptedTerms') ? 'bg-blue-600' : 'bg-gray-200'
									}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											watch('acceptedTerms') ? 'translate-x-6' : 'translate-x-1'
										}`}
									/>
								</button>
								<div className="flex-1 text-sm">
									<label
										className="text-gray-700 cursor-pointer"
										onClick={() => setValue('acceptedTerms', !watch('acceptedTerms'))}
									>
										J'accepte les{' '}
										<a href="#" className="text-blue-600 hover:text-blue-500 underline">
											conditions d'utilisation
										</a>{' '}
										et la{' '}
										<a href="#" className="text-blue-600 hover:text-blue-500 underline">
											politique de confidentialité
										</a>
									</label>
									{errors.acceptedTerms && (
										<p className="mt-1 text-sm text-red-600">{errors.acceptedTerms.message}</p>
									)}
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							{/* First Name and Last Name */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
										Prénom
									</label>
									<input
										{...register('firstName')}
										type="text"
										id="firstName"
										className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
											errors.firstName ? 'border-red-300' : 'border-gray-300'
										}`}
										placeholder="Jean"
									/>
									{errors.firstName && (
										<p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
									)}
								</div>

								<div>
									<label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
										Nom
									</label>
									<input
										{...register('lastName')}
										type="text"
										id="lastName"
										className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
											errors.lastName ? 'border-red-300' : 'border-gray-300'
										}`}
										placeholder="Dupont"
									/>
									{errors.lastName && (
										<p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
									)}
								</div>
							</div>

							{/* Birth Date */}
							<div>
								<label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
									Date de naissance
								</label>
								<input
									{...register('birthDate')}
									type="date"
									id="birthDate"
									className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
										errors.birthDate ? 'border-red-300' : 'border-gray-300'
									}`}
								/>
								{errors.birthDate && (
									<p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
								)}
							</div>

							{/* Gender */}
							<Dropdown
								options={genderOptions}
								value={watch('gender')}
								onChange={(value) => setValue('gender', value as 'homme' | 'femme' | 'autre')}
								label="Genre"
								placeholder="Sélectionner un genre"
								error={errors.gender?.message}
							/>

							{/* Profession */}
							<Dropdown
								options={professionOptions}
								value={watch('profession')}
								onChange={(value) =>
									setValue(
										'profession',
										value as
											| 'student'
											| 'unemployed'
											| 'executive'
											| 'non-executive'
											| 'entrepreneur'
									)
								}
								label="Catégorie professionnelle"
								placeholder="Sélectionner une catégorie"
								error={errors.profession?.message}
							/>
						</div>
					)}

					{currentStep === 1 ? (
						<div>
							<button
								type="button"
								onClick={handleNextStep}
								className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
							>
								Continuer
							</button>
						</div>
					) : (
						<>
							{/* Submit Button */}
							<div>
								<button
									type="submit"
									disabled={isSubmitting}
									className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
								>
									{isSubmitting ? (
										<>
											<Spinner size="sm" color="white" className="mr-2" />
											Création du compte...
										</>
									) : (
										'Créer mon compte'
									)}
								</button>
							</div>

							{/* Previous Step Button */}
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

					{/* Google Signup Button */}
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-gray-50 text-gray-500">ou</span>
							</div>
						</div>
						<div className="mt-6">
							<button
								type="button"
								onClick={() => {
									// TODO: Implement Google signup
									console.log('Google signup clicked');
								}}
								className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
							>
								<FaGoogle className="h-4 w-4 mr-2 text-red-500" />
								S'inscrire avec Google
							</button>
						</div>
					</div>

					{/* Signin Redirect Button */}
					<div className="text-center mt-6">
						<p className="text-sm text-gray-600">
							Déjà un compte ?{' '}
							<button
								type="button"
								onClick={() => navigate('/login')}
								className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 underline hover:no-underline"
							>
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
