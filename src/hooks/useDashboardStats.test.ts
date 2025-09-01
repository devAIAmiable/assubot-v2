import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHook } from '@testing-library/react';
import { useDashboardStats } from './useDashboardStats';
// Import the mocked module
import { useGetDashboardStatsQuery } from '../store/contractsApi';

// Mock the contractsApi
vi.mock('../store/contractsApi', () => ({
	contractsApi: {
		endpoints: {
			getDashboardStats: {
				useQuery: vi.fn(),
			},
		},
	},
	useGetDashboardStatsQuery: vi.fn(),
}));


const mockUseGetDashboardStatsQuery = vi.mocked(useGetDashboardStatsQuery);

describe('useDashboardStats', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should fetch dashboard stats on mount', () => {
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

		mockUseGetDashboardStatsQuery.mockReturnValue({
			data: mockStats,
			isLoading: false,
			error: null,
			refetch: vi.fn(),
		});

		const { result } = renderHook(() => useDashboardStats());

		expect(result.current.dashboardStats).toEqual(mockStats);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe(null);
		expect(mockUseGetDashboardStatsQuery).toHaveBeenCalledTimes(1);
	});

	it('should handle loading state', () => {
		mockUseGetDashboardStatsQuery.mockReturnValue({
			data: undefined,
			isLoading: true,
			error: null,
			refetch: vi.fn(),
		});

		const { result } = renderHook(() => useDashboardStats());

		expect(result.current.dashboardStats).toBe(null);
		expect(result.current.isLoading).toBe(true);
		expect(result.current.error).toBe(null);
	});

	it('should handle API errors', () => {
		mockUseGetDashboardStatsQuery.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: { message: 'API Error' },
			refetch: vi.fn(),
		});

		const { result } = renderHook(() => useDashboardStats());

		expect(result.current.dashboardStats).toBe(null);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe('API Error');
	});

	it('should handle network errors', () => {
		mockUseGetDashboardStatsQuery.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: { message: 'Network Error' },
			refetch: vi.fn(),
		});

		const { result } = renderHook(() => useDashboardStats());

		expect(result.current.dashboardStats).toBe(null);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe('Network Error');
	});

	it('should provide refetch function', () => {
		const mockRefetch = vi.fn();
		mockUseGetDashboardStatsQuery.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: null,
			refetch: mockRefetch,
		});

		const { result } = renderHook(() => useDashboardStats());

		expect(typeof result.current.refetch).toBe('function');
		result.current.refetch();
		expect(mockRefetch).toHaveBeenCalledTimes(1);
	});
});
