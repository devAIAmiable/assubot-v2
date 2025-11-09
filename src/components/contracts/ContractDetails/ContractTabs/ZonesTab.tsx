import { AnimatePresence, motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Graticule, Marker, ZoomableGroup } from 'react-simple-maps';
import type { Contract, ContractZone } from '../../../../types/contract';
import { FaGlobe, FaMapMarkedAlt, FaSearch, FaTimes } from 'react-icons/fa';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getZoneCoordinates, getZoneTypeLabel } from '../../../../utils/map';

import AIDisclaimer from '../ui/AIDisclaimer';
import PendingSummarizationMessage from '../ui/PendingSummarizationMessage';
import ZoneCard from './ZoneCard';
import ZoneFilters from './ZoneFilters';
import { capitalizeFirst } from '../../../../utils/text';

interface ZonesTabProps {
  contract: Contract;
  summarizeStatus?: Contract['summarizeStatus'];
  isProcessing: boolean;
  isSummarizing: boolean;
  onSummarize: () => void;
}

const geographyUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface ZoneMarkersProps {
  zones: ContractZone[];
  hoveredZoneCode: string | null;
  zoom: number;
  onZoneClick: (zone: ContractZone, layoutId: string) => void;
  onZoneHover: (code: string | null) => void;
}

const ZoneMarkers = React.memo<ZoneMarkersProps>(({ zones, hoveredZoneCode, zoom, onZoneClick, onZoneHover }) => {
  return (
    <>
      {zones.map((zone, zoneIndex) => {
        const coordinates = getZoneCoordinates(zone);
        if (!coordinates) return null;

        const countryCode = zone.code?.toUpperCase();
        const isCountryWithFlag = zone.type === 'country' && countryCode && countryCode.length === 2;
        const isHovered = hoveredZoneCode ? hoveredZoneCode === countryCode : false;
        const isDimmed = hoveredZoneCode ? hoveredZoneCode !== countryCode : false;

        // Scale markers inversely with zoom
        const markerScale = zoom > 0 ? 1 / zoom : 1;
        const pulseRadius = 8 * markerScale;
        const flagRadius = 10 * markerScale;
        const dotRadius = 3 * markerScale;
        const flagSize = 16 * markerScale;
        const textOffset = isCountryWithFlag ? -18 * markerScale : -15 * markerScale;
        const fontSize = (isCountryWithFlag ? 12 : 11) * markerScale;
        const markerKey = zone.id ?? `${zone.code ?? zone.name ?? 'zone'}-${zoneIndex}`;

        const layoutId = zone.id ?? markerKey;

        const baseColor = isHovered ? '#22c55e' : isDimmed ? '#94a3b8' : '#1e51ab';
        const strokeColor = isHovered ? '#22c55e' : isDimmed ? '#94a3b8' : '#1e51ab';
        const textColor = baseColor;

        return (
          <Marker
            key={markerKey}
            coordinates={coordinates}
            onClick={() => onZoneClick(zone, layoutId)}
            onMouseEnter={() => onZoneHover(countryCode ?? null)}
            onMouseLeave={() => onZoneHover(null)}
          >
            <g
              style={{
                opacity: isDimmed ? 0.35 : 1,
                filter: isDimmed ? 'grayscale(100%) contrast(85%)' : 'none',
                transition: 'opacity 0.2s ease, filter 0.2s ease',
                zIndex: isDimmed ? 0 : 2,
              }}
            >
              <title>{`${capitalizeFirst(zone.name)} • ${getZoneTypeLabel(zone.type)}`}</title>
              {/* Pulse animation - faster when hovered */}
              <circle r={pulseRadius} fill={baseColor} opacity={isDimmed ? '0.05' : '0.2'}>
                <animate attributeName="r" from={pulseRadius * 0.5} to={pulseRadius * 1.5} dur={isHovered ? '1s' : '2s'} begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur={isHovered ? '1s' : '2s'} begin="0s" repeatCount="indefinite" />
              </circle>
              {isCountryWithFlag ? (
                <>
                  <circle
                    r={flagRadius * (isHovered ? 1.15 : 1)}
                    fill="#fff"
                    stroke={strokeColor}
                    strokeWidth={isHovered ? 1.5 * markerScale : 1 * markerScale}
                    opacity={isDimmed ? 0.2 : isHovered ? 1 : 0.9}
                  >
                    {isHovered && <animate attributeName="r" from={flagRadius} to={flagRadius * 1.15} dur="0.3s" fill="freeze" />}
                  </circle>
                  <image
                    href={`/flags/${zone.type}/${countryCode}.png`}
                    x={(-flagSize / 2) * (isHovered ? 1.15 : 1)}
                    y={(-flagSize / 2) * (isHovered ? 1.15 : 1)}
                    width={flagSize * (isHovered ? 1.15 : 1)}
                    height={flagSize * (isHovered ? 1.15 : 1)}
                    clipPath={`circle(${(flagSize / 2) * (isHovered ? 1.15 : 1)}px at ${(flagSize / 2) * (isHovered ? 1.15 : 1)}px ${(flagSize / 2) * (isHovered ? 1.15 : 1)}px)`}
                    opacity={isDimmed ? 0.2 : 1}
                  />
                </>
              ) : (
                <circle r={dotRadius * (isHovered ? 1.3 : 1)} fill={baseColor} stroke="#fff" strokeWidth={0.75 * markerScale} opacity={isDimmed ? 0.05 : isHovered ? 1 : 0.9} />
              )}
              <text
                textAnchor="middle"
                y={textOffset}
                style={{
                  fontFamily: 'system-ui',
                  fill: textColor,
                  opacity: isDimmed ? 0.3 : 1,
                  fontSize: `${fontSize * (isHovered ? 1.1 : 1)}px`,
                  fontWeight: '700',
                  textShadow: isHovered ? '2px 2px 4px rgba(255,255,255,0.95)' : '1px 1px 3px rgba(255,255,255,0.9)',
                  transition: 'all 0.3s ease',
                }}
              >
                {capitalizeFirst(zone.name)}
              </text>
            </g>
          </Marker>
        );
      })}
    </>
  );
});

