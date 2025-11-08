import { FaEdit, FaEye, FaInfoCircle, FaTrash } from 'react-icons/fa';
import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

import ContractSummarizationStatus from '../ui/ContractSummarizationStatus';
import type { ContractListItem } from '../../types/contract';
import { getContractListItemInsurer, getContractListItemPremium, getContractListItemType } from '../../utils/contractAdapters';
import { getInsurerLogo } from '../../utils/insurerLogo';
import { getStatusLabel, getTypeIcon, getTypeLabel } from '../../utils/contract';

interface ContractCardProps {
  contract: ContractListItem;
  index: number;
  onEdit: (contract: ContractListItem) => void;
  onDelete: (contract: ContractListItem) => void;
}

const statusPillClass = (status: ContractListItem['status'], isExpired: boolean, isPending: boolean): string => {
  if (isPending) {
    return 'bg-yellow-100 text-yellow-800';
  }
  if (isExpired) {
    return 'bg-red-100 text-red-800';
  }

  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'expired':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-gray-200 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const ContractCard = memo(({ contract, index, onEdit, onDelete }: ContractCardProps) => {
  const type = getContractListItemType(contract);
  const TypeIcon = getTypeIcon(type);
  const insurerName = getContractListItemInsurer(contract);
  const premiumCents = getContractListItemPremium(contract);
  const hasPremium = typeof premiumCents === 'number' && Number.isFinite(premiumCents);
  const premiumEuros = hasPremium ? premiumCents / 100 : null;
  const isPending = contract.status === 'pending';
  const isExpired = contract.endDate ? dayjs(contract.endDate).endOf('day').isBefore(dayjs()) : false;
  const statusClass = statusPillClass(contract.status, isExpired, isPending);
  const statusLabel = isPending ? 'En cours de traitement' : isExpired ? 'Expiré' : getStatusLabel(contract.status);
  const logoSrc = insurerName ? getInsurerLogo(insurerName) : undefined;
  const contractLink = `/app/contrats/${contract.id}`;

  const handleEdit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onEdit(contract);
    },
    [contract, onEdit]
  );

  const handleDelete = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onDelete(contract);
    },
    [contract, onDelete]
  );

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-1">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={insurerName || 'Assureur'}
                onError={(event) => {
                  const target = event.currentTarget;
                  target.style.display = 'none';
                }}
                className="w-8 h-8 object-contain rounded"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                <TypeIcon className="h-5 w-5 text-[#1e51ab]" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{contract.name}</h3>
            {contract.subject && <p className="text-xs text-gray-500 italic">{contract.subject}</p>}
            <p className="text-xs text-gray-600">{getTypeLabel(type)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>{statusLabel}</span>
          {isPending && (
            <div className="flex items-center text-xs text-gray-500" title="Analyse des documents en cours…">
              <FaInfoCircle className="mr-1" />
              Analyse en cours…
            </div>
          )}
          <ContractSummarizationStatus summarizeStatus={contract.summarizeStatus} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Assureur</span>
          <span className="text-sm font-medium text-gray-900">{insurerName || 'Non spécifié'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Dépenses annuelles</span>
          <span className={`text-sm font-bold ${isPending ? 'text-gray-400' : 'text-[#1e51ab]'}`}>
            {isPending || premiumEuros === null ? '-' : `${premiumEuros.toLocaleString('fr-FR')}€`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Échéance</span>
          <span className={`text-sm font-medium ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>
            {isPending ? '-' : contract.endDate ? dayjs(contract.endDate).format('DD/MM/YYYY') : 'Non spécifiée'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`relative bg-white border border-gray-100 rounded-2xl p-6 transition-shadow duration-300 ${
        isPending ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      <div className="flex flex-col h-full">
        {isPending ? (
          <div className="flex-1 mb-4">{content}</div>
        ) : (
          <Link
            to={contractLink}
            className="flex-1 mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e51ab] focus-visible:ring-offset-2 rounded-xl"
            aria-label={`Voir le contrat ${contract.name}`}
          >
            {content}
          </Link>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              disabled={isPending}
              className={`transition-colors p-1 rounded ${isPending ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-[#1e51ab]'}`}
              aria-label={`Modifier le contrat ${contract.name}`}
            >
              <FaEdit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className={`transition-colors p-1 rounded ${isPending ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600'}`}
              aria-label={`Supprimer le contrat ${contract.name}`}
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
          {isPending ? (
            <div className="text-gray-400 text-sm flex items-center space-x-1" title="Vous recevrez une notification une fois l'analyse terminée.">
              <FaEye className="h-3 w-3" />
              <span>En attente</span>
            </div>
          ) : (
            <Link to={contractLink} className="flex items-center text-sm font-medium text-[#1e51ab]" aria-label={`Accéder aux détails du contrat ${contract.name}`}>
              <FaEye className="mr-1 h-3 w-3" aria-hidden="true" />
              <span>Voir détails</span>
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
});

ContractCard.displayName = 'ContractCard';

export default ContractCard;
