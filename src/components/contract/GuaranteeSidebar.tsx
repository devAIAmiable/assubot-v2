import { FaCheck, FaInfoCircle } from 'react-icons/fa';
import { calculateGuaranteeStats, calculateServiceStats } from '../../utils/guaranteeCalculations';

import type { BackendContractGuarantee } from '../../types/contract';
import React from 'react';
import { motion } from 'framer-motion';

interface GuaranteeSidebarProps {
  guarantee: BackendContractGuarantee;
  activeSection: string | null;
  onSectionChange: (section: string) => void;
}

const GuaranteeSidebar: React.FC<GuaranteeSidebarProps> = ({ guarantee, activeSection, onSectionChange }) => {
  const prestationStats = calculateServiceStats(guarantee);
  const guaranteeStats = calculateGuaranteeStats(guarantee);

  const sections = [
    {
      id: 'overview',
      label: "Vue d'ensemble",
      icon: FaInfoCircle,
      description: `${guaranteeStats.totalCoverages} couvert • ${guaranteeStats.totalExclusions} exclus`,
    },
    ...prestationStats.map((prestation, index) => ({
      id: `prestation-${index}`,
      label: prestation.serviceName.slice(0, 30) + (prestation.serviceName.length > 30 ? '...' : ''),
      icon: FaCheck,
      description: `${prestation.coveredCount} couvert • ${prestation.excludedCount} exclus`,
    })),
  ];

  const getSectionIcon = (section: (typeof sections)[0]) => {
    if (section.id === 'overview') return FaInfoCircle;
    return FaCheck;
  };

  const getSectionColor = (section: (typeof sections)[0]) => {
    if (section.id === 'overview') return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const Icon = getSectionIcon(section);
            const color = getSectionColor(section);

            return (
              <motion.button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  isActive ? `bg-blue-50 border-blue-200 text-blue-700 border shadow-sm` : 'hover:bg-white hover:border-gray-200 border border-transparent'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${isActive ? color : 'text-gray-400'}`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{section.label}</div>
                    <div className={`text-xs mt-1 ${isActive ? 'text-gray-600' : 'text-gray-500'}`}>{section.description}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default GuaranteeSidebar;
