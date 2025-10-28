import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FaCoins, FaSpinner, FaTimes } from 'react-icons/fa';
import React, { Fragment } from 'react';

import Button from './Button';

interface SummarizeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentCredits: number;
  requiredCredits: number;
  isProcessing: boolean;
}

const SummarizeConfirmationModal: React.FC<SummarizeConfirmationModalProps> = ({ isOpen, onClose, onConfirm, currentCredits, requiredCredits, isProcessing }) => {
  const hasInsufficientCredits = currentCredits < requiredCredits;

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
                  <h3 className="text-lg font-semibold text-gray-900">Confirmer la génération du résumé</h3>
                  <button type="button" onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${hasInsufficientCredits ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <FaCoins className={`h-8 w-8 ${hasInsufficientCredits ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <p className="text-gray-700 mb-4">
                    La génération du résumé de votre contrat coûte <span className="font-semibold text-gray-900">{requiredCredits} crédits</span>.
                  </p>

                  {/* Credit Balance Display */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Votre solde actuel :</span>
                      <span className={`font-semibold ${hasInsufficientCredits ? 'text-red-600' : 'text-gray-900'}`}>{currentCredits} crédits</span>
                    </div>
                  </div>

                  {/* Warning Message */}
                  {hasInsufficientCredits && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">
                        <span className="font-semibold">Crédits insuffisants !</span>
                        <br />
                        Vous avez besoin de {requiredCredits - currentCredits} crédits supplémentaires pour générer le résumé.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3">
                  <Button type="button" variant="secondary" onClick={onClose} disabled={isProcessing}>
                    Annuler
                  </Button>
                  <Button type="button" onClick={onConfirm} disabled={isProcessing || hasInsufficientCredits} className="px-6">
                    {isProcessing ? (
                      <>
                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                        Génération...
                      </>
                    ) : (
                      'Confirmer'
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

export default SummarizeConfirmationModal;
