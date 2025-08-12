import type {
	ContractCategory,
	ContractFormData,
	DocumentType,
} from '../types';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { validateStep } from '../schemas/contractValidation';

interface ContractCreationState {
	// Form state
	formData: Partial<ContractFormData>;
	currentStep: number;
	isFormValid: boolean;

	// UI state
	isModalOpen: boolean;
	isSubmitting: boolean;
	error: string | null;

	// Validation
	fieldErrors: Record<string, string>;
	fieldTouched: Record<string, boolean>; // Track which fields have been interacted with
}

const initialState: ContractCreationState = {
	formData: {
		documents: [],
	},
	currentStep: 1,
	isFormValid: false,
	isModalOpen: false,
	isSubmitting: false,
	error: null,
	fieldErrors: {},
	fieldTouched: {},
};

const contractCreationSlice = createSlice({
	name: 'contractCreation',
	initialState,
	reducers: {
		// Modal management
		openModal: (state) => {
			state.isModalOpen = true;
			state.error = null;
		},

		closeModal: (state) => {
			state.isModalOpen = false;
			// Reset form when closing modal
			state.formData = { documents: [] };
			state.currentStep = 1;
			state.isFormValid = false;
			state.isSubmitting = false;
			state.error = null;
			state.fieldErrors = {};
			state.fieldTouched = {};
		},

		// Step navigation
		setCurrentStep: (state, action: PayloadAction<number>) => {
			state.currentStep = action.payload;
			// Revalidate form when step changes
			const validation = validateFormStep(state.formData, state.currentStep, state.fieldTouched);
			state.isFormValid = validation.success;
			state.fieldErrors = validation.success ? {} : getFieldErrorsFromZod(validation.error);
		},

		nextStep: (state) => {
			if (state.currentStep < 3) {
				state.currentStep += 1;
				// Revalidate form when step changes
				const validation = validateFormStep(state.formData, state.currentStep, state.fieldTouched);
				state.isFormValid = validation.success;
				state.fieldErrors = validation.success ? {} : getFieldErrorsFromZod(validation.error);
			}
		},

		previousStep: (state) => {
			if (state.currentStep > 1) {
				state.currentStep -= 1;
				// Revalidate form when step changes
				const validation = validateFormStep(state.formData, state.currentStep, state.fieldTouched);
				state.isFormValid = validation.success;
				state.fieldErrors = validation.success ? {} : getFieldErrorsFromZod(validation.error);
			}
		},

		// Form data management
		updateFormData: (state, action: PayloadAction<Partial<ContractFormData>>) => {
			state.formData = { ...state.formData, ...action.payload };
			const validation = validateFormStep(state.formData, state.currentStep, state.fieldTouched);
			state.isFormValid = validation.success;
			state.fieldErrors = validation.success ? {} : getFieldErrorsFromZod(validation.error);
		},

		updateFormField: (
			state,
			action: PayloadAction<{
				field: keyof ContractFormData;
				value: ContractFormData[keyof ContractFormData];
			}>
		) => {
			const { field, value } = action.payload;
			
			// Type-safe field update
			if (field === 'name') {
				state.formData.name = value as string;
			} else if (field === 'insurerName') {
				state.formData.insurerName = value as string;
			} else if (field === 'category') {
				state.formData.category = value as ContractCategory;
			} else if (field === 'startDate') {
				state.formData.startDate = value as string;
			} else if (field === 'endDate') {
				state.formData.endDate = value as string;
			} else if (field === 'annualPremiumCents') {
				state.formData.annualPremiumCents = value as number;
			} else if (field === 'monthlyPremiumCents') {
				state.formData.monthlyPremiumCents = value as number;
			} else if (field === 'tacitRenewal') {
				state.formData.tacitRenewal = value as boolean;
			} else if (field === 'formula') {
				state.formData.formula = value as string;
			} else if (field === 'cancellationDeadline') {
				state.formData.cancellationDeadline = value as string;
			}
			
			// Revalidate form after field update
			const validation = validateFormStep(state.formData, state.currentStep, state.fieldTouched);
			state.isFormValid = validation.success;
			state.fieldErrors = validation.success ? {} : getFieldErrorsFromZod(validation.error);
		},

		// Document management
		addDocument: (state, action: PayloadAction<{ type: DocumentType; file: File }>) => {
			const { type, file } = action.payload;
			if (!state.formData.documents) {
				state.formData.documents = [];
			}
			
			// Remove existing document of same type
			state.formData.documents = state.formData.documents.filter(doc => doc.type !== type);
			
			// Add new document
			state.formData.documents.push({
				type,
				fileName: file.name,
				fileSize: file.size,
				fileType: file.type,
			});
			
			// Revalidate form
			const validation = validateFormStep(state.formData, state.currentStep, state.fieldTouched);
			state.isFormValid = validation.success;
			state.fieldErrors = validation.success ? {} : getFieldErrorsFromZod(validation.error);
		},

		removeDocument: (state, action: PayloadAction<DocumentType>) => {
			if (state.formData.documents) {
				state.formData.documents = state.formData.documents.filter(
					doc => doc.type !== action.payload
				);
				
				// Revalidate form
				const validation = validateFormStep(state.formData, state.currentStep, state.fieldTouched);
				state.isFormValid = validation.success;
				state.fieldErrors = validation.success ? {} : getFieldErrorsFromZod(validation.error);
			}
		},

		updateDocumentBlobPath: (
			state,
			action: PayloadAction<{ type: DocumentType; blobPath: string }>
		) => {
			const { type, blobPath } = action.payload;
			if (state.formData.documents) {
				const docIndex = state.formData.documents.findIndex(doc => doc.type === type);
				if (docIndex !== -1) {
					state.formData.documents[docIndex].blobPath = blobPath;
				}
			}
		},

		// Submission state
		setSubmitting: (state, action: PayloadAction<boolean>) => {
			state.isSubmitting = action.payload;
		},

		// Error handling
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
			state.isSubmitting = false;
		},

		clearError: (state) => {
			state.error = null;
		},

		// Field error management
		clearFieldError: (state, action: PayloadAction<string>) => {
			if (state.fieldErrors[action.payload]) {
				delete state.fieldErrors[action.payload];
			}
		},

		// Field interaction tracking
		markFieldTouched: (state, action: PayloadAction<string>) => {
			state.fieldTouched[action.payload] = true;
		},
	},
});

