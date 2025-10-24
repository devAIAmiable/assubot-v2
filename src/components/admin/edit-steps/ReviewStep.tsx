import { FaCheck, FaEdit, FaExclamationTriangle, FaGlobe, FaPhone, FaShieldAlt, FaTimes, FaUserShield } from 'react-icons/fa';

import React from 'react';
import type { TemplateContractEditFormData } from '../../../validators/templateContractSchema';
import { useFormContext } from 'react-hook-form';

interface ReviewStepProps {
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onPrevious, onSubmit, isSubmitting = false }) => {
  const { watch } = useFormContext<TemplateContractEditFormData>();
  const formData = watch();

  const renderBasicInfo = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Informations de base</h3>
        <button
          type="button"
          onClick={() => {
            /* Navigate to step 1 */
          }}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          <FaEdit className="h-3 w-3" />
          Modifier
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-sm font-medium text-gray-600">Nom:</span>
          <p className="text-gray-900">{formData.name || 'Non défini'}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Catégorie:</span>
          <p className="text-gray-900">{formData.category || 'Non définie'}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Version:</span>
          <p className="text-gray-900">{formData.version || 'Non définie'}</p>
        </div>
      </div>
    </div>
  );

  const renderGuarantees = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FaShieldAlt className="text-purple-600" />
          Garanties ({formData.guarantees?.length || 0})
        </h3>
        <button
          type="button"
          onClick={() => {
            /* Navigate to step 2 */
          }}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          <FaEdit className="h-3 w-3" />
          Modifier
        </button>
      </div>
      {formData.guarantees && formData.guarantees.length > 0 ? (
        <div className="space-y-3">
          {formData.guarantees.map((guarantee, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900">{guarantee.title}</h4>
              <div className="mt-2 text-sm text-gray-600">
                {guarantee.deductible && <span>Franchise: {guarantee.deductible}</span>}
                {guarantee.limitation && <span className="ml-4">Limitation: {guarantee.limitation}</span>}
              </div>
              {guarantee.details && guarantee.details.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {guarantee.details.length} prestation{guarantee.details.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aucune garantie définie</p>
      )}
    </div>
  );

  const renderOtherSections = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FaExclamationTriangle className="text-orange-600" />
          Autres sections
        </h3>
        <button
          type="button"
          onClick={() => {
            /* Navigate to step 4 */
          }}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          <FaEdit className="h-3 w-3" />
          Modifier
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <FaTimes className="text-red-500" />
          <span className="text-sm font-medium text-gray-600">Exclusions:</span>
          <span className="text-gray-900">{formData.exclusions?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaUserShield className="text-blue-500" />
          <span className="text-sm font-medium text-gray-600">Obligations:</span>
          <span className="text-gray-900">{formData.obligations?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaGlobe className="text-green-500" />
          <span className="text-sm font-medium text-gray-600">Zones:</span>
          <span className="text-gray-900">{formData.zones?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="text-gray-500" />
          <span className="text-sm font-medium text-gray-600">Contacts:</span>
          <span className="text-gray-900">{formData.contacts?.length || 0}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <FaCheck className="text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Récapitulatif</h2>
          <p className="text-sm text-gray-600">Vérifiez les informations avant de sauvegarder</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {renderBasicInfo()}
        {renderGuarantees()}
        {renderOtherSections()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button type="button" onClick={onPrevious} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Précédent
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
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
  );
};

export default ReviewStep;
