/**
 * Utility functions for detecting changes in form data
 * Supports deep comparison of objects and arrays
 */

/**
 * Deep equality check for objects and arrays
 */
export function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 !== 'object') {
    return obj1 === obj2;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Get only changed fields from form data
 * Returns a partial object containing only the fields that have changed
 */
export function getChangedFields<T extends object>(original: T, current: T): Partial<T> {
  const changedFields: Partial<T> = {};

  for (const key in current) {
    if (Object.prototype.hasOwnProperty.call(current, key)) {
      const originalValue = original[key];
      const currentValue = current[key];

      // Handle arrays specially
      if (Array.isArray(currentValue)) {
        if (!deepEqual(originalValue, currentValue)) {
          (changedFields as Record<string, unknown>)[key] = currentValue;
        }
      } else if (typeof currentValue === 'object' && currentValue !== null) {
        // Handle nested objects
        if (!deepEqual(originalValue, currentValue)) {
          (changedFields as Record<string, unknown>)[key] = currentValue;
        }
      } else {
        // Handle primitive values
        if (originalValue !== currentValue) {
          (changedFields as Record<string, unknown>)[key] = currentValue;
        }
      }
    }
  }

  return changedFields;
}

/**
 * Special handling for arrays to detect changes
 * Returns the new array if it has changed, undefined otherwise
 */
export function getChangedArrayFields<T>(original: T[], current: T[]): T[] | undefined {
  if (!deepEqual(original, current)) {
    return current;
  }
  return undefined;
}

/**
 * Check if any fields have changed
 */
export function hasChanges<T extends object>(original: T, current: T): boolean {
  const changedFields = getChangedFields(original, current);
  return Object.keys(changedFields).length > 0;
}

/**
 * Get a summary of what fields have changed
 * Useful for debugging or user feedback
 */
export function getChangeSummary<T extends object>(original: T, current: T): string[] {
  const changedFields = getChangedFields(original, current);
  return Object.keys(changedFields);
}
