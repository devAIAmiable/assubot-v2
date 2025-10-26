import { Combobox, Transition } from '@headlessui/react';
import { FaCheck, FaChevronDown, FaSpinner } from 'react-icons/fa';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { FormField } from '../../../types/comparison';
import { motion } from 'framer-motion';
import { renderIcon } from '../../../utils/iconMapper';
import { useInsurerAutocomplete } from '../../../services/autocompleteService';

interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface AutocompleteFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({ field, value, onChange, error }) => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Use RTK Query hook for insurer search
  const { searchInsurers, isLoading: rtkLoading } = useInsurerAutocomplete();

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!field.autocomplete) return;

      setIsLoading(true);
      setErrorMessage(null);

      try {
        // Use RTK Query for insurer endpoint
        if (field.autocomplete.endpoint === '/insurers') {
          const result = await searchInsurers(searchQuery);
          setOptions(result.options);
          setIsOpen(true);
          setErrorMessage(result.error || null);
        } else {
          // Fallback for other endpoints (could be extended)
          console.warn(`Autocomplete endpoint not implemented: ${field.autocomplete.endpoint}`);
          setOptions([]);
        }
      } catch (error) {
        console.error('Autocomplete search failed:', error);
        setOptions([]);
        setErrorMessage('Erreur lors de la recherche');
      } finally {
        setIsLoading(false);
      }
    },
    [field.autocomplete, searchInsurers]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);

    // If the input doesn't match any option, clear the value
    const matchingOption = options.find((opt) => opt.label.toLowerCase() === newValue.toLowerCase());
    if (!matchingOption && newValue !== '') {
      onChange('');
    } else if (matchingOption) {
      onChange(matchingOption.value);
    }
  };

  // Debounce search
  useEffect(() => {
    if (!field.autocomplete || query.length < field.autocomplete.minLength) {
      setOptions([]);
      setIsOpen(false);
      setErrorMessage(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, field.autocomplete.debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, field.autocomplete, performSearch]);

  const handleOptionSelect = (option: AutocompleteOption) => {
    setQuery(option.label);
    onChange(option.value);
    setIsOpen(false);
  };

  // const handleClear = () => {
  //   setQuery('');
  //   onChange('');
  //   setIsOpen(false);
  //   setOptions([]);
  // };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  const displayValue = query || options.find((opt) => opt.value === value)?.label || '';

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <div className="relative w-full">
            <Combobox.Input
              className={`w-full rounded-lg border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-[#1e51ab] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e51ab] sm:text-sm ${
                error ? 'border-red-300' : ''
              }`}
              displayValue={() => displayValue}
              onChange={handleInputChange}
              placeholder={field.placeholder || 'Rechercher...'}
              autoComplete="off"
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {isLoading || rtkLoading ? <FaSpinner className="h-4 w-4 animate-spin text-gray-400" /> : <FaChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />}
            </div>
          </div>

          <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')}>
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-500">{isLoading || rtkLoading ? 'Recherche...' : 'Aucun résultat trouvé.'}</div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.value}
                    className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#1e51ab] text-white' : 'text-gray-900'}`}
                    value={option.value}
                    onClick={() => handleOptionSelect(option)}
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
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>

      {field.helperText && <p className="text-sm text-gray-500">{field.helperText}</p>}

      {errorMessage && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600">
          {errorMessage}
        </motion.div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default React.memo(AutocompleteField);
