import type { ContractCategory, ContractFormData } from '../../../types';
import { FaBuilding, FaCar, FaHeart, FaHome, FaLaptop, FaMotorcycle } from 'react-icons/fa';
import React, { useCallback } from 'react';

import { motion } from 'framer-motion';

interface CategorySelectionStepProps {
	onDataUpdate: (data: Partial<ContractFormData>) => void;
	initialData: Partial<ContractFormData>;
}

const CategorySelectionStep: React.FC<CategorySelectionStepProps> = ({ onDataUpdate, initialData }) => {
	// Categories configuration
	const categories: Array<{
		id: ContractCategory;
		name: string;
		icon: React.ComponentType<{ className?: string }>;
		description: string;
	}> = [
		{
			id: 'auto',
			name: 'Auto',
			icon: FaCar,
			description: 'Assurance automobile',
		},
		{
			id: 'health',
			name: 'Santé',
			icon: FaHeart,
			description: 'Assurance santé et prévoyance',
		},
		{
			id: 'home',
			name: 'Habitation',
			icon: FaHome,
			description: 'Assurance habitation',
		},
		{
			id: 'moto',
			name: 'Moto',
			icon: FaMotorcycle,
			description: 'Assurance motocycle',
		},
		{
			id: 'electronic_devices',
			name: 'Appareils électroniques',
			icon: FaLaptop,
			description: 'Assurance électronique',
		},
		{
			id: 'other',
			name: 'Autre',
			icon: FaBuilding,
			description: 'Autres assurances',
		},
	];

	const handleCategorySelect = useCallback((category: ContractCategory) => {
		onDataUpdate({ category });
	}, [onDataUpdate]);

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-6"
		>
			<div className="text-center mb-8">
				<h3 className="text-2xl font-semibold text-gray-900 mb-2">
					Choisissez le type d'assurance
				</h3>
				<p className="text-gray-600">Sélectionnez la catégorie qui correspond à votre contrat</p>
			</div>

			<div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{categories.map((category) => {
						const Icon = category.icon;
						const isSelected = initialData.category === category.id;

						return (
							<motion.button
								key={category.id}
								type="button"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => handleCategorySelect(category.id)}
								className={`p-6 rounded-xl border-2 transition-all duration-200 ${
									isSelected
										? 'border-[#1e51ab] bg-blue-50 text-[#1e51ab] shadow-lg'
										: 'border-gray-200 hover:border-gray-300 text-gray-600 hover:shadow-md'
								}`}
							>
								<Icon className="h-8 w-8 mx-auto mb-3" />
								<div className="text-base font-medium mb-1">{category.name}</div>
								<div className="text-xs opacity-75">{category.description}</div>
							</motion.button>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
};

export default CategorySelectionStep;
