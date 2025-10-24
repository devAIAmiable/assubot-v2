import { FaChevronLeft } from 'react-icons/fa';
import { getComparisonCategories, getComparisonCategoryLabel } from '../../config/categories';
import InsuranceTypeCard from '../ui/InsuranceTypeCard';

import type { ComparisonCategory } from '../../types/comparison';
import type { Contract } from '../../types';
import React from 'react';
import type { User } from '../../store/userSlice';
import { getContractType } from '../../utils/contractAdapters';
import { motion } from 'framer-motion';

interface TypeSelectionViewProps {
  user: User | null;
  contracts: Contract[];
  setCurrentStep: (step: 'history' | 'type' | 'form' | 'results' | 'loading') => void;
  handleTypeSelection: (type: ComparisonCategory) => void;
}

const TypeSelectionView: React.FC<TypeSelectionViewProps> = ({ user, contracts, setCurrentStep, handleTypeSelection }) => {
  // Get available comparison categories (auto and home only)
  const comparisonCategories = getComparisonCategories();

  // Helper function to get category description
  const getCategoryDescription = (category: ComparisonCategory): string => {
    switch (category) {
      case 'auto':
        return "Comparez les offres d'assurance auto et trouvez la meilleure couverture pour votre véhicule.";
      case 'home':
        return "Protégez votre habitation avec les meilleures offres d'assurance maison disponibles.";
      default:
        return "Comparez les offres d'assurance disponibles.";
    }
  };

  // Helper function to check if user has existing contract
  const hasExistingContract = (category: ComparisonCategory): boolean => {
    return contracts.some((c) => {
      const contractType = getContractType(c);
      const isMatchingContract = contractType === category || (category === 'home' && contractType === 'habitation') || (category === 'auto' && contractType === 'auto');
      return isMatchingContract && c.status === 'active';
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Comparateur d'assurances</h1>
          <p className="text-gray-600 text-lg">
            {user?.firstName ? `${user.firstName}, choisissez le type d'assurance à comparer.` : "Choisissez le type d'assurance à comparer."}
          </p>
        </motion.div>
        <button onClick={() => setCurrentStep('history')} className="text-[#1e51ab] hover:text-[#163d82] font-medium flex items-center">
          <FaChevronLeft className="h-4 w-4 mr-2" />
          Mes comparaisons
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {comparisonCategories.map((category, index) => (
          <InsuranceTypeCard
            key={category}
            category={category}
            label={getComparisonCategoryLabel(category)}
            description={getCategoryDescription(category)}
            illustration={`/illustrations/${category}.svg`}
            hasExistingContract={hasExistingContract(category)}
            onClick={() => handleTypeSelection(category)}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default TypeSelectionView;
