import { ContactType, ObligationType, ZoneType } from '../types/contract';

import { z } from 'zod';

// Basic Info Step Schema
export const basicInfoSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  version: z.string().optional(),
});

// Guarantee Detail Schema
export const guaranteeDetailSchema = z.object({
  service: z.string().optional(),
  ceiling: z.string().optional(),
  plafond: z.string().optional(),
  franchise: z.string().optional(),
  deductible: z.string().optional(),
  limitation: z.string().optional(),
  coverages: z
    .array(
      z.object({
        type: z.enum(['covered', 'not_covered']),
        description: z.string(),
      })
    )
    .optional(),
});

// Guarantee Schema
export const guaranteeSchema = z.object({
  title: z.string().optional(),
  deductible: z.string().optional(),
  ceiling: z.string().optional(),
  limitation: z.string().optional(),
  details: z.array(guaranteeDetailSchema).optional(),
});

// Guarantees Step Schema
export const guaranteesSchema = z.object({
  guarantees: z.array(guaranteeSchema).optional(),
});

// Exclusion Schema
export const exclusionSchema = z.object({
  description: z.string().optional(),
  type: z.string().optional(),
});

// Obligation Schema
export const obligationSchema = z.object({
  description: z.string().optional(),
  type: z.enum([ObligationType.SUBSCRIPTION, ObligationType.DURING_CONTRACT, ObligationType.CLAIM] as const).optional(),
});

// Zone Schema
export const zoneSchema = z.object({
  type: z.enum([ZoneType.COUNTRY, ZoneType.ZONE, ZoneType.REGION, ZoneType.CITY] as const).optional(),
  label: z.string().optional(),
  conditions: z.array(z.string()).optional().nullable(),
});

// Termination Schema
export const terminationSchema = z.object({
  description: z.string().optional(),
});

// Cancellation Schema
export const cancellationSchema = z.object({
  question: z.string().optional(),
  response: z.string().optional(),
});

// Contact Schema
export const contactSchema = z.object({
  type: z.enum([ContactType.MANAGEMENT, ContactType.ASSISTANCE, ContactType.EMERGENCY] as const).optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  openingHours: z.string().optional(),
});

// Other Sections Step Schema
export const otherSectionsSchema = z.object({
  exclusions: z.array(exclusionSchema).optional(),
  obligations: z.array(obligationSchema).optional(),
  zones: z.array(zoneSchema).optional(),
  terminations: z.array(terminationSchema).optional(),
  cancellations: z.array(cancellationSchema).optional(),
  contacts: z.array(contactSchema).optional(),
});

// Complete Form Schema
export const templateContractEditSchema = z.object({
  ...basicInfoSchema.shape,
  ...guaranteesSchema.shape,
  ...otherSectionsSchema.shape,
});

// Step validation schemas for individual steps
export const stepSchemas = {
  basicInfo: basicInfoSchema,
  guarantees: guaranteesSchema,
  otherSections: otherSectionsSchema,
};

// Type exports
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type GuaranteesFormData = z.infer<typeof guaranteesSchema>;
export type OtherSectionsFormData = z.infer<typeof otherSectionsSchema>;
export type TemplateContractEditFormData = z.infer<typeof templateContractEditSchema>;
