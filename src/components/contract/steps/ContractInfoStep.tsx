import React, { useCallback, useState } from 'react';

import type { ContractFormData } from '../../../types';
import { FaExclamationTriangle } from 'react-icons/fa';
import FieldError from '../../ui/FieldError';
import Input from '../../ui/Input';
import { motion } from 'framer-motion';

interface ContractInfoStepProps {
	onDataUpdate: (data: Partial<ContractFormData>) => void;
	initialData: Partial<ContractFormData>;
}

const ContractInfoStep: React.FC<ContractInfoStepProps> = ({ onDataUpdate, initialData }) => {
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	const handleInputChange = useCallback(
		(field: keyof ContractFormData, value: string | boolean | number) => {
			// Update form data
			onDataUpdate({ [field]: value });
			
			// Clear field-specific error when user starts typing
			if (fieldErrors[field]) {
				setFieldErrors(prev => {
					const newErrors = { ...prev };
					delete newErrors[field];
					return newErrors;
				});
			}
		},
		[fieldErrors, onDataUpdate]
	);

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-6"
		>
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-6">Informations du contrat</h3>

				{/* General Information */}
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<Input
								label="Nom du contrat *"
								type="text"
								required
								value={initialData.name || ''}
								onChange={(e) => handleInputChange('name', e.target.value)}
								placeholder="Ex: Assurance Auto Tous Risques"
							/>
							<FieldError error={fieldErrors.name} />
						</div>
						<div>
							<Input
								label="Nom de l'assureur"
								type="text"
								value={initialData.insurerName || ''}
								onChange={(e) => handleInputChange('insurerName', e.target.value)}
								placeholder="Ex: AXA, MAIF, Allianz..."
							/>
							<FieldError error={fieldErrors.insurerName} />
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<Input
								label="Date de début"
								type="date"
								value={initialData.startDate || ''}
								onChange={(e) => handleInputChange('startDate', e.target.value)}
							/>
							<FieldError error={fieldErrors.startDate} />
						</div>
						<div>
							<Input
								label="Date de fin"
								type="date"
								value={initialData.endDate || ''}
								onChange={(e) => handleInputChange('endDate', e.target.value)}
							/>
							<FieldError error={fieldErrors.endDate} />
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<Input
								label="Prime annuelle (€)"
								type="number"
								value={
									initialData.annualPremiumCents ? (initialData.annualPremiumCents / 100).toString() : ''
								}
								onChange={(e) =>
									handleInputChange(
										'annualPremiumCents',
										Math.round(parseFloat(e.target.value || '0') * 100)
									)
								}
								placeholder="Ex: 650.50"
								step="0.01"
							/>
							<FieldError error={fieldErrors.annualPremiumCents} />
						</div>
						<div>
							<Input
								label="Prime mensuelle (€)"
								type="number"
								value={
									initialData.monthlyPremiumCents
										? (initialData.monthlyPremiumCents / 100).toString()
										: ''
								}
								onChange={(e) =>
									handleInputChange(
										'monthlyPremiumCents',
										Math.round(parseFloat(e.target.value || '0') * 100)
									)
								}
								placeholder="Ex: 54.21"
								step="0.01"
							/>
							<FieldError error={fieldErrors.monthlyPremiumCents} />
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Renouvellement tacite <span className="text-red-500">*</span>
							</label>
							<div className="flex space-x-4">
								<button
									type="button"
									onClick={() => handleInputChange('tacitRenewal', true)}
									className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
										initialData.tacitRenewal === true
											? 'border-[#1e51ab] bg-blue-50 text-[#1e51ab]'
											: 'border-gray-200 hover:border-gray-300'
									}`}
								>
									Oui
								</button>
								<button
									type="button"
									onClick={() => handleInputChange('tacitRenewal', false)}
									className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
										initialData.tacitRenewal === false
											? 'border-[#1e51ab] bg-blue-50 text-[#1e51ab]'
											: 'border-gray-200 hover:border-gray-300'
									}`}
								>
									Non
								</button>
							</div>
							<FieldError error={fieldErrors.tacitRenewal} />
						</div>
						<div>
							<Input
								label="Date limite de résiliation"
								type="date"
								value={initialData.cancellationDeadline || ''}
								onChange={(e) => handleInputChange('cancellationDeadline', e.target.value)}
							/>
							<FieldError error={fieldErrors.cancellationDeadline} />
						</div>
					</div>
				</div>
			</div>

			<div className="bg-blue-50 p-4 rounded-lg">
				<p className="text-sm text-blue-800">
					<FaExclamationTriangle className="inline h-4 w-4 mr-2" />
					Les champs facultatifs peuvent être remplis automatiquement par notre IA lors de l'analyse
					du document.
				</p>
			</div>
		</motion.div>
	);
};

export default ContractInfoStep;
