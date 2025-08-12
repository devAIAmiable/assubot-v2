import dayjs from 'dayjs';

/**
 * Calculate the exact age based on birth date
 * @param birthDate - Birth date in YYYY-MM-DD format
 * @returns The exact age in years
 */
export const calculateAge = (birthDate: string): number => {
	const today = dayjs();
	const birth = dayjs(birthDate);
	return today.diff(birth, 'year');
};

/**
 * Check if a person is at least the minimum required age
 * @param birthDate - Birth date in YYYY-MM-DD format
 * @param minimumAge - Minimum required age (default: 18)
 * @returns True if the person is at least the minimum age
 */
export const isMinimumAge = (birthDate: string, minimumAge: number = 18): boolean => {
	return calculateAge(birthDate) >= minimumAge;
};
