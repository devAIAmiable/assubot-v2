import type { ServiceResponse } from './api';
import { coreApi } from './api';
import {
  comparisonCalculationRequestSchema,
  comparisonCalculationResponseSchema,
  type ComparisonCalculationRequestDto,
  type ComparisonCalculationResponseDto,
} from '../schemas/comparison';

const sessionResultSchema = comparisonCalculationResponseSchema;

export const comparisonService = {
  createComparisonSession: async (payload: ComparisonCalculationRequestDto): Promise<ServiceResponse<{ sessionId: string; result?: ComparisonCalculationResponseDto }>> => {
    const parsed = comparisonCalculationRequestSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Payload invalide' };
    }

    try {
      const response = await coreApi.post('/comparison/sessions', payload);

      if (!response.success) {
        return { success: false, error: response.error?.message || 'Création de session échouée' };
      }

      // Support both wrapped and direct formats
      const rawWrapped = response.data as unknown as { data?: unknown; sessionId?: string } | undefined;
      const raw = rawWrapped ?? {};
      const rawData = (raw.data as { resource?: { sessionId?: string; result?: unknown }; sessionId?: string } | undefined) ?? undefined;
      const sessionId: string | undefined = rawData?.resource?.sessionId || raw.sessionId || rawData?.sessionId;

      // If backend also returns results inline, validate and pass them through
      const maybeResult = rawData?.resource?.result || (raw as Record<string, unknown>).result;
      let result: ComparisonCalculationResponseDto | undefined;
      if (maybeResult) {
        const validated = sessionResultSchema.safeParse(maybeResult);
        if (validated.success) {
          result = validated.data;
        }
      }

      if (!sessionId) {
        return { success: false, error: 'Réponse du serveur invalide: sessionId manquant' };
      }

      return { success: true, data: { sessionId, result } };
    } catch (error) {
      console.error('createComparisonSession error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  },

  getSessionResults: async (sessionId: string): Promise<ServiceResponse<ComparisonCalculationResponseDto>> => {
    if (!sessionId) {
      return { success: false, error: 'sessionId requis' };
    }
    try {
      const response = await coreApi.get(`/comparison/sessions/${sessionId}`);
      if (!response.success) {
        return { success: false, error: response.error?.message || 'Récupération des résultats échouée' };
      }

      const rawWrapped = response.data as unknown as { data?: unknown; status?: string; message?: string } | undefined;
      const rawObj = rawWrapped ?? {};
      const dataObj = (rawObj.data as { resource?: unknown } | undefined) ?? undefined;
      const payloadUnknown = dataObj?.resource ?? rawObj.data ?? rawObj; // accept wrapped or direct
      const payloadRec = (payloadUnknown ?? {}) as Record<string, unknown>;

      // First attempt: strict schema
      const validated = sessionResultSchema.safeParse(payloadRec);
      if (validated.success) {
        return { success: true, data: validated.data };
      }

      // Fallback A: accept minimal shape and normalize (already computed offers/scores)
      const offers = payloadRec.offers as unknown;
      const scores = payloadRec.scores as unknown;
      const totalOffers = payloadRec.totalOffers as unknown;
      const filteredCount = payloadRec.filteredCount as unknown;

      if (Array.isArray(offers) && scores && typeof scores === 'object') {
        const normalized: ComparisonCalculationResponseDto = {
          status: rawObj.status || 'success',
          message: rawObj.message || 'OK',
          sessionId,
          offers: offers as ComparisonCalculationResponseDto['offers'],
          scores: scores as ComparisonCalculationResponseDto['scores'],
          totalOffers: typeof totalOffers === 'number' ? (totalOffers as number) : offers.length,
          filteredCount: typeof filteredCount === 'number' ? (filteredCount as number) : offers.length,
        };
        return { success: true, data: normalized };
      }

      // Fallback B: backend returns a Session object with resultOfferIds/resultScores
      const resultOfferIds = payloadRec.resultOfferIds as unknown;
      const resultScores = payloadRec.resultScores as unknown;
      if (Array.isArray(resultOfferIds) && resultScores && typeof resultScores === 'object') {
        // Try to fetch full offers for this session
        try {
          const offersResp = await coreApi.get(`/comparison/sessions/${sessionId}/offers`);
          if (offersResp.success) {
            const offersWrapped = offersResp.data as unknown as { data?: unknown } | undefined;
            const offersPayload = ((offersWrapped?.data as unknown) ?? offersWrapped) as unknown;
            // Validate array of offers with schema
            const parsedOffers = Array.isArray(offersPayload)
              ? offersPayload
              : Array.isArray((offersPayload as { resource?: unknown }).resource)
                ? (offersPayload as { resource: unknown[] }).resource
                : [];

            const offersValidation = comparisonCalculationResponseSchema.shape.offers.safeParse(parsedOffers);
            if (offersValidation.success) {
              const offersArray = offersValidation.data;
              const normalized: ComparisonCalculationResponseDto = {
                status: (payloadRec.status as string) || rawObj.status || 'success',
                message: (payloadRec.message as string) || rawObj.message || 'OK',
                sessionId,
                offers: offersArray,
                scores: resultScores as ComparisonCalculationResponseDto['scores'],
                totalOffers: offersArray.length,
                filteredCount: offersArray.length,
              };
              return { success: true, data: normalized };
            }
          }
          // If offers API fails or invalid, still return response with empty offers but valid scores
          const fallbackNormalized: ComparisonCalculationResponseDto = {
            status: (payloadRec.status as string) || rawObj.status || 'success',
            message: (payloadRec.message as string) || rawObj.message || 'OK',
            sessionId,
            offers: [],
            scores: resultScores as ComparisonCalculationResponseDto['scores'],
            totalOffers: Array.isArray(resultOfferIds) ? resultOfferIds.length : 0,
            filteredCount: Array.isArray(resultOfferIds) ? resultOfferIds.length : 0,
          };
          return { success: true, data: fallbackNormalized };
        } catch {
          const fallbackNormalized: ComparisonCalculationResponseDto = {
            status: (payloadRec.status as string) || rawObj.status || 'success',
            message: (payloadRec.message as string) || rawObj.message || 'OK',
            sessionId,
            offers: [],
            scores: resultScores as ComparisonCalculationResponseDto['scores'],
            totalOffers: Array.isArray(resultOfferIds) ? resultOfferIds.length : 0,
            filteredCount: Array.isArray(resultOfferIds) ? resultOfferIds.length : 0,
          };
          return { success: true, data: fallbackNormalized };
        }
      }

      return { success: false, error: 'Réponse du serveur invalide' };
    } catch (error) {
      console.error('getSessionResults error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  },

  askSessionQuestion: async (
    sessionId: string,
    question: string
  ): Promise<ServiceResponse<{ id: string; question: string; createdAt: string; explanation: string; offerMatches: Record<string, boolean> }>> => {
    if (!sessionId || !question.trim()) {
      return { success: false, error: 'sessionId et question requis' };
    }
    try {
      const response = await coreApi.post<{
        status: string;
        message?: string;
        data?: {
          id: string;
          sessionId: string;
          question: string;
          status: string;
          creditsUsed?: number;
          createdAt?: string;
          processedAt?: string;
          creditReservationId?: string;
          result?: {
            explanation: string;
            offerMatches: Record<string, boolean>;
          };
        };
      }>(`/comparison/sessions/${sessionId}/query`, { question });

      if (!response.success) {
        return { success: false, error: response.error?.message || 'Échec du traitement de la question' };
      }

      const data = response.data as unknown as {
        data?: { id?: string; question?: string; createdAt?: string; result?: { explanation: string; offerMatches: Record<string, boolean> } };
      };
      const result = data?.data?.result;
      if (!result) {
        return { success: false, error: 'Réponse du serveur invalide' };
      }

      return {
        success: true,
        data: {
          id: data?.data?.id || `${Date.now()}`,
          question: data?.data?.question || question,
          createdAt: data?.data?.createdAt || new Date().toISOString(),
          explanation: result.explanation,
          offerMatches: result.offerMatches,
        },
      };
    } catch (error) {
      console.error('askSessionQuestion error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  },
};

export type { ComparisonCalculationRequestDto, ComparisonCalculationResponseDto };
