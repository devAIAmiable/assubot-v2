import { FaExclamationCircle } from 'react-icons/fa';
import React from 'react';
import { motion } from 'framer-motion';

interface FieldErrorProps {
	error?: string;
	className?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ error, className = '' }) => {
	if (!error) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className={`flex items-center space-x-2 text-red-600 text-sm mt-1 ${className}`}
		>
			<FaExclamationCircle className="h-4 w-4 flex-shrink-0" />
			<span>{error}</span>
		</motion.div>
	);
};

export default FieldError;
