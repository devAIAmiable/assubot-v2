import { FaMinus, FaPlus } from 'react-icons/fa';
import React, { useState } from 'react';

import FieldHelpTooltip from '../FieldHelpTooltip';
import type { FormField } from '../../../types/comparison';
import { motion } from 'framer-motion';

interface NumberFieldProps {
  field: FormField;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({ field, value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  const min = field.validation?.min ?? 0;
  const max = field.validation?.max ?? 999999;
  const step = 1;

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value) || 0;
    const clampedValue = Math.min(Math.max(inputValue, min), max);
    onChange(clampedValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        <FieldHelpTooltip helpText={field.helpText} tooltip={field.tooltip} example={field.example} />
      </label>

      <div className="relative">
        <input
          type="number"
          value={value || ''}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className={`w-full px-12 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent ${
            error ? 'border-red-300' : isFocused ? 'border-[#1e51ab]' : 'border-gray-300'
          }`}
          required={field.required}
        />

        {/* Decrement button */}
        <motion.button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className={`absolute left-1 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors duration-200 ${
            value <= min ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-[#1e51ab] hover:bg-gray-50'
          }`}
          whileHover={value > min ? { scale: 1.05 } : {}}
          whileTap={value > min ? { scale: 0.95 } : {}}
          aria-label="Diminuer"
        >
          <FaMinus className="h-3 w-3" />
        </motion.button>

        {/* Increment button */}
        <motion.button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className={`absolute right-1 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors duration-200 ${
            value >= max ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-[#1e51ab] hover:bg-gray-50'
          }`}
          whileHover={value < max ? { scale: 1.05 } : {}}
          whileTap={value < max ? { scale: 0.95 } : {}}
          aria-label="Augmenter"
        >
          <FaPlus className="h-3 w-3" />
        </motion.button>
      </div>

      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600">
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default React.memo(NumberField);
