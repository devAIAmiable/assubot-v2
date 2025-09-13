import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FaBell, FaCheck, FaClock, FaRobot, FaTimes } from 'react-icons/fa';
import { Fragment, useCallback, useState } from 'react';

import ContractCreationForm from './contract/ContractCreationForm';
import type { ContractFormData } from '../types';
import React from 'react';
import { contractUploadService } from '../services/contractUploadService';
import { motion } from 'framer-motion';

interface CreateContractModalProps {
	open?: boolean;
	onClose?: () => void;
}

const CreateContractModal: React.FC<CreateContractModalProps> = ({
	open: propOpen,
	onClose: propOnClose,
}) => {
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	// Use prop if provided, otherwise default to false
	const open = propOpen !== undefined ? propOpen : false;

	const handleClose = useCallback(() => {
		if (propOnClose) {
			propOnClose();
		}
		// Reset form state when closing
		setShowSuccessMessage(false);
		setCurrentStep(1);
		setIsUploading(false);
		setUploadError(null);
	}, [propOnClose]);

	const handleSubmit = useCallback(
		async (fileObjects: Record<string, File>, formData: ContractFormData) => {
			setIsUploading(true);
			setUploadError(null);

			try {
				// Validate required documents using the service
				const validation = contractUploadService.validateRequiredDocuments(fileObjects);
				if (!validation.valid) {
					throw new Error(validation.error);
				}

				// Start the upload process with progress tracking
				const result = await contractUploadService.uploadContract(formData, fileObjects);

				if (result.success) {
					// Show success message
					setShowSuccessMessage(true);
				} else {
					throw new Error(result.error || 'Échec de la création du contrat');
				}
			} catch (error) {
				console.error('Contract creation failed:', error);
				const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
				setUploadError(errorMessage);
				// Re-throw the error so the form can handle it
				throw new Error(errorMessage);
			} finally {
				setIsUploading(false);
			}
		},
		[]
	);

	const closeSuccessMessage = useCallback(() => {
		setShowSuccessMessage(false);
		handleClose();
	}, [handleClose]);

	// Success Modal
	if (showSuccessMessage) {
		return (
			<Transition appear show={true} as={Fragment}>
				<Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={() => {}}>
					<div className="flex items-center justify-center min-h-screen px-4">
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div
								className="fixed inset-0 backdrop-blur-sm"
								style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
							/>
						</TransitionChild>

						<TransitionChild
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<DialogPanel className="relative bg-white rounded-2xl max-w-md w-full mx-auto shadow-xl">
								<div className="p-8">
									<div className="text-center">
										<motion.div
											className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto"
											animate={{ scale: [1, 1.1, 1] }}
											transition={{ duration: 2, repeat: Infinity }}
										>
											<FaCheck className="text-4xl text-white" />
										</motion.div>
										<h4 className="text-2xl font-semibold text-green-600 mt-4">
											Contrat téléchargé avec succès !
										</h4>
										<div className="text-left mb-4">
											<p className="text-lg font-medium text-gray-800 mb-4 text-center">
												Votre contrat est en cours de traitement.
											</p>
											<div className="bg-gray-50 rounded-lg px-2 py-4 space-y-4">
												<div className="flex items-center space-x-3 py-2">
													<FaClock className="text-xl text-blue-500 w-5 flex-shrink-0 mx-2" />
													<span className="text-gray-700">
														Temps de traitement :{' '}
														<strong className="text-gray-900">3 minutes</strong>
													</span>
												</div>
												<div className="flex items-center space-x-3 py-2">
													<FaBell className="text-xl text-blue-500 w-5 flex-shrink-0 mx-2" />
													<span className="text-gray-700">
														Vous serez notifié dès que votre contrat sera disponible
													</span>
												</div>
												<div className="flex items-center space-x-3">
													<FaRobot className="text-xl text-blue-500 w-5 flex-shrink-0 mx-2" />
													<span className="text-gray-700">
														AssuBot analysera automatiquement vos documents
													</span>
												</div>
											</div>
											<p className="mt-4 text-gray-600 text-sm leading-relaxed">
												Une fois le traitement terminé, votre contrat apparaîtra dans votre tableau
												de bord et vous pourrez commencer à poser des questions à AssuBot à son
												sujet.
											</p>
										</div>
										<button
											className="bg-[#1e51ab] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center space-x-2 mx-auto mt-6"
											onClick={closeSuccessMessage}
										>
											<FaCheck />
											<span>Compris</span>
										</button>
									</div>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</Dialog>
			</Transition>
		);
	}

	return (
		<Transition appear show={open} as={Fragment}>
			<Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={handleClose}>
				<div className="flex items-center justify-center min-h-screen px-4">
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div
							className="fixed inset-0 backdrop-blur-sm"
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
						/>
					</TransitionChild>

					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<DialogPanel
							className={`relative bg-white rounded-2xl mx-auto shadow-xl ${
								isUploading ? 'max-w-md w-full' : 'max-w-4xl w-full'
							}`}
						>
							<div className={isUploading ? 'p-8' : 'p-6'}>
								{!isUploading && (
									<div className="flex items-center justify-between mb-6">
										<h2 className="text-2xl font-bold text-gray-900">Créer un nouveau contrat</h2>
										<button
											onClick={handleClose}
											className="text-gray-400 hover:text-gray-600 transition-colors"
										>
											<FaTimes className="h-6 w-6" />
										</button>
									</div>
								)}

								{/* Progress Stepper - Only show when not uploading */}
								{!isUploading && (
									<div className="mb-8">
										<div className="flex items-center justify-center max-w-2xl mx-auto">
											<div className="flex items-center w-full justify-between">
												{['Catégorie', 'Informations', 'Documents'].map((label, idx) => {
													const isActive = currentStep === idx + 1;
													const isCompleted = currentStep > idx + 1;

													return (
														<div key={label} className="flex items-center">
															<div className="flex flex-col items-center">
																<motion.div
																	className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-200 ${
																		isCompleted
																			? 'bg-[#1e51ab] border-[#1e51ab] text-white'
																			: isActive
																				? 'border-[#1e51ab] text-[#1e51ab] bg-white'
																				: 'border-gray-300 text-gray-400 bg-white'
																	}`}
																	animate={{ scale: isActive ? 1.1 : 1 }}
																>
																	{idx + 1}
																</motion.div>
																<span
																	className={`mt-2 text-sm transition-colors duration-200 ${
																		isActive ? 'text-[#1e51ab] font-semibold' : 'text-gray-400'
																	}`}
																>
																	{label}
																</span>
															</div>
															{idx < 2 && (
																<div className="w-20 h-1 bg-gray-200 mx-4 relative overflow-hidden rounded">
																	<motion.div
																		className="absolute top-0 left-0 h-1 bg-[#1e51ab] rounded"
																		initial={{ width: '0%' }}
																		animate={{ width: isCompleted ? '100%' : '0%' }}
																		transition={{ duration: 0.3 }}
																	/>
																</div>
															)}
														</div>
													);
												})}
											</div>
										</div>
									</div>
								)}

								{/* Upload Progress */}
								{isUploading && (
									<motion.div
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-center"
									>
										<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1e51ab] mx-auto mb-6"></div>
										<h4 className="text-xl font-medium text-gray-800 mb-3">
											Téléchargement en cours...
										</h4>
										<p className="text-gray-600">
											Veuillez patienter pendant que nous téléchargeons vos documents et créons
											votre contrat.
										</p>
									</motion.div>
								)}

								{/* Upload Error */}
								{uploadError && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
									>
										<div className="flex items-start space-x-3">
											<FaTimes className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
											<div className="flex-1">
												<p className="text-sm text-red-800 font-medium mb-2">
													Échec de la création du contrat
												</p>
												<p className="text-sm text-red-700 mb-3">{uploadError}</p>
												<div className="flex space-x-2">
													<button
														onClick={() => setUploadError(null)}
														className="text-sm text-red-600 hover:text-red-800 underline"
													>
														Fermer
													</button>
													<span className="text-red-300">•</span>
													<button
														onClick={() => setUploadError(null)}
														className="text-sm text-red-600 hover:text-red-800 underline"
													>
														Réessayer
													</button>
												</div>
											</div>
										</div>
									</motion.div>
								)}

								{/* Content */}
								{!isUploading && (
									<div className="min-h-[500px]">
										<ContractCreationForm
											onSubmit={handleSubmit}
											onStepChange={setCurrentStep}
											isUploading={isUploading}
										/>
									</div>
								)}
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	);
};

export default CreateContractModal;
