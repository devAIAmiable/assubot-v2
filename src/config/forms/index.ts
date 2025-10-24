import type { ComparisonCategory, FormDefinition, FormField } from '../../types/comparison';

import type { RawFormFieldDefinition } from '../../types/comparison.types';
import { autoFormDefinition } from './autoForm';
import { homeFormDefinition } from './homeForm';

/**
 * Transform raw form field definitions into the FormDefinition structure
 */
function transformToFormDefinition(category: ComparisonCategory, fields: RawFormFieldDefinition[]): FormDefinition {
  // Enrich fields with dynamic data (like yearsInsured options)
  const enrichedFields = enrichFieldsWithDynamicData(fields);

  // Transform raw fields to FormField format
  const formFields: FormField[] = enrichedFields.map((field) => ({
    name: field.name,
    type: field.type,
    label: field.label || field.helperText || field.name, // Use label first, then helperText, then field name as fallback
    placeholder: field.placeholder,
    required: field.required,
    validation: field.validation,
    options: field.options,
    helperText: field.helperText,
    showWhen: field.showWhen,
    mask: field.mask,
    shortcuts: field.shortcuts,
    autocomplete: field.autocomplete,
    subsection: field.subsection,
    helpText: field.helpText,
    example: field.example,
    tooltip: field.tooltip,
  }));

  // Group fields by subsection or create logical sections
  const sections = groupFieldsIntoSections(formFields);

  return {
    category,
    sections,
  };
}

/**
 * Enrich fields with dynamic data like yearsInsured options
 */
function enrichFieldsWithDynamicData(fields: RawFormFieldDefinition[]): RawFormFieldDefinition[] {
  return fields.map((field) => {
    if (field.name === 'yearsInsured') {
      return {
        ...field,
        options: generateYearsInsuredOptions(),
      };
    }
    return field;
  });
}

/**
 * Generate years insured options using dayjs
 */
function generateYearsInsuredOptions() {
  const options = [];

  // Generate options from 0 to 50 years
  for (let i = 0; i <= 50; i++) {
    const label = i === 0 ? 'Cette année' : i === 1 ? '1 an' : `${i} ans`;

    options.push({
      value: i.toString(),
      label,
    });
  }

  return options;
}

/**
 * Group fields into logical sections based on subsection property
 */
function groupFieldsIntoSections(fields: FormField[]) {
  const sectionMap = new Map<string, FormField[]>();
  const defaultSection = 'Informations générales';

  // Group fields by subsection
  fields.forEach((field) => {
    const sectionTitle = field.subsection?.label || defaultSection;

    if (!sectionMap.has(sectionTitle)) {
      sectionMap.set(sectionTitle, []);
    }

    sectionMap.get(sectionTitle)!.push(field);
  });

  // Convert map to sections array
  return Array.from(sectionMap.entries()).map(([title, sectionFields]) => ({
    title,
    fields: sectionFields,
  }));
}

/**
 * Get form definition by category
 */
export const getFormDefinitionByCategory = (category: ComparisonCategory): FormDefinition => {
  const fields = category === 'auto' ? autoFormDefinition : homeFormDefinition;
  return transformToFormDefinition(category, fields);
};

/**
 * Export form definitions for direct access if needed
 */
export { autoFormDefinition, homeFormDefinition };
