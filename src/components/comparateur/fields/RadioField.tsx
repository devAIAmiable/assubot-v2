import { FaCheck } from 'react-icons/fa';
import type { FormField } from '../../../types/comparison';
import { RadioGroup } from '@headlessui/react';
import React from 'react';
import { motion } from 'framer-motion';
import { renderIcon } from '../../../utils/iconMapper';

interface RadioFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const RadioField: React.FC<RadioFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <RadioGroup value={value} onChange={onChange}>
        <div className="space-y-3">
          {field.options?.map((option) => (
            <RadioGroup.Option
              key={option.value}
              value={option.value}
              className={({ checked }) =>
                `relative flex cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                  checked ? 'border-[#1e51ab] bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`
              }
            >
              {({ checked }) => (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {option.icon && <div className="text-xl text-gray-600">{renderIcon(option.icon, { className: 'w-5 h-5' })}</div>}
                    <div className="flex flex-col">
                      <RadioGroup.Label as="div" className={`font-medium text-sm ${checked ? 'text-[#1e51ab]' : 'text-gray-900'}`}>
                        {option.label}
                      </RadioGroup.Label>
                      {option.description && (
                        <RadioGroup.Description as="div" className={`text-xs mt-1 ${checked ? 'text-blue-600' : 'text-gray-500'}`}>
                          {option.description}
                        </RadioGroup.Description>
                      )}
                    </div>
                  </div>

                  {/* Custom checkmark */}
                  <div className="flex-shrink-0">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: checked ? 1 : 0,
                        opacity: checked ? 1 : 0,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e51ab] text-white"
                    >
                      <FaCheck className="h-3 w-3" />
                    </motion.div>
                  </div>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      {field.helperText && <p className="text-sm text-gray-500">{field.helperText}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default React.memo(RadioField);
