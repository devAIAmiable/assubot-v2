import { AnimatePresence, motion } from 'framer-motion';
import { FaSpinner, FaTrash } from 'react-icons/fa';
import React, { memo } from 'react';

interface DeleteChatModalProps {
  isOpen: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteChatModalComponent: React.FC<DeleteChatModalProps> = ({ isOpen, loading, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onCancel}
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
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaTrash className="text-red-600 text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Supprimer la conversation</h3>
                <p className="text-gray-500 text-sm">Cette action est irréversible</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">Êtes-vous sûr de vouloir supprimer cette conversation ? Tous les messages seront définitivement supprimés.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                Annuler
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const DeleteChatModal = memo(DeleteChatModalComponent);
DeleteChatModal.displayName = 'DeleteChatModal';
