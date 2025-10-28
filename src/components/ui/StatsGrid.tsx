import React from 'react';
import { motion } from 'framer-motion';

interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: number;
  delay?: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({ children, columns = 4, gap = 6, delay = 0.1 }) => {
  const getGridCols = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <motion.div className={`grid ${getGridCols()} gap-${gap}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay }}>
      {children}
    </motion.div>
  );
};

export default StatsGrid;
