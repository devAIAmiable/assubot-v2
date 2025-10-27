import { FaSpinner, FaSearch } from 'react-icons/fa';
import React, { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce, useDebouncedCallback } from 'use-debounce';

import Dropdown, { type DropdownOption } from './Dropdown';
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
  const [searchQuery, setSearchQuery] = useState('');
  const { setValue, watch } = useFormContext();

  // Debounce search query
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Use the new paginated insurers hook
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

  const selectedValue = watch(name);

  // Transform insurers to dropdown options (API already returns sorted data)
  const insurerOptions: DropdownOption[] = useMemo(() => {
    return insurers
      .filter((insurer) => insurer.isActive)
      .map((insurer) => ({
        value: insurer.id,
        label: insurer.name,
      }));
  }, [insurers]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleValueChange = useCallback(
    (value: string) => {
      setValue(name, value);
    },
    [setValue, name]
  );

  // Simplified scroll handler using useDebouncedCallback
  const handleScroll = useDebouncedCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isNearBottom && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, 100);

  // Enhanced error message extraction
  const getErrorMessage = () => {
    if (!insurersError) return error;
    if (typeof insurersError === 'object' && insurersError && 'data' in insurersError) {
      const errorData = (insurersError as { data?: { message?: string } }).data;
      return errorData?.message || 'Impossible de charger la liste des assureurs';
    }
    return 'Impossible de charger la liste des assureurs';
  };

  const getPlaceholder = () => {
    if (isLoading) return 'Chargement des assureurs...';
    if (insurersError) return 'Erreur de chargement';
    if (searchQuery.trim()) return `Recherche: "${searchQuery}"`;
    return placeholder;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={`${name}-dropdown`} id={`${name}-label`} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {isLoading && insurers.length === 0 && (
          <span className="ml-2 text-xs text-blue-600">
            <FaSpinner className="inline animate-spin mr-1" />
            Chargement...
          </span>
        )}
      </label>

      <Dropdown
        id={`${name}-dropdown`}
        aria-labelledby={`${name}-label`}
        options={insurerOptions}
        value={selectedValue}
        onChange={handleValueChange}
        placeholder={getPlaceholder()}
        error={getErrorMessage()}
        disabled={disabled || (isLoading && insurers.length === 0)}
        searchable
        onSearchChange={handleSearchChange}
        searchPlaceholder="Rechercher un assureur..."
        noOptionsMessage={searchQuery.trim() ? `Aucun assureur trouvé pour "${searchQuery}"` : 'Aucun assureur disponible'}
        onScroll={handleScroll}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />

      {isLoadingMore && (
        <div className="flex items-center justify-center py-2 text-xs text-gray-500">
          <FaSpinner className="animate-spin mr-2" />
          Chargement de plus d'assureurs...
        </div>
      )}

      {searchQuery.trim() && insurerOptions.length === 0 && !isLoading && (
        <p className="text-xs text-gray-500">
          <FaSearch className="inline mr-1" />
          Aucun résultat pour "{searchQuery}". Essayez un autre terme de recherche.
        </p>
      )}
    </div>
  );
};

export default InsurerDropdown;
