import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import React from 'react';

interface Subsection {
  id: string;
  label: string;
  fieldCount: number;
}

interface SubsectionNavigationProps {
  subsections: Subsection[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  className?: string;
}

const SubsectionNavigation: React.FC<SubsectionNavigationProps> = ({ subsections, currentIndex, onNavigate, className = '' }) => {
  if (subsections.length <= 1) {
    return null; // Don't show navigation if there's only one subsection
  }

  const currentSubsection = subsections[currentIndex];
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < subsections.length - 1;

  return (
    <div className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onNavigate(currentIndex - 1)}
        disabled={!canGoBack}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${canGoBack ? 'text-[#1e51ab] hover:bg-blue-50 hover:text-[#163d82]' : 'text-gray-400 cursor-not-allowed'}
        `}
      >
        <FaChevronLeft className="w-3 h-3" />
        Précédent
      </button>

      {/* Subsection Dots */}
      <div className="flex items-center gap-2">
        {subsections.map((subsection, index) => (
          <button
            key={subsection.id}
            onClick={() => onNavigate(index)}
            className={`
              relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200
              ${
                index === currentIndex
                  ? 'bg-[#1e51ab] text-white ring-4 ring-blue-100'
                  : index < currentIndex
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }
            `}
          >
            {index + 1}

            {/* Field count indicator */}
            {subsection.fieldCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                {subsection.fieldCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Current Subsection Info */}
      <div className="text-center flex-1 mx-4">
        <h3 className="text-sm font-medium text-gray-900">{currentSubsection?.label}</h3>
        <p className="text-xs text-gray-500">
          {currentIndex + 1} sur {subsections.length}
        </p>
      </div>

      {/* Next Button */}
      <button
        onClick={() => onNavigate(currentIndex + 1)}
        disabled={!canGoForward}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${canGoForward ? 'text-[#1e51ab] hover:bg-blue-50 hover:text-[#163d82]' : 'text-gray-400 cursor-not-allowed'}
        `}
      >
        Suivant
        <FaChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};

export default SubsectionNavigation;
