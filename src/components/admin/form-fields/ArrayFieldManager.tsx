import { FaMinus, FaPlus } from 'react-icons/fa';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { FieldArrayWithId, UseFieldArrayReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

interface ArrayFieldManagerProps<T> {
  fieldArray: UseFieldArrayReturn<T>;
  renderItem: (item: FieldArrayWithId<T>, index: number) => React.ReactNode;
  addButtonText: string;
  emptyMessage: string;
  maxItems?: number;
  className?: string;
}

function ArrayFieldManager<T>({ fieldArray, renderItem, addButtonText, emptyMessage, maxItems, className = '' }: ArrayFieldManagerProps<T>) {
  const { fields, append, remove } = fieldArray;
  useFormContext();

  const canAddMore = maxItems ? fields.length < maxItems : true;

  const handleAdd = () => {
    if (canAddMore) {
      append({} as T);
    }
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Add Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAddMore}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            canAddMore ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FaPlus className="h-4 w-4" />
          {addButtonText}
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <AnimatePresence>
          {fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{emptyMessage}</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Élément {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <FaMinus className="h-3 w-3" />
                    Supprimer
                  </button>
                </div>

                {renderItem(field, index)}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Max Items Info */}
      {maxItems && (
        <div className="text-xs text-gray-500 text-center">
          {fields.length} / {maxItems} éléments maximum
        </div>
      )}
    </div>
  );
}

export default ArrayFieldManager;
