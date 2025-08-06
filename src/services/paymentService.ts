import { coreApi } from './api';

export interface CheckoutRequest {
	creditPackId: string;
}

export interface CheckoutResponse {
	status: string;
	message: string;
	url: string;
	sessionId: string;
}

export interface PaymentStatusResponse {
	status: string;
	message: string;
	paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
	creditsAdded?: number;
}

export interface ServiceResponse<T = unknown> {
	success: boolean;
	data?: T | null;
	error?: string;
}

class PaymentService {
	async createCheckout(creditPackId: string): Promise<ServiceResponse<{ url: string; sessionId: string }>> {
		try {
			const response = await coreApi.post<CheckoutResponse>('/payments/checkout', {
				creditPackId,
			});

			if (response.success && response.data) {
				return {
					success: true,
					data: {
						url: response.data.url,
						sessionId: response.data.sessionId,
					},
				};
			} else {
				return {
					success: false,
					error: response.error?.message || 'Failed to create checkout session',
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	async getPaymentStatus(sessionId: string): Promise<ServiceResponse<PaymentStatusResponse>> {
		try {
			const response = await coreApi.get<PaymentStatusResponse>(`/payments/status/${sessionId}`);

			if (response.success && response.data) {
				return {
					success: true,
					data: response.data,
				};
			} else {
				return {
					success: false,
					error: response.error?.message || 'Failed to get payment status',
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}
}

export const paymentService = new PaymentService();
export default paymentService; 