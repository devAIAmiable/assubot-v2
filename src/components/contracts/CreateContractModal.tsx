import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FaBell, FaCheck, FaClock, FaTimes } from 'react-icons/fa';
import { Fragment, useCallback, useState } from 'react';

import Avatar from '../ui/Avatar';
import ContractCreationForm from '../contract/ContractCreationForm';
import type { ContractFormData } from '../../types';
import React from 'react';
import { contractUploadService } from '../../services/contractUploadService';
import { motion } from 'framer-motion';
import { trackContractCreateSubmit } from '@/services/analytics/gtm';

interface CreateContractModalProps {
  open?: boolean;
  onClose?: () => void;
}

const CreateContractModal: React.FC<CreateContractModalProps> = ({ open: propOpen, onClose: propOnClose }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const open = propOpen !== undefined ? propOpen : false;

  const handleClose = useCallback(() => {
    if (propOnClose) {
      propOnClose();
    }
    setShowSuccessMessage(false);
  }, [propOnClose]);

  const handleSubmit = useCallback(async (fileObjects: Record<string, File>, formData: ContractFormData) => {
    try {
      const validation = contractUploadService.validateRequiredDocuments(fileObjects);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const result = await contractUploadService.uploadContract(formData, fileObjects);

      if (result.success) {
        trackContractCreateSubmit({
          method: 'upload',
          status: 'success',
        });
        setShowSuccessMessage(true);
      } else {
        throw new Error(result.error || 'Échec de la création du contrat');
      }
    } catch (submitError) {
      console.error('Contract creation failed:', submitError);
      trackContractCreateSubmit({
        method: 'upload',
        status: 'error',
        errorMessage: submitError instanceof Error ? submitError.message : 'unknown_error',
      });
      throw submitError;
    }
  }, []);

  const closeSuccessMessage = useCallback(() => {
    setShowSuccessMessage(false);
    handleClose();
  }, [handleClose]);

  if (showSuccessMessage) {
    return (
      <Transition appear show as={Fragment}>
        <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={() => {}}>
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
                <div className="p-8">
                  <div className="text-center">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaCheck className="text-4xl text-white" />
                    </motion.div>
                    <h4 className="text-2xl font-semibold text-green-600 mt-4">Contrat téléchargé avec succès !</h4>
                    <div className="text-left mb-4">
                      <p className="text-lg font-medium text-gray-800 mb-4 text-center">Votre contrat est en cours de traitement.</p>
                      <div className="bg-gray-50 rounded-lg px-2 py-4 space-y-4">
                        <div className="flex items-center space-x-3 py-2">
                          <FaClock className="text-xl text-blue-500 w-5 flex-shrink-0 mx-2" />
                          <span className="text-gray-700">
                            Temps de traitement moyen&nbsp;: <strong className="text-gray-900">3 minutes*</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 py-2">
                          <FaBell className="text-xl text-blue-500 w-5 flex-shrink-0 mx-2" />
                          <span className="text-gray-700">Vous serez notifié dès que votre contrat sera disponible.</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Avatar isAssistant />
                          <span className="text-gray-700">AI'A analysera automatiquement vos documents.</span>
                        </div>
                      </div>
                      <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                        Une fois le traitement terminé, votre contrat apparaîtra dans votre tableau de bord et vous pourrez commencer à poser des questions à AssuBot à son sujet.
                      </p>
                    </div>
                    <button
                      className="bg-[#1e51ab] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center space-x-2 mx-auto mt-6"
                      onClick={closeSuccessMessage}
                    >
                      <FaCheck aria-hidden="true" />
                      <span>Compris</span>
                    </button>
                    <div className="mt-6">
                      {/* Small footer text */}
                      <p className="text-gray-600 text-sm leading-relaxed">(*)&nbsp;Les fichiers PDF scannés peuvent nécessiter un temps d’analyse plus long</p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={handleClose}>
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
            <DialogPanel className="relative bg-white rounded-2xl mx-auto shadow-xl max-w-4xl w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Importer mon contrat d'assurance</h2>
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fermer la fenêtre de création">
                    <FaTimes className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="min-h-[500px]">
                  <ContractCreationForm onSubmit={handleSubmit} />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateContractModal;
