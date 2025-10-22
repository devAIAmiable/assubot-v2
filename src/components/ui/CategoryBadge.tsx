import React from 'react';
import { motion } from 'framer-motion';

interface CategoryBadgeProps {
  icon?: React.ComponentType<{ className?: string }>;
  text: string;
  variant?: 'success' | 'info' | 'warning';
  pulse?: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ icon: Icon, text, variant = 'info', pulse = false }) => {
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: 'text-green-600',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: 'text-blue-600',
        };
    }
  };

  const styles = getVariantStyles(variant);

  return (
    <motion.div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        border ${styles.bg} ${styles.text} ${styles.border}
      `}
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={pulse ? { duration: 2, repeat: Infinity } : {}}
    >
      {Icon && <Icon className={`h-3 w-3 ${styles.icon}`} />}
      <span>{text}</span>
    </motion.div>
  );
};

export default React.memo(CategoryBadge);
