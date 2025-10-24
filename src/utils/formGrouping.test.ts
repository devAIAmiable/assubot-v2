import { describe, expect, it } from 'vitest';
import { getWizardSteps, getVisibleSubsectionGroups, calculateFormProgress, getRequiredFields } from './formGrouping';
import type { FormField } from '../types/comparison';

describe('Form Grouping Utilities', () => {
  const mockFields: FormField[] = [
    {
      name: 'field1',
      type: 'text',
      label: 'Field 1',
      required: true,
      subsection: { id: 'section1', label: 'Section 1' },
    },
    {
      name: 'field2',
      type: 'text',
      label: 'Field 2',
      required: false,
      subsection: { id: 'section1', label: 'Section 1' },
    },
    {
      name: 'field3',
      type: 'select',
      label: 'Field 3',
      required: true,
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
      subsection: { id: 'section2', label: 'Section 2' },
    },
    {
      name: 'field4',
      type: 'text',
      label: 'Field 4',
      required: false,
      showWhen: { field: 'field3', equals: 'option1' },
      subsection: { id: 'section2', label: 'Section 2' },
    },
    {
      name: 'field5',
      type: 'text',
      label: 'Field 5',
      required: true,
      showWhen: { field: 'field3', in: ['option1', 'option2'] },
      subsection: { id: 'section3', label: 'Section 3' },
    },
    {
      name: 'field6',
      type: 'text',
      label: 'Field 6',
      required: false,
      subsection: { id: 'section3', label: 'Section 3' },
    },
  ];

  describe('getWizardSteps', () => {
    it('should group fields by subsection', () => {
      const steps = getWizardSteps(mockFields);

      expect(steps).toHaveLength(3);
      expect(steps[0].id).toBe('section1');
      expect(steps[0].label).toBe('Section 1');
      expect(steps[0].fields).toHaveLength(2);
      expect(steps[0].fields[0].name).toBe('field1');
      expect(steps[0].fields[1].name).toBe('field2');

      expect(steps[1].id).toBe('section2');
      expect(steps[1].label).toBe('Section 2');
      expect(steps[1].fields).toHaveLength(2);
      expect(steps[1].fields[0].name).toBe('field3');
      expect(steps[1].fields[1].name).toBe('field4');

      expect(steps[2].id).toBe('section3');
      expect(steps[2].label).toBe('Section 3');
      expect(steps[2].fields).toHaveLength(2);
      expect(steps[2].fields[0].name).toBe('field5');
      expect(steps[2].fields[1].name).toBe('field6');
    });

    it('should handle empty fields array', () => {
      const steps = getWizardSteps([]);
      expect(steps).toHaveLength(0);
    });

    it('should handle fields with same subsection', () => {
      const fieldsWithSameSubsection = [
        {
          name: 'field1',
          type: 'text',
          label: 'Field 1',
          required: true,
          subsection: { id: 'section1', label: 'Section 1' },
        },
        {
          name: 'field2',
          type: 'text',
          label: 'Field 2',
          required: false,
          subsection: { id: 'section1', label: 'Section 1' },
        },
      ];

      const steps = getWizardSteps(fieldsWithSameSubsection);
      expect(steps).toHaveLength(1);
      expect(steps[0].fields).toHaveLength(2);
    });

    it('should preserve field order within subsections', () => {
      const steps = getWizardSteps(mockFields);
      expect(steps[0].fields[0].name).toBe('field1');
      expect(steps[0].fields[1].name).toBe('field2');
    });
  });

  describe('getVisibleSubsectionGroups', () => {
    it('should return all subsections when no showWhen conditions', () => {
      const formData = {};
      const visibleGroups = getVisibleSubsectionGroups(mockFields, formData);

      expect(visibleGroups).toHaveLength(3);
      expect(visibleGroups[0].id).toBe('section1');
      expect(visibleGroups[1].id).toBe('section2');
      expect(visibleGroups[2].id).toBe('section3');
    });

    it('should filter subsections based on showWhen conditions', () => {
      const formData = { field3: 'option1' };
      const visibleGroups = getVisibleSubsectionGroups(mockFields, formData);

      expect(visibleGroups).toHaveLength(3);
      expect(visibleGroups[0].id).toBe('section1');
      expect(visibleGroups[1].id).toBe('section2');
      expect(visibleGroups[2].id).toBe('section3');
    });

    it('should hide subsections when showWhen conditions are not met', () => {
      const formData = { field3: 'option3' }; // field5 should be hidden, but field6 will still be visible
      const visibleGroups = getVisibleSubsectionGroups(mockFields, formData);

      expect(visibleGroups).toHaveLength(3);
      expect(visibleGroups[0].id).toBe('section1');
      expect(visibleGroups[1].id).toBe('section2');
      expect(visibleGroups[2].id).toBe('section3');
      // section3 should only contain field6 (field5 should be hidden)
      expect(visibleGroups[2].fields).toHaveLength(1);
      expect(visibleGroups[2].fields[0].name).toBe('field6');
    });

    it('should handle complex showWhen conditions', () => {
      const formData = { field3: 'option1' };
      const visibleGroups = getVisibleSubsectionGroups(mockFields, formData);

      // field4 should be visible (field3 equals 'option1')
      // field5 should be visible (field3 in ['option1', 'option2'])
      expect(visibleGroups).toHaveLength(3);
    });

    it('should handle null and undefined form data', () => {
      const visibleGroups1 = getVisibleSubsectionGroups(mockFields, null);
      const visibleGroups2 = getVisibleSubsectionGroups(mockFields, undefined);

      expect(visibleGroups1).toHaveLength(3);
      expect(visibleGroups2).toHaveLength(3);
    });

    it('should handle empty form data', () => {
      const visibleGroups = getVisibleSubsectionGroups(mockFields, {});
      expect(visibleGroups).toHaveLength(3);
    });
  });

  describe('calculateFormProgress', () => {
    it('should calculate progress based on required fields', () => {
      const formData = { field1: 'value1' };
      const progress = calculateFormProgress(mockFields, formData);

      // field1 is filled, field3 and field5 are required but not filled
      // Total required fields: 3 (field1, field3, field5)
      // Filled required fields: 1 (field1)
      // Progress: 1/3 = 33.33%
      expect(progress).toBeCloseTo(33.33, 1);
    });

    it('should calculate 100% progress when all required fields are filled', () => {
      const formData = {
        field1: 'value1',
        field3: 'option1',
        field5: 'value5',
      };
      const progress = calculateFormProgress(mockFields, formData);

      expect(progress).toBe(100);
    });

    it('should calculate 0% progress when no required fields are filled', () => {
      const formData = { field2: 'value2' }; // field2 is not required
      const progress = calculateFormProgress(mockFields, formData);

      expect(progress).toBe(0);
    });

    it('should handle empty form data', () => {
      const progress = calculateFormProgress(mockFields, {});
      expect(progress).toBe(0);
    });

    it('should handle null form data', () => {
      const progress = calculateFormProgress(mockFields, null);
      expect(progress).toBe(0);
    });

    it('should handle undefined form data', () => {
      const progress = calculateFormProgress(mockFields, undefined);
      expect(progress).toBe(0);
    });

    it('should handle fields with empty string values', () => {
      const formData = { field1: '', field3: 'option1', field5: '' };
      const progress = calculateFormProgress(mockFields, formData);

      // Only field3 is filled, so progress should be 1/3
      expect(progress).toBeCloseTo(33.33, 1);
    });

    it('should handle fields with null values', () => {
      const formData = { field1: null, field3: 'option1', field5: null };
      const progress = calculateFormProgress(mockFields, formData);

      // Only field3 is filled, so progress should be 1/3
      expect(progress).toBeCloseTo(33.33, 1);
    });

    it('should handle fields with undefined values', () => {
      const formData = { field1: undefined, field3: 'option1', field5: undefined };
      const progress = calculateFormProgress(mockFields, formData);

      // Only field3 is filled, so progress should be 1/3
      expect(progress).toBeCloseTo(33.33, 1);
    });
  });

  describe('getRequiredFields', () => {
    it('should return all required fields', () => {
      const requiredFields = getRequiredFields(mockFields);

      expect(requiredFields).toHaveLength(3);
      expect(requiredFields[0].name).toBe('field1');
      expect(requiredFields[1].name).toBe('field3');
      expect(requiredFields[2].name).toBe('field5');
    });

    it('should handle fields with no required fields', () => {
      const nonRequiredFields = [
        {
          name: 'field1',
          type: 'text',
          label: 'Field 1',
          required: false,
          subsection: { id: 'section1', label: 'Section 1' },
        },
        {
          name: 'field2',
          type: 'text',
          label: 'Field 2',
          required: false,
          subsection: { id: 'section1', label: 'Section 1' },
        },
      ];

      const requiredFields = getRequiredFields(nonRequiredFields);
      expect(requiredFields).toHaveLength(0);
    });

    it('should handle empty fields array', () => {
      const requiredFields = getRequiredFields([]);
      expect(requiredFields).toHaveLength(0);
    });

    it('should preserve field order', () => {
      const requiredFields = getRequiredFields(mockFields);
      expect(requiredFields[0].name).toBe('field1');
      expect(requiredFields[1].name).toBe('field3');
      expect(requiredFields[2].name).toBe('field5');
    });
  });

  describe('Edge Cases', () => {
    it('should handle fields with missing subsection', () => {
      const fieldsWithMissingSubsection = [
        {
          name: 'field1',
          type: 'text',
          label: 'Field 1',
          required: true,
          subsection: { id: 'section1', label: 'Section 1' },
        },
        {
          name: 'field2',
          type: 'text',
          label: 'Field 2',
          required: false,
          subsection: undefined,
        },
      ];

      const steps = getWizardSteps(fieldsWithMissingSubsection);
      expect(steps).toHaveLength(1);
      expect(steps[0].fields).toHaveLength(1);
    });

    it('should handle fields with duplicate subsection IDs', () => {
      const fieldsWithDuplicateSubsections = [
        {
          name: 'field1',
          type: 'text',
          label: 'Field 1',
          required: true,
          subsection: { id: 'section1', label: 'Section 1' },
        },
        {
          name: 'field2',
          type: 'text',
          label: 'Field 2',
          required: false,
          subsection: { id: 'section1', label: 'Section 1' },
        },
      ];

      const steps = getWizardSteps(fieldsWithDuplicateSubsections);
      expect(steps).toHaveLength(1);
      expect(steps[0].fields).toHaveLength(2);
    });

    it('should handle complex showWhen conditions with nested objects', () => {
      const fieldsWithComplexConditions = [
        {
          name: 'field1',
          type: 'text',
          label: 'Field 1',
          required: true,
          subsection: { id: 'section1', label: 'Section 1' },
        },
        {
          name: 'field2',
          type: 'text',
          label: 'Field 2',
          required: false,
          showWhen: { field: 'field1', equals: 'value1' },
          subsection: { id: 'section1', label: 'Section 1' },
        },
      ];

      const formData = { field1: 'value1' };
      const visibleGroups = getVisibleSubsectionGroups(fieldsWithComplexConditions, formData);

      expect(visibleGroups).toHaveLength(1);
      expect(visibleGroups[0].fields).toHaveLength(2);
    });

    it('should handle fields with array showWhen conditions', () => {
      const fieldsWithArrayConditions = [
        {
          name: 'field1',
          type: 'select',
          label: 'Field 1',
          required: true,
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
          subsection: { id: 'section1', label: 'Section 1' },
        },
        {
          name: 'field2',
          type: 'text',
          label: 'Field 2',
          required: false,
          showWhen: { field: 'field1', in: ['option1', 'option2'] },
          subsection: { id: 'section1', label: 'Section 1' },
        },
      ];

      const formData = { field1: 'option1' };
      const visibleGroups = getVisibleSubsectionGroups(fieldsWithArrayConditions, formData);

      expect(visibleGroups).toHaveLength(1);
      expect(visibleGroups[0].fields).toHaveLength(2);
    });
  });
});
