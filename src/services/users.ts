import type { ServiceResponse } from './api';
import { coreApi } from './api';
import { batchUsersPayloadSchema, batchUsersResponseSchema, type BatchUsersPayload, type BatchUsersResponse, type BatchUsersResource } from '../schemas/users';

export const usersService = {
  batchCreate: async (
    payload: BatchUsersPayload
  ): Promise<
    ServiceResponse<{
      message: string;
      resource?: BatchUsersResource;
    }>
  > => {
    // Valide côté client avant envoi
    const parsed = batchUsersPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Payload invalide',
      };
    }

    try {
      const response = await coreApi.post<{
        status: string;
        message: string;
        results?: BatchUsersResource['results'];
        summary?: BatchUsersResource['summary'];
      }>('/users/batch', payload);

      // Normalise en BatchUsersResponse minimal puis revalide
      const normalized: BatchUsersResponse =
        response.success && response.status === 'success'
          ? {
              success: true,
              data: {
                message: response.data?.message ?? 'Création en lot terminée',
                resource:
                  response.data?.results && response.data?.summary
                    ? {
                        results: response.data.results,
                        summary: response.data.summary,
                      }
                    : undefined,
              },
            }
          : {
              success: false,
              error: response.error?.message || 'Échec de la création en lot',
            };

      const validated = batchUsersResponseSchema.safeParse(normalized);
      if (!validated.success) {
        return {
          success: false,
          error: 'Réponse du serveur invalide',
        };
      }

      if (validated.data.success) {
        return {
          success: true,
          data: {
            message: validated.data.data.message,
            resource: validated.data.data.resource,
          },
        };
      }

      return {
        success: false,
        error: validated.data.error,
      };
    } catch (error) {
      console.error('Batch create users error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  },
};

export type { BatchUsersPayload, BatchUsersResource };
