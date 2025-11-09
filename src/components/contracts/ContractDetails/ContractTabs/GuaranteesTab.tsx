import type { BackendContractGuarantee, Contract } from '../../../../types/contract';
import { FaCheck, FaChevronRight, FaMagic, FaShieldAlt, FaTimes } from 'react-icons/fa';

import AIDisclaimer from '../ui/AIDisclaimer';
import PendingSummarizationMessage from '../ui/PendingSummarizationMessage';
import React from 'react';

interface GuaranteesTabProps {
  contract: Contract;
  summarizeStatus?: Contract['summarizeStatus'];
  isProcessing: boolean;
  isSummarizing: boolean;
  onSummarize: () => void;
  onSelectGuarantee: (guarantee: BackendContractGuarantee) => void;
}

const GuaranteesTab: React.FC<GuaranteesTabProps> = ({ contract, summarizeStatus, isProcessing, isSummarizing, onSummarize, onSelectGuarantee }) => {
  if (summarizeStatus === 'pending' || summarizeStatus === 'ongoing') {
    return (
      <div className="max-w-full sm:max-w-7xl mx-auto px-0 sm:px-4">
        <PendingSummarizationMessage status={summarizeStatus} isProcessing={isProcessing} isSummarizing={isSummarizing} onSummarize={onSummarize} />
        <AIDisclaimer />
      </div>
    );
  }

  const guarantees = contract.guarantees ?? [];

  return (
    <div className="max-w-full sm:max-w-7xl mx-auto px-0 sm:px-4 space-y-6">
      {guarantees.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-blue-600" />
              <span className="font-semibold text-gray-900">{guarantees.length} garanties</span>
              <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <FaCheck className="text-green-600" />
              <span className="text-sm text-gray-700">
                {guarantees.reduce((total, guarantee) => {
                  return (
                    total +
                    (guarantee.details?.reduce((detailTotal, detail) => {
                      return detailTotal + (detail.coverages?.filter((coverage) => coverage.type === 'covered').length || 0);
                    }, 0) || 0)
                  );
                }, 0)}{' '}
                couvertures
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <FaTimes className="text-red-600" />
              <span className="text-sm text-gray-700">
                {guarantees.reduce((total, guarantee) => {
                  return (
                    total +
                    (guarantee.details?.reduce((detailTotal, detail) => {
                      return detailTotal + (detail.coverages?.filter((coverage) => coverage.type === 'not_covered').length || 0);
                    }, 0) || 0)
                  );
                }, 0)}{' '}
                exclusions
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {guarantees.map((guarantee, index) => {
              const coverageCount =
                guarantee.details?.reduce((total, detail) => {
                  return total + (detail.coverages?.filter((coverage) => coverage.type === 'covered').length || 0);
                }, 0) || 0;
              const exclusionCount =
                guarantee.details?.reduce((total, detail) => {
                  return total + (detail.coverages?.filter((coverage) => coverage.type === 'not_covered').length || 0);
                }, 0) || 0;

              return (
                <button
                  key={guarantee.id}
                  onClick={() => onSelectGuarantee(guarantee)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{guarantee.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {coverageCount} couvertures • {exclusionCount} exclusions
                        </p>
                      </div>
                    </div>
                    <FaChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Aucune garantie spécifiée</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Ce contrat ne contient pas encore d'informations détaillées sur les garanties. Lancez l'analyse IA pour générer ces informations.
            </p>
          </div>
        </div>
      )}

      <AIDisclaimer />
    </div>
  );
};

export default GuaranteesTab;
