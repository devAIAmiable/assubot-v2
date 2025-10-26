import { FaCheckCircle, FaChevronDown, FaSearch, FaSpinner } from 'react-icons/fa';
import { Listbox, Transition } from '@headlessui/react';
import React, { useMemo, useState } from 'react';

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
  searchable?: boolean;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  id?: string;
  'aria-labelledby'?: string;
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
  searchable = false,
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  noOptionsMessage = 'Aucune option disponible',
  onScroll,
  hasMore = false,
  isLoadingMore = false,
  id,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchQuery, searchable]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              id={id}
              aria-labelledby={ariaLabelledBy}
              onClick={() => setIsOpen(!isOpen)}
              className={`relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                error ? 'border border-red-300 focus:ring-red-500' : 'border border-gray-300 hover:border-gray-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`block truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>{selectedOption?.label || placeholder}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <FaChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options
                className="absolute z-10 mt-1 max-h-80 w-full overflow-y-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                onScroll={onScroll}
              >
                {/* Search input */}
                {searchable && (
                  <div className="px-3 py-2 border-b border-gray-200">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}

                {/* Options */}
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2.5 pl-3 pr-9 transition-colors duration-150 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`
                      }
                      value={option.value}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{option.label}</span>
                          {selected ? (
                            <span className={`absolute inset-y-0 right-0 flex items-center pr-3 ${active ? 'text-blue-600' : 'text-blue-500'}`}>
                              <FaCheckCircle className="h-4 w-4" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">{noOptionsMessage}</div>
                )}

                {/* Loading more indicator */}
                {hasMore && (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center border-t border-gray-200">
                    {isLoadingMore ? (
                      <div className="flex items-center justify-center space-x-2">
                        <FaSpinner className="animate-spin h-4 w-4" />
                        <span>Chargement...</span>
                      </div>
                    ) : (
                      <span>Faites défiler pour charger plus</span>
                    )}
                  </div>
                )}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Dropdown;
