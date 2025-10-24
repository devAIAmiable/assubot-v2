import { FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

import React from 'react';

interface FieldHelpTooltipProps {
  helpText?: string;
  tooltip?: string;
  example?: string;
  className?: string;
}

const FieldHelpTooltip: React.FC<FieldHelpTooltipProps> = ({ helpText, tooltip, example, className = '' }) => {
  // Don't render if no help content is provided
  if (!helpText && !tooltip && !example) {
    return null;
  }

  const hasDetailedHelp = helpText || example;

  return (
    <Popover className={`relative inline-block ${className}`}>
      <PopoverButton className="inline-flex items-center justify-center w-4 h-4 text-[#1e51ab] hover:text-[#163d82] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:ring-opacity-50 rounded-full">
        {hasDetailedHelp ? <FaInfoCircle className="w-4 h-4" aria-hidden="true" /> : <FaQuestionCircle className="w-4 h-4" aria-hidden="true" />}
        <span className="sr-only">{hasDetailedHelp ? 'Informations détaillées' : 'Aide rapide'}</span>
      </PopoverButton>

      <PopoverPanel className="absolute z-10 w-80 mt-2 transform -translate-x-1/2 left-1/2 sm:w-96">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="space-y-3">
            {/* Help Text */}
            {helpText && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Aide</h4>
                <p className="text-sm text-gray-700">{helpText}</p>
              </div>
            )}

            {/* Tooltip (simple) */}
            {tooltip && !helpText && <p className="text-sm text-gray-700">{tooltip}</p>}

            {/* Example */}
            {example && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Exemple</h4>
                <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded border-l-2 border-[#1e51ab]">{example}</p>
              </div>
            )}
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  );
};

export default FieldHelpTooltip;
