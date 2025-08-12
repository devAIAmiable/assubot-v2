import type {
	ContractInitResponse,
	ContractNotificationRequest,
	DocumentType,
	UploadUrlRequest,
	UploadUrlResponse,
} from '../types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { config } from '../config/env';

// Define the API response wrapper type based on backend spec
interface ApiResponse<T> {
	success: boolean;
	data: {
		message: string;
		resource: T;
	};
}

// Updated request types for batch upload
interface BatchUploadUrlRequest {
	files: Array<{
		fileName: string;
		contentType: string;
		documentType: DocumentType;
	}>;
}

interface BatchUploadUrlResponse {
	uploadUrls: Array<{
		fileName: string;
		documentType: DocumentType;
		uploadUrl: string;
		blobName: string;
	}>;
}

// Updated contract init request
interface UpdatedContractInitRequest {
	insurerName?: string;
	name: string;
	category: string;
	formula?: string;
	startDate?: string;
	endDate?: string;
	annualPremiumCents?: number;
	monthlyPremiumCents?: number;
	tacitRenewal?: boolean;
	cancellationDeadline?: string;
	documents: Array<{
		blobPath: string;
		documentType: DocumentType;
	}>;
}

interface ApiErrorResponse {
	status: 'error';
	error: {
		code: string;
		message: string;
	};
}

// Base query with authentication
const baseQuery = fetchBaseQuery({
	baseUrl: `${config.coreApiUrl}/contracts`,
	credentials: 'include',
	prepareHeaders: (headers) => {
		headers.set('Content-Type', 'application/json');
		return headers;
	},
});

export const contractsApi = createApi({
	reducerPath: 'contractsApi',
	baseQuery,
	tagTypes: ['Contract'],
	endpoints: (builder) => ({
		// Generate batch signed Azure upload URLs
		generateBatchUploadUrls: builder.mutation<BatchUploadUrlResponse, BatchUploadUrlRequest>({
			query: (uploadRequest) => ({
				url: '/upload-url',
				method: 'POST',
				body: uploadRequest,
			}),
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
		}),

		// Legacy single upload URL (for backward compatibility)
		generateUploadUrl: builder.mutation<UploadUrlResponse, UploadUrlRequest>({
			query: (uploadRequest) => ({
				url: '/upload-url',
				method: 'POST',
				body: {
					files: [
						{
							fileName: uploadRequest.fileName,
							contentType: uploadRequest.contentType,
							documentType: 'CP' as DocumentType, // Default to CP for legacy
						},
					],
				},
			}),
			transformResponse: (response: BatchUploadUrlResponse) => {
				const firstUrl = response.uploadUrls[0];
				return {
					uploadUrl: firstUrl.uploadUrl,
					blobPath: firstUrl.blobName,
				};
			},
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
		}),

		// Upload file directly to Azure Blob Storage
		uploadToAzure: builder.mutation<void, { uploadUrl: string; file: File }>({
			queryFn: async ({ uploadUrl, file }) => {
				try {
					const result = await fetch(uploadUrl, {
						method: 'PUT',
						body: file,
						headers: {
							'x-ms-blob-type': 'BlockBlob',
							'Content-Type': file.type,
						},
					});

					if (!result.ok) {
						throw new Error(`Upload failed: ${result.statusText}`);
					}

					return { data: undefined };
				} catch (error) {
					return {
						error: {
							status: 'FETCH_ERROR' as const,
							error: error instanceof Error ? error.message : 'Upload failed',
						},
					};
				}
			},
		}),

		// Initialize contract processing with multiple documents
		initContract: builder.mutation<ContractInitResponse, UpdatedContractInitRequest>({
			query: (contractData) => ({
				url: '/init',
				method: 'POST',
				body: contractData,
			}),
			transformResponse: (response: ApiResponse<ContractInitResponse> | ContractInitResponse) => {
				// Handle both wrapped and direct response formats
				if ('data' in response && response.data?.resource) {
					return response.data.resource;
				}
				return response as ContractInitResponse;
			},
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
			invalidatesTags: ['Contract'],
		}),

		// Handle processing completion notification (called by background worker)
		notify: builder.mutation<{ message: string }, ContractNotificationRequest>({
			query: (notificationData) => ({
				url: '/notify',
				method: 'POST',
				body: notificationData,
			}),
			transformResponse: (response: ApiResponse<{ message: string }> | { message: string }) => {
				// Handle both wrapped and direct response formats
				if ('data' in response && response.data?.resource) {
					return response.data.resource;
				}
				return response as { message: string };
			},
			transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
				status: response.status,
				message: response.data.error.message,
				code: response.data.error.code,
			}),
			invalidatesTags: ['Contract'],
		}),
	}),
});

export const {
	useGenerateBatchUploadUrlsMutation,
	useGenerateUploadUrlMutation,
	useUploadToAzureMutation,
	useInitContractMutation,
	useNotifyMutation,
} = contractsApi;

// Combined hook for the complete upload process
export const useContractUpload = () => {
	const [generateBatchUploadUrls] = useGenerateBatchUploadUrlsMutation();
	const [uploadToAzure] = useUploadToAzureMutation();
	const [initContract] = useInitContractMutation();

	const uploadDocuments = async (
		files: Array<{ file: File; type: DocumentType }>,
		contractData: Omit<UpdatedContractInitRequest, 'documents'>
	) => {
		console.log('🚀 ~ uploadDocuments ~ contractData:', contractData);
		try {
			// Step 1: Generate batch signed upload URLs
			const uploadUrlsResponse = await generateBatchUploadUrls({
				files: files.map(({ file, type }) => ({
					fileName: file.name,
					contentType: file.type,
					documentType: type,
				})),
			}).unwrap();

			// Step 2: Upload all files to Azure
			const uploadPromises = uploadUrlsResponse.uploadUrls.map(async (urlData, index) => {
				const file = files[index].file;
				await uploadToAzure({
					uploadUrl: urlData.uploadUrl,
					file,
				}).unwrap();
				return urlData;
			});

			await Promise.all(uploadPromises);

			// Step 3: Initialize contract processing with all documents
			const contractResponse = await initContract({
				...contractData,
				documents: uploadUrlsResponse.uploadUrls.map((urlData) => ({
					blobPath: urlData.blobName,
					documentType: urlData.documentType,
				})),
			}).unwrap();

			return {
				success: true,
				contractId: contractResponse.contractId,
				taskId: contractResponse.taskId,
				status: contractResponse.status,
				message: contractResponse.message,
			};
		} catch (error) {
			console.error('Contract upload failed:', error);
			throw error;
		}
	};

	return { uploadDocuments };
};
