import { FaCamera } from 'react-icons/fa';
import React from 'react';
import { motion } from 'framer-motion';

interface AvatarProps {
	user?: {
		firstName?: string;
		lastName?: string;
		avatar?: string;
	};
	size?: 'sm' | 'md' | 'lg' | 'xl';
	onAvatarUpload?: (file: File) => void;
	loading?: boolean;
	className?: string;
	showUploadButton?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
	user,
	size = 'md',
	onAvatarUpload,
	loading = false,
	className = '',
	showUploadButton = false,
}) => {
	const getUserInitials = () => {
		if (user) {
			const firstInitial = user.firstName?.charAt(0) || '';
			const lastInitial = user.lastName?.charAt(0) || '';
			return (firstInitial + lastInitial).toUpperCase() || 'U';
		}
		return 'U';
	};

	const sizeClasses = {
		sm: 'w-8 h-8 text-sm',
		md: 'w-10 h-10 text-base',
		lg: 'w-12 h-12 text-lg',
		xl: 'w-24 h-24 text-2xl',
	};

	const uploadButtonSizeClasses = {
		sm: 'w-6 h-6',
		md: 'w-7 h-7',
		lg: 'w-8 h-8',
		xl: 'w-8 h-8',
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && onAvatarUpload) {
			onAvatarUpload(file);
		}
		// Clear the input
		e.target.value = '';
	};

	return (
		<div className={`relative inline-block ${className}`}>
			{user?.avatar ? (
				<motion.img
					key={user.avatar} // Force re-render when avatar changes
					src={user.avatar}
					alt="Avatar"
					className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-lg`}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
				/>
			) : (
				<motion.div
					className={`${sizeClasses[size]} bg-gradient-to-br from-[#1e51ab] to-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg`}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
				>
					{getUserInitials()}
				</motion.div>
			)}

			{/* Upload Button Overlay */}
			{showUploadButton && onAvatarUpload && (
				<label
					className={`absolute bottom-0 right-0 ${uploadButtonSizeClasses[size]} bg-[#1e51ab] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#163d82] transition-colors shadow-lg ${
						loading ? 'opacity-50 cursor-not-allowed' : ''
					}`}
				>
					{loading ? (
						<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
					) : (
						<FaCamera className="h-3 w-3" />
					)}
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						disabled={loading}
					/>
				</label>
			)}
		</div>
	);
};

export default Avatar; 