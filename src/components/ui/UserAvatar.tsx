import React from 'react';

interface UserAvatarProps {
	user?: {
		firstName?: string;
		lastName?: string;
		name?: string;
		avatar?: string;
	} | null;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
	// Helper function to get user initials
	const getUserInitials = (userData: typeof user) => {
		if (!userData) return 'U';
		if (userData.firstName && userData.lastName) {
			return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
		}
		if (userData.name) {
			const names = userData.name.split(' ');
			return names.length >= 2
				? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
				: names[0].charAt(0).toUpperCase();
		}
		return 'U';
	};

	// Size classes
	const sizeClasses = {
		sm: 'w-6 h-6 text-xs',
		md: 'w-8 h-8 text-xs',
		lg: 'w-12 h-12 text-sm',
	};

	const baseClasses = `rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${sizeClasses[size]} ${className}`;

	// Handle image error by replacing with initials
	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const target = e.target as HTMLImageElement;
		const parent = target.parentElement;
		if (parent) {
			parent.innerHTML = `
				<div class="w-full h-full bg-[#1e51ab] flex items-center justify-center">
					<span class="text-white font-medium">${getUserInitials(user)}</span>
				</div>
			`;
		}
	};

	return (
		<div className={baseClasses}>
			{user?.avatar ? (
				<img
					src={user.avatar}
					alt={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur'}
					className="w-full h-full object-cover"
					onError={handleImageError}
				/>
			) : (
				<div className="w-full h-full bg-[#1e51ab] flex items-center justify-center">
					<span className="text-white font-medium">{getUserInitials(user)}</span>
				</div>
			)}
		</div>
	);
};

export default UserAvatar;
