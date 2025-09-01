import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { contractsService } from '../services/coreApi';
import { useDashboardStats } from './useDashboardStats';

// Mock the contractsService
vi.mock('../services/coreApi', () => ({
	contractsService: {
		getDashboardStats: vi.fn(),
	},
}));

const mockContractsService = vi.mocked(contractsService);

describe('useDashboardStats', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should fetch dashboard stats on mount', async () => {
		const mockStats = {
			status: 'success',
			message: 'Success',
			totalAnnualCostCents: 1450000,
			activeContracts: 12,
			monthlyPremiumCents: 125000,
			expiringSoonContracts: 3,
			categoryBreakdown: {
				auto: {
					count: 4,
					totalAnnualCostCents: 600000,
					percentage: 41,
				},
				health: {
					count: 3,
					totalAnnualCostCents: 450000,
					percentage: 31,
				},
				home: {
					count: 5,
					totalAnnualCostCents: 400000,
					percentage: 28,
				},
			},
		};

		mockContractsService.getDashboardStats.mockResolvedValue({
			success: true,
			data: mockStats,
		});

		const { result } = renderHook(() => useDashboardStats());

		expect(result.current.isLoading).toBe(true);
		expect(result.current.dashboardStats).toBe(null);
		expect(result.current.error).toBe(null);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.dashboardStats).toEqual(mockStats);
		expect(result.current.error).toBe(null);
		expect(mockContractsService.getDashboardStats).toHaveBeenCalledTimes(1);
	});

	it('should handle API errors', async () => {
		mockContractsService.getDashboardStats.mockResolvedValue({
			success: false,
			error: 'API Error',
		});

		const { result } = renderHook(() => useDashboardStats());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.dashboardStats).toBe(null);
		expect(result.current.error).toBe('API Error');
	});

	it('should handle network errors', async () => {
		mockContractsService.getDashboardStats.mockRejectedValue(new Error('Network Error'));

		const { result } = renderHook(() => useDashboardStats());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.dashboardStats).toBe(null);
		expect(result.current.error).toBe('Erreur de connexion au serveur');
	});

	it('should refetch data when refetch is called', async () => {
		const mockStats = {
			status: 'success',
			message: 'Success',
			totalAnnualCostCents: 1000000,
			activeContracts: 8,
			monthlyPremiumCents: 100000,
			expiringSoonContracts: 1,
			categoryBreakdown: {},
		};

		mockContractsService.getDashboardStats.mockResolvedValue({
			success: true,
			data: mockStats,
		});

		const { result } = renderHook(() => useDashboardStats());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.dashboardStats).toEqual(mockStats);

		// Change the mock response for refetch
		const newMockStats = {
			status: 'success',
			message: 'Success',
			totalAnnualCostCents: 1000000,
			activeContracts: 10,
			monthlyPremiumCents: 100000,
			expiringSoonContracts: 1,
			categoryBreakdown: {},
		};

		mockContractsService.getDashboardStats.mockResolvedValue({
			success: true,
			data: newMockStats,
		});

		// Clear the mock call count before refetch
		mockContractsService.getDashboardStats.mockClear();

		await result.current.refetch();

		await waitFor(() => {
			expect(result.current.dashboardStats).toEqual(newMockStats);
		});

		expect(mockContractsService.getDashboardStats).toHaveBeenCalledTimes(1);
	});
});
