import { Dialog, Transition } from '@headlessui/react';
import { FaCoins, FaExclamationTriangle, FaPlus, FaTimes } from 'react-icons/fa';

import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  operation?: string;
  requiredCredits?: number;
  currentCredits?: number;
}

export const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({ isOpen, onClose, operation = 'cette opération', requiredCredits, currentCredits = 0 }) => {
  const navigate = useNavigate();

  const handlePurchaseCredits = () => {
    onClose();
    navigate('/app/credits');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaExclamationTriangle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Crédits insuffisants
                      </Dialog.Title>
                    </div>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <FaCoins className="h-5 w-5 text-yellow-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Solde actuel : {currentCredits} crédits</p>
                        {requiredCredits && <p className="text-sm text-yellow-700">Crédits requis : {requiredCredits} crédits</p>}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">Vous n'avez pas assez de crédits pour effectuer {operation}. Veuillez acheter des crédits pour continuer.</p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Que sont les crédits ?</h4>
                    <p className="text-sm text-blue-700">
                      Les crédits sont utilisés pour nos services d'IA comme la génération de résumés de contrats, les comparaisons intelligentes et l'assistance chatbot.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handlePurchaseCredits}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Acheter des crédits
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InsufficientCreditsModal;
