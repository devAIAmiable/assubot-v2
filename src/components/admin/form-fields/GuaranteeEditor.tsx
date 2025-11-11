import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaChevronRight, FaMinus, FaPlus } from 'react-icons/fa';
import React, { useState } from 'react';

import type { BackendGuaranteeDetail } from '../../../types/contract';
import { useFormContext } from 'react-hook-form';

interface GuaranteeEditorProps {
  guaranteeIndex: number;
  guarantee: {
    title?: string;
    deductible?: string;
    ceiling?: string;
    limitation?: string;
    details?: BackendGuaranteeDetail[];
  };
}

const GuaranteeEditor: React.FC<GuaranteeEditorProps> = ({ guaranteeIndex, guarantee }) => {
  const { register, watch, setValue } = useFormContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const guaranteeDetails: BackendGuaranteeDetail[] = watch(`guarantees.${guaranteeIndex}.details`) || [];

  const addDetail = () => {
    const currentDetails: BackendGuaranteeDetail[] = guaranteeDetails || [];
    setValue(`guarantees.${guaranteeIndex}.details`, [
      ...currentDetails,
      {
        service: '',
        ceiling: '',
        plafond: '',
        franchise: '',
        deductible: '',
        limitation: '',
        coverages: [],
      },
    ]);
  };

  const removeDetail = (detailIndex: number) => {
    const currentDetails: BackendGuaranteeDetail[] = guaranteeDetails || [];
    const newDetails = currentDetails.filter((_: unknown, index: number) => index !== detailIndex);
    setValue(`guarantees.${guaranteeIndex}.details`, newDetails);
  };

  const addCoverage = (detailIndex: number) => {
    const currentDetails = guaranteeDetails || [];
    const detail = currentDetails[detailIndex];
    const newCoverages = [...(detail.coverages || []), { type: 'covered' as const, description: '' }];

    const updatedDetails = [...currentDetails];
    updatedDetails[detailIndex] = {
      ...detail,
      coverages: newCoverages,
    };

    setValue(`guarantees.${guaranteeIndex}.details`, updatedDetails);
  };

  const removeCoverage = (detailIndex: number, coverageIndex: number) => {
    const currentDetails = guaranteeDetails || [];
    const detail = currentDetails[detailIndex];
    const newCoverages = (detail.coverages || []).filter((_: unknown, index: number) => index !== coverageIndex);

    const updatedDetails = [...currentDetails];
    updatedDetails[detailIndex] = {
      ...detail,
      coverages: newCoverages,
    };

    setValue(`guarantees.${guaranteeIndex}.details`, updatedDetails);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Guarantee Header */}
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-left flex-1">
          {isExpanded ? <FaChevronDown className="h-4 w-4 text-gray-400" /> : <FaChevronRight className="h-4 w-4 text-gray-400" />}
          <h3 className="font-medium text-gray-900">{guarantee.title || `Garantie ${guaranteeIndex + 1}`}</h3>
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Guarantee Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intitulé</label>
                <input
                  {...register(`guarantees.${guaranteeIndex}.title`)}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Responsabilité civile"
                />
              </div>
              {/* 
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Franchise</label>
                <input
                  {...register(`guarantees.${guaranteeIndex}.deductible`)}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 500€"
                />
              </div> */}
              {/* 
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plafond</label>
                <input
                  {...register(`guarantees.${guaranteeIndex}.ceiling`)}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 100 000€"
                />
              </div> */}

              {/* <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Limitation</label>
                <textarea
                  {...register(`guarantees.${guaranteeIndex}.limitation`)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Limitation annuelle"
                />
              </div> */}
            </div>

            {/* Prestations Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Prestations de la garantie</h4>
                <button type="button" onClick={addDetail} className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  <FaPlus className="h-3 w-3" />
                  Ajouter une prestation
                </button>
              </div>

              <div className="space-y-3">
                {guaranteeDetails.map((detail: BackendGuaranteeDetail, detailIndex: number) => (
                  <div key={detailIndex} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-600">Prestation {detailIndex + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeDetail(detailIndex)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <FaMinus className="h-3 w-3" />
                        Supprimer
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Intitulé</label>
                        <input
                          {...register(`guarantees.${guaranteeIndex}.details.${detailIndex}.service`)}
                          type="text"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Dommages corporels"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Plafond</label>
                        <input
                          {...register(`guarantees.${guaranteeIndex}.details.${detailIndex}.ceiling`)}
                          type="text"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 100 000€"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Limite</label>
                        <input
                          {...register(`guarantees.${guaranteeIndex}.details.${detailIndex}.limitation`)}
                          type="text"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 100 000€"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Franchise</label>
                        <input
                          {...register(`guarantees.${guaranteeIndex}.details.${detailIndex}.deductible`)}
                          type="text"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 100 000€"
                        />
                      </div>
                    </div>

                    {/* Coverages */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-gray-600">Couvertures/Exclusions</label>
                        <button
                          type="button"
                          onClick={() => addCoverage(detailIndex)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          <FaPlus className="h-3 w-3" />
                          Ajouter
                        </button>
                      </div>

                      {(detail.coverages || []).map((_coverage: { type?: string; description?: string }, coverageIndex: number) => (
                        <div key={coverageIndex} className="flex items-center gap-2">
                          <select
                            {...register(`guarantees.${guaranteeIndex}.details.${detailIndex}.coverages.${coverageIndex}.type`)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="covered">Couvert</option>
                            <option value="not_covered">Non couvert</option>
                          </select>

                          <input
                            {...register(`guarantees.${guaranteeIndex}.details.${detailIndex}.coverages.${coverageIndex}.description`)}
                            type="text"
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Description de la couverture"
                          />

                          <button type="button" onClick={() => removeCoverage(detailIndex, coverageIndex)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                            <FaMinus className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuaranteeEditor;
