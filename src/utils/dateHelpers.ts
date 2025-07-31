/**
 * Converts a date string to ISO datetime format for API requests
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns ISO datetime string or undefined if no date provided
 */
export const formatDateForAPI = (dateString: string | undefined): string | undefined => {
	if (!dateString) return undefined;

	try {
		// Create a date object and set it to midnight UTC
		const date = new Date(dateString + 'T00:00:00.000Z');
		return date.toISOString();
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
export const formatDateForInput = (isoString: string | undefined): string => {
	if (!isoString) return '';

	try {
		const date = new Date(isoString);
		return date.toISOString().split('T')[0];
	} catch (error) {
		console.error('Error formatting date for input:', error);
		return '';
	}
};
