import React from 'react';

interface LogoProps {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
	const sizeClasses = {
		sm: 'h-8',
		md: 'h-12',
		lg: 'h-16',
	};

	return (
		<div className={`flex justify-center ${className}`}>
			<img
				src="/logo.png"
				alt="AssuBot Logo"
				className={`${sizeClasses[size]} w-auto`}
			/>
		</div>
	);
};

export default Logo; 