import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FaExclamationTriangle, FaSpinner, FaTimes } from 'react-icons/fa';
import React, { Fragment, useEffect } from 'react';

import Button from '../ui/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contractName: string;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, contractName, isDeleting }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        const element = document.getElementById('contracts-delete-confirm-button');
        element?.focus();
      }, 10);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen px-4">
          <TransitionChild
            as={Fragment}
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
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative bg-white rounded-2xl max-w-md w-full mx-auto shadow-xl">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    aria-label="Fermer la fenêtre de confirmation de suppression"
                  >
                    <FaTimes className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <p className="text-gray-700 mb-2">
                    Êtes-vous sûr de vouloir supprimer le contrat <span className="font-semibold text-gray-900">"{contractName}"</span> ?
                  </p>
                  <p className="text-sm text-red-600">Cette action ne peut pas être annulée. Tous les documents et données associés seront définitivement supprimés.</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3">
                  <Button type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
                    Annuler
                  </Button>
                  <Button
                    id="contracts-delete-confirm-button"
                    type="button"
                    variant="danger"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="px-6"
                    aria-label="Confirmer la suppression définitive du contrat"
                  >
                    {isDeleting ? (
                      <>
                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                        Suppression...
                      </>
                    ) : (
                      'Supprimer définitivement'
                    )}
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteConfirmationModal;
