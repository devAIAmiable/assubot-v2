import { Dialog, Transition } from '@headlessui/react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { Fragment, useState } from 'react';

import React from 'react';
import { motion } from 'framer-motion';

interface CreateContractModalProps {
  open: boolean;
  onClose: () => void;
  createStep: number;
  setCreateStep: React.Dispatch<React.SetStateAction<number>>;
  form: {
    coverage: string;
    type: string;
    valid_from: string;
    valid_to: string;
    prime: string;
    renouvellement_tacite: string;
    date_limit: string;
    conditions_particulieres: File | null;
    conditions_generales: File | null;
    autres_documents: File | null;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    coverage: string;
    type: string;
    valid_from: string;
    valid_to: string;
    prime: string;
    renouvellement_tacite: string;
    date_limit: string;
    conditions_particulieres: File | null;
    conditions_generales: File | null;
    autres_documents: File | null;
  }>>;
}

const CreateContractModal: React.FC<CreateContractModalProps> = ({
  open,
  onClose,
  createStep,
  setCreateStep,
  form,
  setForm,
}) => {
  // Drag and drop state for each file input
  const [dragOver, setDragOver] = useState<{
    conditions_particulieres: boolean;
    conditions_generales: boolean;
    autres_documents: boolean;
  }>({
    conditions_particulieres: false,
    conditions_generales: false,
    autres_documents: false,
  });

  // Handlers for drag and drop
  const handleDragOver = (e: React.DragEvent, field: keyof typeof dragOver) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [field]: true }));
  };
  const handleDragLeave = (e: React.DragEvent, field: keyof typeof dragOver) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [field]: false }));
  };
  const handleDrop = (e: React.DragEvent, field: keyof typeof dragOver) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [field]: false }));
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setForm((f) => ({ ...f, [field]: files[0] }));
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof dragOver) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setForm((f) => ({ ...f, [field]: files[0] }));
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" open={open} onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" />
          <Dialog.Panel className="relative bg-white rounded-2xl max-w-2xl w-full mx-auto shadow-xl p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Importer un nouveau contrat</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              {/* Stepper/Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between w-full mb-2">
                  {['Informations', 'Détails', 'Documents'].map((label, idx, arr) => (
                    <div key={label} className="flex items-center w-full">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${createStep === idx + 1 ? 'border-[#1e51ab] text-[#1e51ab] bg-white' : 'border-gray-300 text-gray-400 bg-white'} ${createStep > idx + 1 ? 'bg-[#1e51ab] text-white' : ''}`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={`mt-2 text-xs ${createStep === idx + 1 ? 'text-[#1e51ab] font-semibold' : 'text-gray-400'}`}
                        >
                          {label}
                        </span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="flex-1 h-1 bg-gray-200 mx-2 relative">
                          <div
                            className={`absolute top-0 left-0 h-1 rounded ${createStep > idx + 1 ? 'bg-[#1e51ab] w-full' : 'bg-gray-200 w-0'}`}
                            style={{ transition: 'width 0.3s' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                {/* Step 1: Basic Information */}
                {createStep === 1 && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contractCoverage"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Contrat <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="contractCoverage"
                          name="coverage"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                          placeholder="Nom du contrat"
                          value={form.coverage}
                          onChange={(e) => setForm((f) => ({ ...f, coverage: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contractType"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Catégorie <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="contractType"
                          name="type"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                          value={form.type}
                          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                        >
                          <option value="">Sélectionnez une catégorie</option>
                          <option value="assurances-habitations">Assurances habitations</option>
                          <option value="assurances-vehicules">Assurances véhicules</option>
                          <option value="assurances-appareils-electroniques">
                            Assurances appareils électroniques
                          </option>
                          <option value="assurances-vie-sante-prevoyance">
                            Assurances vie, santé et prévoyance
                          </option>
                          <option value="autres-assurances">Autres assurances</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-gray-500 mt-3 text-sm">
                      Les champs facultatifs peuvent être renseignés par AssuBot lors du
                      chargement du contrat
                    </p>
                  </div>
                )}
                {/* Step 2: Contract Details */}
                {createStep === 2 && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="validFrom"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Valide à partir du
                        </label>
                        <input
                          type="date"
                          id="validFrom"
                          name="valid_from"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                          value={form.valid_from}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, valid_from: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="validTo"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Valide jusqu'au
                        </label>
                        <input
                          type="date"
                          id="validTo"
                          name="valid_to"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                          value={form.valid_to}
                          onChange={(e) => setForm((f) => ({ ...f, valid_to: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="prime"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Prime annuelle
                        </label>
                        <input
                          type="number"
                          id="prime"
                          name="prime"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                          placeholder="Prime"
                          value={form.prime}
                          onChange={(e) => setForm((f) => ({ ...f, prime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="renouvellementTacite"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Renouvellement Tacite
                        </label>
                        <select
                          id="renouvellementTacite"
                          name="renouvellement_tacite"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                          value={form.renouvellement_tacite}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, renouvellement_tacite: e.target.value }))
                          }
                        >
                          <option value="">Sélectionnez une option</option>
                          <option value="1">Oui</option>
                          <option value="0">Non</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label
                          htmlFor="dateLimit"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Date Limite
                        </label>
                        <input
                          type="date"
                          id="dateLimit"
                          name="date_limit"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                          value={form.date_limit}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, date_limit: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <p className="text-gray-500 mt-3 text-sm">
                      Les champs facultatifs peuvent être renseignés par AssuBot lors du
                      chargement du contrat
                    </p>
                  </div>
                )}
                {/* Step 3: Document Upload */}
                {createStep === 3 && (
                  <div className="space-y-6">
                    {/* Conditions Particulières */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragOver.conditions_particulieres ? 'border-[#1e51ab] bg-blue-50' : 'border-gray-300 hover:border-[#1e51ab]'}`}
                      onDragOver={(e) => handleDragOver(e, 'conditions_particulieres')}
                      onDragLeave={(e) => handleDragLeave(e, 'conditions_particulieres')}
                      onDrop={(e) => handleDrop(e, 'conditions_particulieres')}
                    >
                      <input
                        type="file"
                        id="file-upload-cp"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'conditions_particulieres')}
                        className="hidden"
                      />
                      <FaUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Conditions Particulières <span className="text-red-500">*</span></h3>
                      <p className="text-gray-600 mb-4">Glissez-déposez votre fichier ici ou cliquez pour sélectionner</p>
                      <label
                        htmlFor="file-upload-cp"
                        className="inline-flex items-center px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-semibold hover:bg-[#163d82] transition-colors cursor-pointer"
                      >
                        <FaUpload className="h-4 w-4 mr-2" />
                        Choisir un fichier
                      </label>
                      <p className="text-sm text-gray-500 mt-2">Formats acceptés: PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
                      {form.conditions_particulieres && (
                        <p className="mt-2 text-green-600 text-sm">Fichier sélectionné: {form.conditions_particulieres.name}</p>
                      )}
                    </motion.div>
                    {/* Conditions Générales */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragOver.conditions_generales ? 'border-[#1e51ab] bg-blue-50' : 'border-gray-300 hover:border-[#1e51ab]'}`}
                      onDragOver={(e) => handleDragOver(e, 'conditions_generales')}
                      onDragLeave={(e) => handleDragLeave(e, 'conditions_generales')}
                      onDrop={(e) => handleDrop(e, 'conditions_generales')}
                    >
                      <input
                        type="file"
                        id="file-upload-cg"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'conditions_generales')}
                        className="hidden"
                      />
                      <FaUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Conditions Générales <span className="text-red-500">*</span></h3>
                      <p className="text-gray-600 mb-4">Glissez-déposez votre fichier ici ou cliquez pour sélectionner</p>
                      <label
                        htmlFor="file-upload-cg"
                        className="inline-flex items-center px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-semibold hover:bg-[#163d82] transition-colors cursor-pointer"
                      >
                        <FaUpload className="h-4 w-4 mr-2" />
                        Choisir un fichier
                      </label>
                      <p className="text-sm text-gray-500 mt-2">Formats acceptés: PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
                      {form.conditions_generales && (
                        <p className="mt-2 text-green-600 text-sm">Fichier sélectionné: {form.conditions_generales.name}</p>
                      )}
                    </motion.div>
                    {/* Autres Documents */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragOver.autres_documents ? 'border-[#1e51ab] bg-blue-50' : 'border-gray-300 hover:border-[#1e51ab]'}`}
                      onDragOver={(e) => handleDragOver(e, 'autres_documents')}
                      onDragLeave={(e) => handleDragLeave(e, 'autres_documents')}
                      onDrop={(e) => handleDrop(e, 'autres_documents')}
                    >
                      <input
                        type="file"
                        id="file-upload-autres"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'autres_documents')}
                        className="hidden"
                      />
                      <FaUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Autres Documents</h3>
                      <p className="text-gray-600 mb-4">Glissez-déposez votre fichier ici ou cliquez pour sélectionner</p>
                      <label
                        htmlFor="file-upload-autres"
                        className="inline-flex items-center px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-semibold hover:bg-[#163d82] transition-colors cursor-pointer"
                      >
                        <FaUpload className="h-4 w-4 mr-2" />
                        Choisir un fichier
                      </label>
                      <p className="text-sm text-gray-500 mt-2">Formats acceptés: PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
                      {form.autres_documents && (
                        <p className="mt-2 text-green-600 text-sm">Fichier sélectionné: {form.autres_documents.name}</p>
                      )}
                    </motion.div>
                  </div>
                )}
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      if (createStep > 1) setCreateStep((s) => Math.max(1, s - 1));
                      else onClose();
                    }}
                  >
                    {createStep > 1 ? 'Précédent' : 'Fermer'}
                  </button>
                  {createStep < 3 ? (
                    <button
                      type="button"
                      className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors"
                      onClick={() => setCreateStep((s) => Math.min(3, s + 1))}
                    >
                      Suivant
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#1e51ab] text-white rounded-xl font-medium hover:bg-[#163d82] transition-colors"
                    >
                      Importer
                    </button>
                  )}
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateContractModal; 