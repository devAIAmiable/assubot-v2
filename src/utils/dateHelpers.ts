import 'dayjs/locale/fr';

import dayjs from 'dayjs';

// Set French as default locale
dayjs.locale('fr');

/**
 * Converts a date string to ISO datetime format for API requests
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns ISO datetime string or undefined if no date provided
 */
export const formatDateForAPI = (
	dateString: string | Date | undefined
): string | Date | undefined => {
	if (!dateString) return undefined;

	try {
		// Create a date object and set it to midnight UTC
		return dayjs(dateString + 'T00:00:00.000Z').toISOString();
	} catch (error) {
		console.error('Error formatting date for API:', error);
		return undefined;
	}
};

/**
 * Converts an ISO datetime string to date-only format for HTML date inputs
 * @param isoString - ISO datetime string from API
 * @returns Date string in YYYY-MM-DD format or empty string if invalid
 */
export const formatDateForInput = (isoString: string | Date | undefined): string => {
	if (!isoString) return '';

	try {
		return dayjs(isoString).format('YYYY-MM-DD');
	} catch (error) {
		console.error('Error formatting date for input:', error);
		return '';
	}
};

/**
 * Formats a date string to DD-MM-YYYY format for display
 * @param dateString - Date string in YYYY-MM-DD or ISO format
 * @returns Date string in DD-MM-YYYY format or empty string if invalid
 */
export const formatDateForDisplay = (dateString: string | undefined): string => {
	if (!dateString) return '';

	try {
		const date = dayjs(dateString);

		// Check if date is valid
		if (!date.isValid()) return '';

		return date.format('DD-MM-YYYY');
	} catch (error) {
		console.error('Error formatting date for display:', error);
		return '';
	}
};

/**
 * Formats a date string to French locale format for display
 * @param dateString - Date string in YYYY-MM-DD or ISO format
 * @returns Date string in French format or empty string if invalid
 */
export const formatDateForDisplayFR = (dateString: string | Date | undefined): string => {
	if (!dateString) return '';

	try {
		const date = dayjs(dateString);

		// Check if date is valid
		if (!date.isValid()) return '';

		return date.format('DD MMMM YYYY');
	} catch (error) {
		console.error('Error formatting date for display:', error);
		return '';
	}
};

/**
 * Formats a date string to French locale format with time for display
 * @param dateString - Date string in YYYY-MM-DD or ISO format
 * @returns Date string in French format with time or empty string if invalid
 */
export const formatDateTimeForDisplayFR = (dateString: string | Date | undefined): string => {
	if (!dateString) return '';

	try {
		const date = dayjs(dateString);

		// Check if date is valid
		if (!date.isValid()) return '';

		return date.format('DD MMMM YYYY à HH:mm');
	} catch (error) {
		console.error('Error formatting date for display:', error);
		return '';
	}
};

/**
 * Checks if a date is expired (in the past)
 * @param dateString - Date string to check
 * @returns true if date is expired, false otherwise
 */
export const isDateExpired = (dateString: string | Date | undefined): boolean => {
	if (!dateString) return false;

	try {
		const date = dayjs(dateString);
		return date.isValid() && date.isBefore(dayjs());
	} catch (error) {
		console.error('Error checking if date is expired:', error);
		return false;
	}
};

/**
 * Gets a placeholder value for null/undefined data
 * @param value - The value to check
 * @param placeholder - Custom placeholder (defaults to "-")
 * @returns The value if it exists, otherwise the placeholder
 */
export const getDisplayValue = (
	value: string | Date | number | null | undefined,
	placeholder: string = '-'
): string => {
	if (value === null || value === undefined || value === '') {
		return placeholder;
	}
	return String(value);
};
