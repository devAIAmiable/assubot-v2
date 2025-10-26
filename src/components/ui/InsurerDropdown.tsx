import { FaSpinner, FaSearch } from 'react-icons/fa';
import React, { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
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
  const { setValue, watch } = useFormContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
  }, 300);

  const {
    insurers,
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore,
    error: insurersError,
  } = usePaginatedInsurers({
    searchQuery,
    limit: 20,
    isActive: true,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const selectedValue = useMemo(() => watch(name), [watch, name]);

  const insurerOptions: DropdownOption[] = useMemo(() => {
    return insurers.map((insurer) => ({
      value: insurer.id,
      label: insurer.name,
    }));
  }, [insurers]);

  const handleValueChange = useCallback((value: string) => setValue(name, value), [setValue, name]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      // Trigger load more when user scrolls to within 50px of the bottom
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !isLoadingMore) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  const getErrorMessage = useCallback(() => {
    if (!insurersError) return error;
    const errorData = insurersError as { data?: { message?: string }; message?: string };
    const message = errorData?.data?.message || errorData?.message || 'Impossible de charger la liste des assureurs';
    return message;
  }, [insurersError, error]);

  const getPlaceholder = () => {
    if (isLoading) return 'Chargement des assureurs...';
    if (insurersError) return 'Erreur de chargement';
    if (searchQuery.trim()) return `Recherche: "${searchQuery}"`;
    return placeholder;
  };

  return (
    <div className={`space-y-2 ${className}`} aria-busy={isLoading}>
      <label htmlFor={`${name}-dropdown`} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {isLoading && insurers.length === 0 && (
          <span className="ml-2 text-xs text-blue-600">
            <FaSpinner className="inline animate-spin mr-1" /> Chargement...
          </span>
        )}
      </label>

      <Dropdown
        id={`${name}-dropdown`}
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
          Aucun résultat pour "{searchQuery}".
        </p>
      )}
    </div>
  );
};

export default InsurerDropdown;
