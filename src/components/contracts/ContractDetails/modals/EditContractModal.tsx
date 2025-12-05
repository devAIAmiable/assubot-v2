import type { ContractCategory, ContractListItem, UpdateContractRequest } from '../../../../types';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FaExclamationTriangle, FaSpinner, FaTimes } from 'react-icons/fa';
import React, { Fragment, useState } from 'react';

import Button from '../../../ui/Button';
import { formatDateForInput } from '../../../../utils/dateHelpers';
import { motion } from 'framer-motion';
import { trackContractEditSave } from '@/services/analytics';
import { useContractOperations } from '../../../../hooks/useContractOperations';

interface EditContractModalProps {
  contract: ContractListItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditContractModal: React.FC<EditContractModalProps> = ({ contract, isOpen, onClose, onSuccess }) => {
  const { updateContract, isUpdating, updateError } = useContractOperations();
  const [formData, setFormData] = useState<UpdateContractRequest>({
    name: contract.name,
    insurerId: contract.insurerId,
    category: contract.category,
    subject: contract.subject || '',
    formula: contract.formula || '',
    annualPremiumCents: contract.annualPremiumCents || 0,
    startDate: contract.startDate ? formatDateForInput(contract.startDate) : '',
    endDate: contract.endDate ? formatDateForInput(contract.endDate) : '',
  });
  const [startDateInput, setStartDateInput] = useState(formData.startDate ?? '');
  const [endDateInput, setEndDateInput] = useState(formData.endDate ?? '');

  const handleInputChange = (field: keyof UpdateContractRequest, value: string | number | boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === 'startDate' && value && newData.endDate) {
        const startDate = new Date(value as string);
        const endDate = new Date(newData.endDate);
        if (startDate > endDate) {
          newData.endDate = '';
        }
      }

      if (field === 'endDate' && value && newData.startDate) {
        const startDate = new Date(newData.startDate);
        const endDate = new Date(value as string);
        if (endDate < startDate) {
          return prev;
        }
      }

      return newData;
    });
  };

  React.useEffect(() => {
    setStartDateInput(formData.startDate ?? '');
  }, [formData.startDate]);

  React.useEffect(() => {
    setEndDateInput(formData.endDate ?? '');
  }, [formData.endDate]);

  const areDatesValid = () => {
    if (!formData.startDate || !formData.endDate) return true;
    return new Date(formData.endDate) >= new Date(formData.startDate);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!areDatesValid()) {
      return;
    }

    try {
      const updates: UpdateContractRequest = {
        ...formData,
        annualPremiumCents: typeof formData.annualPremiumCents === 'string' ? parseInt(formData.annualPremiumCents) : formData.annualPremiumCents,
      };

      if (updates.startDate && updates.startDate.trim() !== '') {
        updates.startDate = new Date(updates.startDate).toISOString();
      } else {
        delete updates.startDate;
      }

      if (updates.endDate && updates.endDate.trim() !== '') {
        updates.endDate = new Date(updates.endDate).toISOString();
      } else {
        delete updates.endDate;
      }

      await updateContract(contract.id, updates);
      trackContractEditSave({
        contractId: contract.id,
        status: 'success',
      });
      onSuccess?.();
      onClose();
    } catch (updateErr) {
      console.error('Failed to update contract:', updateErr);
      trackContractEditSave({
        contractId: contract.id,
        status: 'error',
        errorMessage: updateErr instanceof Error ? updateErr.message : 'unknown_error',
      });
    }
  };

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
            <DialogPanel className="relative bg-white rounded-2xl max-w-2xl w-full mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Modifier le contrat</h2>
                  <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fermer la fenêtre d'édition">
                    <FaTimes className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {updateError && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <FaExclamationTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      <p className="text-sm text-red-800">{updateError}</p>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contract-name">
                        Nom du contrat *
                      </label>
                      <input
                        id="contract-name"
                        type="text"
                        value={formData.name || ''}
                        onChange={(event) => handleInputChange('name', event.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contract-subject">
                        Bien(s)/Bénéficiaire(s) <span className="text-gray-500 text-xs ml-1">(optionnel)</span>
                      </label>
                      <input
                        id="contract-subject"
                        type="text"
                        value={formData.subject || ''}
                        onChange={(event) => handleInputChange('subject', event.target.value)}
                        placeholder="Ex: BMW X4, Appartement Paris 75001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assureur</label>
                      <input type="text" value={contract.insurer?.name || ''} disabled className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500" />
                      <p className="text-xs text-gray-500 mt-1">L'assureur ne peut pas être modifié.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contract-formula">
                        Formule
                      </label>
                      <input
                        id="contract-formula"
                        type="text"
                        value={formData.formula || ''}
                        onChange={(event) => handleInputChange('formula', event.target.value)}
                        placeholder="Ex: Tous risques, Tiers, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contract-category">
                        Type de contrat *
                      </label>
                      <select
                        id="contract-category"
                        value={formData.category || ''}
                        onChange={(event) => handleInputChange('category', event.target.value as ContractCategory)}
                        required
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
                      >
                        <option value="auto">Automobile</option>
                        <option value="home">Habitation</option>
                        <option value="health">Santé</option>
                        <option value="moto">Moto</option>
                        <option value="electronic_devices">Équipements électroniques</option>
                        <option value="other">Autre</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Le type de contrat ne peut pas être modifié.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contract-premium">
                        Prime annuelle (€) *
                      </label>
                      <input
                        id="contract-premium"
                        type="number"
                        value={formData.annualPremiumCents ? (formData.annualPremiumCents / 100).toString() : '0'}
                        onChange={(event) => handleInputChange('annualPremiumCents', Number(event.target.value) * 100)}
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contract-start-date">
                        Date de début
                      </label>
                      <input
                        id="contract-start-date"
                        type="date"
                        value={startDateInput}
                        onChange={(event) => {
                          const value = event.target.value;
                          setStartDateInput(value);
                          if (value === '' || value.length === 10) {
                            handleInputChange('startDate', value);
                          }
                        }}
                        onBlur={(event) => {
                          const value = event.target.value;
                          if (value === '' || value.length === 10) {
                            handleInputChange('startDate', value);
                          } else {
                            setStartDateInput(formData.startDate ?? '');
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">La date de fin sera automatiquement effacée si elle devient antérieure à cette date.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contract-end-date">
                        Date de fin
                      </label>
                      <input
                        id="contract-end-date"
                        type="date"
                        value={endDateInput}
                        onChange={(event) => {
                          const value = event.target.value;
                          setEndDateInput(value);
                          if (value === '' || value.length === 10) {
                            handleInputChange('endDate', value);
                          }
                        }}
                        onBlur={(event) => {
                          const value = event.target.value;
                          if (value === '' || value.length === 10) {
                            handleInputChange('endDate', value);
                          } else {
                            setEndDateInput(formData.endDate ?? '');
                          }
                        }}
                        min={formData.startDate || undefined}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent ${
                          !areDatesValid() ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                      />
                      {!areDatesValid() && <p className="text-xs text-red-600 mt-1">La date de fin doit être postérieure à la date de début.</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
                  <Button type="button" variant="secondary" onClick={onClose} disabled={isUpdating}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isUpdating || !areDatesValid()} className="px-8">
                    {isUpdating ? (
                      <>
                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                        Mise à jour...
                      </>
                    ) : (
                      'Enregistrer'
                    )}
                  </Button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditContractModal;
