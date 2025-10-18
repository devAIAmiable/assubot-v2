import { FaSpinner, FaSearch } from 'react-icons/fa';
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import Dropdown, { type DropdownOption } from './Dropdown';
import { useGetInsurersQuery, type Insurer } from '../../store/insurersApi';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [allInsurers, setAllInsurers] = useState<Insurer[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { setValue, watch } = useFormContext();

  const isMountedRef = useRef(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const shouldSkipQuery = false;

  const {
    data: insurersData,
    isLoading: insurersLoading,
    error: insurersError,
  } = useGetInsurersQuery(
    {
      page: currentPage,
      limit: 20,
      search: debouncedSearchQuery.trim() || undefined,
      isActive: true,
      sortBy: 'name',
      sortOrder: 'asc',
    },
    {
      skip: shouldSkipQuery,
    }
  );
  const selectedValue = watch(name);

  useEffect(() => {
    if (insurersData?.data && isMountedRef.current) {
      console.log('📊 Data received:', {
        currentPage,
        dataLength: insurersData.data.length,
        hasNext: insurersData.pagination?.hasNext,
        totalData: insurersData.data
      });

      if (currentPage === 1) {
        console.log('🔄 First page - replacing all insurers');
        setAllInsurers(insurersData.data);
      } else {
        console.log('➕ Subsequent page - appending insurers');
        setAllInsurers((prev) => {
          const existingIds = new Set(prev.map((insurer) => insurer.id));
          const newInsurers = insurersData.data.filter((insurer) => !existingIds.has(insurer.id));
          console.log('🔗 Appending:', {
            prevLength: prev.length,
            newInsurersLength: newInsurers.length,
            totalAfter: prev.length + newInsurers.length
          });
          return [...prev, ...newInsurers];
        });
      }
      setHasMore(insurersData.pagination?.hasNext || false);
    }
  }, [insurersData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setAllInsurers([]);
  }, [debouncedSearchQuery]);

  const insurerOptions: DropdownOption[] = useMemo(() => {
    return allInsurers
      .filter((insurer) => insurer.isActive)
      .map((insurer) => ({
        value: insurer.id,
        label: insurer.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allInsurers]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleValueChange = useCallback(
    (value: string) => {
      setValue(name, value);
    },
    [setValue, name]
  );
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (!isMountedRef.current) return;

      // Clear previous timeout to debounce scroll events
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

        console.log('🔍 Scroll Debug:', {
          scrollTop,
          scrollHeight,
          clientHeight,
          isNearBottom,
          hasMore,
          isLoadingMore,
          insurersLoading,
          currentPage,
          allInsurersLength: allInsurers.length
        });

        if (isNearBottom && hasMore && !isLoadingMore && !insurersLoading) {
          console.log('📄 Loading next page:', currentPage + 1);
          setIsLoadingMore(true);
          setCurrentPage((prev) => prev + 1);
        }
      }, 100); // 100ms debounce for scroll
    },
    [hasMore, isLoadingMore, insurersLoading, currentPage, allInsurers.length]
  );

  useEffect(() => {
    if (insurersData && isLoadingMore && isMountedRef.current) {
      setIsLoadingMore(false);
    }
  }, [insurersData, isLoadingMore]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      setIsLoadingMore(false);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const getPlaceholder = () => {
    if (insurersLoading) return 'Chargement des assureurs...';
    if (insurersError) return 'Erreur de chargement';
    if (searchQuery.trim()) return `Recherche: "${searchQuery}"`;
    return placeholder;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {insurersLoading && (
          <span className="ml-2 text-xs text-blue-600">
            <FaSpinner className="inline animate-spin mr-1" />
            Chargement...
          </span>
        )}
      </label>

      <Dropdown
        options={insurerOptions}
        value={selectedValue}
        onChange={handleValueChange}
        placeholder={getPlaceholder()}
        error={error}
        disabled={disabled || insurersLoading}
        searchable
        onSearchChange={handleSearchChange}
        searchPlaceholder="Rechercher un assureur..."
        noOptionsMessage={searchQuery.trim() ? `Aucun assureur trouvé pour "${searchQuery}"` : 'Aucun assureur disponible'}
        onScroll={handleScroll}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />

      {(error || insurersError) && <p className="text-xs text-red-600">⚠️ {error || 'Impossible de charger la liste des assureurs'}</p>}

      {isLoadingMore && (
        <div className="flex items-center justify-center py-2 text-xs text-gray-500">
          <FaSpinner className="animate-spin mr-2" />
          Chargement de plus d'assureurs...
        </div>
      )}

      {searchQuery.trim() && insurerOptions.length === 0 && !insurersLoading && (
        <p className="text-xs text-gray-500">
          <FaSearch className="inline mr-1" />
          Aucun résultat pour "{searchQuery}". Essayez un autre terme de recherche.
        </p>
      )}
    </div>
  );
};

export default InsurerDropdown;
