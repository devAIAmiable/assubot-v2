import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import React, { useCallback, useRef, useState } from 'react';

import Button from '../ui/Button';
import type { ContractFormData } from '../../types';
import DocumentsStep from './steps/DocumentsStep';
import { motion } from 'framer-motion';

interface ContractCreationFormProps {
  onSubmit: (fileObjects: Record<string, File>, formData: ContractFormData) => Promise<void>;
}

const ContractCreationForm: React.FC<ContractCreationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<ContractFormData>>({
    documents: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileRefs = useRef<Record<string, File>>({});

  const handleStepDataUpdate = useCallback((data: Partial<ContractFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setError(null);

    const documents = formData.documents;
    if (!documents || documents.length === 0) {
      setError('Au moins un document est requis');
      return;
    }

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

    setIsSubmitting(true);

    try {
      await onSubmit(fileRefs.current, formData as ContractFormData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du contrat');
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, formData]);

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
      <div className="min-h-[500px]">
        {
          <DocumentsStep
            onDataUpdate={(data: Partial<ContractFormData>) => handleStepDataUpdate(data)}
            onFileRefsUpdate={(refs: Record<string, File>) => {
              fileRefs.current = refs;
            }}
            initialData={formData}
          />
        }
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <div className="flex justify-end w-full">
          <Button onClick={handleSubmit} disabled={isSubmitting} className="px-8">
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                Traitement...
              </>
            ) : (
              'Importer'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContractCreationForm;
