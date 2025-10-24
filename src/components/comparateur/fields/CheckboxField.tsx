import type { FormField } from '../../../types/comparison';
import { Switch } from '@headlessui/react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import React from 'react';

interface CheckboxFieldProps {
  field: FormField;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <Switch.Group>
        <div className="flex items-center justify-between">
          <Switch.Label className="flex-1">
            <div className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            {field.helperText && <div className="text-xs text-gray-500 mt-1">{field.helperText}</div>}
          </Switch.Label>

          <Switch
            checked={value}
            onChange={onChange}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:ring-offset-2 ${
              value ? 'bg-[#1e51ab]' : 'bg-gray-200'
            }`}
          >
            <span className="sr-only">Toggle {field.label}</span>
            <motion.span
              animate={{
                x: value ? 20 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            >
              <div className="flex items-center justify-center h-full">
                {value ? <FaCheck className="h-3 w-3 text-[#1e51ab]" /> : <FaTimes className="h-3 w-3 text-gray-400" />}
              </div>
            </motion.span>
          </Switch>
        </div>
      </Switch.Group>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default React.memo(CheckboxField);
