import { AnimatePresence, motion } from 'framer-motion';
import { FaPlus, FaShieldAlt } from 'react-icons/fa';
import { useFieldArray, useFormContext } from 'react-hook-form';

import GuaranteeEditor from '../form-fields/GuaranteeEditor';
import type { GuaranteesFormData } from '../../../validators/templateContractSchema';
import React from 'react';

interface GuaranteesStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const GuaranteesStep: React.FC<GuaranteesStepProps> = ({ onNext, onPrevious }) => {
  const { control } = useFormContext<GuaranteesFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'guarantees',
  });

  const addGuarantee = () => {
    append({
      title: '',
      deductible: '',
      limitation: '',
      details: [],
    });
  };

  const removeGuarantee = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <FaShieldAlt className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Garanties</h2>
          <p className="text-sm text-gray-600">Définissez les garanties et leurs conditions</p>
        </div>
      </div>

      {/* Add Guarantee Button */}
      <div className="flex justify-end">
        <button type="button" onClick={addGuarantee} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus className="h-4 w-4" />
          Ajouter une garantie
        </button>
      </div>

      {/* Guarantees List */}
      <div className="space-y-4">
        <AnimatePresence>
          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaShieldAlt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Aucune garantie définie</p>
              <p className="text-sm">Cliquez sur "Ajouter une garantie" pour commencer</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <GuaranteeEditor guaranteeIndex={index} guarantee={field} />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeGuarantee(index)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer cette garantie"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Information Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FaShieldAlt className="text-purple-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-purple-900">Structure des garanties</h4>
            <p className="text-sm text-purple-700 mt-1">
              Chaque garantie peut contenir plusieurs détails (services) avec leurs propres conditions financières et listes de couvertures. Utilisez les sections dépliables pour
              organiser l'information.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button type="button" onClick={onPrevious} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Précédent
        </button>

        <button type="button" onClick={onNext} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  );
};

export default GuaranteesStep;
