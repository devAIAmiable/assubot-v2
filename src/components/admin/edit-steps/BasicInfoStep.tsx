import type { BasicInfoFormData } from '../../../validators/templateContractSchema';
import { FaInfoCircle } from 'react-icons/fa';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Dropdown, { type DropdownOption } from '../../ui/Dropdown';
import { getAllCategories, getCategoryLabel } from '../../../config/categories';

interface BasicInfoStepProps {
  onNext: () => void;
  onPrevious?: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onNext, onPrevious }) => {
  const { register, control } = useFormContext<BasicInfoFormData>();
  console.log('🚀 ~ BasicInfoStep ~ control:', control);
  console.log('🚀 ~ BasicInfoStep ~ register:', register('name'));

  // Get all categories from config and convert to dropdown options
  const categories: DropdownOption[] = getAllCategories().map((category) => ({
    value: category,
    label: getCategoryLabel(category),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <FaInfoCircle className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Informations de base</h2>
          <p className="text-sm text-gray-600">Définissez les informations générales du contrat</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Name and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom du contrat
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Assurance Auto Premium"
            />
          </div>

          <div>
            <Controller
              name="category"
              control={control}
              render={({ field, fieldState }) => (
                <Dropdown
                  label="Catégorie"
                  options={categories}
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Sélectionnez une catégorie"
                  error={fieldState.error?.message}
                  id="category"
                />
              )}
            />
          </div>
        </div>

        {/* Version */}
        <div>
          <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-2">
            Version
          </label>
          <input
            {...register('version')}
            type="text"
            id="version"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 2.1"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Précédent
          </button>
        )}

        <button type="button" onClick={onNext} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  );
};

export default BasicInfoStep;
