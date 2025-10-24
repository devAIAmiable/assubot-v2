import { FaBrain, FaCalculator, FaStar } from 'react-icons/fa';

import type { ComparisonCategory } from '../../types/comparison';
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingViewProps {
  selectedType: ComparisonCategory | null;
}

const LoadingView: React.FC<LoadingViewProps> = ({ selectedType }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-20 h-20 border-4 border-[#1e51ab] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recherche des meilleures offres...</h2>
        <p className="text-gray-600 mb-8">
          Nous analysons les meilleures offres d'assurance {selectedType === 'auto' ? 'auto' : selectedType === 'home' ? 'habitation' : ''} pour vous
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex items-center">
            <FaCalculator className="h-4 w-4 mr-2" />
            Comparaison des prix
          </motion.div>
          <span>•</span>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="flex items-center">
            <FaBrain className="h-4 w-4 mr-2" />
            Analyse des garanties
          </motion.div>
          <span>•</span>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} className="flex items-center">
            <FaStar className="h-4 w-4 mr-2" />
            Notation des assureurs
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingView;
