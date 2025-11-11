import { FaBan } from 'react-icons/fa';
import React from 'react';

interface SummarizedEmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const SummarizedEmptyState: React.FC<SummarizedEmptyStateProps> = ({ title, description, icon }) => {
  return (
    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
      <div className="mb-4 flex items-center justify-center">{icon ?? <FaBan className="h-16 w-16 text-gray-300" />}</div>
      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm sm:text-base text-gray-600">{description}</p>
    </div>
  );
};

export default SummarizedEmptyState;
