import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import React, { memo } from 'react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

const ErrorToastComponent: React.FC<ErrorToastProps> = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-6 right-6 bg-red-500 text-white px-4 py-3 rounded-lg shadow-2xl border border-red-400 max-w-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-sm">{message}</span>
        <button onClick={onClose} className="p-1 text-red-200 hover:text-white hover:bg-red-600 rounded transition-colors" aria-label="Fermer l'erreur">
          <FaTimes />
        </button>
      </div>
    </motion.div>
  );
};

export const ErrorToast = memo(ErrorToastComponent);
ErrorToast.displayName = 'ErrorToast';
