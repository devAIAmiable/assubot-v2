import type { ContractFormData, DocumentType } from '../types';

import { contractsApi } from '../store/contractsApi';
import { store } from '../store';

interface UploadProgress {
	documentType: DocumentType;
	progress: number;
	status: 'pending' | 'uploading' | 'completed' | 'error';
	error?: string;
}

interface ContractUploadResult {
	success: boolean;
	contractId?: string;
	taskId?: string;
	error?: string;
	uploadResults: UploadProgress[];
}

export class ContractUploadService {
	private static instance: ContractUploadService;

	public static getInstance(): ContractUploadService {
		if (!ContractUploadService.instance) {
			ContractUploadService.instance = new ContractUploadService();
		}
		return ContractUploadService.instance;
	}

	/**
	 * Upload all documents for a contract and initialize processing
	 */
	async uploadContract(
		formData: ContractFormData,
		fileObjects: Record<string, File> // Actual File objects stored separately
	): Promise<ContractUploadResult> {
		// Convert fileObjects to array format
		const files = Object.entries(fileObjects).map(([type, file]) => ({
			file,
			type: type as DocumentType,
		}));

		const uploadResults: UploadProgress[] = files.map(({ type }) => ({
			documentType: type,
			progress: 0,
			status: 'pending' as const,
		}));

		try {
			// Step 1: Generate batch upload URLs and get contractId
			const uploadUrlsResponse = await store
				.dispatch(
					contractsApi.endpoints.generateBatchUploadUrls.initiate({
						files: files.map(({ file, type }) => ({
							fileName: file.name,
							contentType: file.type,
							documentType: type,
						})),
					})
				)
				.unwrap();

			// Step 2: Upload all files to Azure
			const uploadPromises = uploadUrlsResponse.uploadUrls.map(async (urlData, index) => {
				const resultIndex = uploadResults.findIndex(result => result.documentType === urlData.documentType);
				if (resultIndex === -1) return;

				try {
					// Upload to Azure
					await this.uploadToAzureWithProgress(
						urlData.uploadUrl,
						files[index].file
					);

					// Mark as completed
					uploadResults[resultIndex].progress = 100;
					uploadResults[resultIndex].status = 'completed';

					return urlData;
				} catch (error) {
					uploadResults[resultIndex].status = 'error';
					uploadResults[resultIndex].error =
						error instanceof Error ? error.message : 'Upload failed';
					throw error;
				}
			});

			await Promise.all(uploadPromises);

			// Step 3: Initialize contract processing with contractId
			const contractInitData = {
				contractId: uploadUrlsResponse.contractId,
				insurerId: formData.insurerId,
				name: formData.name,
				category: formData.category,
				version: formData.version,
				isTemplate: formData.isTemplate || false,
				formula: formData.formula,
				startDate: formData.startDate,
				endDate: formData.endDate,
				annualPremiumCents: formData.annualPremiumCents,
				documents: uploadUrlsResponse.uploadUrls.map(urlData => ({
					blobPath: urlData.blobName,
					documentType: urlData.documentType,
				})),
			};

			const contractResult = await store
				.dispatch(contractsApi.endpoints.initContract.initiate(contractInitData))
				.unwrap();

			return {
				success: true,
				contractId: contractResult.contractId,
				taskId: contractResult.taskId,
				uploadResults,
			};
		} catch (error) {
			console.error('Contract upload failed:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
				uploadResults,
			};
		}
	}

	/**
	 * Upload file to Azure
	 */
	private async uploadToAzureWithProgress(
		uploadUrl: string,
		file: File
	): Promise<void> {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			// Handle completion
			xhr.addEventListener('load', () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve();
				} else {
					reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
				}
			});

			// Handle errors
			xhr.addEventListener('error', () => {
				reject(new Error('Network error during upload'));
			});

			xhr.addEventListener('abort', () => {
				reject(new Error('Upload was aborted'));
			});

			// Set up the request
			xhr.open('PUT', uploadUrl);
			xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
			xhr.setRequestHeader('Content-Type', file.type);

			// Start the upload
			xhr.send(file);
		});
	}

	/**
	 * Validate file before upload
	 */
	validateFile(file: File): { valid: boolean; error?: string } {
		// Check file size (max 10MB)
		const maxSize = 10 * 1024 * 1024; // 10MB in bytes
		if (file.size > maxSize) {
			return {
				valid: false,
				error: 'Le fichier est trop volumineux. Taille maximale autorisée : 10MB',
			};
		}

		// Check file type
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'image/jpeg',
			'image/png',
			'image/jpg',
		];

		if (!allowedTypes.includes(file.type)) {
			return {
				valid: false,
				error: 'Type de fichier non supporté. Formats acceptés : PDF, DOC, DOCX, JPG, PNG',
			};
		}

		return { valid: true };
	}

	/**
	 * Validate required documents
	 */
	validateRequiredDocuments(fileObjects: Record<string, File>, isAdmin: boolean = false): { valid: boolean; error?: string } {
		const hasCP = 'CP' in fileObjects;
		const hasCG = 'CG' in fileObjects;

		// Pour les admins, les CP ne sont pas obligatoires
		if (!isAdmin && !hasCP) {
			return {
				valid: false,
				error: 'Les conditions particulières (CP) sont obligatoires',
			};
		}

		if (!hasCG) {
			return {
				valid: false,
				error: 'Les conditions générales (CG) sont obligatoires',
			};
		}

		return { valid: true };
	}

	/**
	 * Get file type icon
	 */
	getFileTypeIcon(file: File): string {
		if (file.type.includes('pdf')) return '📄';
		if (file.type.includes('word')) return '📝';
		if (file.type.includes('image')) return '🖼️';
		return '📎';
	}

	/**
	 * Format file size for display
	 */
	formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
}

// Export singleton instance
export const contractUploadService = ContractUploadService.getInstance();
