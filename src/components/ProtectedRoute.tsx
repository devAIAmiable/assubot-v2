import { Navigate, useLocation } from 'react-router-dom';

import React from 'react';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated, loading } = useAppSelector((state) => state.user);
	const location = useLocation();

	// Show loading spinner while checking authentication
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab]"></div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Render children if authenticated
	return <>{children}</>;
};

export default ProtectedRoute;
