import type {
  ContractDownloadResponse,
  ContractInitResponse,
  ContractNotificationRequest,
  DashboardStats,
  DeleteContractResponse,
  DocumentType,
  GetContractByIdResponse,
  GetContractsParams,
  GetContractsResponse,
  UpdateContractRequest,
  UpdateContractResponse,
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
  contractId: string;
  uploadUrls: Array<{
    fileName: string;
    documentType: DocumentType;
    uploadUrl: string;
    blobName: string;
  }>;
}

// Admin upload request type
interface AdminUploadUrlRequest {
  insurerId: string;
  version: string;
  category: 'auto' | 'health' | 'home' | 'moto' | 'electronic_devices' | 'other';
  files: Array<{
    fileName: string;
    contentType: string;
    documentType: 'CP' | 'CG' | 'AA' | 'OTHER';
  }>;
}

interface AdminUploadUrlResponse {
  contractId: string;
  uploadUrls: Array<{
    fileName: string;
    documentType: 'CP' | 'CG' | 'AA' | 'OTHER';
    uploadUrl: string;
    blobName: string;
  }>;
}

// Admin contract init request type
interface AdminContractInitRequest {
  contractId: string;
  name: string;
  insurerId: string;
  version: string;
  category: 'auto' | 'health' | 'home' | 'moto' | 'electronic_devices' | 'other';
  documents: Array<{
    blobPath: string;
    documentType: 'CP' | 'CG' | 'AA' | 'OTHER';
  }>;
}

// Single document download response
interface SingleDocumentDownloadResponse {
  status: string;
  message: string;
  url: string;
  expiresAt: string;
  type: DocumentType;
}

// Updated contract init request
interface UpdatedContractInitRequest {
  contractId: string;
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
    // Get paginated active contracts for the authenticated user
    getContracts: builder.query<GetContractsResponse, GetContractsParams>({
      keepUnusedDataFor: 30 * 60, // 30 minutes in seconds
      query: (params) => {
        const queryParams: Record<string, string | number | string[]> = {
          page: params.page || 1,
          limit: Math.min(params.limit || 10, 100), // Ensure limit doesn't exceed 100
          status: params.status || ['active', 'pending'], // Default to active and pending
        };

        // Add optional parameters if they exist
        if (params.sortBy) queryParams.sortBy = params.sortBy;
        if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
        if (params.search && params.search.trim().length >= 2) queryParams.search = params.search.trim();
        if (params.category && params.category !== 'all') queryParams.category = params.category;

        return {
          url: '/',
          method: 'GET',
          params: queryParams,
        };
      },
      transformResponse: (response: GetContractsResponse) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      providesTags: ['Contract'],
    }),

    // Get a specific contract by ID
    getContractById: builder.query<GetContractByIdResponse, string>({
      keepUnusedDataFor: 30 * 60, // 30 minutes in seconds
      query: (contractId) => ({
        url: `/${contractId}`,
        method: 'GET',
      }),
      transformResponse: (response: GetContractByIdResponse) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      providesTags: (_result, _error, contractId) => [{ type: 'Contract', id: contractId }],
    }),

    // Update a specific contract by ID
    updateContract: builder.mutation<UpdateContractResponse, { contractId: string; updates: UpdateContractRequest }>({
      query: ({ contractId, updates }) => ({
        url: `/${contractId}`,
        method: 'PUT',
        body: updates,
      }),
      transformResponse: (response: UpdateContractResponse) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      invalidatesTags: (_result, _error, { contractId }) => [{ type: 'Contract', id: contractId }, { type: 'Contract' }],
    }),

