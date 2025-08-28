import { aiApi } from './api';

// Chat endpoints
export const chatService = {
	sendMessage: (message: { content: string; context?: unknown }) =>
		aiApi.post<{ response: string; context?: unknown }>('/chat/message', message),
	getHistory: () => aiApi.get<unknown[]>('/chat/history'),
	clearHistory: () => aiApi.delete('/chat/history'),
	getSuggestions: (context: unknown) =>
		aiApi.post<{ suggestions: string[] }>('/chat/suggestions', { context }),
};

// Analysis endpoints
export const analysisService = {
	analyzeContract: (contractData: unknown) =>
		aiApi.post<{ analysis: unknown; recommendations: unknown[] }>(
			'/analysis/contract',
			contractData
		),
	compareContracts: (contracts: unknown[]) =>
		aiApi.post<{ comparison: unknown; insights: unknown[] }>('/analysis/compare', { contracts }),
	generateReport: (data: unknown) =>
		aiApi.post<{ report: unknown; url?: string }>('/analysis/report', data),
	getRiskAssessment: (userData: unknown) =>
		aiApi.post<{ riskScore: number; factors: unknown[] }>('/analysis/risk', userData),
};

// Recommendation endpoints
export const recommendationService = {
	getPersonalizedOffers: (userProfile: unknown) =>
		aiApi.post<{ offers: unknown[]; reasoning: string }>('/recommendations/offers', userProfile),
	getCoverageGaps: (contracts: unknown[]) =>
		aiApi.post<{ gaps: unknown[]; suggestions: unknown[] }>('/recommendations/gaps', { contracts }),
	getOptimizationSuggestions: (currentSetup: unknown) =>
		aiApi.post<{ suggestions: unknown[]; potentialSavings: number }>(
			'/recommendations/optimize',
			currentSetup
		),
};

// AI Model endpoints
export const aiModelService = {
	getModelInfo: () =>
		aiApi.get<{ model: string; version: string; capabilities: string[] }>('/model/info'),
	updateModel: (modelConfig: unknown) => aiApi.put<unknown>('/model/config', modelConfig),
	getModelStatus: () => aiApi.get<{ status: string; performance: unknown }>('/model/status'),
};
