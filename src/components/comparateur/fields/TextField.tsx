import React, { useEffect, useState } from 'react';
import { applyMask, getMaskPlaceholder } from '../../../utils/inputMasking';

import { FaTimes } from 'react-icons/fa';
import FieldHelpTooltip from '../FieldHelpTooltip';
import type { FormField } from '../../../types/comparison';
import { motion } from 'framer-motion';

interface TextFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

const TextField: React.FC<TextFieldProps> = ({ field, value, onChange, onBlur, error }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Update display value when external value changes
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (field.mask) {
      // Apply mask to the input value
      const maskedValue = applyMask(inputValue, field.mask);
      setDisplayValue(maskedValue);
      onChange(maskedValue);
    } else {
      setDisplayValue(inputValue);
      onChange(inputValue);
    }
  };

  const handleClear = () => {
    setDisplayValue('');
    onChange('');
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const placeholder = field.mask ? getMaskPlaceholder(field.mask) || field.placeholder : field.placeholder;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        <FieldHelpTooltip helpText={field.helpText} tooltip={field.tooltip} example={field.example} />
      </label>

      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-3 pr-10 border rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent ${
            error ? 'border-red-300' : isFocused ? 'border-[#1e51ab]' : 'border-gray-300'
          }`}
          required={field.required}
        />

        {/* Clear button */}
        {displayValue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label="Effacer"
          >
            <FaTimes className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600">
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default React.memo(TextField);
