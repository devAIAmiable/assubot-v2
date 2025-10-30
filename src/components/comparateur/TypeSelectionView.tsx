import { FaChevronLeft } from 'react-icons/fa';
import { getComparisonCategories, getComparisonCategoryLabel, isComparisonCategoryComingSoon } from '../../config/categories';
import InsuranceTypeCard from '../ui/InsuranceTypeCard';

import type { ComparisonCategory } from '../../types/comparison';
import type { Contract } from '../../types';
import React from 'react';
import type { User } from '../../store/userSlice';
import { getContractType } from '../../utils/contractAdapters';
import { motion } from 'framer-motion';
import { useIsAdmin } from '../../hooks/useIsAdmin';

interface TypeSelectionViewProps {
  user: User | null;
  contracts: Contract[];
  setCurrentStep: (step: 'history' | 'type' | 'form' | 'results' | 'loading') => void;
  handleTypeSelection: (type: ComparisonCategory) => void;
}

const TypeSelectionView: React.FC<TypeSelectionViewProps> = ({ user, contracts, setCurrentStep, handleTypeSelection }) => {
  // Check if user is admin
  const isAdmin = useIsAdmin();

  // Get available comparison categories (auto, home, moto, health)
  const comparisonCategories = getComparisonCategories();

  // Helper function to get category description
  const getCategoryDescription = (category: ComparisonCategory): string => {
    switch (category) {
      case 'auto':
        return "Comparez les offres d'assurance auto et trouvez la meilleure couverture pour votre véhicule.";
      case 'home':
        return "Protégez votre habitation avec les meilleures offres d'assurance maison disponibles.";
      case 'moto':
        return "Comparez les offres d'assurance moto et trouvez la protection idéale pour votre deux-roues.";
      case 'health':
        return 'Comparez les mutuelles santé et trouvez la couverture adaptée à vos besoins médicaux.';
      default:
        return "Comparez les offres d'assurance disponibles.";
    }
  };

  // Helper function to check if user has existing contract
  const hasExistingContract = (category: ComparisonCategory): boolean => {
    return contracts.some((c) => {
      const contractType = getContractType(c);
      const isMatchingContract =
        contractType === category ||
        (category === 'home' && contractType === 'habitation') ||
        (category === 'auto' && contractType === 'auto') ||
        (category === 'moto' && contractType === 'moto') ||
        (category === 'health' && contractType === 'sante');
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {comparisonCategories.map((category, index) => {
          // For non-admins, disable all cards
          // For admins, only disable cards marked as coming soon
          const isComingSoon = !isAdmin || isComparisonCategoryComingSoon(category);
          const isDisabled = !isAdmin || isComparisonCategoryComingSoon(category);

          return (
            <InsuranceTypeCard
              key={category}
              category={category}
              label={getComparisonCategoryLabel(category)}
              description={getCategoryDescription(category)}
              illustration={`/illustrations/${category}.svg`}
              hasExistingContract={hasExistingContract(category)}
              onClick={() => handleTypeSelection(category)}
              index={index}
              disabled={isDisabled}
              comingSoon={isComingSoon}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default TypeSelectionView;
