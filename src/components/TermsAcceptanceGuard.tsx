import { Navigate, useLocation } from 'react-router-dom';

import React from 'react';
import Spinner from './ui/Spinner';
import { trackGuardRedirect } from '@/services/analytics';
import { useAppSelector } from '../store/hooks';

interface TermsAcceptanceGuardProps {
  children: React.ReactNode;
}

const TermsAcceptanceGuard: React.FC<TermsAcceptanceGuardProps> = ({ children }) => {
  const { currentUser, isAuthenticated, loading } = useAppSelector((state) => state.user);
  const location = useLocation();

  if (loading && isAuthenticated && !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner size="lg" color="blue" className="mx-auto mb-4" />
      </div>
    );
  }

  if (isAuthenticated && currentUser && currentUser.acceptedTerms === false) {
    trackGuardRedirect({
      guard: 'terms_acceptance',
      destination: '/auth/accept-terms',
      reason: `terms_not_accepted:${location.pathname}`,
    });
    return <Navigate to="/auth/accept-terms" replace />;
  }

  return <>{children}</>;
};

export default TermsAcceptanceGuard;
