import { Dialog, DialogPanel, Tab, TabList, TabPanel, TabPanels, Transition, TransitionChild } from '@headlessui/react';
import { FaCheck, FaExclamationTriangle, FaTimes, FaWindowClose } from 'react-icons/fa';

import type { BackendContractGuarantee } from '../../types/contract';
import React from 'react';
import { motion } from 'framer-motion';

interface GuaranteeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  guarantee: BackendContractGuarantee;
}

const GuaranteeDetailModal: React.FC<GuaranteeDetailModalProps> = ({ isOpen, onClose, guarantee }) => {
  const coveredCount =
    guarantee.details?.reduce((total, detail) => {
      return total + (detail.coverages?.filter((c) => c.type === 'covered').length || 0);
    }, 0) || 0;
  const excludedCount =
    guarantee.details?.reduce((total, detail) => {
      return total + (detail.coverages?.filter((c) => c.type === 'not_covered').length || 0);
    }, 0) || 0;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen px-4">
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
          </TransitionChild>

          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative bg-white rounded-2xl mx-auto shadow-xl w-3/5 h-3/5 p-0 flex flex-col">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaCheck className="text-blue-600" />
                  </div>
                  <div>
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                      {guarantee.title}
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      {coveredCount} couvertures • {excludedCount} exclusions
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <FaWindowClose className="text-gray-600 text-sm" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <Tab.Group>
                  <TabList className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
                    <Tab
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors ${
                          selected ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-900'
                        }`
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaCheck className="text-sm" />
                        <span>Couvert ({coveredCount})</span>
                      </div>
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors ${
                          selected ? 'bg-white text-red-600 shadow' : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-900'
                        }`
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaTimes className="text-sm" />
                        <span>Non couvert ({excludedCount})</span>
                      </div>
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel className="focus:outline-none">
                      <div className="space-y-6">
                        {coveredCount > 0 ? (
                          guarantee.details?.map((detail, detailIndex) => {
                            const coveredItems = detail.coverages?.filter((c) => c.type === 'covered') || [];
                            const hasFinancialInfo = detail.limit || detail.plafond || detail.franchise || detail.deductible || detail.limitation;
                            if (coveredItems.length === 0) return null;

                            return (
                              <motion.div
                                key={`detail-${detailIndex}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: detailIndex * 0.1 }}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                              >
                                {detail.service && (
                                  <div className="bg-green-50 border-b border-green-200 px-4 py-3">
                                    <h4 className="font-semibold text-green-900 text-base">{detail.service}</h4>
                                  </div>
                                )}

                                <div className="p-4">
                                  {hasFinancialInfo && (
                                    <div className="mb-4">
                                      <h5 className="text-sm font-medium text-gray-700 mb-3">Conditions financières</h5>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {detail.limit && (
                                          <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-600 font-medium mb-1">Limite</div>
                                            <div className="text-sm text-gray-900 font-semibold">{detail.limit}</div>
                                          </div>
                                        )}

                                        {detail.plafond && (
                                          <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-600 font-medium mb-1">Plafond</div>
                                            <div className="text-sm text-gray-900 font-semibold">{detail.plafond}</div>
                                          </div>
                                        )}

                                        {detail.franchise && (
                                          <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-600 font-medium mb-1">Franchise</div>
                                            <div className="text-sm text-gray-900 font-semibold">{detail.franchise}</div>
                                          </div>
                                        )}

                                        {detail.deductible && (
                                          <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-600 font-medium mb-1">Déductible</div>
                                            <div className="text-sm text-gray-900 font-semibold">{detail.deductible}</div>
                                          </div>
                                        )}

                                        {detail.limitation && (
                                          <div className="bg-gray-50 rounded-lg p-3 sm:col-span-2">
                                            <div className="text-xs text-gray-600 font-medium mb-1">Limitation</div>
                                            <div className="text-sm text-gray-900 font-semibold">{detail.limitation}</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-3">Éléments couverts</h5>
                                    <div className="space-y-2">
                                      {coveredItems.map((coverage, index) => (
                                        <div key={index} className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                                          <FaCheck className="text-green-600 mt-0.5 flex-shrink-0 text-sm" />
                                          <span className="text-gray-900 text-sm leading-relaxed">{coverage.description}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FaCheck className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune couverture spécifiée</h3>
                            <p className="text-gray-500">Cette garantie ne contient pas encore d'informations détaillées.</p>
                          </div>
                        )}
                      </div>
                    </TabPanel>

                    <TabPanel className="focus:outline-none">
                      <div className="space-y-6">
                        {excludedCount > 0 ? (
                          guarantee.details?.map((detail, detailIndex) => {
                            const excludedItems = detail.coverages?.filter((c) => c.type === 'not_covered') || [];
                            if (excludedItems.length === 0) return null;

                            return (
                              <motion.div
                                key={`detail-${detailIndex}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: detailIndex * 0.1 }}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                              >
                                {detail.service && (
                                  <div className="bg-red-50 border-b border-red-200 px-4 py-3">
                                    <h4 className="font-semibold text-red-900 text-base">{detail.service}</h4>
                                  </div>
                                )}

                                <div className="p-4">
                                  <h5 className="text-sm font-medium text-gray-700 mb-3">Éléments non couverts</h5>
                                  <div className="space-y-2">
                                    {excludedItems.map((coverage, index) => (
                                      <div key={index} className="flex items-start gap-3 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                        <FaExclamationTriangle className="text-red-600 mt-0.5 flex-shrink-0 text-sm" />
                                        <span className="text-gray-900 text-sm leading-relaxed">{coverage.description}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FaTimes className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune exclusion spécifiée</h3>
                            <p className="text-gray-500">Cette garantie ne contient pas d'exclusions spécifiques.</p>
                          </div>
                        )}
                      </div>
                    </TabPanel>
                  </TabPanels>
                </Tab.Group>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GuaranteeDetailModal;
