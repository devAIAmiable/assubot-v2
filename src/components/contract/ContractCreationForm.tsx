import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import React, { useCallback, useRef, useState } from 'react';

import Button from '../ui/Button';
import CategorySelectionStep from './steps/CategorySelectionStep';
import type { ContractFormData } from '../../types';
import ContractInfoStep from './steps/ContractInfoStep';
import DocumentsStep from './steps/DocumentsStep';
import { motion } from 'framer-motion';

interface ContractCreationFormProps {
  onSubmit: (fileObjects: Record<string, File>, formData: ContractFormData) => Promise<void>;
  onStepChange?: (step: number) => void;
}

const ContractCreationForm: React.FC<ContractCreationFormProps> = ({ onSubmit, onStepChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ContractFormData>>({
    documents: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store actual File objects separately from state
  const fileRefs = useRef<Record<string, File>>({});

  const handleStepDataUpdate = useCallback((data: Partial<ContractFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleNext = useCallback(() => {
    // Clear any previous errors
    setError(null);

    // Validate current step before proceeding
    if (currentStep === 2) {
      const name = formData.name;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        setError('Le nom du contrat est obligatoire');
        return;
      }

      if (name.trim().length < 2) {
        setError('Le nom du contrat doit contenir au moins 2 caractères');
        return;
      }

      // Check for special characters (only allow letters, numbers, spaces, and hyphens)
      const nameRegex = /^[a-zA-ZÀ-ÿ0-9\s-]+$/;
      if (!nameRegex.test(name)) {
        setError('Le nom du contrat ne peut contenir que des lettres, chiffres, espaces et tirets (-)');
        return;
      }
    }

    // If validation passes, proceed to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    onStepChange?.(nextStep);
  }, [currentStep, formData.name, onStepChange]);

  const handlePrevious = useCallback(() => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    onStepChange?.(prevStep);
  }, [currentStep, onStepChange]);

  const handleSubmit = useCallback(async () => {
    // Clear any previous errors
    setError(null);

    // Validate step 3 before submitting
    if (currentStep === 3) {
      const documents = formData.documents;
      if (!documents || documents.length === 0) {
        setError('Au moins un document est requis');
        return;
      }

      // Check for required documents
      const hasCP = documents.some((doc) => doc.type === 'CP');
      const hasCG = documents.some((doc) => doc.type === 'CG');

      if (!hasCP) {
        setError('Les conditions particulières (CP) sont obligatoires');
        return;
      }

      if (!hasCG) {
        setError('Les conditions générales (CG) sont obligatoires');
        return;
      }
    }

    // If validation passes, submit the form
    setIsSubmitting(true);
    setError(null); // Clear any previous errors

    try {
      await onSubmit(fileRefs.current, formData as ContractFormData);
      // If we reach here, submission was successful
      // The parent component will handle success state
    } catch (error) {
      // Handle submission error
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du contrat');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, onSubmit, formData]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CategorySelectionStep onDataUpdate={(data: Partial<ContractFormData>) => handleStepDataUpdate(data)} initialData={formData} />;
      case 2:
        return <ContractInfoStep onDataUpdate={(data: Partial<ContractFormData>) => handleStepDataUpdate(data)} initialData={formData} />;
      case 3:
        return (
          <DocumentsStep
            onDataUpdate={(data: Partial<ContractFormData>) => handleStepDataUpdate(data)}
            onFileRefsUpdate={(refs: Record<string, File>) => {
              fileRefs.current = refs;
            }}
            initialData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FaExclamationTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="min-h-[500px]">{renderCurrentStep()}</div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="secondary" onClick={handlePrevious} disabled={currentStep === 1 || isSubmitting}>
          Précédent
        </Button>

        <div className="flex space-x-3">
          {currentStep < 3 ? (
            <Button onClick={handleNext} className="px-8">
              Suivant
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="px-8">
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                  Traitement...
                </>
              ) : (
                'Créer le contrat'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractCreationForm;
