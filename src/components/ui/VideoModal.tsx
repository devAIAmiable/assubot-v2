import { Dialog, Transition } from '@headlessui/react';
import { FaPause, FaPlay, FaTimes, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import React, { Fragment, useEffect, useRef, useState } from 'react';

interface VideoModalProps {
	isOpen: boolean;
	onClose: () => void;
	videoSrc: string;
	title?: string;
	autoPlay?: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({
	isOpen,
	onClose,
	videoSrc,
	title = 'AssuBot Présentation',
	autoPlay = false,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	// Start muted when autoplaying to satisfy browser policies
	const [isMuted, setIsMuted] = useState<boolean>(autoPlay);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [hasError, setHasError] = useState<boolean>(false);

	// Open/close lifecycle
	useEffect(() => {
		const el = videoRef.current;

		if (!isOpen) {
			// Pause and reset when closing so that each open starts fresh
			if (el) {
				try {
					el.pause();
				} catch {}
				el.currentTime = 0;
			}
			setIsPlaying(false);
			setCurrentTime(0);
			setIsLoading(true);
			setHasError(false);
			return;
		}

		// When opening
		if (el) {
			el.currentTime = 0;
			setCurrentTime(0);
			setIsLoading(true);
			setHasError(false);

			if (autoPlay) {
				// Ensure the DOM property is muted as well (even though React prop sets it)
				el.muted = true;
				setIsMuted(true);

				const playVideo = async () => {
					try {
						await el.play();
						setIsPlaying(true);
					} catch (error) {
						// Autoplay may still be blocked in rare cases
						// (user gesture will be required then)
						// eslint-disable-next-line no-console
						console.log('Auto-play failed:', error);
						setIsPlaying(false);
					}
				};

				// Wait for enough data to start playback
				const handleLoadedData = () => {
					playVideo();
					el.removeEventListener('loadeddata', handleLoadedData);
				};

				el.addEventListener('loadeddata', handleLoadedData);

				// Fallback retry
				const fallbackTimer = setTimeout(() => {
					if (!el.paused) return;
					playVideo();
				}, 1000);

				return () => {
					clearTimeout(fallbackTimer);
					el.removeEventListener('loadeddata', handleLoadedData);
				};
			}
		}
	}, [isOpen, autoPlay]);

	// Video event handlers
	const handleTimeUpdate = () => {
		const el = videoRef.current;
		if (el) setCurrentTime(el.currentTime);
	};

	const handleLoadedMetadata = () => {
		const el = videoRef.current;
		if (el) {
			setDuration(Number.isFinite(el.duration) ? el.duration : 0);
			setIsLoading(false);
			setHasError(false);
		}
	};

	const handleVideoError = () => {
		setIsLoading(false);
		setHasError(true);
	};

	const handleVideoEnd = () => {
		setIsPlaying(false);
		const el = videoRef.current;
		if (el) {
			el.currentTime = 0;
			setCurrentTime(0);
		}
	};

	// Controls
	const togglePlay = async () => {
		const el = videoRef.current;
		if (!el) return;

		if (isPlaying) {
			el.pause();
			setIsPlaying(false);
		} else {
			try {
				await el.play();
				setIsPlaying(true);
			} catch {
				setIsPlaying(false);
			}
		}
	};

	const toggleMute = () => {
		const el = videoRef.current;
		if (!el) return;
		const next = !isMuted;
		el.muted = next;
		setIsMuted(next);
	};

	// Progress bar seek
	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = videoRef.current;
		if (!el || duration <= 0) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const pct = Math.min(Math.max(clickX / rect.width, 0), 1);
		const newTime = pct * duration;

		el.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const formatTime = (time: number) => {
		if (!Number.isFinite(time) || time < 0) time = 0;
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
										type="button"
										onClick={onClose}
										className="rounded-full p-2 hover:bg-gray-100 transition-colors"
										aria-label="Fermer"
									>
										<FaTimes className="h-5 w-5 text-gray-500" />
									</button>
								</div>

								{/* Video Container */}
								<div className="relative bg-black">
									<video
										ref={videoRef}
										className="w-full h-auto max-h-[70vh]"
										// Ensure autoplay works reliably
										muted={isMuted || autoPlay}
										playsInline
										autoPlay={autoPlay}
										preload="metadata"
										// crossOrigin="anonymous" // uncomment if serving from another domain and CORS issues occur
										onTimeUpdate={handleTimeUpdate}
										onLoadedMetadata={handleLoadedMetadata}
										onError={handleVideoError}
										onEnded={handleVideoEnd}
										onPlay={() => setIsPlaying(true)}
										onPause={() => setIsPlaying(false)}
									>
										<source src={videoSrc} type="video/mp4" />
										Votre navigateur ne supporte pas la lecture de vidéos.
									</video>

									{/* Loading State */}
									{isLoading && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/50">
											<div className="text-white text-center">
												<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
												<p>Chargement de la vidéo...</p>
											</div>
										</div>
									)}

									{/* Error State */}
									{hasError && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/50">
											<div className="text-white text-center">
												<p className="text-lg font-semibold mb-2">Erreur de chargement</p>
												<p className="text-sm opacity-75">Impossible de charger la vidéo</p>
											</div>
										</div>
									)}

									{/* Video Controls Overlay */}
									{!isLoading && !hasError && (
										<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
											{/* Progress Bar */}
											<div
												className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3"
												onClick={handleProgressClick}
												role="progressbar"
												aria-valuemin={0}
												aria-valuemax={duration || 0}
												aria-valuenow={currentTime}
												aria-label="Position de lecture"
											>
												<div
													className="h-full bg-blue-500 rounded-full transition-all"
													style={{
														width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
													}}
												/>
											</div>

											{/* Controls */}
											<div className="flex items-center justify-between text-white">
												<div className="flex items-center space-x-4">
													<button
														type="button"
														onClick={togglePlay}
														className="p-2 hover:bg-white/20 rounded-full transition-colors"
														aria-label={isPlaying ? 'Pause' : 'Lecture'}
													>
														{isPlaying ? (
															<FaPause className="h-4 w-4" />
														) : (
															<FaPlay className="h-4 w-4" />
														)}
													</button>
													<button
														type="button"
														onClick={toggleMute}
														className="p-2 hover:bg-white/20 rounded-full transition-colors"
														aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
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
									)}
								</div>

								{/* Footer */}
								<div className="flex justify-end p-6 border-t border-gray-200">
									<button
										type="button"
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
