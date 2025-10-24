import { FaSpinner, FaSearch } from 'react-icons/fa';
import React, { useCallback, useState, useEffect, useRef } from 'react';

import type { FormField } from '../../../types/comparison';
import { useLazyGetInsurersQuery, type Insurer } from '../../../store/insurersApi';

interface InsurerFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  category?: 'auto' | 'home' | 'health' | 'life' | 'disability';
}

const InsurerField: React.FC<InsurerFieldProps> = ({ field, value, onChange, error, category }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [getInsurers] = useLazyGetInsurersQuery();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          const result = await getInsurers({
            page: 1,
            limit: 20,
            search: searchQuery.trim(),
            isActive: true,
            category: category,
            sortBy: 'name',
            sortOrder: 'asc',
          }).unwrap();

          setInsurers(result.data || []);
        } catch (error) {
          console.error('Error fetching insurers:', error);
          setInsurers([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setInsurers([]);
      }
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, getInsurers, category]);

  const handleSelect = useCallback(
    (insurer: Insurer) => {
      onChange(insurer.id);
      setIsOpen(false);
      setSearchQuery(insurer.name);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={field.placeholder || 'Rechercher un assureur...'}
          className={`w-full px-3 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <FaSpinner className="h-4 w-4 text-gray-400 animate-spin" />
          </div>
        )}

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {insurers.length > 0 ? (
              insurers.map((insurer) => (
                <button
                  key={insurer.id}
                  type="button"
                  onClick={() => handleSelect(insurer)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${value === insurer.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}`}
                >
                  {insurer.name}
                </button>
              ))
            ) : searchQuery.trim().length >= 2 && !isLoading ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                <FaSearch className="inline mr-1" />
                Aucun assureur trouvé pour "{searchQuery}"
              </div>
            ) : searchQuery.trim().length < 2 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">Tapez au moins 2 caractères pour rechercher</div>
            ) : null}
          </div>
        )}
      </div>

      {field.helperText && <p className="text-sm text-gray-500">{field.helperText}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default React.memo(InsurerField);
