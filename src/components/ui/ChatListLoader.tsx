import { FaRobot } from 'react-icons/fa';
import React from 'react';

interface ChatListLoaderProps {
	count?: number;
	className?: string;
}

const ChatListLoader: React.FC<ChatListLoaderProps> = ({ count = 3, className = '' }) => {
	return (
		<div className={`space-y-3 ${className}`}>
			{Array.from({ length: count }, (_, index) => (
				<div
					key={index}
					className="mx-3 p-4 bg-white rounded-xl border border-gray-200 animate-pulse"
				>
					<div className="flex items-start gap-3">
						<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
							<FaRobot className="text-gray-400 text-sm" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between">
								<div className="flex-1 min-w-0">
									<div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
									<div className="h-3 bg-gray-100 rounded w-1/2"></div>
								</div>
								<div className="flex flex-col items-end gap-2">
									<div className="h-3 bg-gray-100 rounded w-12"></div>
									<div className="flex gap-1">
										<div className="w-6 h-6 bg-gray-100 rounded-full"></div>
										<div className="w-6 h-6 bg-gray-100 rounded-full"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatListLoader;
