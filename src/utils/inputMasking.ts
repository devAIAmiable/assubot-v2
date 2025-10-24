/**
 * Input masking utilities for form fields
 */

export interface MaskPattern {
  pattern: string;
  placeholder: string;
  guide: boolean;
}

/**
 * Apply input mask to a value based on pattern
 * @param value - The input value
 * @param mask - The mask pattern
 * @returns The masked value
 */
export function applyMask(value: string, mask: MaskPattern): string {
  if (!mask.pattern || !value) return value;

  const { pattern } = mask;
  let maskedValue = '';
  let valueIndex = 0;

  for (let i = 0; i < pattern.length && valueIndex < value.length; i++) {
    const patternChar = pattern[i];
    const valueChar = value[valueIndex];

    if (patternChar === '9') {
      // Only allow digits
      if (/\d/.test(valueChar)) {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        // Skip non-digit characters
        valueIndex++;
        i--; // Stay on current pattern position
      }
    } else if (patternChar === 'A') {
      // Only allow letters
      if (/[A-Za-z]/.test(valueChar)) {
        maskedValue += valueChar.toUpperCase();
        valueIndex++;
      } else {
        // Skip non-letter characters
        valueIndex++;
        i--; // Stay on current pattern position
      }
    } else {
      // Literal character (like /, -, space)
      maskedValue += patternChar;
    }
  }

  return maskedValue;
}

/**
 * Remove mask characters from a value
 * @param value - The masked value
 * @param mask - The mask pattern
 * @returns The unmasked value
 */
export function removeMask(value: string, mask: MaskPattern): string {
  if (!mask.pattern) return value;

  const { pattern } = mask;
  let unmaskedValue = '';
  let patternIndex = 0;

  for (let i = 0; i < value.length && patternIndex < pattern.length; i++) {
    const valueChar = value[i];
    const patternChar = pattern[patternIndex];

    if (patternChar === '9') {
      // Extract digit
      if (/\d/.test(valueChar)) {
        unmaskedValue += valueChar;
        patternIndex++;
      }
    } else if (patternChar === 'A') {
      // Extract letter
      if (/[A-Za-z]/.test(valueChar)) {
        unmaskedValue += valueChar;
        patternIndex++;
      }
    } else {
      // Skip literal character
      patternIndex++;
      i--; // Stay on current value position
    }
  }

  return unmaskedValue;
}

/**
 * Get placeholder text with mask guide
 * @param mask - The mask pattern
 * @returns The placeholder text
 */
export function getMaskPlaceholder(mask: MaskPattern): string {
  if (!mask.guide) return mask.placeholder || '';

  return mask.pattern.replace(/9/g, '_').replace(/A/g, 'A');
}

/**
 * Validate if a value matches the mask pattern
 * @param value - The value to validate
 * @param mask - The mask pattern
 * @returns True if value matches mask
 */
export function validateMask(value: string, mask: MaskPattern): boolean {
  if (!mask.pattern) return true;

  const unmaskedValue = removeMask(value, mask);
  const expectedLength = (mask.pattern.match(/[9A]/g) || []).length;

  return unmaskedValue.length === expectedLength;
}

/**
 * Common mask patterns
 */
export const COMMON_MASKS = {
  DATE_DD_MM_YYYY: {
    pattern: '99/99/9999',
    placeholder: 'DD/MM/YYYY',
    guide: true,
  },
  POSTAL_CODE_FR: {
    pattern: '99999',
    placeholder: '75001',
    guide: true,
  },
  LICENSE_PLATE_FR: {
    pattern: 'AA999AA',
    placeholder: 'AA123BB',
    guide: true,
  },
  PHONE_FR: {
    pattern: '99 99 99 99 99',
    placeholder: '01 23 45 67 89',
    guide: true,
  },
} as const;
