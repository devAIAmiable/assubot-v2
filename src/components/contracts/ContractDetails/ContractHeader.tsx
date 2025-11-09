import { FaArrowLeft, FaEdit, FaFileSignature } from 'react-icons/fa';
import React, { useMemo } from 'react';
import { getContractListItemInsurer, getContractListItemType } from '../../../utils/contractAdapters';
import { getStatusColor, getStatusLabel, getTypeIcon, getTypeLabel } from '../../../utils/contract';

import type { Contract } from '../../../types/contract';
import ContractSummarizationStatus from '../../ui/ContractSummarizationStatus';
import dayjs from 'dayjs';
import { getDisplayValue } from '../../../utils/dateHelpers';
import { getInsurerLogo } from '../../../utils/insurerLogo';

interface ContractHeaderProps {
  contract: Contract;
  onBack: () => void;
  onEdit?: () => void;
  onNavigateToEdit?: () => void;
  onSummarize: () => void;
  isSummarizing: boolean;
  summarizeStatus?: Contract['summarizeStatus'];
  requiredCredits?: number;
  isAdminMode?: boolean;
}

const ContractHeader: React.FC<ContractHeaderProps> = ({
  contract,
  onBack,
  onEdit,
  onNavigateToEdit,
  onSummarize,
  isSummarizing,
  summarizeStatus,
  requiredCredits = 5,
  isAdminMode = false,
}) => {
  const isExpired = useMemo(() => {
    if (!contract.endDate) return false;
    return dayjs(contract.endDate).endOf('day').isBefore(dayjs());
  }, [contract.endDate]);

  const canSummarize = summarizeStatus === 'pending' || summarizeStatus === 'failed';

  const ContractTypeIcon = getTypeIcon(getContractListItemType(contract));

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Revenir à la liste des contrats">
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              {contract.insurer?.name ? (
                <img
                  src={getInsurerLogo(getContractListItemInsurer(contract))}
                  alt={contract.insurer.name}
                  className="w-12 h-12 object-contain rounded bg-white border border-gray-100"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ContractTypeIcon className="h-6 w-6 text-[#1e51ab]" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{contract.name}</h1>
                <p className="text-gray-600">
                  {getDisplayValue(contract.insurer?.name)} - {getTypeLabel(getContractListItemType(contract))}
                  {isAdminMode && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Template</span>}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${isExpired ? 'bg-red-100 text-red-800' : getStatusColor(contract.status)}`}>
              {isExpired ? 'Expiré' : getStatusLabel(contract.status)}
            </span>
            <ContractSummarizationStatus summarizeStatus={summarizeStatus} className="px-3 py-1" />
            <div className="flex items-center space-x-1">
              {canSummarize && (
                <div className="relative group">
                  <button
                    onClick={onSummarize}
                    disabled={isSummarizing}
                    className="p-2 text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={summarizeStatus === 'failed' ? 'Réessayer le résumé' : 'Générer le résumé'}
                  >
                    {isSummarizing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" /> : <FaFileSignature className="h-4 w-4" />}
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {isSummarizing ? 'Génération en cours...' : isAdminMode ? 'Résumé IA' : `Résumé IA (${requiredCredits} crédits)`}
                  </div>
                </div>
              )}
              {(onEdit || onNavigateToEdit) && (
                <div className="relative group">
                  <button onClick={onNavigateToEdit || onEdit} className="p-2 text-gray-600 hover:text-[#1e51ab] transition-colors" aria-label="Modifier le contrat">
                    <FaEdit className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Modifier le contrat
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractHeader;
