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

/**
 * Formats a date string to DD-MM-YYYY format for display
 * @param dateString - Date string in YYYY-MM-DD or ISO format
 * @returns Date string in DD-MM-YYYY format or empty string if invalid
 */
export const formatDateForDisplay = (dateString: string | undefined): string => {
	if (!dateString) return '';

	try {
		const date = new Date(dateString);
		
		// Check if date is valid
		if (isNaN(date.getTime())) return '';
		
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		
		return `${day}-${month}-${year}`;
	} catch (error) {
		console.error('Error formatting date for display:', error);
		return '';
	}
};
