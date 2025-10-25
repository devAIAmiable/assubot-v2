import { z } from 'zod';

import { ContractCategory } from '../types/contract';

// Get all category values from ContractCategory const object
const categoryValues = Object.values(ContractCategory) as [string, ...string[]];

// Contract category enum validation - dynamically derived from ContractCategory
export const contractCategorySchema = z.enum(categoryValues, {
  message: 'La catégorie est obligatoire',
});

// Document type enum validation
export const documentTypeSchema = z.enum(['CP', 'CG', 'OTHER']);

// Step 1: Category Selection validation
export const step1Schema = z.object({
  category: contractCategorySchema,
});

// Step 2: General Information & Details validation
export const step2Schema = z
  .object({
    insurerName: z
      .string({ message: "Le nom de l'assureur est obligatoire" })
      .min(2, "Le nom de l'assureur doit contenir au moins 2 caractères")
      .max(100, "Le nom de l'assureur ne peut pas dépasser 100 caractères")
      .optional(),
    name: z
      .string({ message: 'Le nom du contrat est obligatoire' })
      .min(2, 'Le nom du contrat doit contenir au moins 2 caractères')
      .max(200, 'Le nom du contrat ne peut pas dépasser 200 caractères'),
    startDate: z
      .string({ message: 'La date de début est obligatoire' })
      .min(1, 'La date de début est obligatoire')
      .refine((date) => !isNaN(Date.parse(date)), 'Format de date invalide')
      .optional(),
    endDate: z
      .string({ message: 'La date de fin est obligatoire' })
      .min(1, 'La date de fin est obligatoire')
      .refine((date) => !isNaN(Date.parse(date)), 'Format de date invalide')
      .optional(),
    annualPremiumCents: z
      .number({ message: 'La prime annuelle est obligatoire' })
      .int('La prime doit être un nombre entier de centimes')
      .min(100, "La prime annuelle doit être d'au moins 1€")
      .max(10000000, 'La prime annuelle ne peut pas dépasser 100,000€')
      .optional(),
    monthlyPremiumCents: z
      .number()
      .int('La prime doit être un nombre entier de centimes')
      .min(0, 'La prime mensuelle ne peut pas être négative')
      .max(1000000, 'La prime mensuelle ne peut pas dépasser 10,000€')
      .optional(),
    tacitRenewal: z.boolean({ message: 'Le renouvellement tacite doit être spécifié' }).optional(),
    formula: z.string().optional().optional(),
    cancellationDeadline: z.string().optional().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate > startDate;
    },
    {
      message: 'La date de fin doit être postérieure à la date de début',
      path: ['endDate'],
    }
  );

// Step 3: Documents validation
export const step3Schema = z.object({
  documents: z
    .array(
      z.object({
        type: documentTypeSchema,
        fileName: z.string().min(1, 'Nom de fichier requis'),
        fileSize: z.number().positive('Taille de fichier invalide'),
        fileType: z.string().min(1, 'Type de fichier requis'),
        blobPath: z.string().optional(),
      })
    )
    .min(1, 'Au moins un document est requis')
    .refine((docs) => docs.some((doc) => doc.type === 'CP'), 'Les conditions particulières (CP) sont obligatoires')
    .refine((docs) => docs.some((doc) => doc.type === 'CG'), 'Les conditions générales (CG) sont obligatoires')
    .refine((docs) => docs.every((doc) => doc.fileSize <= 10 * 1024 * 1024), 'Chaque fichier ne peut pas dépasser 10MB')
    .refine(
      (docs) =>
        docs.every((doc) =>
          ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'].includes(
            doc.fileType
          )
        ),
      'Formats de fichiers autorisés : PDF, DOC, DOCX, JPG, PNG'
    ),
});

// Complete form validation
export const contractFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);

// Type inference
export type ContractFormValidation = z.infer<typeof contractFormSchema>;
export type Step1Validation = z.infer<typeof step1Schema>;
export type Step2Validation = z.infer<typeof step2Schema>;
export type Step3Validation = z.infer<typeof step3Schema>;

// Validation helper functions
export const validateStep = (step: number, data: Record<string, unknown>) => {
  switch (step) {
    case 1:
      return step1Schema.safeParse(data);
    case 2:
      return step2Schema.safeParse(data);
    case 3:
      return step3Schema.safeParse(data);
    default:
      return { success: false, error: { issues: [] } };
  }
};

export const getFieldError = (errors: z.ZodError, fieldName: string): string | undefined => {
  const issue = errors.issues.find((issue) => issue.path.includes(fieldName));
  return issue?.message;
};
