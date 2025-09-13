import { FaRobot } from 'react-icons/fa';
import React from 'react';

interface MessageLoaderProps {
	className?: string;
}

const MessageLoader: React.FC<MessageLoaderProps> = ({ className = '' }) => {
	return (
		<div className={`flex items-start gap-3 ${className}`}>
			<div className="w-8 h-8 bg-[#1e51ab] rounded-full flex items-center justify-center flex-shrink-0">
				<FaRobot className="text-white text-sm" />
			</div>
			<div className="bg-white rounded-lg rounded-tl-sm p-3 shadow-sm border border-gray-200">
				<div className="flex items-center gap-1">
					<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
					<div
						className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
						style={{ animationDelay: '0.1s' }}
					></div>
					<div
						className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
						style={{ animationDelay: '0.2s' }}
					></div>
				</div>
			</div>
		</div>
	);
};

export default MessageLoader;
