// Types for frontend form definitions
import type { FormFieldAutocomplete, FormFieldMask, FormFieldOption, FormFieldShortcut, FormFieldShowWhen, FormFieldType, FormFieldValidation } from './comparison';

export interface RawFormFieldDefinition {
  name: string;
  type: FormFieldType;
  required: boolean;
  label?: string;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
  placeholder?: string;
  helperText?: string;
  showWhen?: FormFieldShowWhen;
  mask?: FormFieldMask;
  shortcuts?: FormFieldShortcut[];
  autocomplete?: FormFieldAutocomplete;
  subsection?: {
    id: string;
    label: string;
  };
  helpText?: string;
  example?: string;
  tooltip?: string;
  objectSchema?: unknown; // For complex object fields
}

// Helper type for showWhen conditions with array support
export interface RawFormFieldShowWhen {
  field: string;
  equals?: string | number | boolean;
  in?: (string | number | boolean)[]; // Support for "in" conditions
}
