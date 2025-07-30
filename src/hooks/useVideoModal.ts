import { useEffect, useState } from 'react';

import { useAppSelector } from '../store/hooks';

export const useVideoModal = () => {
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
	const [hasShownVideo, setHasShownVideo] = useState(false);
	const { isAuthenticated, lastLoginAt } = useAppSelector((state) => state.user);

	// Show video modal when user logs in
	useEffect(() => {
		// Check if user just logged in (lastLoginAt is recent)
		if (isAuthenticated && lastLoginAt && !hasShownVideo) {
			const loginTime = new Date(lastLoginAt).getTime();
			const currentTime = new Date().getTime();
			const timeDiff = currentTime - loginTime;

			// Show video if login happened within the last 5 seconds
			if (timeDiff < 5000) {
				// Delay the modal appearance by 1 second
				const timer = setTimeout(() => {
					setIsVideoModalOpen(true);
					setHasShownVideo(true);
				}, 1000);

				return () => clearTimeout(timer);
			}
		}
	}, [isAuthenticated, lastLoginAt, hasShownVideo]);

	const openVideoModal = () => {
		setIsVideoModalOpen(true);
	};

	const closeVideoModal = () => {
		setIsVideoModalOpen(false);
	};

	const resetVideoModal = () => {
		setHasShownVideo(false);
	};

	return {
		isVideoModalOpen,
		openVideoModal,
		closeVideoModal,
		resetVideoModal,
		hasShownVideo,
	};
};
