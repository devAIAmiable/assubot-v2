import { describe, expect, it } from 'vitest';
import { formatDateForAPI, formatDateForDisplay, formatDateForInput } from './dateHelpers';

describe('dateHelpers', () => {
	describe('formatDateForAPI', () => {
		it('should format date string to ISO datetime', () => {
			const result = formatDateForAPI('2023-12-25');
			expect(result).toMatch(/^2023-12-25T00:00:00\.000Z$/);
		});

		it('should return undefined for empty string', () => {
			const result = formatDateForAPI('');
			expect(result).toBeUndefined();
		});

		it('should return undefined for undefined', () => {
			const result = formatDateForAPI(undefined);
			expect(result).toBeUndefined();
		});
	});

	describe('formatDateForInput', () => {
		it('should format ISO datetime to YYYY-MM-DD', () => {
			const result = formatDateForInput('2023-12-25T10:30:00.000Z');
			expect(result).toBe('2023-12-25');
		});

		it('should format date string to YYYY-MM-DD', () => {
			const result = formatDateForInput('2023-12-25');
			expect(result).toBe('2023-12-25');
		});

		it('should return empty string for empty string', () => {
			const result = formatDateForInput('');
			expect(result).toBe('');
		});

		it('should return empty string for undefined', () => {
			const result = formatDateForInput(undefined);
			expect(result).toBe('');
		});
	});

	describe('formatDateForDisplay', () => {
		it('should format date string to DD-MM-YYYY', () => {
			const result = formatDateForDisplay('2023-12-25');
			expect(result).toBe('25-12-2023');
		});

		it('should format ISO datetime to DD-MM-YYYY', () => {
			const result = formatDateForDisplay('2023-12-25T10:30:00.000Z');
			expect(result).toBe('25-12-2023');
		});

		it('should handle single digit day and month', () => {
			const result = formatDateForDisplay('2023-01-05');
			expect(result).toBe('05-01-2023');
		});

		it('should return empty string for empty string', () => {
			const result = formatDateForDisplay('');
			expect(result).toBe('');
		});

		it('should return empty string for undefined', () => {
			const result = formatDateForDisplay(undefined);
			expect(result).toBe('');
		});

		it('should return empty string for invalid date', () => {
			const result = formatDateForDisplay('invalid-date');
			expect(result).toBe('');
		});
	});
});
