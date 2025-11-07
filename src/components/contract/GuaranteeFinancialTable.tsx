import { FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { calculateFinancialSummary, formatFinancialValue, getFinancialRiskLevel } from '../../utils/guaranteeCalculations';

import type { BackendContractGuarantee } from '../../types/contract';
import ExpandableText from './ExpandableText';
import React from 'react';
import { motion } from 'framer-motion';

interface GuaranteeFinancialTableProps {
  guarantee: BackendContractGuarantee;
}

const GuaranteeFinancialTable: React.FC<GuaranteeFinancialTableProps> = ({ guarantee }) => {
  const financial = calculateFinancialSummary(guarantee);

  const getRiskColor = (riskLevel: 'low' | 'medium' | 'high' | 'none') => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskIcon = (riskLevel: 'low' | 'medium' | 'high' | 'none') => {
    switch (riskLevel) {
      case 'low':
        return <FaCheck className="h-4 w-4" />;
      case 'medium':
        return <FaExclamationTriangle className="h-4 w-4" />;
      case 'high':
        return <FaExclamationTriangle className="h-4 w-4" />;
      default:
        return <FaInfoCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* General Financial Conditions */}
      {(financial.hasGeneralDeductible || financial.hasGeneralLimitation) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <FaInfoCircle className="text-blue-600 mr-2" />
            Conditions générales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {financial.hasGeneralDeductible && (
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Franchise générale</span>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(getFinancialRiskLevel(financial.generalDeductible))}`}>
                    {getRiskIcon(getFinancialRiskLevel(financial.generalDeductible))}
                    {getFinancialRiskLevel(financial.generalDeductible) === 'low'
                      ? 'Faible'
                      : getFinancialRiskLevel(financial.generalDeductible) === 'medium'
                        ? 'Moyen'
                        : getFinancialRiskLevel(financial.generalDeductible) === 'high'
                          ? 'Élevé'
                          : 'N/A'}
                  </div>
                </div>
                <div className="text-lg font-semibold text-blue-900">{formatFinancialValue(financial.generalDeductible)}</div>
              </div>
            )}

            {financial.hasGeneralLimitation && (
              <div className="bg-white rounded-lg p-4 border border-blue-100 sm:col-span-2">
                <div className="text-sm font-medium text-blue-700 mb-2">Limitation générale</div>
                <ExpandableText text={financial.generalLimitation!} className="text-blue-900" />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Services Financial Table */}
      {guarantee.details && guarantee.details.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaInfoCircle className="text-gray-600 mr-2" />
              Conditions par service
            </h3>
            <p className="text-sm text-gray-600 mt-1">Détail des conditions financières pour chaque service</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plafond</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Franchise</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Franchise</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limitation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {guarantee.details.map((detail, index) => {
                  const detailCeiling = detail.ceiling ?? (detail as { limit?: string | null }).limit ?? undefined;
                  const hasFinancialInfo = detailCeiling || detail.plafond || detail.franchise || detail.deductible || detail.limitation;

                  if (!hasFinancialInfo) return null;

                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{detail.service || 'Service non nommé'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{formatFinancialValue(detailCeiling || detail.plafond)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{formatFinancialValue(detail.franchise)}</span>
                          {detail.franchise && (
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(getFinancialRiskLevel(detail.franchise))}`}>
                              {getRiskIcon(getFinancialRiskLevel(detail.franchise))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{formatFinancialValue(detail.deductible)}</span>
                          {detail.deductible && (
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(getFinancialRiskLevel(detail.deductible))}`}>
                              {getRiskIcon(getFinancialRiskLevel(detail.deductible))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {detail.limitation ? (
                          <ExpandableText text={detail.limitation} className="text-sm text-gray-900" maxLength={50} />
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {financial.servicesWithFinancials === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <FaInfoCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Aucune condition financière spécifique pour les services</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GuaranteeFinancialTable;
