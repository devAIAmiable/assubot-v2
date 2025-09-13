import { FaCheck, FaChevronLeft } from 'react-icons/fa';

import type { Contract } from '../../types';
import type { InsuranceType } from '../../types';
import React from 'react';
import type { User } from '../../store/userSlice';
import { getContractType } from '../../utils/contractAdapters';
import { motion } from 'framer-motion';

interface InsuranceTypeConfig {
	id: InsuranceType;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
}

interface TypeSelectionViewProps {
	user: User | null;
	insuranceTypes: InsuranceTypeConfig[];
	contracts: Contract[];
	setCurrentStep: (step: 'history' | 'type' | 'form' | 'results' | 'loading') => void;
	handleTypeSelection: (type: InsuranceType) => void;
}

const TypeSelectionView: React.FC<TypeSelectionViewProps> = ({
	user,
	insuranceTypes,
	contracts,
	setCurrentStep,
	handleTypeSelection,
}) => {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Comparateur d'assurances</h1>
					<p className="text-gray-600 text-lg">
						{user?.firstName
							? `${user.firstName}, choisissez le type d'assurance à comparer.`
							: "Choisissez le type d'assurance à comparer."}
					</p>
				</motion.div>
				<button
					onClick={() => setCurrentStep('history')}
					className="text-[#1e51ab] hover:text-[#163d82] font-medium flex items-center"
				>
					<FaChevronLeft className="h-4 w-4 mr-2" />
					Mes comparaisons
				</button>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="grid grid-cols-1 md:grid-cols-2 gap-6"
			>
				{insuranceTypes.map((type) => {
					const Icon = type.icon;
					return (
						<motion.div
							key={type.id}
							className="bg-white border-2 border-gray-100 rounded-2xl p-8 cursor-pointer hover:border-[#1e51ab] hover:shadow-lg transition-all"
							whileHover={{ scale: 1.02 }}
							onClick={() => handleTypeSelection(type.id)}
						>
							<div className="text-center">
								<div
									className={`w-20 h-20 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center mx-auto mb-6`}
								>
									<Icon className="h-10 w-10 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">{type.name}</h3>
								{contracts.some((c) => (getContractType(c) === type.id || (getContractType(c) === 'autre' && type.id === 'moto')) && c.status === 'active') && (
									<div className="flex items-center justify-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
										<FaCheck className="h-3 w-3 mr-2" />
										Contrat existant détecté
									</div>
								)}
							</div>
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);
};

export default TypeSelectionView; 