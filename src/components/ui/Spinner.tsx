import { FaSpinner } from 'react-icons/fa';
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  return (
    <FaSpinner 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      aria-label="Loading"
    />
  );
};

export default Spinner; 