import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import type { BackendContract, EditTemplateContractRequest } from '../../types';
import { useUpdateTemplateContractMutation } from '../../store/contractsApi';
import { templateContractEditSchema, type TemplateContractEditFormData } from '../../validators/templateContractSchema';

import BasicInfoStep from './edit-steps/BasicInfoStep';
import GuaranteesStep from './edit-steps/GuaranteesStep';
import OtherSectionsStep from './edit-steps/OtherSectionsStep';

interface TemplateContractEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: BackendContract;
  onSuccess?: () => void;
}

const TemplateContractEditModal: React.FC<TemplateContractEditModalProps> = ({ isOpen, onClose, contract, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [updateContract, { isLoading: isSubmitting }] = useUpdateTemplateContractMutation();

  const steps = [
    { name: 'Informations de base', component: BasicInfoStep },
    { name: 'Garanties', component: GuaranteesStep },
    { name: 'Autres sections', component: OtherSectionsStep },
  ];

  const form = useForm<TemplateContractEditFormData>({
    resolver: zodResolver(templateContractEditSchema),
    defaultValues: {
      name: contract.name || '',
      category: contract.category || '',
      version: '',
      guarantees:
        contract.guarantees?.map((g) => ({
          title: g.title,
          deductible: g.deductible || undefined,
          limitation: g.limitation || undefined,
          details: g.details || [],
        })) || [],
      exclusions:
        contract.exclusions?.map((e) => ({
          description: e.description,
          type: '',
        })) || [],
      obligations:
        contract.obligations?.map((o) => ({
          description: o.description,
          type: o.type,
        })) || [],
      zones:
        contract.zones?.map((z) => ({
          type: z.type,
          label: z.label,
          conditions: z.conditions || undefined,
        })) || [],
      terminations: [],
      cancellations:
        contract.cancellations?.map((c) => ({
          question: c.question,
          response: c.response,
        })) || [],
      contacts:
        contract.contacts?.map((c) => ({
          type: c.type,
          name: c.name || undefined,
          phone: c.phone || undefined,
          email: c.email || undefined,
          openingHours: c.openingHours || undefined,
        })) || [],
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = form.getValues();
      const updateData: EditTemplateContractRequest = {
        name: formData.name,
        category: formData.category,
        version: formData.version,
        guarantees: formData.guarantees,
        exclusions: formData.exclusions,
        obligations: formData.obligations,
        zones: formData.zones?.map((zone) => ({
          ...zone,
          conditions: zone.conditions || undefined,
        })),
        terminations: formData.terminations,
        cancellations: formData.cancellations,
        contacts: formData.contacts,
      };

      await updateContract({
        id: contract.id,
        data: updateData,
      }).unwrap();

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating contract:', error);
      // TODO: Show error toast
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setCurrentStep(0);
      onClose();
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-hidden" onClose={handleClose}>
        <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={React.Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    Modifier les conditions générales
                  </Dialog.Title>
                  <p className="text-sm text-gray-600 mt-1">
                    {contract.name} - Étape {currentStep + 1} sur {steps.length}
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <FaTimes className="text-gray-600 text-sm" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{steps[currentStep].name}</span>
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} / {steps.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <FormProvider {...form}>
                    <AnimatePresence mode="wait">
                      <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                        <CurrentStepComponent onNext={handleNext} onPrevious={handlePrevious} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                      </motion.div>
                    </AnimatePresence>
                  </FormProvider>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentStep(index)}
                        disabled={isSubmitting}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                          index === currentStep ? 'bg-blue-600 text-white' : index < currentStep ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-200 text-gray-400'
                        } ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <div className="text-sm text-gray-500">
                    {currentStep + 1} sur {steps.length}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TemplateContractEditModal;
