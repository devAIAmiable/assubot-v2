import { FaGoogle } from 'react-icons/fa';
import React from 'react';

interface GoogleLoginButtonProps {
	onClick: () => void;
	loading?: boolean;
	disabled?: boolean;
	className?: string;
	children?: React.ReactNode;
	isLogin?: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
	onClick,
	loading = false,
	disabled = false,
	isLogin = false,
}) => {
	return (
		<div className="mt-6">
			<button
				type="button"
				onClick={onClick}
				disabled={disabled || loading}
				className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
			>
				<FaGoogle className="h-4 w-4 mr-2 text-red-500" />
				{isLogin ? 'Se connecter avec Google' : "S'inscrire avec Google"}
			</button>
		</div>
	);
};

export default GoogleLoginButton;
