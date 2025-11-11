import { AnimatePresence, motion } from 'framer-motion';
import { FaCheck, FaChevronDown, FaChevronRight, FaTimes } from 'react-icons/fa';
import React, { useState } from 'react';

import type { BackendGuaranteeDetail } from '../../types/contract';
import ExpandableText from './ExpandableText';

interface GuaranteeServiceAccordionProps {
  detail: BackendGuaranteeDetail;
  index: number;
}

const GuaranteeServiceAccordion: React.FC<GuaranteeServiceAccordionProps> = ({ detail, index }) => {
  const coveredItems = detail.coverages?.filter((c) => c.type === 'covered') || [];
  const excludedItems = detail.coverages?.filter((c) => c.type === 'not_covered') || [];
  const detailCeiling = detail.ceiling ?? (detail as { limit?: string | null }).limit ?? undefined;
  const hasFinancialInfo = detailCeiling || detail.plafond || detail.franchise || detail.deductible || detail.limitation;
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const formatFinancialValue = (value: string | undefined): string => {
    if (!value) return '-';
    if (value.toLowerCase().includes('sans franchise')) return 'Sans franchise';
    if (value.toLowerCase().includes('illimité')) return 'Illimité';
    return value;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <button onClick={onToggle} className="w-full p-4 text-left hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{detail.service || 'Service non nommé'}</h2>

          <div className="flex items-center gap-2">{isExpanded ? <FaChevronDown className="text-gray-400" /> : <FaChevronRight className="text-gray-400" />}</div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
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
                    {detail.plafond && (
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <div className="text-xs text-amber-600 font-medium mb-1">Plafond</div>
                        <div className="text-sm text-amber-900 font-semibold">{formatFinancialValue(detail.plafond)}</div>
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
                      {coveredItems.map((coverage, coverageIndex) => (
                        <motion.div
                          key={coverageIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: coverageIndex * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
                        >
                          <FaCheck className="text-green-600 mt-0.5 flex-shrink-0 text-sm" />
                          <ExpandableText text={coverage.description} className="text-gray-900 text-sm leading-relaxed" />
                        </motion.div>
                      ))}
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
                      {excludedItems.map((coverage, coverageIndex) => (
                        <motion.div
                          key={coverageIndex}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: coverageIndex * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                        >
                          <FaTimes className="text-red-600 mt-0.5 flex-shrink-0 text-sm" />
                          <ExpandableText text={coverage.description} className="text-gray-900 text-sm leading-relaxed" />
                        </motion.div>
                      ))}
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
