import type { FormField } from '../types/comparison';

export interface WizardStep {
  id: string;
  label: string;
  fields: FormField[];
}

export interface SubsectionGroup {
  id: string;
  label: string;
  fields: FormField[];
}

/**
 * Groups form fields into wizard steps based on their subsection
 */
export function getWizardSteps(fields: FormField[]): WizardStep[] {
  const stepMap = new Map<string, WizardStep>();

  fields.forEach((field) => {
    if (!field.subsection) return;

    const { id, label } = field.subsection;

    if (!stepMap.has(id)) {
      stepMap.set(id, {
        id,
        label,
        fields: [],
      });
    }

    stepMap.get(id)!.fields.push(field);
  });

  return Array.from(stepMap.values());
}

/**
 * Returns visible subsection groups based on form data and showWhen conditions
 */
export function getVisibleSubsectionGroups(fields: FormField[], formData: Record<string, unknown> = {}): SubsectionGroup[] {
  const visibleFields = fields.filter((field) => {
    if (!field.showWhen) return true;

    const { field: dependencyField, equals, in: inArray } = field.showWhen;
    const dependencyValue = formData?.[dependencyField];

    if (equals !== undefined) {
      return String(dependencyValue) === String(equals);
    }

    if (inArray !== undefined) {
      return Array.isArray(inArray) && inArray.some((val) => String(val) === String(dependencyValue));
    }

    return true;
  });

  const steps = getWizardSteps(visibleFields);

  // Filter out empty subsections
  return steps.filter((step) => step.fields.length > 0);
}

/**
 * Calculates form completion progress as a percentage
 */
export function calculateFormProgress(fields: FormField[], formData: Record<string, unknown> = {}): number {
  const requiredFields = getRequiredFields(fields);

  if (requiredFields.length === 0) return 100;

  const filledRequiredFields = requiredFields.filter((field) => {
    const value = formData?.[field.name];
    return value !== undefined && value !== null && value !== '';
  });

  return Math.round((filledRequiredFields.length / requiredFields.length) * 100 * 100) / 100;
}

/**
 * Returns all required fields from the form definition
 */
export function getRequiredFields(fields: FormField[]): FormField[] {
  return fields.filter((field) => field.required);
}

/**
 * Checks if a field should be visible based on showWhen conditions
 */
export function shouldShowField(field: FormField, formData: Record<string, unknown> = {}): boolean {
  if (!field.showWhen) return true;

  const { field: dependencyField, equals, in: inArray } = field.showWhen;
  const dependencyValue = formData?.[dependencyField];

  if (equals !== undefined) {
    return String(dependencyValue) === String(equals);
  }

  if (inArray !== undefined) {
    return Array.isArray(inArray) && inArray.some((val) => String(val) === String(dependencyValue));
  }

  return true;
}

/**
 * Gets the current step index based on form data
 */
export function getCurrentStepIndex(steps: WizardStep[], formData: Record<string, unknown> = {}): number {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const hasIncompleteRequiredFields = step.fields.some((field) => {
      if (!field.required) return false;
      const value = formData?.[field.name];
      return value === undefined || value === null || value === '';
    });

    if (hasIncompleteRequiredFields) {
      return i;
    }
  }

  return steps.length - 1;
}

/**
 * Validates a single field based on its validation rules
 */
export function validateField(field: FormField, value: unknown): string | null {
  if (field.required && (value === undefined || value === null || value === '')) {
    return 'Ce champ est requis';
  }

  if (!field.validation || value === undefined || value === null || value === '') {
    return null;
  }

  const { min, max, minLength, maxLength, pattern } = field.validation;

  if (typeof value === 'string') {
    if (minLength !== undefined && value.length < minLength) {
      return `Minimum ${minLength} caractères requis`;
    }

    if (maxLength !== undefined && value.length > maxLength) {
      return `Maximum ${maxLength} caractères autorisés`;
    }

    if (pattern && typeof pattern === 'string' && !new RegExp(pattern).test(value)) {
      return 'Format invalide';
    }
  }

  if (typeof value === 'number') {
    if (min !== undefined && value < min) {
      return `Valeur minimale : ${min}`;
    }

    if (max !== undefined && value > max) {
      return `Valeur maximale : ${max}`;
    }
  }

  return null;
}

/**
 * Validates all fields in a form
 */
export function validateForm(fields: FormField[], formData: Record<string, unknown> = {}): Record<string, string> {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    if (!shouldShowField(field, formData)) return;

    const value = formData?.[field.name];
    const error = validateField(field, value);

    if (error) {
      errors[field.name] = error;
    }
  });

  return errors;
}
