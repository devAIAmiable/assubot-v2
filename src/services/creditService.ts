import { coreApi } from './api';

export interface CreditPack {
	id: string;
	name: string;
	description: string;
	creditAmount: number;
	priceCents: number;
	currency: string;
	isActive: boolean;
	isFeatured: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreditPacksResponse {
	status: string;
	message: string;
	creditPacks: CreditPack[];
}

export interface ServiceResponse<T = unknown> {
	success: boolean;
	data?: T | null;
	error?: string;
}

class CreditService {
	async getCreditPacks(): Promise<ServiceResponse<CreditPack[]>> {
		try {
			const response = await coreApi.get<CreditPacksResponse>('/credit-packs');

			if (response.success && response.data) {
				return {
					success: true,
					data: response.data.creditPacks,
				};
			} else {
				return {
					success: false,
					error: response.error?.message || 'Failed to fetch credit packs',
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	// Helper method to format price from cents to euros
	formatPrice(priceCents: number): string {
		return (priceCents / 100).toFixed(2);
	}

	// Helper method to get featured packs
	getFeaturedPacks(packs: CreditPack[]): CreditPack[] {
		return packs.filter(pack => pack.isFeatured && pack.isActive);
	}

	// Helper method to get all active packs
	getActivePacks(packs: CreditPack[]): CreditPack[] {
		return packs.filter(pack => pack.isActive);
	}
}

export const creditService = new CreditService();
export default creditService; 