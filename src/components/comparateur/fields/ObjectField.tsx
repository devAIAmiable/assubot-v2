import React, { useState } from 'react';

import type { FormField } from '../../../types/comparison';

interface ObjectFieldProps {
  field: FormField;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  error?: string;
}

const ObjectField: React.FC<ObjectFieldProps> = ({ field, value, onChange, error }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // For now, we'll render object fields as a simple textarea for JSON input
  // In a real implementation, this would be more sophisticated based on the object schema
  const handleTextChange = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      onChange(parsed);
    } catch {
      // If JSON is invalid, store as empty object
      onChange({});
    }
  };

  const getDisplayValue = () => {
    if (value && typeof value === 'object' && Object.keys(value).length > 0) {
      return JSON.stringify(value, null, 2);
    }
    return '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-[#1e51ab] hover:text-[#163d82] font-medium">
          {isExpanded ? 'Masquer' : 'Configurer'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          <textarea
            value={getDisplayValue()}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={field.placeholder || 'Saisissez les données au format JSON...'}
            className={`
              w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent
              ${error ? 'border-red-300' : 'border-gray-300'}
              font-mono text-sm
            `}
            rows={6}
          />

          <div className="text-xs text-gray-500">Format JSON attendu. Laissez vide pour un objet vide.</div>
        </div>
      )}

      {!isExpanded && value && Object.keys(value).length > 0 && (
        <div className="p-3 bg-gray-50 border rounded-lg">
          <div className="text-sm text-gray-600">
            Configuration enregistrée ({Object.keys(value).length} propriété{Object.keys(value).length > 1 ? 's' : ''})
          </div>
        </div>
      )}

      {field.helperText && <p className="text-sm text-gray-500">{field.helperText}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ObjectField;
