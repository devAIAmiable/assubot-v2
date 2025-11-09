import { FaFlag, FaGlobe, FaMapMarkedAlt, FaSearch, FaTimes } from 'react-icons/fa';

import type { ContractZone } from '../../../../types/contract';
import React from 'react';
import { motion } from 'framer-motion';

type ZoneFilterType = 'all' | ContractZone['type'];

interface ZoneFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: ZoneFilterType;
  onTypeChange: (value: ZoneFilterType) => void;
  zoneCounts: Record<string, number>;
  onResetFilters: () => void;
}

const FILTERS: Array<{ value: ZoneFilterType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { value: 'all', label: 'Tous', icon: FaGlobe },
  { value: 'country', label: 'Pays', icon: FaFlag },
  { value: 'zone', label: 'Zones', icon: FaMapMarkedAlt },
  { value: 'region', label: 'Régions', icon: FaMapMarkedAlt },
  { value: 'city', label: 'Villes', icon: FaMapMarkedAlt },
];

const ZoneFilters: React.FC<ZoneFiltersProps> = ({ searchQuery, onSearchChange, typeFilter, onTypeChange, zoneCounts, onResetFilters }) => {
  const hasActiveFilters = searchQuery.length > 0 || typeFilter !== 'all';

  return (
    <motion.div layout className="flex flex-col gap-3" transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="search"
          placeholder="Rechercher une zone..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
          aria-label="Rechercher une zone géographique"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
            aria-label="Effacer la recherche"
          >
            <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label, icon: Icon }) => {
          const count = zoneCounts[value] || 0;
          const isActive = typeFilter === value;

          return (
            <button
              key={value}
              onClick={() => onTypeChange(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={`Filtrer par ${label}`}
              aria-pressed={isActive}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
              <span className={`text-xs ${isActive ? 'text-blue-200' : 'text-gray-500'}`}>{count}</span>
            </button>
          );
        })}

        {hasActiveFilters && (
          <button onClick={onResetFilters} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 underline" aria-label="Réinitialiser les filtres">
            Réinitialiser
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ZoneFilters;
