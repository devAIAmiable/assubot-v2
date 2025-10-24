import React, { useEffect, useState } from 'react';
import { applyMask, getMaskPlaceholder } from '../../../utils/inputMasking';

import { FaCalendar } from 'react-icons/fa';
import FieldHelpTooltip from '../FieldHelpTooltip';
import type { FormField } from '../../../types/comparison';
import { applyShortcut } from '../../../utils/fieldShortcuts';
import { motion } from 'framer-motion';

interface DateFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const DateField: React.FC<DateFieldProps> = ({ field, value, onChange, error }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Update display value when external value changes
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  // Get shortcuts for this field - only use shortcuts if they're explicitly defined
  const shortcuts = field.shortcuts || [];

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

  const handleShortcutSelect = (shortcutValue: string) => {
    const actualValue = applyShortcut(shortcutValue, 'date');
    setDisplayValue(actualValue);
    onChange(actualValue);
    setShowShortcuts(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const placeholder = field.mask ? getMaskPlaceholder(field.mask) || field.placeholder : field.placeholder;

  // If no mask is specified, use HTML5 date input
  if (!field.mask) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
          <FieldHelpTooltip helpText={field.helpText} tooltip={field.tooltip} example={field.example} />
        </label>

        <div className="relative">
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full px-3 py-3 pr-10 border rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent ${
              error ? 'border-red-300' : isFocused ? 'border-[#1e51ab]' : 'border-gray-300'
            }`}
            required={field.required}
          />

          {/* Calendar icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaCalendar className="h-4 w-4" />
          </div>
        </div>

        {/* Date shortcuts */}
        {shortcuts.length > 0 && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="text-sm text-[#1e51ab] hover:text-[#163d82] font-medium transition-colors duration-200"
            >
              {showShortcuts ? 'Masquer les raccourcis' : 'Afficher les raccourcis'}
            </button>

            {showShortcuts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-2"
              >
                {shortcuts.map((shortcut) => (
                  <motion.button
                    key={shortcut.value}
                    type="button"
                    onClick={() => handleShortcutSelect(shortcut.value)}
                    className="p-2 text-left text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#1e51ab] transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium text-gray-900">{shortcut.label}</div>
                    <div className="text-xs text-gray-500">{shortcut.description}</div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600">
            {error}
          </motion.p>
        )}
      </div>
    );
  }

  // If mask is specified, use text input with masking
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

        {/* Calendar icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaCalendar className="h-4 w-4" />
        </div>
      </div>

      {/* Date shortcuts */}
      {shortcuts.length > 0 && (
        <div className="space-y-2">
          <button type="button" onClick={() => setShowShortcuts(!showShortcuts)} className="text-sm text-[#1e51ab] hover:text-[#163d82] font-medium transition-colors duration-200">
            {showShortcuts ? 'Masquer les raccourcis' : 'Afficher les raccourcis'}
          </button>

          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-2"
            >
              {shortcuts.map((shortcut) => (
                <motion.button
                  key={shortcut.value}
                  type="button"
                  onClick={() => handleShortcutSelect(shortcut.value)}
                  className="p-2 text-left text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#1e51ab] transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium text-gray-900">{shortcut.label}</div>
                  <div className="text-xs text-gray-500">{shortcut.description}</div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600">
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default React.memo(DateField);