    // Delete a specific contract by ID
    deleteContract: builder.mutation<DeleteContractResponse, string>({
      query: (contractId) => ({
        url: `/${contractId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: DeleteContractResponse) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      invalidatesTags: (_result, _error, contractId) => [{ type: 'Contract', id: contractId }, { type: 'Contract' }],
    }),

    // Generate download URLs for contract documents
    generateDownloadUrls: builder.mutation<ContractDownloadResponse, string>({
      query: (contractId) => ({
        url: `/${contractId}/download`,
        method: 'POST',
      }),
      transformResponse: (response: ContractDownloadResponse) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
    }),

    // Download specific contract document by type
    downloadDocumentByType: builder.query<SingleDocumentDownloadResponse, { contractId: string; documentType: DocumentType }>({
      query: ({ contractId, documentType }) => ({
        url: `/${contractId}/documents/${documentType}/download`,
        method: 'GET',
      }),
      transformResponse: (response: SingleDocumentDownloadResponse) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
    }),

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

    // Generate admin upload URLs (simplified schema)
    generateAdminUploadUrls: builder.mutation<AdminUploadUrlResponse, AdminUploadUrlRequest>({
      query: (uploadRequest) => ({
        url: '/admin/upload-url',
        method: 'POST',
        body: uploadRequest,
      }),
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
    }),

    // Initialize admin contract
    initAdminContract: builder.mutation<ContractInitResponse, AdminContractInitRequest>({
      query: (initRequest) => ({
        url: '/admin/init',
        method: 'POST',
        body: initRequest,
      }),
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
    }),

    // Get admin template contracts
    getAdminTemplateContracts: builder.query<GetContractsResponse, GetContractsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.insurerId) searchParams.append('insurerId', params.insurerId);
        if (params.category) searchParams.append('category', params.category);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        const queryString = searchParams.toString();
        return {
          url: queryString ? `/admin/templates?${queryString}` : '/admin/templates',
          method: 'GET',
        };
      },
      transformResponse: (response: GetContractsResponse) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      providesTags: ['Contract'],
    }),

    // Summarize admin template contract
    summarizeAdminTemplateContract: builder.mutation<{ message: string; taskId: string }, string>({
      query: (contractId) => ({
        url: `/admin/templates/${contractId}/summarize`,
        method: 'POST',
      }),
      transformResponse: (response: { status: string; data: { message: string; taskId: string } }) => ({
        message: response.data.message,
        taskId: response.data.taskId,
      }),
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      // Optimistically update the contract status to 'ongoing'
      async onQueryStarted(contractId, { dispatch, queryFulfilled }) {
        const patchResults: Array<{ undo: () => void }> = [];

        // Update the admin template contracts cache
        const adminTemplatesPatch = dispatch(
          contractsApi.util.updateQueryData('getAdminTemplateContracts', {}, (draft) => {
            const contract = draft.data?.find((c) => c.id === contractId);
            if (contract) {
              contract.summarizeStatus = 'ongoing';
            }
          })
        );
        patchResults.push(adminTemplatesPatch);

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic updates on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),

    // Delete admin template contract
    deleteAdminTemplateContract: builder.mutation<{ message: string }, string>({
      query: (contractId) => ({
        url: `/admin/templates/${contractId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { status: string; data: { message: string } }) => ({
        message: response.data.message,
      }),
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      // Optimistically remove the contract from the cache
      async onQueryStarted(contractId, { dispatch, queryFulfilled }) {
        const patchResults: Array<{ undo: () => void }> = [];

        // Remove from admin template contracts cache
        const adminTemplatesPatch = dispatch(
          contractsApi.util.updateQueryData('getAdminTemplateContracts', {}, (draft) => {
            if (draft.data) {
              draft.data = draft.data.filter((c) => c.id !== contractId);
              // Update pagination
              if (draft.pagination) {
                draft.pagination.total = Math.max(0, draft.pagination.total - 1);
              }
            }
          })
        );
        patchResults.push(adminTemplatesPatch);

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic updates on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
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
          contractId: response.contractId, // Include contractId for legacy compatibility
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

    // Get dashboard statistics
    getDashboardStats: builder.query<DashboardStats, void>({
      keepUnusedDataFor: 15 * 60, // 15 minutes in seconds
      query: () => ({
        url: '/dashboard-stats',
        method: 'GET',
      }),
      transformResponse: (response: DashboardStats) => response,
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
    }),

    // Summarize contract
    summarizeContract: builder.mutation<{ message: string }, string>({
      query: (contractId) => ({
        url: `/${contractId}/summarize`,
        method: 'POST',
      }),
      transformErrorResponse: (response: { status: number; data: ApiErrorResponse }) => ({
        status: response.status,
        message: response.data.error.message,
        code: response.data.error.code,
      }),
      // Optimistically update the contract status to 'ongoing'
      async onQueryStarted(contractId, { dispatch, queryFulfilled, getState }) {
        const patchResults: Array<{ undo: () => void }> = [];

        // Update the single contract cache
        const singleContractPatch = dispatch(
          contractsApi.util.updateQueryData('getContractById', contractId, (draft) => {
            draft.summarizeStatus = 'ongoing';
          })
        );
        patchResults.push(singleContractPatch);

        // Update all contract list caches
        const state = getState() as { contractsApi: { queries: Record<string, unknown> } };
        const queries = state.contractsApi.queries;

        Object.keys(queries).forEach((key) => {
          if (key.startsWith('getContracts(')) {
            const listPatch = dispatch(
              contractsApi.util.updateQueryData('getContracts', JSON.parse(key.slice('getContracts('.length, -1)), (draft) => {
                const contract = draft.data.find((c) => c.id === contractId);
                if (contract) {
                  contract.summarizeStatus = 'ongoing';
                }
              })
            );
            patchResults.push(listPatch);
          }
        });

        try {
          await queryFulfilled;
        } catch {
          // Revert all optimistic updates on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),
  }),
});

export const {
  useGetContractsQuery,
  useGetContractByIdQuery,
  useUpdateContractMutation,
  useDeleteContractMutation,
  useGenerateDownloadUrlsMutation,
  useGenerateBatchUploadUrlsMutation,
  useGenerateAdminUploadUrlsMutation,
  useInitAdminContractMutation,
  useGetAdminTemplateContractsQuery,
  useSummarizeAdminTemplateContractMutation,
  useDeleteAdminTemplateContractMutation,
  useGenerateUploadUrlMutation,
  useUploadToAzureMutation,
  useInitContractMutation,
  useNotifyMutation,
  useGetDashboardStatsQuery,
  useSummarizeContractMutation,
  useLazyDownloadDocumentByTypeQuery,
} = contractsApi;

// Combined hook for the complete upload process
export const useContractUpload = () => {
  const [generateBatchUploadUrls] = useGenerateBatchUploadUrlsMutation();
  const [uploadToAzure] = useUploadToAzureMutation();
  const [initContract] = useInitContractMutation();

  const uploadDocuments = async (files: Array<{ file: File; type: DocumentType }>, contractData: Omit<UpdatedContractInitRequest, 'documents' | 'contractId'>) => {
    try {
      // Step 1: Generate batch signed upload URLs and get contractId
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

      // Step 3: Initialize contract processing with contractId and all documents
      const contractResponse = await initContract({
        ...contractData,
        contractId: uploadUrlsResponse.contractId,
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
