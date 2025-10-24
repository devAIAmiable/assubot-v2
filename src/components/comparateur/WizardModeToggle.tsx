import { FaList, FaMagic } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';

interface WizardModeToggleProps {
  onToggle: (isWizardMode: boolean) => void;
  className?: string;
}

const WizardModeToggle: React.FC<WizardModeToggleProps> = ({ onToggle, className = '' }) => {
  const [isWizardMode, setIsWizardMode] = useState(false);

  // Load preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('formViewMode');
    if (savedMode === 'wizard') {
      setIsWizardMode(true);
      onToggle(true);
    }
  }, [onToggle]);

  const handleToggle = (enabled: boolean) => {
    setIsWizardMode(enabled);
    localStorage.setItem('formViewMode', enabled ? 'wizard' : 'form');
    onToggle(enabled);
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <FaList className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Mode formulaire</span>
        </div>
        <Switch
          checked={isWizardMode}
          onChange={handleToggle}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:ring-offset-2
            ${isWizardMode ? 'bg-[#1e51ab]' : 'bg-gray-300'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
              ${isWizardMode ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </Switch>
        <div className="flex items-center gap-2">
          <FaMagic className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Mode assistant</span>
        </div>
      </div>

      {/* Mode Description */}
      <motion.div key={isWizardMode ? 'wizard' : 'form'} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-right">
        <p className="text-xs text-gray-600">{isWizardMode ? 'Assistant guidé étape par étape' : 'Formulaire complet avec sections'}</p>
      </motion.div>
    </div>
  );
};

export default WizardModeToggle;
