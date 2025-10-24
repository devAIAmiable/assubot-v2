import type { FormField } from '../../../types/comparison';
import React from 'react';
import { motion } from 'framer-motion';
import { renderIcon } from '../../../utils/iconMapper';

interface CardFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const CardField: React.FC<CardFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="grid grid-cols-1 gap-3">
        {field.options?.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 w-full
              ${value === option.value ? 'border-[#1e51ab] bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}
            `}
            onClick={() => onChange(option.value)}
          >
            <div className="flex items-center space-x-3">
              {option.icon && <div className="text-xl flex-shrink-0 text-gray-600">{renderIcon(option.icon, { className: 'w-6 h-6' })}</div>}
              <div className="flex flex-col">
                <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                {option.description && <div className="text-xs text-gray-500">{option.description}</div>}
              </div>
            </div>

            {value === option.value && (
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-[#1e51ab] rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {field.helperText && <p className="text-sm text-gray-500">{field.helperText}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CardField;
