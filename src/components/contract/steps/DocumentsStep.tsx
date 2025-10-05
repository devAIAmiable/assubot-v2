import { FaCheckCircle, FaUpload } from 'react-icons/fa';
import React, { useCallback, useState } from 'react';

import type { ContractFormData } from '../../../types';
import { motion } from 'framer-motion';

interface DocumentsStepProps {
	onDataUpdate: (data: Partial<ContractFormData>) => void;
	onFileRefsUpdate: (refs: Record<string, File>) => void;
	initialData: Partial<ContractFormData>;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({
	onDataUpdate,
	onFileRefsUpdate,
	initialData,
}) => {
	const [dragStates, setDragStates] = useState<Record<string, boolean>>({});
	const [localFileRefs, setLocalFileRefs] = useState<Record<string, File>>({});

	// Utility functions
	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	// Document types configuration
	const documentTypes = [
		{
			type: 'CP' as const,
			name: 'Conditions Particulières',
			description: 'Document contenant les détails spécifiques à votre contrat',
			required: true,
		},
		{
			type: 'CG' as const,
			name: 'Conditions Générales',
			description: 'Document contenant les conditions générales du contrat',
			required: true,
		},
		{
			type: 'OTHER' as const,
			name: 'Autres Documents',
			description: 'Annexes, avenants ou autres documents complémentaires',
			required: false,
		},
	];

	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>, documentType: 'CP' | 'CG' | 'OTHER') => {
			const file = event.target.files?.[0];
			if (file) {
				// Store the actual File object in local refs
				const newFileRefs = { ...localFileRefs, [documentType]: file };
				setLocalFileRefs(newFileRefs);
				onFileRefsUpdate(newFileRefs);

				// Add document to state
				onDataUpdate({
					documents: [
						...(initialData.documents || []).filter((doc) => doc.type !== documentType),
						{
							type: documentType,
							fileName: file.name,
							fileSize: file.size,
							fileType: file.type,
						},
					],
				});
			}
		},
		[initialData.documents, localFileRefs, onDataUpdate, onFileRefsUpdate]
	);

	const handleDragOver = useCallback((event: React.DragEvent, documentType: string) => {
		event.preventDefault();
		setDragStates((prev) => ({ ...prev, [documentType]: true }));
	}, []);

	const handleDragLeave = useCallback((event: React.DragEvent, documentType: string) => {
		event.preventDefault();
		setDragStates((prev) => ({ ...prev, [documentType]: false }));
	}, []);

	const handleDrop = useCallback(
		(event: React.DragEvent, documentType: 'CP' | 'CG' | 'OTHER') => {
			event.preventDefault();
			setDragStates((prev) => ({ ...prev, [documentType]: false }));

			const file = event.dataTransfer.files?.[0];
			if (file) {
				// Store the actual File object in local refs
				const newFileRefs = { ...localFileRefs, [documentType]: file };
				setLocalFileRefs(newFileRefs);
				onFileRefsUpdate(newFileRefs);

				// Add document to state
				onDataUpdate({
					documents: [
						...(initialData.documents || []).filter((doc) => doc.type !== documentType),
						{
							type: documentType,
							fileName: file.name,
							fileSize: file.size,
							fileType: file.type,
						},
					],
				});
			}
		},
		[initialData.documents, localFileRefs, onDataUpdate, onFileRefsUpdate]
	);

	const handleRemoveDocument = useCallback(
		(documentType: 'CP' | 'CG' | 'OTHER') => {
			onDataUpdate({
				documents: (initialData.documents || []).filter((doc) => doc.type !== documentType),
			});

			// Remove from local file refs
			const newFileRefs = { ...localFileRefs };
			delete newFileRefs[documentType];
			setLocalFileRefs(newFileRefs);
			onFileRefsUpdate(newFileRefs);
		},
		[initialData.documents, localFileRefs, onDataUpdate, onFileRefsUpdate]
	);

	const getDocumentForType = (type: 'CP' | 'CG' | 'OTHER') => {
		return initialData.documents?.find((doc) => doc.type === type);
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-6"
		>
			<div className="text-center">
				<h3 className="text-xl font-semibold text-gray-900 mb-2">Documents du contrat</h3>
				<p className="text-gray-600">Ajoutez les documents nécessaires à votre contrat</p>
			</div>

			<div className="space-y-6">
					{/* Document Types */}
					{documentTypes.map((docType) => (
						<div key={docType.type} className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<span className="text-sm font-medium text-gray-700">{docType.name}</span>
									{docType.required && <span className="text-red-500 text-xs">*</span>}
								</div>
								{getDocumentForType(docType.type) && (
									<div className="flex items-center space-x-2 text-green-600">
										<FaCheckCircle className="h-4 w-4" />
										<span className="text-sm">Ajouté</span>
									</div>
								)}
							</div>

							<div
								className={[
									'relative rounded-xl border border-zinc-200 p-6 transition',
									'hover:bg-zinc-50',
									dragStates[docType.type] && 'ring-2 ring-blue-500/30 bg-blue-50/50',
									getDocumentForType(docType.type) && 'bg-zinc-50',
								]
									.filter(Boolean)
									.join(' ')}
								onDragOver={(e) => handleDragOver(e, docType.type)}
								onDragLeave={(e) => handleDragLeave(e, docType.type)}
								onDrop={(e) => handleDrop(e, docType.type)}
								role="region"
								aria-label={`Zone de dépôt pour ${docType.name}`}
							>
								{/* Invisible input covering the entire area to capture clicks */}
								<input
									type="file"
									accept=".pdf"
									onChange={(e) => handleFileUpload(e, docType.type)}
									className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
									aria-label={`Téléverser un fichier pour ${docType.name}`}
								/>

								{getDocumentForType(docType.type) ? (
									<div className="flex items-center justify-between pointer-events-none">
										<div className="flex items-center gap-3 min-w-0">
											<span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white">
												📄
											</span>
											<div className="min-w-0">
												<p className="truncate text-sm font-medium text-zinc-900">
													{getDocumentForType(docType.type)?.fileName}
												</p>
												<p className="text-xs text-zinc-500">
													{formatFileSize(getDocumentForType(docType.type)?.fileSize || 0)}
												</p>
											</div>
										</div>

										{/* Remove still needs to be clickable: lift above the input */}
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveDocument(docType.type);
											}}
											className="relative z-20 text-sm text-red-600 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 rounded-md px-2 py-1"
										>
											Supprimer
										</button>
									</div>
								) : (
									<div className="flex flex-col items-center text-center pointer-events-none">
										<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-zinc-300">
											<FaUpload className="h-5 w-5 text-zinc-400" />
										</div>
										<p className="text-sm text-zinc-700">Cliquez ou déposez un fichier ici</p>
										<p className="mt-1 text-xs text-zinc-500">
											PDF, DOC, DOCX, JPG, PNG · max 10MB
										</p>

										<div className="pointer-events-none mt-6 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
									</div>
								)}
							</div>
						</div>
					))}
				</div>
		</motion.div>
	);
};

export default DocumentsStep;
