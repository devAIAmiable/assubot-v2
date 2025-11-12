import { Navigate, useLocation } from 'react-router-dom';

import React from 'react';
import { trackGuardRedirect } from '@/services/analytics/gtm';
import { getUserState } from '../utils/stateHelpers';
import { useAppSelector } from '../store/hooks';

interface ProfileCompletionGuardProps {
  children: React.ReactNode;
}

const ProfileCompletionGuard: React.FC<ProfileCompletionGuardProps> = ({ children }) => {
  const { currentUser } = useAppSelector(getUserState);
  const location = useLocation();

  // Check if profile is incomplete by directly checking required fields
  const isProfileIncomplete = !currentUser?.birthDate || !currentUser?.gender || !currentUser?.professionalCategory;

  // If profile is incomplete and user is not already on profile page, redirect to profile
  if (isProfileIncomplete && location.pathname !== '/app/profil') {
    trackGuardRedirect({
      guard: 'profile_completion',
      destination: '/app/profil',
      reason: 'profile_incomplete',
    });
    return <Navigate to="/app/profil" replace />;
  }

  // If profile is complete or user is not a first-time Google user, render children
  return <>{children}</>;
};

export default ProfileCompletionGuard;
