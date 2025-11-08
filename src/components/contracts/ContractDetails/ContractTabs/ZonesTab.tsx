import { AnimatePresence, motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Graticule, Marker, ZoomableGroup } from 'react-simple-maps';
import type { Contract, ContractZone } from '../../../../types/contract';
import { FaChevronDown, FaFilter, FaFlag, FaGlobe, FaMagic, FaMapMarkedAlt, FaSearch, FaTimes } from 'react-icons/fa';
import React, { useMemo, useState } from 'react';

import AIDisclaimer from '../ui/AIDisclaimer';
import PendingSummarizationMessage from '../ui/PendingSummarizationMessage';
import { capitalizeFirst } from '../../../../utils/text';

interface ZonesTabProps {
  contract: Contract;
  summarizeStatus?: Contract['summarizeStatus'];
  isProcessing: boolean;
  isSummarizing: boolean;
  onSummarize: () => void;
}

const geographyUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const getZoneCoordinates = (zone: ContractZone): [number, number] | null => {
  const latitudeValue = zone.latitude ?? undefined;
  const longitudeValue = zone.longitude ?? undefined;

  const latitude = latitudeValue !== undefined && latitudeValue !== '' ? Number(latitudeValue) : undefined;
  const longitude = longitudeValue !== undefined && longitudeValue !== '' ? Number(longitudeValue) : undefined;

  if (typeof latitude === 'number' && Number.isFinite(latitude) && typeof longitude === 'number' && Number.isFinite(longitude)) {
    return [longitude, latitude];
  }

  return null;
};

const getZoneIcon = (type: ContractZone['type']) => {
  switch (type) {
    case 'country':
      return FaFlag;
    case 'zone':
    case 'region':
    case 'city':
      return FaMapMarkedAlt;
    default:
      return FaGlobe;
  }
};

const getZoneTypeLabel = (type: ContractZone['type']): string => {
  switch (type) {
    case 'country':
      return 'Pays';
    case 'zone':
      return 'Zone';
    case 'region':
      return 'Région';
    case 'city':
      return 'Ville';
    default:
      return 'Zone';
  }
};

