import { isMinimumAge } from '../utils/ageValidation';
import { z } from 'zod';

// Schéma pour les informations personnelles
export const personalInfoSchema = z.object({
    firstName: z.string().trim().min(2, 'Le prénom est requis et doit contenir au moins 2 caractères'),
    lastName: z.string().trim().min(2, 'Le nom est requis et doit contenir au moins 2 caractères'),
    birthDate: z.string().min(1, 'La date de naissance est requise').refine(
        (val) => {
            if (!val) return false;
            return isMinimumAge(val, 18);
        },
        'Vous devez avoir au moins 18 ans pour créer un compte'
    ),
    gender: z.string().min(1, 'Le genre est requis').refine(
        (val) => val === '' || ['male', 'female', 'other'].includes(val),
        'Veuillez sélectionner un genre valide'
    ),
    professionalCategory: z.string().min(1, 'La catégorie professionnelle est requise').refine(
        (val) => val === '' || ['student', 'unemployed', 'executive', 'non-executive', 'entrepreneur'].includes(val),
        'Veuillez sélectionner une catégorie professionnelle valide'
    ),
});

// Schéma pour l'adresse
export const addressSchema = z.object({
    address: z.string().trim().min(1, 'L\'adresse est requise'),
    city: z.string().trim().min(1, 'La ville est requise'),
    zip: z.string().trim().min(1, 'Le code postal est requis'),
});

// Schéma pour le changement de mot de passe
export const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z.string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            'Le mot de passe doit contenir au moins: une majuscule, une minuscule, un chiffre et un caractère spécial'
        ),
    confirmPassword: z.string().min(1, 'La confirmation du mot de passe est requise'),
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Les mots de passe ne correspondent pas',
            path: ['confirmPassword'],
        });
    }
});

// Types inférés des schémas
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
