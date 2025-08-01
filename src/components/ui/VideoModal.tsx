import { Dialog, Transition } from '@headlessui/react';
import { FaPause, FaPlay, FaTimes, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import React, { useEffect, useRef } from 'react';

import { Fragment } from 'react';

interface VideoModalProps {
	isOpen: boolean;
	onClose: () => void;
	videoSrc: string;
	title?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
	isOpen,
	onClose,
	videoSrc,
	title = 'AssuBot Présentation',
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = React.useState(false);
	const [isMuted, setIsMuted] = React.useState(false);
	const [currentTime, setCurrentTime] = React.useState(0);
	const [duration, setDuration] = React.useState(0);

	// Reset video when modal opens
	useEffect(() => {
		if (isOpen && videoRef.current) {
			videoRef.current.currentTime = 0;
			setCurrentTime(0);
			setIsPlaying(false);
		}
	}, [isOpen]);

	// Handle video time updates
	const handleTimeUpdate = () => {
		if (videoRef.current) {
			setCurrentTime(videoRef.current.currentTime);
		}
	};

	// Handle video loaded metadata
	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			setDuration(videoRef.current.duration);
		}
	};

	// Toggle play/pause
	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	// Toggle mute
	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	// Handle video end
	const handleVideoEnd = () => {
		setIsPlaying(false);
		if (videoRef.current) {
			videoRef.current.currentTime = 0;
			setCurrentTime(0);
		}
	};

	// Format time in MM:SS
	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	// Handle progress bar click
	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (videoRef.current) {
			const rect = e.currentTarget.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const percentage = clickX / rect.width;
			const newTime = percentage * duration;
			videoRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-white/30 backdrop-blur-md" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
								{/* Header */}
								<div className="flex items-center justify-between p-6 border-b border-gray-200">
									<Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
										{title}
									</Dialog.Title>
									<button
										onClick={onClose}
										className="rounded-full p-2 hover:bg-gray-100 transition-colors"
									>
										<FaTimes className="h-5 w-5 text-gray-500" />
									</button>
								</div>

								{/* Video Container */}
								<div className="relative bg-black">
									<video
										ref={videoRef}
										className="w-full h-auto max-h-[70vh]"
										onTimeUpdate={handleTimeUpdate}
										onLoadedMetadata={handleLoadedMetadata}
										onEnded={handleVideoEnd}
										onPlay={() => setIsPlaying(true)}
										onPause={() => setIsPlaying(false)}
									>
										<source src={videoSrc} type="video/mp4" />
										Votre navigateur ne supporte pas la lecture de vidéos.
									</video>

									{/* Video Controls Overlay */}
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
										{/* Progress Bar */}
										<div
											className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3"
											onClick={handleProgressClick}
										>
											<div
												className="h-full bg-blue-500 rounded-full transition-all"
												style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
											/>
										</div>

										{/* Controls */}
										<div className="flex items-center justify-between text-white">
											<div className="flex items-center space-x-4">
												<button
													onClick={togglePlay}
													className="p-2 hover:bg-white/20 rounded-full transition-colors"
												>
													{isPlaying ? (
														<FaPause className="h-4 w-4" />
													) : (
														<FaPlay className="h-4 w-4" />
													)}
												</button>
												<button
													onClick={toggleMute}
													className="p-2 hover:bg-white/20 rounded-full transition-colors"
												>
													{isMuted ? (
														<FaVolumeMute className="h-4 w-4" />
													) : (
														<FaVolumeUp className="h-4 w-4" />
													)}
												</button>
												<span className="text-sm">
													{formatTime(currentTime)} / {formatTime(duration)}
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Footer */}
								<div className="flex justify-end p-6 border-t border-gray-200">
									<button
										onClick={onClose}
										className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
									>
										Fermer
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default VideoModal;
