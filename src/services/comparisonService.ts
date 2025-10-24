import type {
  AutoFormData,
  ComparisonCalculationRequest,
  ComparisonCalculationResponse,
  ComparisonCategory,
  ComparisonOfferDetails,
  ComparisonSearchParams,
  HomeFormData,
} from '../types/comparison';

import { comparisonApi } from '../store/comparisonApi';
import { store } from '../store';

// Form data type unions for type safety
export type ComparisonFormData = AutoFormData | HomeFormData;

// Helper function to convert form data to typed format
export function convertFormDataToTyped(_category: ComparisonCategory, formData: Record<string, unknown>): ComparisonFormData {
  // Cast to unknown first to avoid type assertion issues
  return formData as unknown as ComparisonFormData;
}

export class ComparisonService {
  // Calculate comparison results for a category
  static async calculateComparison(
    requestData: Record<string, unknown>,
    existingContract?: { id: string; insurer: string; premium: number }
  ): Promise<ComparisonCalculationResponse> {
    // Add user contract info if provided
    const finalRequestData = existingContract
      ? {
          ...requestData,
          includeUserContract: true,
          userContractId: existingContract.id,
        }
      : requestData;

    const result = await store.dispatch(comparisonApi.endpoints.calculateComparison.initiate(finalRequestData as unknown as ComparisonCalculationRequest));
    if (result.data) {
      return result.data;
    }
    throw new Error('No comparison result returned');
  }

  // Get offers for a category
  static async getOffers(category: ComparisonCategory, limit?: number, offset?: number): Promise<ComparisonOfferDetails[]> {
    const result = await store.dispatch(comparisonApi.endpoints.getComparisonOffers.initiate({ category, limit, offset }));
    if (result.data) {
      return result.data;
    }
    throw new Error('No offers returned');
  }

  // Get detailed offer information
  static async getOfferDetails(id: string): Promise<ComparisonOfferDetails> {
    const result = await store.dispatch(comparisonApi.endpoints.getComparisonOffer.initiate(id));
    if (result.data) {
      return result.data;
    }
    throw new Error('Offer not found');
  }

  // Search offers with filters
  static async searchOffers(params: ComparisonSearchParams): Promise<ComparisonOfferDetails[]> {
    const result = await store.dispatch(comparisonApi.endpoints.searchComparisonOffers.initiate(params));
    if (result.data) {
      return result.data;
    }
    throw new Error('Search failed');
  }

  // Get popular offers
  static async getPopularOffers(category?: ComparisonCategory, limit?: number): Promise<ComparisonOfferDetails[]> {
    const result = await store.dispatch(comparisonApi.endpoints.getPopularOffers.initiate({ category, limit }));
    if (result.data) {
      return result.data;
    }
    throw new Error('No popular offers returned');
  }

  // Get cheapest offers
  static async getCheapestOffers(category: ComparisonCategory, limit?: number): Promise<ComparisonOfferDetails[]> {
    const result = await store.dispatch(comparisonApi.endpoints.getCheapestOffers.initiate({ category, limit }));
    if (result.data) {
      return result.data;
    }
    throw new Error('No cheapest offers returned');
  }
}
