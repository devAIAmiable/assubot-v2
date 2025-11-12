import { AnimatePresence, motion } from 'framer-motion';
import { FaCheck, FaChevronDown, FaChevronRight, FaTimes } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

import type { BackendGuaranteeDetail } from '../../types/contract';
import ExpandableText from './ExpandableText';

interface GuaranteeServiceAccordionProps {
  detail: BackendGuaranteeDetail;
  index: number;
  forceExpand?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const GuaranteeServiceAccordion: React.FC<GuaranteeServiceAccordionProps> = ({ detail, index, forceExpand, onToggle }) => {
  const coveredItems = detail.coverages?.filter((c) => c.type === 'covered') || [];
  const excludedItems = detail.coverages?.filter((c) => c.type === 'not_covered') || [];
  const detailCeiling = detail.ceiling ?? (detail as { limit?: string | null }).limit ?? detail.plafond ?? undefined;
  const hasFinancialInfo = Boolean(detailCeiling || detail.deductible || detail.limitation);
  const [isExpanded, setIsExpanded] = useState<boolean>(forceExpand ?? index === 0);

  useEffect(() => {
    if (typeof forceExpand === 'boolean') {
      setIsExpanded(forceExpand);
    }
  }, [forceExpand]);

  const handleToggle = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (onToggle) {
        onToggle(next);
      }
      return next;
    });
  };

  const formatFinancialValue = (value: string | undefined): string => {
    if (!value) return '-';
    if (value.toLowerCase().includes('sans franchise')) return 'Sans franchise';
    if (value.toLowerCase().includes('illimité')) return 'Illimité';
    return value;
  };

  const baseDelay = Math.min(index * 0.05, 0.3);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: baseDelay }} className="bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <button onClick={handleToggle} className="w-full p-4 text-left hover:bg-gray-50 transition-colors" aria-expanded={isExpanded} aria-controls={`guarantee-panel-${index}`}>
        <div className="flex items-start justify-between gap-4">
          <h2 id={`guarantee-header-${index}`} className="text-xl font-semibold text-gray-900">
            {detail.service || 'Service non nommé'}
          </h2>
          <div className="mt-1 text-gray-400">{isExpanded ? <FaChevronDown /> : <FaChevronRight />}</div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`guarantee-panel-${index}`}
            role="region"
            aria-labelledby={`guarantee-header-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-gray-100">
              {/* Financial Information */}
              {hasFinancialInfo && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {detailCeiling && (
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <div className="text-xs text-amber-600 font-medium mb-1">Plafond</div>
                        <div className="text-sm text-amber-900 font-semibold">{formatFinancialValue(detailCeiling)}</div>
                      </div>
                    )}
                    {detail.deductible && (
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <div className="text-xs text-amber-600 font-medium mb-1">Franchise</div>
                        <div className="text-sm text-amber-900 font-semibold">{formatFinancialValue(detail.deductible)}</div>
                      </div>
                    )}
                    {detail.limitation && (
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 sm:col-span-2">
                        <div className="text-xs text-amber-600 font-medium mb-1">Limite</div>
                        <ExpandableText text={detail.limitation} className="text-sm text-amber-900" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comparison View */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Covered Items */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-green-700 flex items-center">Éléments couverts ({coveredItems.length})</h5>
                  {coveredItems.length > 0 ? (
                    <div className="space-y-2">
                      {coveredItems.map((coverage, coverageIndex) => {
                        const coverageKey = (coverage as { id?: string }).id ?? `${coverage.type}-${coverageIndex}-${coverage.description}`;
                        const itemDelay = Math.min(coverageIndex * 0.03, 0.15);
                        return (
                          <motion.div
                            key={coverageKey}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemDelay }}
                            className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
                          >
                            <FaCheck className="text-green-600 mt-0.5 flex-shrink-0 text-sm" />
                            <ExpandableText text={coverage.description} className="text-gray-900 text-sm leading-relaxed" />
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">Aucun élément couvert spécifié</div>
                  )}
                </div>

                {/* Excluded Items */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-red-700 flex items-center">Éléments non couverts ({excludedItems.length})</h5>
                  {excludedItems.length > 0 ? (
                    <div className="space-y-2">
                      {excludedItems.map((coverage, coverageIndex) => {
                        const coverageKey = (coverage as { id?: string }).id ?? `${coverage.type}-${coverageIndex}-${coverage.description}`;
                        const itemDelay = Math.min(coverageIndex * 0.03, 0.15);
                        return (
                          <motion.div
                            key={coverageKey}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemDelay }}
                            className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                          >
                            <FaTimes className="text-red-600 mt-0.5 flex-shrink-0 text-sm" />
                            <ExpandableText text={coverage.description} className="text-gray-900 text-sm leading-relaxed" />
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">Aucune exclusion spécifiée</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GuaranteeServiceAccordion;
