import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginSuccess, type User } from '../store/userSlice';
import { authService } from '../services/coreApi';
import Spinner from './ui/Spinner';

interface AuthInitializerProps {
	children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
	const dispatch = useAppDispatch();
	const { isAuthenticated } = useAppSelector((state) => state.user);
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				if (!isAuthenticated) {
					let response = await authService.checkSession();

					if (!response.success) {
						response = await authService.checkAuthStatus();
					}

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
					}
				}
			} catch (error) {
				console.error('🚨 Auth initialization error:', error);
			} finally {
				setIsInitializing(false);
			}
		};

		initializeAuth();
	}, [dispatch, isAuthenticated]);

	// Show loading spinner while checking authentication
	if (isInitializing) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center">
					<Spinner size="lg" color="blue" className="mx-auto mb-4" />
					<p className="text-gray-600">Vérification de l'authentification...</p>
				</div>
			</div>
		);
	}

	// Render children once authentication check is complete
	return <>{children}</>;
};

export default AuthInitializer;
