import { FaArrowLeft, FaEdit, FaFileSignature, FaInfoCircle, FaSpinner, FaTrash } from 'react-icons/fa';
import React, { useEffect, useMemo, useRef } from 'react';
import { getContractListItemInsurer, getContractListItemType } from '../../../utils/contractAdapters';
import { getStatusColor, getStatusLabel, getTypeIcon, getTypeLabel } from '../../../utils/contract';

import type { Contract } from '../../../types/contract';
import { ContractStatus } from '../../../types/contract';
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
  onDelete?: () => void;
  isSummarizing: boolean;
  isDeleting?: boolean;
  summarizeStatus?: Contract['summarizeStatus'];
  requiredCredits?: number;
  isAdminMode?: boolean;
}

const Tooltip: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="relative group inline-flex">
    {children}
    <div
      role="tooltip"
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[11px] leading-none text-white bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
    >
      {label}
    </div>
  </div>
);

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { ariaLabel: string }> = ({ ariaLabel, className = '', children, ...props }) => (
  <button
    aria-label={ariaLabel}
    className={`p-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

const StatusBadge: React.FC<{ isExpired: boolean; status: Contract['status']; className?: string }> = ({ isExpired, status, className = '' }) => {
  const cls = isExpired ? 'bg-red-100 text-red-800' : getStatusColor(status);
  const label = isExpired ? 'Expiré' : getStatusLabel(status);
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cls} ${className}`} aria-label={`Statut du contrat : ${label}`}>
      {label}
    </span>
  );
};

const LogoOrIcon: React.FC<{ contract: Contract }> = ({ contract }) => {
  const TypeIcon = getTypeIcon(getContractListItemType(contract));
  const src = getInsurerLogo(getContractListItemInsurer(contract));
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleError = () => {
    // hide the broken image and let the icon show
    if (imgRef.current) {
      imgRef.current.style.display = 'none';
    }
  };

  return (
    <div className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 overflow-hidden flex-shrink-0" aria-hidden="true">
      {src ? (
        <>
          <img ref={imgRef} src={src} alt="" onError={handleError} className="z-10 w-full h-full object-contain" loading="lazy" />
          {/* Fallback icon visually behind if image fails */}
          <TypeIcon className="absolute h-5 w-5 sm:h-6 sm:w-6 text-[#1e51ab] z-0" />
        </>
      ) : (
        <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#1e51ab]" />
      )}
    </div>
  );
};

const ContractHeader: React.FC<ContractHeaderProps> = React.memo(
  ({ contract, onBack, onEdit, onNavigateToEdit, onSummarize, onDelete, isSummarizing, isDeleting = false, summarizeStatus, requiredCredits = 5, isAdminMode = false }) => {
    const isExpired = useMemo(() => {
      if (!contract.endDate) return false;
      return dayjs(contract.endDate).endOf('day').isBefore(dayjs());
    }, [contract.endDate]);

    const isActiveContract = contract.status === ContractStatus.ACTIVE;
    const canSummarize = isActiveContract && (summarizeStatus === undefined || summarizeStatus === 'pending' || summarizeStatus === 'failed');
    const contractTypeLabel = useMemo(() => getTypeLabel(getContractListItemType(contract)), [contract]);

    // Keyboard shortcuts: E = edit, R = summarize, Backspace = back
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        // avoid when typing in inputs/textareas
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.getAttribute('contenteditable') === 'true')) {
          return;
        }
        const hasModifier = e.metaKey || e.ctrlKey || e.altKey;

        if (!hasModifier && (e.key === 'e' || e.key === 'E') && (onNavigateToEdit || onEdit)) {
          e.preventDefault();
          (onNavigateToEdit || onEdit)!();
        }
        if (!hasModifier && isActiveContract && (e.key === 'r' || e.key === 'R') && canSummarize && !isSummarizing) {
          e.preventDefault();
          onSummarize();
        }
        if (!hasModifier && (e.key === 'd' || e.key === 'D') && onDelete && !isDeleting) {
          e.preventDefault();
          onDelete();
        }
        if (e.key === 'Backspace' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          onBack();
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [canSummarize, isSummarizing, isDeleting, onSummarize, onBack, onEdit, onNavigateToEdit, onDelete, isActiveContract]);

    return (
      <header
        className="sticky top-0 z-20 border-b border-gray-200 bg-white supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur shadow-sm"
        role="banner"
      >
        <div className="px-4 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back + Title */}
            <div className="min-w-0 flex items-center gap-3 sm:gap-4">
              <IconButton ariaLabel="Revenir à la liste des contrats" onClick={onBack} className="text-gray-500 hover:text-gray-700">
                <FaArrowLeft className="h-5 w-5" />
              </IconButton>

              <LogoOrIcon contract={contract} />

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{contract.name}</h1>
                  {isAdminMode && <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800">Template</span>}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {getDisplayValue(contract.insurer?.name)} • {contractTypeLabel}
                </p>
              </div>
            </div>

            {/* Right: Status + AI + Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <StatusBadge isExpired={isExpired} status={contract.status} className="hidden sm:inline-flex" />

              <div className="hidden sm:inline-flex">
                <ContractSummarizationStatus summarizeStatus={summarizeStatus} className="px-2.5 py-1" />
              </div>

              {/* Summarize */}
              {canSummarize && (
                <Tooltip label={isSummarizing ? 'Génération en cours…' : isAdminMode ? 'Résumé IA' : `Résumé IA (${requiredCredits} crédits)`}>
                  <IconButton
                    ariaLabel={summarizeStatus === 'failed' ? 'Réessayer le résumé' : 'Générer le résumé'}
                    onClick={onSummarize}
                    disabled={isSummarizing}
                    className={`${isSummarizing ? 'opacity-60 cursor-not-allowed' : 'hover:text-green-600'}`}
                  >
                    {isSummarizing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" /> : <FaFileSignature className="h-4 w-4" />}
                  </IconButton>
                </Tooltip>
              )}

              {/* Edit */}
              {(onEdit || onNavigateToEdit) && (
                <Tooltip label="Modifier le contrat">
                  <IconButton ariaLabel="Modifier le contrat" onClick={onNavigateToEdit || onEdit}>
                    <FaEdit className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
              )}

              {/* Delete */}
              {onDelete && (
                <Tooltip label="Supprimer le contrat">
                  <IconButton ariaLabel="Supprimer le contrat" onClick={onDelete} disabled={isDeleting} className="text-gray-600 hover:text-red-600">
                    {isDeleting ? <FaSpinner className="h-4 w-4 animate-spin" /> : <FaTrash className="h-4 w-4" />}
                  </IconButton>
                </Tooltip>
              )}

              {/* Info (shortcut help) */}
              <Tooltip label="Raccourcis : E pour éditer, R pour résumer, Retour pour revenir">
                <span className="inline-flex items-center text-gray-400 p-1.5" aria-hidden="true">
                  <FaInfoCircle className="h-3.5 w-3.5 hidden sm:inline-flex" />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

export default ContractHeader;
