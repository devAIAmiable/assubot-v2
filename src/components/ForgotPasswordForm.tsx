import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import Logo from './ui/Logo';
import Spinner from './ui/Spinner';
import { authService } from '../services/coreApi';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, 'L\'adresse email est requise')
		.email('Format d\'email invalide'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		setIsSubmitting(true);
		setSubmitError(null);
		setSubmitSuccess(null);

		try {
			const response = await authService.forgotPassword(data.email);

			if (response.success) {
				setSubmitSuccess(
					'Un email de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.'
				);
				reset();
			} else {
				setSubmitError(response.error || 'Erreur lors de l\'envoi de l\'email');
			}
		} catch (error) {
			console.error('Forgot password error:', error);
			setSubmitError('Erreur de connexion au serveur');
		}

		setIsSubmitting(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<Logo size="md" className="mb-6" />
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Mot de passe oublié
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Entrez votre adresse email pour recevoir un lien de réinitialisation
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
					{submitSuccess && (
						<div className="bg-green-50 border border-green-200 rounded-md p-4">
							<div className="flex">
								<FaEnvelope className="h-5 w-5 text-green-400 mt-0.5" />
								<div className="ml-3">
									<p className="text-sm text-green-600">{submitSuccess}</p>
								</div>
							</div>
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
								disabled={isSubmitting}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
							)}
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={isSubmitting}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isSubmitting ? (
								<>
									<Spinner size="sm" color="white" className="mr-2" />
									Envoi en cours...
								</>
							) : (
								'Envoyer le lien de réinitialisation'
							)}
						</button>
					</div>

					<div className="text-center">
						<Link
							to="/login"
							className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
						>
							<FaArrowLeft className="h-4 w-4 mr-1" />
							Retour à la connexion
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ForgotPasswordForm; 