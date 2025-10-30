import { z } from 'zod';

// Schéma pour un utilisateur à créer en lot
export const batchUserInputSchema = z.object({
  email: z.string().trim().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().trim().min(1, 'Le prénom est requis'),
  lastName: z.string().trim().min(1, 'Le nom est requis'),
  gender: z.string().trim().optional().nullable(),
  birthDate: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  profession: z.string().trim().optional().nullable(),
  avatar: z.string().url('URL avatar invalide').optional().nullable(),
  address: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  zip: z.string().trim().optional().nullable(),
  country: z.string().trim().optional().nullable(),
});

export const batchUsersPayloadSchema = z.object({
  users: z.array(batchUserInputSchema).min(1, 'Ajoutez au moins un utilisateur'),
  initialCredits: z.number().int('Crédits invalides').min(0, 'Les crédits doivent être positifs').default(0),
});

// Réponse d'une ligne de résultat pour un utilisateur
export const batchUserResultSchema = z.object({
  success: z.boolean(),
  email: z.string().email(),
  userId: z.string().optional(),
  error: z.string().nullable().optional(),
});

// Résumé global de la création en lot
export const batchUsersSummarySchema = z.object({
  total: z.number().int().nonnegative(),
  successCount: z.number().int().nonnegative(),
  failureCount: z.number().int().nonnegative(),
  initialCredits: z.number().int().nonnegative(),
});

// Schéma de la ressource retournée par l'API
export const batchUsersResourceSchema = z.object({
  results: z.array(batchUserResultSchema),
  summary: batchUsersSummarySchema,
});

// Schéma de la réponse API standardisée
export const batchUsersResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.object({
      message: z.string(),
      resource: batchUsersResourceSchema.optional(),
    }),
  })
  .or(
    z.object({
      success: z.literal(false),
      error: z.string(),
    })
  );

export type BatchUserInput = z.infer<typeof batchUserInputSchema>;
export type BatchUsersPayload = z.infer<typeof batchUsersPayloadSchema>;
export type BatchUserResult = z.infer<typeof batchUserResultSchema>;
export type BatchUsersSummary = z.infer<typeof batchUsersSummarySchema>;
export type BatchUsersResource = z.infer<typeof batchUsersResourceSchema>;
export type BatchUsersResponse = { success: true; data: { message: string; resource?: BatchUsersResource } } | { success: false; error: string };
