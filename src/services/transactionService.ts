import { coreApi } from './api';

export interface Transaction {
	id: string;
	type: 'purchase' | 'usage';
	action: string;
	credits: number;
	date: string;
	createdAt: string;
	description?: string;
}

export interface TransactionFilters {
	type?: 'purchase' | 'usage' | 'all';
	dateFrom?: string;
	dateTo?: string;
}

export interface TransactionResponse {
	status: string;
	message: string;
	transactions: Transaction[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface ServiceResponse<T = unknown> {
	success: boolean;
	data?: T | null;
	error?: string;
}

class TransactionService {
	async getTransactions(
		page: number = 1,
		limit: number = 10,
		filters?: TransactionFilters
	): Promise<ServiceResponse<TransactionResponse>> {
		try {
			const params = new URLSearchParams();
			params.append('page', page.toString());
			params.append('limit', limit.toString());
			
			if (filters?.type && filters.type !== 'all') {
				params.append('type', filters.type);
			}
			if (filters?.dateFrom) {
				params.append('dateFrom', filters.dateFrom);
			}
			if (filters?.dateTo) {
				params.append('dateTo', filters.dateTo);
			}

			const response = await coreApi.get<TransactionResponse>(`/transactions?${params.toString()}`);

			if (response.success && response.data) {
				return {
					success: true,
					data: response.data,
				};
			} else {
				return {
					success: false,
					error: response.error?.message || 'Failed to fetch transactions',
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	async getRecentTransactions(limit: number = 5): Promise<ServiceResponse<Transaction[]>> {
		try {
			const response = await this.getTransactions(1, limit);
			
			if (response.success && response.data) {
				return {
					success: true,
					data: response.data.transactions,
				};
			} else {
				return {
					success: false,
					error: response.error,
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	// Helper method to format transaction date
	formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) {
			return 'Il y a 1 jour';
		} else if (diffDays < 7) {
			return `Il y a ${diffDays} jours`;
		} else if (diffDays < 30) {
			const weeks = Math.floor(diffDays / 7);
			return weeks === 1 ? 'Il y a 1 semaine' : `Il y a ${weeks} semaines`;
		} else if (diffDays < 365) {
			const months = Math.floor(diffDays / 30);
			return months === 1 ? 'Il y a 1 mois' : `Il y a ${months} mois`;
		} else {
			const years = Math.floor(diffDays / 365);
			return years === 1 ? 'Il y a 1 an' : `Il y a ${years} ans`;
		}
	}
}

export const transactionService = new TransactionService();
export default transactionService; 