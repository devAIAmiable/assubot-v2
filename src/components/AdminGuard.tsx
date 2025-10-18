import { FaUserShield } from 'react-icons/fa';
import React from 'react';
import type { RootState } from '../store';
import { useSelector } from 'react-redux';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallback }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  
  const isAdmin = currentUser?.email?.endsWith('@a-lamiable.com');

  if (!isAdmin) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-xl p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
              <FaUserShield className="text-4xl text-white" />
            </div>
            <h4 className="text-2xl font-semibold text-red-600 mt-4">Accès non autorisé</h4>
            <p className="text-gray-600 mt-4">
              Cette page est réservée aux administrateurs avec un email @a-lamiable.com
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Email actuel: {currentUser?.email || 'Non connecté'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
