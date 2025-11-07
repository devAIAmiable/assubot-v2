import { z } from 'zod';

export const comparisonCategorySchema = z.enum(['auto', 'home', 'moto', 'health']);

export const comparisonCalculationRequestSchema = z.object({
  category: comparisonCategorySchema,
  formData: z.record(z.string(), z.unknown()),
  userContractId: z.string().optional(),
  includeUserContract: z.boolean(),
});

export const comparisonOfferSchema = z.object({
  id: z.string(),
  insurerId: z.string(),
  category: z.string(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  insurer: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    logoUrl: z.string().nullable().optional(),
    rating: z.number(),
  }),
  formulas: z.array(
    z.object({
      id: z.string(),
      offerId: z.string(),
      name: z.string(),
      slug: z.string(),
      annualPremiumCents: z.number(),
      description: z.string().optional().default(''),
      displayOrder: z.number().optional(),
      isRecommended: z.boolean().optional().default(false),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
      guarantees: z.array(
        z.object({
          id: z.string(),
          formulaId: z.string(),
          name: z.string(),
          details: z.string().optional().default(''),
          ceiling: z.number().nullable().optional(),
          deductible: z.number().nullable().optional(),
          createdAt: z.string().optional(),
        })
      ),
    })
  ),
});

export const comparisonCalculationResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  sessionId: z.string(),
  offers: z.array(comparisonOfferSchema),
  scores: z.record(z.string(), z.number()),
  totalOffers: z.number(),
  filteredCount: z.number(),
});

export type ComparisonCalculationRequestDto = z.infer<typeof comparisonCalculationRequestSchema>;
export type ComparisonCalculationResponseDto = z.infer<typeof comparisonCalculationResponseSchema>;
