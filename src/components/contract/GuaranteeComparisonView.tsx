import { FaCheck, FaSearch, FaTimes } from 'react-icons/fa';
import React, { useState } from 'react';

import type { BackendContractGuarantee } from '../../types/contract';
import ExpandableText from './ExpandableText';
import { motion } from 'framer-motion';

interface GuaranteeComparisonViewProps {
  guarantee: BackendContractGuarantee;
}

const GuaranteeComparisonView: React.FC<GuaranteeComparisonViewProps> = ({ guarantee }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Get all coverages from all services
  const allCoverages =
    guarantee.details?.flatMap(
      (detail) =>
        detail.coverages?.map((coverage) => ({
          ...coverage,
          serviceName: detail.service || 'Service non nommé',
          serviceIndex: guarantee.details?.indexOf(detail) || 0,
        })) || []
    ) || [];

  const coveredItems = allCoverages.filter((item) => item.type === 'covered');
  const excludedItems = allCoverages.filter((item) => item.type === 'not_covered');

  // Filter items based on search criteria only
  const filterItems = (items: typeof allCoverages) => {
    if (!searchTerm) return items;

    return items.filter((item) => item.description.toLowerCase().includes(searchTerm.toLowerCase()) || item.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const filteredCovered = filterItems(coveredItems);
  const filteredExcluded = filterItems(excludedItems);

  const getServiceColor = (serviceIndex: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-pink-100 text-pink-800 border-pink-200',
    ];
    return colors[serviceIndex % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher dans les éléments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results summary */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span>
            {filteredCovered.length} élément{filteredCovered.length > 1 ? 's' : ''} couvert{filteredCovered.length > 1 ? 's' : ''}
          </span>
          <span>•</span>
          <span>
            {filteredExcluded.length} exclusion{filteredExcluded.length > 1 ? 's' : ''}
          </span>
          {searchTerm && (
            <>
              <span>•</span>
              <span>Recherche: "{searchTerm}"</span>
            </>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Covered Items */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FaCheck className="text-green-600 h-5 w-5" />
            <h3 className="text-lg font-semibold text-green-700">Éléments couverts ({filteredCovered.length})</h3>
          </div>

          {filteredCovered.length > 0 ? (
            <div className="space-y-3">
              {filteredCovered.map((item, index) => (
                <motion.div
                  key={`covered-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FaCheck className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <ExpandableText text={item.description} className="text-gray-900 text-sm leading-relaxed" />
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceColor(item.serviceIndex)}`}>{item.serviceName}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaCheck className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Aucun élément couvert trouvé</p>
              {searchTerm && <p className="text-sm mt-1">Essayez de modifier votre recherche</p>}
            </div>
          )}
        </motion.div>

        {/* Excluded Items */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FaTimes className="text-red-600 h-5 w-5" />
            <h3 className="text-lg font-semibold text-red-700">Exclusions ({filteredExcluded.length})</h3>
          </div>

          {filteredExcluded.length > 0 ? (
            <div className="space-y-3">
              {filteredExcluded.map((item, index) => (
                <motion.div
                  key={`excluded-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FaTimes className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <ExpandableText text={item.description} className="text-gray-900 text-sm leading-relaxed" />
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceColor(item.serviceIndex)}`}>{item.serviceName}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaTimes className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Aucune exclusion trouvée</p>
              {searchTerm && <p className="text-sm mt-1">Essayez de modifier votre recherche</p>}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GuaranteeComparisonView;
