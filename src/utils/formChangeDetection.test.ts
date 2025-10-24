import { deepEqual, getChangeSummary, getChangedFields, hasChanges } from './formChangeDetection';
import { describe, expect, it } from 'vitest';

describe('formChangeDetection', () => {
  describe('deepEqual', () => {
    it('should return true for identical primitive values', () => {
      expect(deepEqual(5, 5)).toBe(true);
      expect(deepEqual('hello', 'hello')).toBe(true);
      expect(deepEqual(true, true)).toBe(true);
      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
    });

    it('should return false for different primitive values', () => {
      expect(deepEqual(5, 6)).toBe(false);
      expect(deepEqual('hello', 'world')).toBe(false);
      expect(deepEqual(true, false)).toBe(false);
      expect(deepEqual(null, undefined)).toBe(false);
    });

    it('should return true for identical objects', () => {
      const obj1 = { name: 'John', age: 30 };
      const obj2 = { name: 'John', age: 30 };
      expect(deepEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for different objects', () => {
      const obj1 = { name: 'John', age: 30 };
      const obj2 = { name: 'Jane', age: 30 };
      expect(deepEqual(obj1, obj2)).toBe(false);
    });

    it('should return true for identical arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3];
      expect(deepEqual(arr1, arr2)).toBe(true);
    });

    it('should return false for different arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 4];
      expect(deepEqual(arr1, arr2)).toBe(false);
    });

    it('should handle nested objects and arrays', () => {
      const obj1 = {
        name: 'John',
        hobbies: ['reading', 'swimming'],
        address: { city: 'Paris', country: 'France' },
      };
      const obj2 = {
        name: 'John',
        hobbies: ['reading', 'swimming'],
        address: { city: 'Paris', country: 'France' },
      };
      expect(deepEqual(obj1, obj2)).toBe(true);
    });
  });

  describe('getChangedFields', () => {
    it('should return empty object when no changes', () => {
      const original = { name: 'John', age: 30 };
      const current = { name: 'John', age: 30 };
      const result = getChangedFields(original, current);
      expect(result).toEqual({});
    });

    it('should return only changed fields', () => {
      const original = { name: 'John', age: 30, city: 'Paris' };
      const current = { name: 'Jane', age: 30, city: 'Paris' };
      const result = getChangedFields(original, current);
      expect(result).toEqual({ name: 'Jane' });
    });

    it('should handle array changes', () => {
      const original = {
        name: 'John',
        hobbies: ['reading', 'swimming'],
        age: 30,
      };
      const current = {
        name: 'John',
        hobbies: ['reading', 'cooking'],
        age: 30,
      };
      const result = getChangedFields(original, current);
      expect(result).toEqual({ hobbies: ['reading', 'cooking'] });
    });

    it('should handle nested object changes', () => {
      const original = {
        name: 'John',
        address: { city: 'Paris', country: 'France' },
        age: 30,
      };
      const current = {
        name: 'John',
        address: { city: 'Lyon', country: 'France' },
        age: 30,
      };
      const result = getChangedFields(original, current);
      expect(result).toEqual({
        address: { city: 'Lyon', country: 'France' },
      });
    });
  });

  describe('hasChanges', () => {
    it('should return false when no changes', () => {
      const original = { name: 'John', age: 30 };
      const current = { name: 'John', age: 30 };
      expect(hasChanges(original, current)).toBe(false);
    });

    it('should return true when there are changes', () => {
      const original = { name: 'John', age: 30 };
      const current = { name: 'Jane', age: 30 };
      expect(hasChanges(original, current)).toBe(true);
    });
  });

  describe('getChangeSummary', () => {
    it('should return array of changed field names', () => {
      const original = { name: 'John', age: 30, city: 'Paris' };
      const current = { name: 'Jane', age: 30, city: 'Lyon' };
      const result = getChangeSummary(original, current);
      expect(result).toEqual(['name', 'city']);
    });

    it('should return empty array when no changes', () => {
      const original = { name: 'John', age: 30 };
      const current = { name: 'John', age: 30 };
      const result = getChangeSummary(original, current);
      expect(result).toEqual([]);
    });
  });
});
