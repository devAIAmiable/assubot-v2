import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { authService } from '../services/coreApi';

const VerifyPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const verifyToken = async () => {
			const token = searchParams.get('token');

			if (!token) {
				setError('Token de vérification manquant');
				setLoading(false);
				return;
			}

			const response = await authService.verify(token);

			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.error || 'Échec de la vérification');
			}

			setLoading(false);
		};

		verifyToken();
	}, []); // Empty dependency array to run only once on mount

	const handleRedirect = () => {
		navigate('/login');
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<FaSpinner className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-gray-900 mb-2">Vérification en cours...</h1>
					<p className="text-gray-600">
						Veuillez patienter pendant la vérification de votre token.
					</p>
				</div>
			</div>
		);
	}

	if (success) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center max-w-md mx-auto p-8">
					<FaCheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Vérification réussie !</h1>
					<p className="text-gray-600 mb-8">
						Votre compte a été vérifié avec succès. Vous pouvez maintenant accéder à toutes les
						fonctionnalités.
					</p>
					<button
						onClick={handleRedirect}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
					>
						Continuer vers l'application
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="text-center max-w-md mx-auto p-8">
				<FaExclamationTriangle className="h-16 w-16 text-red-600 mx-auto mb-6" />
				<h1 className="text-3xl font-bold text-gray-900 mb-4">Échec de la vérification</h1>
				<p className="text-gray-600 mb-8">
					{error || 'Une erreur est survenue lors de la vérification de votre token.'}
				</p>
				<button
					onClick={handleRedirect}
					className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
				>
					Retour à l'application
				</button>
			</div>
		</div>
	);
};

export default VerifyPage;
