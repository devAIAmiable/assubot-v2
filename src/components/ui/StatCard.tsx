import { FaCalendarAlt, FaCheckCircle, FaClock, FaEuroSign, FaExclamationTriangle, FaFileContract, FaShieldAlt } from 'react-icons/fa';

import React from 'react';

export type StatType =
  | 'total-contracts'
  | 'active-contracts'
  | 'expired-contracts'
  | 'expiring-contracts'
  | 'monthly-premium'
  | 'annual-premium'
  | 'total-premium'
  | 'savings'
  | 'coverage-score'
  | 'renewals'
  | 'insurers'
  | 'custom';

interface StatCardProps {
  label: string;
  value: string | number;
  type: StatType;
  valueColor?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
  customIcon?: React.ComponentType<{ className?: string }>;
  customIconBgColor?: string;
  customIconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, type, valueColor = 'text-gray-900', footer, isLoading = false, customIcon, customIconBgColor, customIconColor }) => {
  const getStatConfig = () => {
    switch (type) {
      case 'total-contracts':
        return {
          icon: FaShieldAlt,
          iconBgColor: 'bg-blue-50',
          iconColor: 'text-[#1e51ab]',
        };
      case 'active-contracts':
        return {
          icon: FaFileContract,
          iconBgColor: 'bg-green-50',
          iconColor: 'text-green-600',
        };
      case 'expired-contracts':
        return {
          icon: FaCalendarAlt,
          iconBgColor: 'bg-red-50',
          iconColor: 'text-red-600',
        };
      case 'expiring-contracts':
        return {
          icon: FaClock,
          iconBgColor: 'bg-amber-50',
          iconColor: 'text-amber-600',
        };
      case 'monthly-premium':
      case 'annual-premium':
      case 'total-premium':
      case 'savings':
        return {
          icon: FaEuroSign,
          iconBgColor: 'bg-purple-50',
          iconColor: 'text-purple-600',
        };
      case 'coverage-score':
        return {
          icon: FaCheckCircle,
          iconBgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
        };
      case 'renewals':
        return {
          icon: FaCalendarAlt,
          iconBgColor: 'bg-orange-50',
          iconColor: 'text-orange-600',
        };
      case 'insurers':
        return {
          icon: FaShieldAlt,
          iconBgColor: 'bg-cyan-50',
          iconColor: 'text-cyan-600',
        };
      case 'custom':
        return {
          icon: customIcon || FaExclamationTriangle,
          iconBgColor: customIconBgColor || 'bg-gray-50',
          iconColor: customIconColor || 'text-gray-600',
        };
      default:
        return {
          icon: FaExclamationTriangle,
          iconBgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
        };
    }
  };

  const { icon: Icon, iconBgColor, iconColor } = getStatConfig();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{isLoading ? '...' : value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default StatCard;
