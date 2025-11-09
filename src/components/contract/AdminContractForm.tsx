import { FaExclamationTriangle, FaSearch, FaSpinner, FaUpload } from 'react-icons/fa';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import Button from '../ui/Button';
import Dropdown, { type DropdownOption } from '../ui/Dropdown';
import Input from '../ui/Input';
import { motion } from 'framer-motion';
import { CATEGORY_CONFIG } from '../../config/categories';
import { type Insurer, useLazyGetInsurersQuery } from '../../store/insurersApi';

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
  const [insurerQuery, setInsurerQuery] = useState('');
  const [insurerSuggestions, setInsurerSuggestions] = useState<Insurer[]>([]);
  const [showInsurerSuggestions, setShowInsurerSuggestions] = useState(false);
  const [insurerSearchError, setInsurerSearchError] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

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

  const insurerId = watch('insurer');
  const [fetchInsurers, { isFetching: isSearchingInsurers }] = useLazyGetInsurersQuery();

  // Options pour les types d'assurance
  const insuranceTypeOptions: DropdownOption[] = Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: AdminContractFormData) => {
      setError(null);

      // Validation
      if (!data.insurer) {
        setError('Veuillez sélectionner un assureur');
        return;
      }

      if (!data.insuranceType) {
        setError("Veuillez sélectionner un produit d'assurance");
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
        setError(error instanceof Error ? error.message : "Une erreur est survenue lors de l'upload");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setValue('cgFile', null);
  }, [setValue]);

  const handleInsurerQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInsurerQuery(value);
      setShowInsurerSuggestions(true);
      if (insurerId) {
        setValue('insurer', '', { shouldDirty: true, shouldValidate: true });
      }
      if (!value.trim()) {
        setInsurerSuggestions([]);
        setInsurerSearchError(null);
      }
    },
    [insurerId, setValue]
  );

  const handleInsurerSelect = useCallback(
    (insurer: Insurer) => {
      setValue('insurer', insurer.id, { shouldDirty: true, shouldValidate: true });
      setInsurerQuery(insurer.name);
      setInsurerSuggestions([]);
      setShowInsurerSuggestions(false);
      setInsurerSearchError(null);
    },
    [setValue]
  );

  const handleInsurerBlur = useCallback(() => {
    if (!insurerId && !insurerQuery.trim()) {
      setInsurerSuggestions([]);
      setShowInsurerSuggestions(false);
    }
  }, [insurerId, insurerQuery]);

  useEffect(() => {
    if (!insurerQuery.trim()) {
      setInsurerSuggestions([]);
      return;
    }

    let isCancelled = false;
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetchInsurers({
          page: 1,
          limit: 5,
          search: insurerQuery.trim(),
          isActive: true,
          sortBy: 'name',
          sortOrder: 'asc',
        }).unwrap();

        if (!isCancelled) {
          setInsurerSuggestions(response.data ?? []);
          setInsurerSearchError(null);
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setInsurerSuggestions([]);
          setInsurerSearchError('Impossible de charger les assureurs.');
          console.error('Erreur lors de la recherche des assureurs:', fetchError);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [fetchInsurers, insurerQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowInsurerSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Assureur */}
          <div className="space-y-2">
            <label htmlFor="insurer-search" className="block text-sm font-medium text-gray-700">
              Assureur <span className="text-red-500">*</span>
            </label>
            <input type="hidden" {...register('insurer', { required: 'Veuillez sélectionner un assureur' })} />
            <div className="relative" ref={suggestionsRef}>
              <input
                id="insurer-search"
                type="text"
                value={insurerQuery}
                onChange={handleInsurerQueryChange}
                onFocus={() => {
                  if (insurerSuggestions.length > 0) {
                    setShowInsurerSuggestions(true);
                  }
                }}
                onBlur={handleInsurerBlur}
                placeholder="Rechercher un assureur par nom"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.insurer ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                autoComplete="off"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {isSearchingInsurers && <FaSpinner className="absolute right-9 top-1/2 -translate-y-1/2 text-blue-500 animate-spin h-4 w-4" />}

              {showInsurerSuggestions && (insurerSuggestions.length > 0 || insurerSearchError) && (
                <div className="absolute z-40 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-56 overflow-y-auto">
                  {insurerSearchError ? (
                    <div className="px-4 py-3 text-sm text-red-600">{insurerSearchError}</div>
                  ) : (
                    insurerSuggestions.map((insurer) => (
                      <button
                        key={insurer.id}
                        type="button"
                        onClick={() => handleInsurerSelect(insurer)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm text-gray-800"
                      >
                        {insurer.name}
                      </button>
                    ))
                  )}
                  {insurerSuggestions.length === 0 && !insurerSearchError && insurerQuery.trim().length > 0 && !isSearchingInsurers && (
                    <div className="px-4 py-3 text-sm text-gray-500">Aucun assureur trouvé</div>
                  )}
                </div>
              )}
            </div>
            {errors.insurer && (
              <div className="flex items-center text-sm text-red-600">
                <span className="mr-2">⚠</span>
                {errors.insurer.message}
              </div>
            )}
          </div>

          {/* Produit d'assurance */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Produit d'assurance <span className="text-red-500">*</span>
            </label>
            <Dropdown
              options={insuranceTypeOptions}
              value={watch('insuranceType')}
              onChange={(value) => setValue('insuranceType', value)}
              placeholder="Sélectionnez un produit d'assurance"
              error={errors.insuranceType?.message}
            />
          </div>

          {/* Version */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Version <span className="text-red-500">*</span>
            </label>
            <Input {...register('version', { required: 'La version est obligatoire' })} placeholder="Ex: 2024.1, v2.3, etc." error={errors.version?.message} />
          </div>

          {/* Upload des Conditions Générales */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Conditions Générales <span className="text-red-500">*</span>
            </label>

            {!uploadedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="cg-file-upload" />
                <label htmlFor="cg-file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                  <FaUpload className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Cliquez pour télécharger ou glissez-déposez votre fichier</p>
                    <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF uniquement</p>
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
                      <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={removeFile} className="text-red-500 hover:text-red-700 text-sm font-medium">
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
