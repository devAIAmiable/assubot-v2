import type { ContractCategory, ContractListItem, UpdateContractRequest } from '../types';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FaExclamationTriangle, FaSpinner, FaTimes } from 'react-icons/fa';
import React, { Fragment, useState } from 'react';

import Button from './ui/Button';
import { formatDateForInput } from '../utils/dateHelpers';
import { motion } from 'framer-motion';
import { useContractOperations } from '../hooks/useContractOperations';

interface EditContractModalProps {
	contract: ContractListItem;
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

const EditContractModal: React.FC<EditContractModalProps> = ({
	contract,
	isOpen,
	onClose,
	onSuccess,
}) => {
	const { updateContract, isUpdating, updateError } = useContractOperations();
	const [formData, setFormData] = useState<UpdateContractRequest>({
		name: contract.name,
		insurerName: contract.insurerName || '',
		category: contract.category,
		formula: contract.formula || '',
		annualPremiumCents: contract.annualPremiumCents || 0,
		startDate: contract.startDate ? formatDateForInput(contract.startDate.toISOString()) : '',
		endDate: contract.endDate ? formatDateForInput(contract.endDate.toISOString()) : '',
	});

	const handleInputChange = (
		field: keyof UpdateContractRequest,
		value: string | number | boolean
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Convert form data to API format
			const updates: UpdateContractRequest = {
				...formData,
				annualPremiumCents:
					typeof formData.annualPremiumCents === 'string'
						? parseInt(formData.annualPremiumCents)
						: formData.annualPremiumCents,
			};

			// Convert dates to ISO strings if provided and not empty
			if (updates.startDate && updates.startDate.trim() !== '') {
				updates.startDate = new Date(updates.startDate).toISOString();
			} else {
				delete updates.startDate;
			}
			
			if (updates.endDate && updates.endDate.trim() !== '') {
				updates.endDate = new Date(updates.endDate).toISOString();
			} else {
				delete updates.endDate;
			}

			await updateContract(contract.id, updates);
			onSuccess?.();
			onClose();
		} catch (error) {
			// Error is handled by the hook
			console.error('Failed to update contract:', error);
		}
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={onClose}>
				<div className="flex items-center justify-center min-h-screen px-4">
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div
							className="fixed inset-0 backdrop-blur-sm"
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
						/>
					</TransitionChild>

					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<DialogPanel className="relative bg-white rounded-2xl max-w-2xl w-full mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
							<form onSubmit={handleSubmit} className="p-6">
								{/* Header */}
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-2xl font-bold text-gray-900">Modifier le contrat</h2>
									<button
										type="button"
										onClick={onClose}
										className="text-gray-400 hover:text-gray-600 transition-colors"
									>
										<FaTimes className="h-6 w-6" />
									</button>
								</div>

								{/* Error Message */}
								{updateError && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
									>
										<div className="flex items-center space-x-2">
											<FaExclamationTriangle className="h-5 w-5 text-red-500" />
											<p className="text-sm text-red-800">{updateError}</p>
										</div>
									</motion.div>
								)}

								{/* Form Fields */}
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Nom du contrat *
											</label>
											<input
												type="text"
												value={formData.name || ''}
												onChange={(e) => handleInputChange('name', e.target.value)}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Assureur
											</label>
											<input
												type="text"
												value={formData.insurerName || ''}
												onChange={(e) => handleInputChange('insurerName', e.target.value)}
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Formule
											</label>
											<input
												type="text"
												value={formData.formula || ''}
												onChange={(e) => handleInputChange('formula', e.target.value)}
												placeholder="Ex: Tous risques, Tiers, etc."
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Type de contrat *
											</label>
											<select
												value={formData.category || ''}
												onChange={(e) => handleInputChange('category', e.target.value as ContractCategory)}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
											>
												<option value="auto">Automobile</option>
												<option value="home">Habitation</option>
												<option value="health">Santé</option>
												<option value="moto">Moto</option>
												<option value="electronic_devices">Équipements électroniques</option>
												<option value="other">Autre</option>
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Prime annuelle (€) *
											</label>
											<input
												type="number"
												value={
													formData.annualPremiumCents
														? (formData.annualPremiumCents / 100).toString()
														: 0
												}
												onChange={(e) =>
													handleInputChange('annualPremiumCents', parseInt(e.target.value) * 100)
												}
												min="0"
												step="0.01"
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Date de début
											</label>
											<input
												type="date"
												value={formData.startDate || ''}
												onChange={(e) => handleInputChange('startDate', e.target.value)}
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Date de fin
											</label>
											<input
												type="date"
												value={formData.endDate || ''}
												onChange={(e) => handleInputChange('endDate', e.target.value)}
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
											/>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
									<Button type="button" variant="secondary" onClick={onClose} disabled={isUpdating}>
										Annuler
									</Button>
									<Button type="submit" disabled={isUpdating} className="px-8">
										{isUpdating ? (
											<>
												<FaSpinner className="animate-spin h-4 w-4 mr-2" />
												Mise à jour...
											</>
										) : (
											'Enregistrer'
										)}
									</Button>
								</div>
							</form>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	);
};

export default EditContractModal;
