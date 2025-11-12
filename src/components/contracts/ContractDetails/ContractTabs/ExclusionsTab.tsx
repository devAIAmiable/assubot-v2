import { FaBan, FaChevronCircleDown, FaChevronUp, FaInfoCircle, FaMagic, FaSearch, FaTimes } from 'react-icons/fa';
import React, { useMemo, useState } from 'react';

import AIDisclaimer from '../ui/AIDisclaimer';
import type { Contract } from '../../../../types/contract';
import { ContractStatus } from '../../../../types/contract';
import PendingSummarizationMessage from '../ui/PendingSummarizationMessage';
import ReactMarkdown from 'react-markdown';
import SummarizedEmptyState from '../ui/SummarizedEmptyState';
import { motion } from 'framer-motion';

interface ExclusionsTabProps {
  contract: Contract;
  summarizeStatus?: Contract['summarizeStatus'];
  isProcessing: boolean;
  isSummarizing: boolean;
  onSummarize: () => void;
}

const ExclusionsTab: React.FC<ExclusionsTabProps> = ({ contract, summarizeStatus, isProcessing, isSummarizing, onSummarize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const exclusions = useMemo(() => contract.exclusions ?? [], [contract.exclusions]);

  const filteredExclusions = useMemo(() => {
    if (!searchQuery) {
      return exclusions;
    }

    const lowered = searchQuery.toLowerCase();
    return exclusions.filter((exclusion) => exclusion.description.toLowerCase().includes(lowered));
  }, [exclusions, searchQuery]);

  const handleToggle = (id: string, isLong: boolean) => {
    if (!isLong) return;
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const isActiveContract = contract.status === ContractStatus.ACTIVE;

  if (summarizeStatus === 'pending' || summarizeStatus === 'ongoing') {
    return (
      <div className="max-w-full sm:max-w-7xl mx-auto px-0 sm:px-4">
        <PendingSummarizationMessage status={summarizeStatus} isProcessing={isProcessing} isSummarizing={isSummarizing} onSummarize={onSummarize} canSummarize={isActiveContract} />
        <AIDisclaimer />
      </div>
    );
  }

  return (
    <div className="max-w-full sm:max-w-7xl mx-auto px-0 sm:px-4 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-amber-100 flex items-center justify-center">
            <FaBan className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex flex-wrap items-center gap-2">
              <span>Exclusions générales</span>
              <FaMagic className="h-4 w-4 text-blue-500 flex-shrink-0" title="Généré par IA" />
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {filteredExclusions.length} exclusion{filteredExclusions.length > 1 ? 's' : ''}
              {searchQuery && ` trouvée${filteredExclusions.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Effacer la recherche d'exclusions">
              <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {exclusions.length === 0 ? (
        <SummarizedEmptyState
          title="Aucune exclusion spécifiée"
          description="Ce contrat ne contient pas d'exclusions générales"
          icon={<FaBan className="h-16 w-16 text-gray-300" />}
        />
      ) : filteredExclusions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune exclusion trouvée</h4>
          <p className="text-sm text-gray-600">Essayez de modifier votre recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredExclusions.map((exclusion) => {
            const description = exclusion.description;
            const isLong = description.length > 150;
            const isExpanded = expandedId === exclusion.id;
            const truncatedDescription = isLong && !isExpanded ? `${description.substring(0, 150)}…` : description;

            return (
              <motion.div
                key={exclusion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-amber-300 transition-all group cursor-pointer"
                onClick={() => handleToggle(exclusion.id, isLong)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <FaBan className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-sm sm:prose-base text-gray-900 max-w-none leading-relaxed">
                      <ReactMarkdown>{truncatedDescription}</ReactMarkdown>
                    </div>
                    {isLong && (
                      <button
                        className="mt-2 text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggle(exclusion.id, isLong);
                        }}
                      >
                        {isExpanded ? (
                          <>
                            <FaChevronUp className="h-3 w-3" />
                            Voir moins
                          </>
                        ) : (
                          <>
                            <FaChevronCircleDown className="h-3 w-3" />
                            Voir plus
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <FaInfoCircle className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AIDisclaimer />
    </div>
  );
};

export default ExclusionsTab;
