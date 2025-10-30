import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';

import FieldHelpTooltip from '../FieldHelpTooltip';
import type { FormField } from '../../../types/comparison';
import { renderIcon } from '../../../utils/iconMapper';

interface SelectFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ field, value, onChange, error }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const ariaDescribedBy = error ? `${field.name}-error` : '';

  // Filter options based on search query
  const filteredOptions = field.options?.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  const selectedOption = field.options?.find((option) => option.value === value);

  // Stable onChange handler to prevent infinite loops
  // Use refs to track value and onChange to avoid dependency issues
  const valueRef = React.useRef(value);
  const onChangeRef = React.useRef(onChange);

  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Create a stable handleChange that never changes
  const handleChange = React.useCallback((newValue: string) => {
    // Only call onChange if value actually changed
    if (newValue !== valueRef.current) {
      onChangeRef.current(newValue);
    }
  }, []); // Empty deps - this callback never changes

  return (
    <div className="space-y-2">
      <label className="flex text-sm font-medium text-gray-700 items-center gap-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        <FieldHelpTooltip helpText={field.helpText} tooltip={field.tooltip} example={field.example} />
      </label>

      <Listbox value={value || ''} onChange={handleChange}>
        <div className="relative">
          <Listbox.Button
            className={`relative w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-[#1e51ab] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e51ab] sm:text-sm ${
              error ? 'border border-red-500' : 'border border-gray-300'
            }`}
            {...(error ? { 'aria-describedby': ariaDescribedBy } : {})}
          >
            <span className="block truncate">{selectedOption ? selectedOption.label : 'Sélectionnez...'}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <FaChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {/* Search input for long lists */}
              {field.options && field.options.length > 5 && (
                <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1e51ab] focus:border-[#1e51ab]"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {filteredOptions.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#1e51ab] text-white' : 'text-gray-900'}`}
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        <div className="flex items-center space-x-2">
                          {option.icon && <span className="text-sm text-gray-600">{renderIcon(option.icon, { className: 'w-4 h-4' })}</span>}
                          <div>
                            <div className="text-sm">{option.label}</div>
                            {option.description && <div className={`text-xs ${active ? 'text-blue-100' : 'text-gray-500'}`}>{option.description}</div>}
                          </div>
                        </div>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#1e51ab]">
                          <FaCheck className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}

              {filteredOptions.length === 0 && searchQuery && <div className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-500">Aucun résultat trouvé.</div>}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {field.helperText && <p className="text-sm text-gray-500">{field.helperText}</p>}
      {error && (
        <p id={`${field.name}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default React.memo(SelectField);
