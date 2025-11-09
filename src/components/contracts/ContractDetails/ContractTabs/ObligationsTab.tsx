import { AnimatePresence, motion } from 'framer-motion';
import type { Contract, ObligationType } from '../../../../types/contract';
import { FaCheck, FaChevronDown, FaChevronUp, FaClipboardList, FaMagic } from 'react-icons/fa';
import React, { useMemo, useState } from 'react';

import AIDisclaimer from '../ui/AIDisclaimer';
import PendingSummarizationMessage from '../ui/PendingSummarizationMessage';
import { getObligationTypeLabel } from '../../../../utils/contract';

interface ObligationsTabProps {
  contract: Contract;
  summarizeStatus?: Contract['summarizeStatus'];
  isProcessing: boolean;
  isSummarizing: boolean;
  onSummarize: () => void;
}

const ObligationsTab: React.FC<ObligationsTabProps> = ({ contract, summarizeStatus, isProcessing, isSummarizing, onSummarize }) => {
  const [expandedType, setExpandedType] = useState<ObligationType | null>(null);

  const obligations = useMemo(() => contract.obligations ?? [], [contract.obligations]);

  const groupedObligations = useMemo(() => {
    return obligations.reduce<Record<ObligationType, typeof obligations>>(
      (groups, obligation) => {
        const type = obligation.type;
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(obligation);
        return groups;
      },
      {} as Record<ObligationType, typeof obligations>
    );
  }, [obligations]);

  const handleToggle = (type: ObligationType) => {
    setExpandedType((prev) => (prev === type ? null : type));
  };

  if (summarizeStatus === 'pending' || summarizeStatus === 'ongoing') {
    return (
      <div className="max-w-full sm:max-w-7xl mx-auto px-0 sm:px-4">
        <PendingSummarizationMessage status={summarizeStatus} isProcessing={isProcessing} isSummarizing={isSummarizing} onSummarize={onSummarize} />
        <AIDisclaimer />
      </div>
    );
  }

  return (
    <div className="max-w-full sm:max-w-7xl mx-auto px-0 sm:px-4 space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <FaClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
        Mes obligations
        <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
      </h3>

      {obligations.length === 0 ? (
        <div className="text-sm sm:text-base text-center text-gray-500 py-8">Aucune obligation spécifiée</div>
      ) : (
        Object.entries(groupedObligations).map(([type, items]) => {
          const typedType = type as ObligationType;
          const isExpanded = expandedType === typedType;

          return (
            <div key={type} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => handleToggle(typedType)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaClipboardList className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">{getObligationTypeLabel(typedType)}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {items.length} obligation{items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">{items.length}</span>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <ul className="space-y-3">
                        {items.map((obligation) => (
                          <li key={obligation.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <FaCheck className="text-blue-600 mt-1 flex-shrink-0" />
                            <span className="text-sm sm:text-base text-gray-900">{obligation.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })
      )}

      <AIDisclaimer />
    </div>
  );
};

export default ObligationsTab;
