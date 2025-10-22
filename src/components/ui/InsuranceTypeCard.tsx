import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import type { ComparisonCategory } from '../../types/comparison';
import CategoryBadge from './CategoryBadge';
import DecorativePattern from './DecorativePattern';

interface InsuranceTypeCardProps {
  category: ComparisonCategory;
  label: string;
  description: string;
  illustration: string;
  hasExistingContract: boolean;
  onClick: () => void;
  index: number; // for stagger animation
}

const InsuranceTypeCard: React.FC<InsuranceTypeCardProps> = ({ category, label, description, illustration, hasExistingContract, onClick, index }) => {
  const getCategoryColor = (category: ComparisonCategory) => {
    switch (category) {
      case 'auto':
        return {
          primary: 'from-blue-500 to-blue-600',
          secondary: 'bg-blue-50',
          border: 'hover:border-blue-500',
          pattern: 'bg-blue-100',
        };
      case 'home':
        return {
          primary: 'from-green-500 to-green-600',
          secondary: 'bg-green-50',
          border: 'hover:border-green-500',
          pattern: 'bg-green-100',
        };
      default:
        return {
          primary: 'from-gray-500 to-gray-600',
          secondary: 'bg-gray-50',
          border: 'hover:border-gray-500',
          pattern: 'bg-gray-100',
        };
    }
  };

  const colors = getCategoryColor(category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative bg-white rounded-2xl p-6 cursor-pointer border-2 border-transparent
        hover:shadow-2xl transition-all duration-300 overflow-hidden
        ${colors.border}
      `}
      onClick={onClick}
    >
      {/* Decorative background pattern */}
      <DecorativePattern color={colors.pattern} position="top-right" size="lg" />

      {/* Illustration container */}
      <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
        <img src={illustration} alt={`${label} illustration`} className="w-full h-full object-contain p-4" />
        {/* Subtle overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{label}</h3>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>

        {/* Existing contract badge */}
        {hasExistingContract && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>
            <CategoryBadge icon={FaCheck} text="Contrat existant détecté" variant="success" pulse={true} />
          </motion.div>
        )}
      </div>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

export default React.memo(InsuranceTypeCard);
