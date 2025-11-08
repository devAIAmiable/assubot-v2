import { FaInfoCircle } from 'react-icons/fa';
import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  tooltip?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, tooltip, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      {tooltip && (
        <div className="flex items-center text-sm text-gray-500">
          <FaInfoCircle className="h-4 w-4 mr-1 text-[#1e51ab]" aria-hidden="true" />
          <span>{tooltip}</span>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