const ZonesTab: React.FC<ZonesTabProps> = ({ contract, summarizeStatus, isProcessing, isSummarizing, onSummarize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ContractZone['type']>('all');
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);

  const zones = useMemo(() => contract.zones ?? [], [contract.zones]);

  const filteredZones = useMemo(() => {
    return zones
      .filter((zone) => {
        const zoneName = zone.name?.toLowerCase() ?? '';
        const matchesSearch = zoneName.includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || zone.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const labelA = getZoneTypeLabel(a.type);
        const labelB = getZoneTypeLabel(b.type);
        if (labelA !== labelB) {
          return labelA.localeCompare(labelB, 'fr', { sensitivity: 'base' });
        }
        return (a.name ?? '').localeCompare(b.name ?? '', 'fr', { sensitivity: 'base' });
      });
  }, [zones, searchQuery, typeFilter]);

  const geographiesMemo = useMemo(
    () => (
      <Geographies geography={geographyUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isHighlighted = filteredZones.some((zone) => {
              const zoneCode = zone.code?.toUpperCase();
              const geoCode = String(geo.properties.iso_a2 || geo.properties.ISO_A2 || '').toUpperCase();
              if (zoneCode && geoCode && geoCode !== 'ZZ') {
                return geoCode === zoneCode;
              }

              const geoName = geo.properties.name?.toLowerCase();
              const zoneName = zone.name?.toLowerCase();
              return !!zoneName && !!geoName && geoName === zoneName;
            });

            return (
              <g key={geo.rsmKey} style={{ cursor: 'crosshair' }}>
                <title>{geo.properties.name}</title>
                <Geography
                  geography={geo}
                  fill={isHighlighted ? '#1e51ab' : '#cedaf0'}
                  stroke="#fff"
                  strokeWidth={1}
                  style={{
                    default: { outline: 'none' },
                    hover: {
                      fill: isHighlighted ? '#163d82' : '#e2e8f0',
                      outline: 'none',
                    },
                    pressed: { outline: 'none' },
                  }}
                />
              </g>
            );
          })
        }
      </Geographies>
    ),
    [filteredZones]
  );

  const handleToggleZone = (zoneId: string) => {
    setExpandedZoneId((prev) => (prev === zoneId ? null : zoneId));
  };

  if (summarizeStatus === 'pending' || summarizeStatus === 'ongoing') {
    return (
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
        <PendingSummarizationMessage status={summarizeStatus} isProcessing={isProcessing} isSummarizing={isSummarizing} onSummarize={onSummarize} />
        <AIDisclaimer />
      </div>
    );
  }

  return (
    <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0 space-y-6">
      {zones.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaGlobe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Aucune zone géographique définie</h4>
          <p className="text-sm sm:text-base text-gray-600">Lancez l'analyse IA pour générer les zones couvertes par ce contrat.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaGlobe className="h-5 w-5 sm:h-6 sm:w-6 text-[#1e51ab]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex flex-wrap items-center gap-2">
                  <span>Zones géographiques</span>
                  <FaMagic className="h-4 w-4 text-blue-500 flex-shrink-0" title="Généré par IA" />
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {filteredZones.length} zone{filteredZones.length > 1 ? 's' : ''} de couverture
                  {(searchQuery || typeFilter !== 'all') && ` (filtré${filteredZones.length > 1 ? 's' : ''})`}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Effacer la recherche de zones">
                    <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value as ZonesTabProps['contract']['zones'][number]['type'] | 'all')}
                    className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">Tous</option>
                    <option value="country">Pays</option>
                    <option value="zone">Zones</option>
                    <option value="region">Régions</option>
                    <option value="city">Villes</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FaChevronDown className="h-3 w-3 text-gray-400" />
                  </div>
                </div>

                {(searchQuery || typeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setTypeFilter('all');
                    }}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredZones.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <FaSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune zone trouvée</h4>
              <p className="text-sm text-gray-600">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Carte interactive des zones</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#1e51ab]" />
                        <span className="text-gray-600">Zones couvertes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-300" />
                        <span className="text-gray-600">Autres régions</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[300px] sm:h-[400px] lg:h-[550px] bg-gray-50 overflow-hidden relative">
                  <ComposableMap
                    projection="geoEqualEarth"
                    projectionConfig={{
                      scale: 190,
                      center: [0, 15],
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <ZoomableGroup>
                      <Graticule stroke="#e2e8f0" strokeWidth={1} />
                      {geographiesMemo}
                      {filteredZones.map((zone) => {
                        const coordinates = getZoneCoordinates(zone);
                        if (!coordinates) return null;

                        return (
                          <Marker key={zone.id} coordinates={coordinates}>
                            <g>
                              <circle r="8" fill="#1e51ab" opacity="0.2">
                                <animate attributeName="r" from="4" to="12" dur="2s" begin="0s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
                              </circle>
                              <circle r="3" fill="#1e51ab" stroke="#fff" strokeWidth="1.5" />
                              <text
                                textAnchor="middle"
                                y="-15"
                                style={{
                                  fontFamily: 'system-ui',
                                  fill: '#1e51ab',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  textShadow: '1px 1px 3px rgba(255,255,255,0.9)',
                                }}
                              >
                                {capitalizeFirst(zone.name)}
                              </text>
                            </g>
                          </Marker>
                        );
                      })}
                    </ZoomableGroup>
                  </ComposableMap>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 text-center">Utilisez la molette de votre souris pour zoomer et dézoomer sur la carte</p>
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 px-1">Liste des zones de couverture</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredZones.map((zone, zoneIndex) => {
                    const zoneKey = zone.id ?? `${zone.code ?? zone.name ?? 'zone'}-${zoneIndex}`;
                    const ZoneIcon = getZoneIcon(zone.type);
                    const hasConditions = zone.conditions && zone.conditions.length > 0;
                    const isExpanded = expandedZoneId === zoneKey;

                    return (
                      <motion.div
                        key={zoneKey}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#1e51ab] transition-all group ${
                          isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                              <ZoneIcon className="h-5 w-5 text-[#1e51ab]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-semibold text-gray-900">{capitalizeFirst(zone.name)}</h5>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{getZoneTypeLabel(zone.type)}</span>
                              </div>
                              {zone.code && <p className="text-xs text-gray-500 mt-1">Code : {zone.code}</p>}
                            </div>
                          </div>
                        </div>
                        {hasConditions ? (
                          <div className="p-4">
                            <button onClick={() => handleToggleZone(zoneKey)} className="w-full flex items-center justify-between text-left group/btn">
                              <span className="text-sm font-semibold text-[#1e51ab]">Voir les conditions spécifiques</span>
                              <FaChevronDown className={`h-4 w-4 text-[#1e51ab] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-3 space-y-2">
                                    {zone.conditions!.map((condition, conditionIndex) => (
                                      <div key={`${zoneKey}-condition-${conditionIndex}`} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                                        <span className="mt-0.5 text-[#1e51ab]">•</span>
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
                            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">Aucune condition spécifique</div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <AIDisclaimer />
        </>
      )}
    </div>
  );
};

export default ZonesTab;