// Validation helper function using Zod
function validateFormStep(formData: Partial<ContractFormData>, step: number, fieldTouched: Record<string, boolean>) {
	// For step 2, we only need to validate that the name field is filled
	// We don't need to validate other fields that are optional
	if (step === 2) {
		// Check if name field is filled and valid
		const name = formData.name;
		
		// Only validate if the field has been touched
		if (fieldTouched.name) {
			if (!name || typeof name !== 'string' || name.trim().length === 0) {
				return {
					success: false,
					error: {
						issues: [{
							path: ['name'],
							message: 'Le nom du contrat est obligatoire'
						}]
					}
				};
			}
			
			if (name.trim().length < 2) {
				return {
					success: false,
					error: {
						issues: [{
							path: ['name'],
							message: 'Le nom du contrat doit contenir au moins 2 caractères'
						}]
					}
				};
			}
			
			// Check for special characters (only allow letters, numbers, spaces, and hyphens)
			const nameRegex = /^[a-zA-ZÀ-ÿ0-9\s-]+$/;
			if (!nameRegex.test(name)) {
				return {
					success: false,
					error: {
						issues: [{
							path: ['name'],
							message: 'Le nom du contrat ne peut contenir que des lettres, chiffres, espaces et tirets (-)'
						}]
					}
				};
			}
		}
		
		return { success: true, data: formData };
	}
	
	// For other steps, use the original validation
	return validateStep(step, formData);
}

// Helper to convert Zod errors to field errors
function getFieldErrorsFromZod(zodError: unknown): Record<string, string> {
	const fieldErrors: Record<string, string> = {};
	if (zodError && typeof zodError === 'object' && 'issues' in zodError) {
		const issues = (zodError as { issues: Array<{ path: (string | number)[]; message: string }> }).issues;
		issues.forEach((issue) => {
			const fieldPath = issue.path.join('.');
			if (!fieldErrors[fieldPath]) {
				fieldErrors[fieldPath] = issue.message;
			}
		});
	}
	return fieldErrors;
}

export const {
	openModal,
	closeModal,
	setCurrentStep,
	nextStep,
	previousStep,
	updateFormData,
	updateFormField,
	clearFieldError,
	addDocument,
	removeDocument,
	updateDocumentBlobPath,
	setSubmitting,
	setError,
	clearError,
	markFieldTouched,
} = contractCreationSlice.actions;

export const selectContractCreation = (state: { contractCreation: ContractCreationState }) =>
	state.contractCreation;
export const selectFormData = (state: { contractCreation: ContractCreationState }) =>
	state.contractCreation.formData;
export const selectCurrentStep = (state: { contractCreation: ContractCreationState }) =>
	state.contractCreation.currentStep;
export const selectIsFormValid = (state: { contractCreation: ContractCreationState }) =>
	state.contractCreation.isFormValid;
export const selectIsModalOpen = (state: { contractCreation: ContractCreationState }) =>
	state.contractCreation.isModalOpen;
export const selectFieldErrors = (state: { contractCreation: ContractCreationState }) =>
	state.contractCreation.fieldErrors;
export const selectIsSubmitting = (state: { contractCreation: ContractCreationState }) =>
	state.contractCreation.isSubmitting;
export const selectError = (state: { contractCreation: ContractCreationState }) =>
	state.contractCreation.error;

export default contractCreationSlice.reducer;
