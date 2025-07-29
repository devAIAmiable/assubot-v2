import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import React, { useState } from 'react';
import { loginFailure, loginStart, loginSuccess, type User } from '../store/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

import Logo from './ui/Logo';
import { authService } from '../services/coreApi';
import { useAppDispatch } from '../store/hooks';
import { useForm } from 'react-hook-form';
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

		const response = await authService.login(data);

		if (response.success && response.data?.user) {
			// Prepare user data with computed name
			const userData = {
				...response.data.user,
				name: `${response.data.user.firstName} ${response.data.user.lastName}`,
			};

			// Update Redux state with user data
			dispatch(
				loginSuccess({
					user: userData as User,
					lastLoginAt: new Date().toISOString(),
				})
			);

			// Redirect to the original intended page or dashboard
			const from = location.state?.from?.pathname || '/app';
			navigate(from, { replace: true });
		} else {
			const errorMessage = response.error || 'Email ou mot de passe incorrect';
			dispatch(loginFailure(errorMessage));
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

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Pas encore de compte ?{' '}
							<button
								type="button"
								onClick={() => navigate('/signup')}
								className="font-medium text-blue-600 hover:text-blue-500"
							>
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
