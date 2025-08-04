import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors ${
          error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 hover:border-gray-400'
        } ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default Input; 