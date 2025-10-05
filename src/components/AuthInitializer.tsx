import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginSuccess, updateCredits, type User } from '../store/userSlice';
import { authService, userService } from '../services/coreApi';
import Spinner from './ui/Spinner';

interface AuthInitializerProps {
	children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
	const dispatch = useAppDispatch();
	const { isAuthenticated } = useAppSelector((state) => state.user);
	const [isInitializing, setIsInitializing] = useState(true);

	// Function to refresh user credits
	const refreshUserCredits = async () => {
		try {
			const creditsResponse = await userService.getCredits();
			if (creditsResponse.success && creditsResponse.data) {
				dispatch(updateCredits(creditsResponse.data.credits));
			}
		} catch (error) {
			console.error('Failed to refresh user credits:', error);
		}
	};

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				if (!isAuthenticated) {
					// First check if user is authenticated
					const authResponse = await authService.checkAuthStatus();

					if (authResponse.success && authResponse.data?.user) {
						// If authenticated, get the full user profile
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

							// Refresh user credits after successful authentication
							refreshUserCredits();
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

							// Refresh user credits after successful authentication
							refreshUserCredits();
						}
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
