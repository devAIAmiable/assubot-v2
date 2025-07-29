import { FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import { Listbox, Transition } from '@headlessui/react';

import React from 'react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner une option',
  label,
  error,
  disabled = false,
  className = '',
}) => {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={`relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              error
                ? 'border border-red-300 focus:ring-red-500'
                : 'border border-gray-300 hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`block truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
              {selectedOption?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <FaChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2.5 pl-3 pr-9 transition-colors duration-150 ${
                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                            active ? 'text-blue-600' : 'text-blue-500'
                          }`}
                        >
                          <FaCheckCircle className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Dropdown; 