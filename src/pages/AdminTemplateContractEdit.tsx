import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import type { EditTemplateContractRequest } from '../types';
import { useUpdateTemplateContractMutation, useGetAdminTemplateContractByIdQuery } from '../store/contractsApi';
import { templateContractEditSchema, type TemplateContractEditFormData } from '../validators/templateContractSchema';
import { getChangedFields, hasChanges } from '../utils/formChangeDetection';
import { showToast } from '../components/ui/Toast';

import BasicInfoStep from '../components/admin/edit-steps/BasicInfoStep';
import GuaranteesStep from '../components/admin/edit-steps/GuaranteesStep';
import OtherSectionsStep from '../components/admin/edit-steps/OtherSectionsStep';
import ReviewStep from '../components/admin/edit-steps/ReviewStep';

const AdminTemplateContractEdit: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [originalData, setOriginalData] = useState<TemplateContractEditFormData | null>(null);
  const [updateContract, { isLoading: isSubmitting }] = useUpdateTemplateContractMutation();

  // Fetch contract data
  const { data: contract, isLoading, error } = useGetAdminTemplateContractByIdQuery(contractId!);

  const steps = [
    { name: 'Informations de base', component: BasicInfoStep },
    { name: 'Garanties', component: GuaranteesStep },
    { name: 'Autres sections', component: OtherSectionsStep },
    { name: 'Récapitulatif', component: ReviewStep },
  ];

  const form = useForm<TemplateContractEditFormData>({
    resolver: zodResolver(templateContractEditSchema),
    defaultValues: {
      name: '',
      category: '',
      version: '',
      guarantees: [],
      exclusions: [],
      obligations: [],
      zones: [],
      terminations: [],
      cancellations: [],
      contacts: [],
    },
  });

  // Update form when contract data loads
  React.useEffect(() => {
    if (contract) {
      const formData = {
        name: contract.name || '',
        category: contract.category || '',
        version: contract.version || '',
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
            value: z.label,
          })) || [],
        terminations: [],
        cancellations:
          contract.cancellations?.map((c) => ({
            description: c.question,
            deadline: c.response,
          })) || [],
        contacts:
          contract.contacts?.map((c) => ({
            type: c.type,
            name: c.name || undefined,
            phone: c.phone || undefined,
            email: c.email || undefined,
            openingHours: c.openingHours || undefined,
          })) || [],
      };

      form.reset(formData);
      setOriginalData(formData);
    }
  }, [contract, form]);

  // Scroll to top whenever the current step changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    try {
      const currentFormData = form.getValues();

      // Check if there are any changes
      if (!originalData || !hasChanges(originalData, currentFormData)) {
        showToast.info('Aucune modification à enregistrer');
        return;
      }

      // Get only the changed fields
      const changedFields = getChangedFields(originalData, currentFormData);

      await updateContract({
        id: contractId!,
        data: changedFields as EditTemplateContractRequest,
      }).unwrap();

      // Navigate back to contract details
      navigate(`/app/admin/templates/${contractId}`);
    } catch (error) {
      console.error('Failed to update contract:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/app/admin/templates/${contractId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du contrat...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Erreur</div>
          <p className="text-gray-600">Impossible de charger le contrat</p>
          <button onClick={() => navigate('/app/admin')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Modifier le contrat template</h1>
                <p className="text-sm text-gray-600">{contract.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={handleCancel} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <FaCheck className="h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>{step.name}</span>
                  {index < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200 mx-4" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto py-8">
        <FormProvider {...form}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <CurrentStepComponent onNext={handleNext} onPrevious={handlePrevious} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default AdminTemplateContractEdit;
