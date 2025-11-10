import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaMapMarkedAlt } from 'react-icons/fa';
import React, { useMemo, useState } from 'react';
import { getZoneIcon, getZoneTypeLabel } from '../../../../utils/map';

import type { ContractZone } from '../../../../types/contract';
import { capitalizeFirst } from '../../../../utils/text';

interface ZoneCardProps {
  zone: ContractZone;
  zoneKey: string;
  zoneIndex: number;
  isExpanded: boolean;
  onToggle: (zoneKey: string) => void;
  onFocus: (zoneCode: string) => void;
  onHover: (zoneCode: string | null) => void;
  onSelect: (zone: ContractZone) => void;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone, zoneKey, zoneIndex, isExpanded, onToggle, onFocus, onHover, onSelect }) => {
  const [hasFlagError, setHasFlagError] = useState(false);
  const countryCode = useMemo(() => zone.code?.toUpperCase() ?? null, [zone.code]);
  const showFlag = zone.type === 'country' && countryCode && countryCode.length === 2 && !hasFlagError;
  const ZoneIcon = useMemo(() => getZoneIcon(zone.type), [zone.type]);
  const hasConditions = !!zone.conditions && zone.conditions.length > 0;
  const layoutId = zone.id ?? zoneKey;
  const zoneName = zone.name || zone.label;

  return (
    <motion.div
      id={`zone-card-${layoutId}`}
      layout
      layoutId={`zone-${layoutId}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: zoneIndex * 0.03,
        type: 'spring',
        stiffness: 120,
        damping: 14,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => onHover(countryCode)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(zone)}
      className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group"
    >
      {countryCode && (
        <motion.button
          onClick={(event) => {
            event.stopPropagation();
            onFocus(countryCode);
          }}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          aria-label={`Localiser ${zoneName} sur la carte`}
          title="Localiser sur la carte"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaMapMarkedAlt className="h-4 w-4" />
        </motion.button>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {showFlag ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
              <img
                src={`/flags/${zone.type}/${countryCode}.png`}
                loading="lazy"
                alt={`Drapeau ${zoneName}`}
                className="w-full h-full object-cover"
                onError={() => setHasFlagError(true)}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ZoneIcon className="h-5 w-5 text-[#1e51ab]" />
            </div>
          )}
          <div className="flex-1 min-w-0 pr-8">
            <h5 className="text-sm font-semibold text-gray-900 mb-1">{capitalizeFirst(zoneName)}</h5>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{getZoneTypeLabel(zone.type)}</span>
              {countryCode && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono">{countryCode}</span>}
            </div>
          </div>
        </div>
      </div>

      {hasConditions ? (
        <div className="px-4 pb-4">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggle(zoneKey);
            }}
            className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 rounded-lg transition-colors group/btn"
          >
            <span className="text-sm font-medium text-blue-700">
              {zone.conditions!.length} condition{zone.conditions!.length > 1 ? 's' : ''} spécifique{zone.conditions!.length > 1 ? 's' : ''}
            </span>
            <FaChevronDown className={`h-3.5 w-3.5 text-blue-700 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2">
                <div className="space-y-1.5">
                  {zone.conditions!.map((condition, conditionIndex) => (
                    <div
                      key={`${zoneKey}-condition-${conditionIndex}`}
                      className="flex items-start gap-2 text-xs text-gray-700 bg-blue-50 border-l-2 border-blue-500 rounded-r-lg p-2"
                    >
                      <span className="mt-0.5 text-blue-600 font-bold">•</span>
                      <span>{condition}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 text-center">Aucune condition spécifique</div>
        </div>
      )}
    </motion.div>
  );
};

export default ZoneCard;
