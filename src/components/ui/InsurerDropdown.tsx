import { FaChevronDown, FaSearch, FaSpinner } from 'react-icons/fa';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Insurer } from '../../store/insurersApi';
import { useDebounce } from 'use-debounce';
import { useFormContext } from 'react-hook-form';
import { usePaginatedInsurers } from '../../hooks/usePaginatedInsurers';

interface InsurerDropdownProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const InsurerDropdown: React.FC<InsurerDropdownProps> = ({
  name,
  label = 'Assureur',
  placeholder = 'Sélectionnez un assureur',
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search query
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Watch form value
  const selectedValue = watch(name);
  const fieldError = error || errors[name]?.message;

  // Paginated insurers hook
  const {
    insurers,
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore,
    error: insurersError,
  } = usePaginatedInsurers({
    searchQuery: debouncedSearchQuery,
    limit: 20,
    isActive: true,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Find selected insurer
  const selectedInsurer = useMemo(() => {
    if (!selectedValue) return null;
    return insurers.find((insurer) => insurer.id === selectedValue) || null;
  }, [selectedValue, insurers]);

  // Filter insurers based on search
  const filteredInsurers = useMemo(() => {
    return insurers.filter((insurer) => insurer.isActive && insurer.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [insurers, searchQuery]);

  // Event handlers
  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  }, [disabled]);

  const handleSelect = useCallback(
    (insurer: Insurer) => {
      setValue(name, insurer.id, { shouldValidate: true, shouldDirty: true });
      setIsOpen(false);
      setSearchQuery('');
    },
    [setValue, name]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const getPlaceholder = () => {
    if (isLoading && insurers.length === 0) return 'Chargement des assureurs...';
    if (insurersError) return 'Erreur de chargement';
    return placeholder;
  };

  const getErrorMessage = () => {
    if (fieldError) return String(fieldError);
    if (insurersError) return 'Impossible de charger la liste des assureurs';
    return null;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label htmlFor={`${name}-dropdown`} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {isLoading && insurers.length === 0 && (
          <span className="ml-2 text-xs text-blue-600 flex items-center">
            <FaSpinner className="inline animate-spin mr-1" />
            Chargement...
          </span>
        )}
      </label>

      {/* Dropdown */}
      <div ref={dropdownRef} className="relative">
        {/* Button */}
        <button
          type="button"
          id={`${name}-dropdown`}
          onClick={handleToggle}
          disabled={disabled || (isLoading && insurers.length === 0)}
          className={`
            relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all duration-200 border
            ${fieldError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}
            ${disabled || (isLoading && insurers.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span className={`block truncate ${selectedInsurer ? 'text-gray-900' : 'text-gray-500'}`}>{selectedInsurer?.name || getPlaceholder()}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FaChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {/* Search Input */}
            <div className="px-3 py-2 border-b border-gray-200 sticky top-0 bg-white">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher un assureur..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Options */}
            {filteredInsurers.length > 0 ? (
              <>
                {filteredInsurers.map((insurer) => (
                  <button
                    key={insurer.id}
                    type="button"
                    onClick={() => handleSelect(insurer)}
                    className={`
                      relative w-full cursor-default select-none py-2.5 pl-3 pr-9 text-left
                      hover:bg-blue-50 hover:text-blue-900 transition-colors duration-150
                      ${selectedInsurer?.id === insurer.id ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-900'}
                    `}
                  >
                    <span className="block truncate">{insurer.name}</span>
                    {selectedInsurer?.id === insurer.id && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500">✓</span>}
                  </button>
                ))}

                {/* Load More Button */}
                {hasMore && !isLoadingMore && (
                  <div className="px-3 py-2 border-t border-gray-200">
                    <button type="button" onClick={handleLoadMore} className="w-full text-center text-xs text-blue-600 hover:text-blue-800 underline transition-colors py-1">
                      Charger plus d'assureurs
                    </button>
                  </div>
                )}

                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="px-3 py-2 border-t border-gray-200">
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <FaSpinner className="animate-spin mr-2" />
                      Chargement...
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">{searchQuery.trim() ? `Aucun assureur trouvé pour "${searchQuery}"` : 'Aucun assureur disponible'}</div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {fieldError && (
        <div className="flex items-center text-sm text-red-600">
          <span className="mr-2">⚠</span>
          {getErrorMessage()}
        </div>
      )}
    </div>
  );
};

export default InsurerDropdown;
