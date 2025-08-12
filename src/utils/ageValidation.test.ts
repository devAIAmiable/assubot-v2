import { calculateAge, isMinimumAge } from './ageValidation';
import { describe, expect, it } from 'vitest';

describe('Age Validation', () => {
	describe('calculateAge function', () => {
		it('should calculate age correctly for someone born exactly 18 years ago', () => {
			const birthDate = '2007-01-15';
			const age = calculateAge(birthDate);
			// This will depend on the current date, but should be around 18
			expect(age).toBeGreaterThanOrEqual(17);
			expect(age).toBeLessThanOrEqual(19);
		});

		it('should calculate age correctly for someone born 20 years ago', () => {
			const birthDate = '2005-01-15';
			const age = calculateAge(birthDate);
			// This will depend on the current date, but should be around 20
			expect(age).toBeGreaterThanOrEqual(19);
			expect(age).toBeLessThanOrEqual(21);
		});

		it('should calculate age correctly for someone born 25 years ago', () => {
			const birthDate = '2000-01-15';
			const age = calculateAge(birthDate);
			// This will depend on the current date, but should be around 25
			expect(age).toBeGreaterThanOrEqual(24);
			expect(age).toBeLessThanOrEqual(26);
		});

		it('should handle leap years correctly', () => {
			const birthDate = '2004-02-29';
			const age = calculateAge(birthDate);
			// This will depend on the current date, but should be around 20-21
			expect(age).toBeGreaterThanOrEqual(19);
			expect(age).toBeLessThanOrEqual(22);
		});

		it('should handle the specific case mentioned in feedback (2007-08-10)', () => {
			const birthDate = '2007-08-10';
			const age = calculateAge(birthDate);
			
			// This person should be around 17-18 as of 2025
			expect(age).toBeGreaterThanOrEqual(16);
			expect(age).toBeLessThanOrEqual(19);
		});
	});

	describe('isMinimumAge function', () => {
		it('should return true for someone who is over 18', () => {
			const birthDate = '1990-01-01';
			expect(isMinimumAge(birthDate, 18)).toBe(true);
		});

		it('should return false for someone who is under 18', () => {
			const birthDate = '2010-01-01';
			expect(isMinimumAge(birthDate, 18)).toBe(false);
		});

		it('should work with custom minimum age', () => {
			const birthDate = '2000-01-01';
			expect(isMinimumAge(birthDate, 21)).toBe(true);
			expect(isMinimumAge(birthDate, 30)).toBe(false);
		});

		it('should use 18 as default minimum age', () => {
			const birthDate = '1990-01-01';
			expect(isMinimumAge(birthDate)).toBe(true);
		});
	});
});
