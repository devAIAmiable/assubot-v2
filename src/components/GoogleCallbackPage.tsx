import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure, type User } from '../store/userSlice';
import { authService } from '../services/coreApi';
import { FaSpinner } from 'react-icons/fa';

const GoogleCallbackPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleGoogleCallback = async () => {
			const code = searchParams.get('code');
			const error = searchParams.get('error');
			const success = searchParams.get('success');
			const userData = searchParams.get('user');

			if (error) {
				setError('Échec de l\'authentification Google');
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

					// Redirect to dashboard
					navigate('/app', { replace: true });
					return;
				} catch (err) {
					console.error('Error parsing user data:', err);
				}
			}

			// Fallback: try to check auth status from backend
			if (code) {
				dispatch(loginStart());

				try {
					const response = await authService.checkGoogleAuthStatus();

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

						// Redirect to dashboard
						navigate('/app', { replace: true });
					} else {
						const errorMessage = response.error || 'Échec de l\'authentification Google';
						dispatch(loginFailure(errorMessage));
						setError(errorMessage);
					}
				} catch (err) {
					console.error('Google callback error:', err);
					const errorMessage = 'Erreur de connexion au serveur';
					dispatch(loginFailure(errorMessage));
					setError(errorMessage);
				} finally {
					setLoading(false);
				}
			} else {
				setError('Code d\'autorisation manquant');
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
					<p className="text-gray-600">
						Veuillez patienter pendant la finalisation de votre connexion Google.
					</p>
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
					<button
						onClick={() => navigate('/login')}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
					>
						Retour à la connexion
					</button>
				</div>
			</div>
		);
	}

	return null;
};

export default GoogleCallbackPage; 