ZoneMarkers.displayName = 'ZoneMarkers';

const ZonesTab: React.FC<ZonesTabProps> = ({ contract, summarizeStatus, isProcessing, isSummarizing, onSummarize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ContractZone['type']>('all');
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
  const [hoveredZoneCode, setHoveredZoneCode] = useState<string | null>(null);
  const [focusedZoneCode, setFocusedZoneCode] = useState<string | null>(null);
  const [mapPosition, setMapPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 15],
    zoom: 1,
  });
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : false));
  const [isMapOpen, setIsMapOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : false));
  const [activeZone, setActiveZone] = useState<ContractZone | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const zoom = mapPosition.zoom;

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

  // Zone type counts for filter chips
  const zoneCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: zones.length,
      country: 0,
      zone: 0,
      region: 0,
      city: 0,
    };

    zones.forEach((zone) => {
      counts[zone.type]++;
    });

    return counts;
  }, [zones]);

  const geographiesMemo = useMemo(
    () => (
      <Geographies geography={geographyUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            return (
              <g key={geo.rsmKey} style={{ cursor: 'crosshair' }}>
                <title>{geo.properties.name}</title>
                <Geography
                  geography={geo}
                  fill="#e0e7ff"
                  stroke="#fff"
                  strokeWidth={0.75}
                  style={{
                    default: { outline: 'none' },
                    hover: {
                      fill: '#e2e8f0',
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
    []
  );

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') {
        return;
      }
      const isLgScreen = window.innerWidth >= 1024;
      setIsDesktop(isLgScreen);
      setIsMapOpen(isLgScreen);
      if (isLgScreen) {
        setIsLegendOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const zonesForMarkers = useMemo(() => filteredZones, [filteredZones]);

  const handleZoneClick = useCallback((zone: ContractZone, layoutId: string) => {
    const zoneCode = zone.code?.toUpperCase() ?? null;
    setFocusedZoneCode(zoneCode);
    setHoveredZoneCode(zoneCode);

    const coordinates = getZoneCoordinates(zone);
    if (coordinates) {
      setMapPosition((prev) => ({
        coordinates,
        zoom: Math.max(prev.zoom, 3),
      }));
    }

    if (typeof window !== 'undefined') {
      document.getElementById(`zone-card-${layoutId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const memoizedMarkers = useMemo(
    () => <ZoneMarkers zones={zonesForMarkers} hoveredZoneCode={hoveredZoneCode} zoom={zoom} onZoneClick={handleZoneClick} onZoneHover={setHoveredZoneCode} />,
    [zonesForMarkers, hoveredZoneCode, zoom, handleZoneClick]
  );

  const currentInsightZone = useMemo(() => {
    if (hoveredZoneCode) {
      return filteredZones.find((zone) => zone.code?.toUpperCase() === hoveredZoneCode) ?? null;
    }
    if (focusedZoneCode) {
      return filteredZones.find((zone) => zone.code?.toUpperCase() === focusedZoneCode) ?? null;
    }
    return null;
  }, [filteredZones, focusedZoneCode, hoveredZoneCode]);

  const handleToggleZone = (zoneId: string) => {
    setExpandedZoneId((prev) => (prev === zoneId ? null : zoneId));
  };

  const handleFocusOnMap = (zoneCode: string) => {
    setFocusedZoneCode(zoneCode);
    if (!isDesktop) {
      setIsMapOpen(true);
    }

    const zone = filteredZones.find((item) => item.code?.toUpperCase() === zoneCode);
    const coordinates = zone ? getZoneCoordinates(zone) : null;
    if (coordinates) {
      setMapPosition((prev) => ({
        coordinates,
        zoom: Math.max(prev.zoom, 3),
      }));
    }

    // Scroll to map
    document.querySelector('.zones-map-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleZoneSelection = (zone: ContractZone) => {
    if (!isDesktop) {
      setActiveZone(zone);
      if (zone.code) {
        setFocusedZoneCode(zone.code.toUpperCase());
      }
      setIsMapOpen(true);
    }
  };

  const shouldShowSummarizeButton = summarizeStatus === undefined || summarizeStatus === 'pending' || summarizeStatus === 'failed';

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <FaGlobe className="h-24 w-24 text-blue-200 mx-auto" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-30"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3">Aucune zone détectée</h4>
          <p className="text-base text-gray-600 max-w-md mx-auto mb-6">L'IA peut extraire automatiquement les zones couvertes à partir de vos documents.</p>
          {shouldShowSummarizeButton && (
            <button
              onClick={onSummarize}
              disabled={isSummarizing}
              className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSummarizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <FaGlobe className="h-4 w-4" />
                  <span>Lancer l'analyse IA</span>
                </>
              )}
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <ZoneFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeChange={(value) => setTypeFilter(value)}
            zoneCounts={zoneCounts}
            onResetFilters={() => {
              setSearchQuery('');
              setTypeFilter('all');
            }}
          />

          <div className="lg:hidden">
            {isMapOpen ? (
              <button
                onClick={() => {
                  setIsMapOpen(false);
                  setIsLegendOpen(false);
                }}
                className="flex items-center gap-2 text-blue-700 font-medium underline"
                aria-label="Masquer la carte"
              >
                <FaMapMarkedAlt className="h-4 w-4" />
                Masquer la carte
              </button>
            ) : (
              <button onClick={() => setIsMapOpen(true)} className="flex items-center gap-2 text-blue-700 font-medium underline" aria-label="Afficher la carte">
                <FaMapMarkedAlt className="h-4 w-4" />
                Afficher la carte
              </button>
            )}
          </div>

          {filteredZones.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="relative mx-auto w-20 h-20 mb-6">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <FaSearch className="h-20 w-20 text-gray-300 mx-auto" />
                </motion.div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Aucune zone trouvée</h4>
              <p className="text-base text-gray-600 mb-4">Essayez de modifier vos filtres</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                }}
                className="text-sm text-blue-700 hover:text-blue-800 font-medium underline"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : (
            // Two-column layout: Map + List
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Map Section (2/3 width on desktop) */}
              {(isDesktop || isMapOpen) && (
                <div className="w-full lg:w-2/3">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-4 zones-map-container">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">Carte interactive</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-700 border-2 border-white shadow-sm" />
                            <span className="text-gray-600">Zones couvertes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-[300px] sm:h-[400px] lg:h-[550px] bg-gray-50 overflow-hidden relative">
                      {currentInsightZone && (
                        <motion.div
                          key={currentInsightZone.code ?? currentInsightZone.name}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow text-xs text-gray-700"
                        >
                          <strong className="block text-gray-900 text-sm">{capitalizeFirst(currentInsightZone.name)}</strong>
                          <span className="block text-gray-600">{getZoneTypeLabel(currentInsightZone.type)}</span>
                          <span className="block text-gray-500 mt-1">
                            {currentInsightZone.conditions?.length ?? 0} condition{(currentInsightZone.conditions?.length ?? 0) > 1 ? 's' : ''}
                          </span>
                        </motion.div>
                      )}
                      {!isDesktop && (
                        <>
                          <AnimatePresence>
                            {isLegendOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-20 right-4 z-20 bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-lg space-y-2 text-xs text-gray-700"
                              >
                                <div className="font-semibold text-gray-900 text-sm">Légende</div>
                                <div className="flex items-center gap-2">
                                  <span className="relative inline-flex w-3 h-3 rounded-full bg-blue-700 shadow-sm" />
                                  <span>Zone couverte</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="relative inline-flex w-3 h-3 rounded-full bg-[#22c55e]" />
                                  <span>Surlignage (focus/hover)</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <motion.button
                            onClick={() => setIsLegendOpen((prev) => !prev)}
                            className="absolute bottom-4 right-4 z-20 inline-flex items-center justify-center rounded-full bg-blue-700 text-white h-12 w-12 shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={isLegendOpen ? 'Masquer la légende' : 'Afficher la légende'}
                            whileTap={{ scale: 0.96 }}
                          >
                            <FaGlobe className="h-5 w-5" />
                          </motion.button>
                        </>
                      )}
                      <ComposableMap
                        projection="geoEqualEarth"
                        projectionConfig={{
                          scale: 190,
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <ZoomableGroup
                          center={mapPosition.coordinates}
                          zoom={mapPosition.zoom}
                          onMoveEnd={(position) =>
                            setMapPosition({
                              coordinates: position.coordinates as [number, number],
                              zoom: position.zoom,
                            })
                          }
                        >
                          <Graticule stroke="#e2e8f0" strokeWidth={1} />
                          {geographiesMemo}
                          {memoizedMarkers}
                        </ZoomableGroup>
                      </ComposableMap>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-xs sm:text-sm text-gray-600">Utilisez la molette pour zoomer</p>
                      {focusedZoneCode && (
                        <button
                          onClick={() => setFocusedZoneCode(null)}
                          className="text-xs px-2 py-1 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          aria-label="Réinitialiser la vue de la carte"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* List Section (1/3 width on desktop) */}
              <div className="w-full lg:w-1/3">
                <div className="overflow-hidden sticky top-4">
                  <div className="h-[300px] sm:h-[400px] lg:h-[675px] overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {filteredZones.map((zone, zoneIndex) => {
                      const zoneKey = zone.id ?? `${zone.code ?? zone.name ?? 'zone'}-${zoneIndex}`;
                      const isExpanded = expandedZoneId === zoneKey;

                      return (
                        <ZoneCard
                          key={zoneKey}
                          zone={zone}
                          zoneKey={zoneKey}
                          zoneIndex={zoneIndex}
                          isExpanded={isExpanded}
                          onToggle={handleToggleZone}
                          onFocus={handleFocusOnMap}
                          onHover={(code) => setHoveredZoneCode(code)}
                          onSelect={handleZoneSelection}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <AIDisclaimer />
        </>
      )}

      <AnimatePresence>
        {activeZone && !isDesktop && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveZone(null)} />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6 space-y-4"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-lg font-semibold text-gray-900">{capitalizeFirst(activeZone.name)}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{getZoneTypeLabel(activeZone.type)}</span>
                    {activeZone.code && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono">{activeZone.code.toUpperCase()}</span>}
                  </div>
                </div>
                <button onClick={() => setActiveZone(null)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fermer la fiche de zone">
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>

              {activeZone.conditions && activeZone.conditions.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700">
                    {activeZone.conditions.length} condition{activeZone.conditions.length > 1 ? 's' : ''} spécifique{activeZone.conditions.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1.5">
                    {activeZone.conditions.map((condition, index) => (
                      <div key={`sheet-${activeZone.code ?? activeZone.name}-${index}`} className="text-sm text-gray-700 bg-blue-50 border-l-2 border-blue-500 rounded-r-lg p-2">
                        {condition}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 text-center">Aucune condition spécifique</div>
              )}

              <button
                onClick={() => {
                  if (activeZone.code) {
                    handleFocusOnMap(activeZone.code.toUpperCase());
                  }
                  setActiveZone(null);
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-800 transition-colors"
              >
                <FaMapMarkedAlt className="h-4 w-4" />
                Centrer sur la carte
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZonesTab;
