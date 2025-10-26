import { FaCheck, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

import React from 'react';
import type { TemplateContractEditFormData } from '../../../validators/templateContractSchema';
import { useFormContext } from 'react-hook-form';

interface ReviewStepProps {
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  originalData?: TemplateContractEditFormData | null;
}

interface FieldChange {
  field: string;
  type: 'add' | 'delete' | 'modify';
  oldValue?: string | number | object;
  newValue?: string | number | object;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onPrevious, onSubmit, isSubmitting = false, originalData }) => {
  const { getValues } = useFormContext<TemplateContractEditFormData>();

  // Get current form values using getValues() to ensure we have the latest data
  const formData = getValues();

  const getFieldChanges = (): FieldChange[] => {
    if (!originalData) {
      console.log('No original data available');
      return [];
    }

    console.log('Original data:', originalData);
    console.log('Current form data:', formData);

    const changes: FieldChange[] = [];

    // Basic info changes
    if (formData.name !== originalData.name) {
      changes.push({
        field: 'Nom',
        type: 'modify',
        oldValue: originalData.name,
        newValue: formData.name,
      });
    }
    if (formData.category !== originalData.category) {
      changes.push({
        field: 'Catégorie',
        type: 'modify',
        oldValue: originalData.category,
        newValue: formData.category,
      });
    }
    if (formData.version !== originalData.version) {
      changes.push({
        field: 'Version',
        type: 'modify',
        oldValue: originalData.version,
        newValue: formData.version,
      });
    }

    // Guarantees changes
    const oldGuarantees = originalData.guarantees || [];
    const newGuarantees = formData.guarantees || [];

    if (newGuarantees.length > oldGuarantees.length) {
      changes.push({
        field: 'Garantie ajoutée',
        type: 'add',
        newValue: newGuarantees[newGuarantees.length - 1]?.title,
      });
    } else if (newGuarantees.length < oldGuarantees.length) {
      changes.push({
        field: 'Garantie supprimée',
        type: 'delete',
        oldValue: oldGuarantees[oldGuarantees.length - 1]?.title,
      });
    }

    // Check for modifications in guarantees
    newGuarantees.forEach((newGuarantee, index) => {
      const oldGuarantee = oldGuarantees[index];
      if (oldGuarantee) {
        // Normalize values: treat undefined, null, and empty string as the same
        const normalizeValue = (val: string | undefined) => val || '';

        const oldTitle = normalizeValue(oldGuarantee.title);
        const newTitle = normalizeValue(newGuarantee.title);
        const oldDeductible = normalizeValue(oldGuarantee.deductible);
        const newDeductible = normalizeValue(newGuarantee.deductible);
        const oldLimitation = normalizeValue(oldGuarantee.limitation);
        const newLimitation = normalizeValue(newGuarantee.limitation);

        // Check each field individually and only report if there's an actual change
        if (oldTitle !== newTitle) {
          changes.push({
            field: `Garantie: ${oldTitle || 'Sans titre'}`,
            type: 'modify',
            oldValue: oldTitle || 'Non définie',
            newValue: newTitle || 'Non définie',
          });
        }
        if (oldDeductible !== newDeductible) {
          changes.push({
            field: `Garantie "${oldTitle || 'Sans titre'}" - Franchise`,
            type: 'modify',
            oldValue: oldDeductible || 'Non définie',
            newValue: newDeductible || 'Non définie',
          });
        }
        if (oldLimitation !== newLimitation) {
          changes.push({
            field: `Garantie "${oldTitle || 'Sans titre'}" - Limitation`,
            type: 'modify',
            oldValue: oldLimitation || 'Non définie',
            newValue: newLimitation || 'Non définie',
          });
        }

        // Check for changes in nested details (prestations)
        const oldDetails = oldGuarantee.details || [];
        const newDetails = newGuarantee.details || [];

        if (JSON.stringify(oldDetails) !== JSON.stringify(newDetails)) {
          changes.push({
            field: `Garantie "${oldTitle || 'Sans titre'}" - Prestations`,
            type: 'modify',
            oldValue: `${oldDetails.length} prestation${oldDetails.length > 1 ? 's' : ''}`,
            newValue: `${newDetails.length} prestation${newDetails.length > 1 ? 's' : ''}`,
          });
        }
      }
    });

    // Check other sections for changes
    // Exclusions
    const oldExclusions = originalData.exclusions || [];
    const newExclusions = formData.exclusions || [];
    if (JSON.stringify(oldExclusions) !== JSON.stringify(newExclusions)) {
      changes.push({
        field: 'Exclusions',
        type: 'modify',
        oldValue: `${oldExclusions.length} exclusion${oldExclusions.length > 1 ? 's' : ''}`,
        newValue: `${newExclusions.length} exclusion${newExclusions.length > 1 ? 's' : ''}`,
      });
    }

    // Obligations
    const oldObligations = originalData.obligations || [];
    const newObligations = formData.obligations || [];
    if (JSON.stringify(oldObligations) !== JSON.stringify(newObligations)) {
      changes.push({
        field: 'Obligations',
        type: 'modify',
        oldValue: `${oldObligations.length} obligation${oldObligations.length > 1 ? 's' : ''}`,
        newValue: `${newObligations.length} obligation${newObligations.length > 1 ? 's' : ''}`,
      });
    }

    // Zones
    const oldZones = originalData.zones || [];
    const newZones = formData.zones || [];
    if (JSON.stringify(oldZones) !== JSON.stringify(newZones)) {
      changes.push({
        field: 'Zones',
        type: 'modify',
        oldValue: `${oldZones.length} zone${oldZones.length > 1 ? 's' : ''}`,
        newValue: `${newZones.length} zone${newZones.length > 1 ? 's' : ''}`,
      });
    }

    // Contacts
    const oldContacts = originalData.contacts || [];
    const newContacts = formData.contacts || [];
    if (JSON.stringify(oldContacts) !== JSON.stringify(newContacts)) {
      changes.push({
        field: 'Contacts',
        type: 'modify',
        oldValue: `${oldContacts.length} contact${oldContacts.length > 1 ? 's' : ''}`,
        newValue: `${newContacts.length} contact${newContacts.length > 1 ? 's' : ''}`,
      });
    }

    console.log('Detected changes:', changes);
    return changes;
  };

  const renderChangeIcon = (type: 'add' | 'delete' | 'modify') => {
    switch (type) {
      case 'add':
        return <FaPlus className="h-4 w-4 text-green-600" />;
      case 'delete':
        return <FaTrash className="h-4 w-4 text-red-600" />;
      case 'modify':
        return <FaEdit className="h-4 w-4 text-blue-600" />;
    }
  };

  const renderChangeBadge = (type: 'add' | 'delete' | 'modify') => {
    switch (type) {
      case 'add':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Ajouté</span>;
      case 'delete':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Supprimé</span>;
      case 'modify':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Modifié</span>;
    }
  };

  const changes = getFieldChanges();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <FaCheck className="text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Récapitulatif</h2>
          <p className="text-sm text-gray-600">Modifications à sauvegarder</p>
        </div>
      </div>

      {/* Changes List */}
      {changes.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifications ({changes.length})</h3>
          <div className="space-y-3">
            {changes.map((change, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-0.5">{renderChangeIcon(change.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{change.field}</span>
                    {renderChangeBadge(change.type)}
                  </div>
                  {change.type === 'modify' && (
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>
                        <span className="font-medium">Ancienne valeur:</span> {change.oldValue?.toString() || 'Non définie'}
                      </div>
                      <div>
                        <span className="font-medium">Nouvelle valeur:</span> {change.newValue?.toString() || 'Non définie'}
                      </div>
                    </div>
                  )}
                  {(change.type === 'add' || change.type === 'delete') && <div className="text-xs text-gray-600">{change.newValue?.toString() || change.oldValue?.toString()}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <FaCheck className="h-5 w-5" />
            <p className="text-sm font-medium">Aucune modification détectée</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button type="button" onClick={onPrevious} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Précédent
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || changes.length === 0}
          className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            isSubmitting || changes.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
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
