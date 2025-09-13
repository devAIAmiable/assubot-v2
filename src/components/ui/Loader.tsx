import { FaSpinner } from 'react-icons/fa';
import React from 'react';

interface LoaderProps {
	size?: 'sm' | 'md' | 'lg';
	text?: string;
	className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text, className = '' }) => {
	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-lg',
		lg: 'text-2xl',
	};

	return (
		<div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
			<FaSpinner className={`animate-spin text-[#1e51ab] ${sizeClasses[size]}`} />
			{text && (
				<p className="text-gray-600 text-sm font-medium">{text}</p>
			)}
		</div>
	);
};

export default Loader;
