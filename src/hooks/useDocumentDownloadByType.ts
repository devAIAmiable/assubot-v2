import { useCallback, useMemo } from 'react';

import type { DocumentType } from '../types';
import { useDownloadInternalDocumentMutation } from '../store/internalDocumentApi';
import { useLazyDownloadDocumentByTypeQuery } from '../store/contractsApi';

interface DocumentDownloadResult {
  url: string;
  expiresAt: string;
  type: DocumentType;
}

interface UseDocumentDownloadByTypeReturn {
  downloadDocumentByType: (contractId: string, documentType: DocumentType) => Promise<DocumentDownloadResult>;
  downloadInternalDocument: (url: string, documentType: string) => Promise<DocumentDownloadResult>;
  isDownloading: boolean;
  error: unknown;
}

export const useDocumentDownloadByType = (): UseDocumentDownloadByTypeReturn => {
  const [downloadDocumentByTypeQuery, { isLoading: isDownloadingContractDocs, error: contractDocsError }] = useLazyDownloadDocumentByTypeQuery();
  const [downloadInternalDocumentMutation, { isLoading: isDownloadingInternalDocs, error: internalDocsError }] = useDownloadInternalDocumentMutation();

  const isDownloading = isDownloadingContractDocs || isDownloadingInternalDocs;
  const error = contractDocsError || internalDocsError;

  const cache = useMemo(() => new Map<string, { data: DocumentDownloadResult; expiresAt: number }>(), []);

  const downloadDocumentByType = useCallback(
    async (contractId: string, documentType: DocumentType): Promise<DocumentDownloadResult> => {
      const now = Date.now();
      const cacheKey = `download_${contractId}_${documentType}`;
      const cached = cache.get(cacheKey);

      if (cached && cached.expiresAt > now) {
        return cached.data;
      }

      try {
        const response = await downloadDocumentByTypeQuery({ contractId, documentType }).unwrap();

        // Extract the document data from the response
        const documentData = {
          url: response.url,
          expiresAt: response.expiresAt,
          type: response.type,
        };

        // Cache for 4 minutes (URL expires in 5 minutes, so cache for 4 to be safe)
        const expiresAt = now + 4 * 60 * 1000;
        cache.set(cacheKey, { data: documentData, expiresAt });

        return documentData;
      } catch (error) {
        console.error('Failed to download document by type:', error);
        throw error;
      }
    },
    [downloadDocumentByTypeQuery, cache]
  );

  const downloadInternalDocument = useCallback(
    async (url: string, documentType: string): Promise<DocumentDownloadResult> => {
      const now = Date.now();
      const cacheKey = `internal_download_${url}_${documentType}`;
      const cached = cache.get(cacheKey);

      if (cached && cached.expiresAt > now) {
        return cached.data;
      }

      try {
        const response = await downloadInternalDocumentMutation({ url, documentType }).unwrap();

        // Extract the document data from the response
        const documentData = {
          url: response.url,
          expiresAt: response.expiresAt,
          type: response.type as DocumentType,
        };

        // Cache for 4 minutes (URL expires in 5 minutes, so cache for 4 to be safe)
        const expiresAt = now + 4 * 60 * 1000;
        cache.set(cacheKey, { data: documentData, expiresAt });

        return documentData;
      } catch (error) {
        console.error('Failed to download internal document:', error);
        throw error;
      }
    },
    [downloadInternalDocumentMutation, cache]
  );

  return {
    downloadDocumentByType,
    downloadInternalDocument,
    isDownloading,
    error,
  };
};
