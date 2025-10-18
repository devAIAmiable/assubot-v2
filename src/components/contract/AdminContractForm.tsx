import { FaExclamationTriangle, FaSpinner, FaUpload } from 'react-icons/fa';
import React, { useCallback, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import Button from '../ui/Button';
import Dropdown, { type DropdownOption } from '../ui/Dropdown';
import Input from '../ui/Input';
import InsurerDropdown from '../ui/InsurerDropdown';
import { motion } from 'framer-motion';

interface AdminContractFormData {
  insurer: string;
  insuranceType: string;
  version: string;
  cgFile: File | null;
}

interface AdminContractFormProps {
  onSubmit: (data: AdminContractFormData) => Promise<void>;
}

const AdminContractForm: React.FC<AdminContractFormProps> = ({ onSubmit }) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const methods = useForm<AdminContractFormData>({
    defaultValues: {
      insurer: '',
      insuranceType: '',
      version: '',
      cgFile: null,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;


  // Options pour les types d'assurance
  const insuranceTypeOptions: DropdownOption[] = [
    { value: 'auto', label: 'Assurance Auto' },
    { value: 'health', label: 'Assurance Santé' },
    { value: 'home', label: 'Assurance Habitation' },
    { value: 'moto', label: 'Assurance Moto' },
    { value: 'electronic_devices', label: 'Assurance Objets Électroniques' },
    { value: 'other', label: 'Autre' },
  ];

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Seuls les fichiers PDF sont acceptés pour les Conditions Générales');
        return;
      }
      setUploadedFile(file);
      setValue('cgFile', file);
      setError(null);
    }
  }, [setValue]);

  const handleFormSubmit = useCallback(async (data: AdminContractFormData) => {
    setError(null);

    // Validation
    if (!data.insurer) {
      setError('Veuillez sélectionner un assureur');
      return;
    }

    if (!data.insuranceType) {
      setError('Veuillez sélectionner un type d\'assurance');
      return;
    }

    if (!data.version.trim()) {
      setError('Veuillez saisir une version');
      return;
    }

    if (!data.cgFile) {
      setError('Veuillez télécharger le fichier des Conditions Générales');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'upload');
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setValue('cgFile', null);
  }, [setValue]);

  return (
    <div className="space-y-6">
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <FaExclamationTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Assureur */}
          <InsurerDropdown
            name="insurer"
            label="Assureur"
            required
            error={errors.insurer?.message}
          />

        {/* Type d'assurance */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Type d'assurance <span className="text-red-500">*</span>
          </label>
          <Dropdown
            options={insuranceTypeOptions}
            value={watch('insuranceType')}
            onChange={(value) => setValue('insuranceType', value)}
            placeholder="Sélectionnez un type d'assurance"
            error={errors.insuranceType?.message}
          />
        </div>

        {/* Version */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Version <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('version', { required: 'La version est obligatoire' })}
            placeholder="Ex: 2024.1, v2.3, etc."
            error={errors.version?.message}
          />
        </div>

        {/* Upload des Conditions Générales */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Conditions Générales <span className="text-red-500">*</span>
          </label>
          
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="cg-file-upload"
              />
              <label
                htmlFor="cg-file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FaUpload className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    Cliquez pour télécharger ou glissez-déposez votre fichier
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés: PDF uniquement
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-medium">📄</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button type="submit" disabled={isSubmitting} className="px-8">
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
        </form>
      </FormProvider>
    </div>
  );
};

export default AdminContractForm;
