import type { FormField } from '../../../types/comparison';
import React from 'react';

interface TextAreaFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        required={field.required}
      />
      {field.helperText && <p className="text-sm text-gray-500">{field.helperText}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default React.memo(TextAreaField);
