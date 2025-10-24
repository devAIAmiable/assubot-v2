import type { FormField } from '../../../types/comparison';
import React from 'react';

interface SliderFieldProps {
  field: FormField;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

const SliderField: React.FC<SliderFieldProps> = ({ field, value, onChange, error }) => {
  const min = field.validation?.min || 0;
  const max = field.validation?.max || 100;
  const step = 0.1; // Default step for slider

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{min}</span>
          <span className="font-medium text-[#1e51ab]">{value}</span>
          <span>{max}</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e51ab]"
            style={{
              background: `linear-gradient(to right, #1e51ab 0%, #1e51ab ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
            }}
          />
        </div>
      </div>

      {field.helperText && <p className="text-sm text-gray-500">{field.helperText}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SliderField;
