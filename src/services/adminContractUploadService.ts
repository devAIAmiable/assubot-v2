import { contractsApi } from '../store/contractsApi';
import { store } from '../store';

export interface AdminContractUploadData {
  insurerId: string;
  version: string;
  category: 'auto' | 'health' | 'home' | 'moto' | 'electronic_devices' | 'other';
  cgFile: File;
}

export interface AdminUploadResult {
  success: boolean;
  contractId?: string;
  taskId?: string;
  error?: string;
}

export class AdminContractUploadService {
  private static instance: AdminContractUploadService;

  public static getInstance(): AdminContractUploadService {
    if (!AdminContractUploadService.instance) {
      AdminContractUploadService.instance = new AdminContractUploadService();
    }
    return AdminContractUploadService.instance;
  }

  async uploadAdminContract(
    formData: AdminContractUploadData
  ): Promise<AdminUploadResult> {
    try {
      // Step 1: Generate admin upload URLs
      const uploadUrlsResponse = await store
        .dispatch(
          contractsApi.endpoints.generateAdminUploadUrls.initiate({
            insurerId: formData.insurerId,
            version: formData.version,
            category: formData.category,
            files: [
              {
                fileName: formData.cgFile.name,
                contentType: formData.cgFile.type,
                documentType: 'CG' as const,
              },
            ],
          })
        )
        .unwrap();

      // Step 2: Upload file to Azure
      const uploadUrl = uploadUrlsResponse.uploadUrls[0];
      await this.uploadToAzureWithProgress(
        uploadUrl.uploadUrl,
        formData.cgFile
      );

      // Step 3: Initialize contract processing
      const contractInitData = {
        contractId: uploadUrlsResponse.contractId,
        name: `${formData.category} - ${formData.version}`,
        insurerId: formData.insurerId,
        version: formData.version,
        category: formData.category,
        documents: [
          {
            blobPath: uploadUrl.blobName,
            documentType: 'CG' as const,
          },
        ],
      };

      const contractResult = await store
        .dispatch(contractsApi.endpoints.initAdminContract.initiate(contractInitData))
        .unwrap();

      return {
        success: true,
        contractId: contractResult.contractId,
        taskId: contractResult.taskId,
      };
    } catch (error) {
      console.error('Admin contract upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private async uploadToAzureWithProgress(
    uploadUrl: string,
    file: File
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
      xhr.send(file);
    });
  }
}

export const adminContractUploadService = AdminContractUploadService.getInstance();
