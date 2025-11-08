import { AnimatePresence, motion } from 'framer-motion';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import React, { memo } from 'react';

import type { BackendContractListItem } from '../../types';

interface NewChatModalProps {
  isOpen: boolean;
  loading: boolean;
  newChatTitle: string;
  contracts: BackendContractListItem[];
  selectedContractIds: string[];
  onTitleChange: (value: string) => void;
  onToggleContract: (contractId: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

const NewChatModalComponent: React.FC<NewChatModalProps> = ({
  isOpen,
  loading,
  newChatTitle,
  contracts,
  selectedContractIds,
  onTitleChange,
  onToggleContract,
  onCreate,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#1e51ab] rounded-full flex items-center justify-center">
                <FaPlus className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Nouvelle conversation</h3>
                <p className="text-gray-500 text-sm">Créez une nouvelle discussion</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la conversation <span className="text-gray-400 text-sm">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={newChatTitle}
                  onChange={(event) => onTitleChange(event.target.value)}
                  placeholder="Ex: Discussion sur mon contrat auto (laissé vide = titre automatique)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contrats liés (optionnel)</label>
                <div className="max-h-40 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-300">
                  {contracts.length > 0 ? (
                    contracts.map((contract) => {
                      const isSelected = selectedContractIds.includes(contract.id);
                      const isDisabled = !isSelected && selectedContractIds.length >= 2;
                      return (
                        <label
                          key={contract.id}
                          className={`flex items-center space-x-3 p-2 rounded transition-colors ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-100'}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleContract(contract.id)}
                            disabled={isDisabled}
                            className="w-4 h-4 rounded border-gray-300 text-[#1e51ab] focus:ring-[#1e51ab] disabled:cursor-not-allowed disabled:border-gray-200"
                          />
                          <span className="text-sm text-gray-900 font-medium">{contract.name}</span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">Aucun contrat disponible</p>
                  )}
                </div>
                {selectedContractIds.length >= 2 && <p className="text-xs text-gray-500 mt-2">Vous pouvez associer au maximum deux contrats par conversation.</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                Annuler
              </button>
              <button
                onClick={onCreate}
                disabled={loading}
                className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#1a4599] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const NewChatModal = memo(NewChatModalComponent);
NewChatModal.displayName = 'NewChatModal';
