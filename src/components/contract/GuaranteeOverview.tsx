import { calculateFinancialSummary, calculateGuaranteeStats, getGuaranteeHighlights } from '../../utils/guaranteeCalculations';

import type { BackendContractGuarantee } from '../../types/contract';
import ExpandableText from './ExpandableText';
import { FaCheck } from 'react-icons/fa';
import React from 'react';

interface GuaranteeOverviewProps {
  guarantee: BackendContractGuarantee;
}

const GuaranteeOverview: React.FC<GuaranteeOverviewProps> = ({ guarantee }) => {
  const stats = calculateGuaranteeStats(guarantee);
  const financial = calculateFinancialSummary(guarantee);
  const highlights = getGuaranteeHighlights(guarantee);

  return (
    <div className="space-y-4">
      {/* Combined Overview & Financial */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">Vue d'ensemble</h3>
        </div>

        {/* Stats and Financial in one row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stats Section */}
          <div className="col-span-1">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.servicesCount}</div>
                <div className="text-xs text-gray-500">Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalCoverages}</div>
                <div className="text-xs text-gray-500">Couvert</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.totalExclusions}</div>
                <div className="text-xs text-gray-500">Exclus</div>
              </div>
            </div>
          </div>

          {/* Financial Section */}
          {(financial.hasGeneralDeductible || financial.hasGeneralLimitation || financial.servicesWithFinancials > 0) && (
            <div>
              <div className="space-y-2">
                {financial.hasGeneralDeductible && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Franchise:</span>
                    <span className="font-semibold text-gray-900">{financial.generalDeductible}</span>
                  </div>
                )}

                {financial.hasGeneralLimitation && (
                  <div className="text-sm">
                    <span className="text-gray-600">Limitation: </span>
                    <ExpandableText text={financial.generalLimitation!} className="text-gray-900 font-medium inline" maxLength={60} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Highlights - Compact */}
      {highlights.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FaCheck className="text-green-600" />
            <h3 className="text-sm font-semibold text-gray-900">Points forts</h3>
          </div>

          <div className="flex flex-wrap gap-1">
            {highlights.map((highlight, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuaranteeOverview;
