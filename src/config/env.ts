interface AppConfig {
	// Core API URLs
	coreApiUrl: string;

	// AI API URLs
	aiApiUrl: string;

	// App Configuration
	appName: string;
	appVersion: string;

	// Feature Flags
	enableAnalytics: boolean;
	enableDebugMode: boolean;

	// Timeouts
	apiTimeout: number;
	sessionTimeout: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
	const value = import.meta.env[key];
	if (value === undefined && defaultValue === undefined) {
		console.warn(`Environment variable ${key} is not defined`);
	}
	return value || defaultValue || '';
};

const getEnvVarAsNumber = (key: string, defaultValue: number): number => {
	const value = getEnvVar(key);
	const parsed = parseInt(value, 10);
	return isNaN(parsed) ? defaultValue : parsed;
};

const getEnvVarAsBoolean = (key: string, defaultValue: boolean): boolean => {
	const value = getEnvVar(key);
	if (value === '') return defaultValue;
	return value.toLowerCase() === 'true';
};

export const config: AppConfig = {
	// Core API URLs
	coreApiUrl: getEnvVar('VITE_CORE_API_URL', 'http://localhost:3000/api/v1'),

	// AI API URLs
	aiApiUrl: getEnvVar('VITE_AI_API_URL', 'http://localhost:3001/api/v1'),

	// App Configuration
	appName: getEnvVar('VITE_APP_NAME', 'AssuBot'),
	appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),

	// Feature Flags
	enableAnalytics: getEnvVarAsBoolean('VITE_ENABLE_ANALYTICS', false),
	enableDebugMode: getEnvVarAsBoolean('VITE_ENABLE_DEBUG_MODE', false),

	// Timeouts
	apiTimeout: getEnvVarAsNumber('VITE_API_TIMEOUT', 10000),
	sessionTimeout: getEnvVarAsNumber('VITE_SESSION_TIMEOUT', 3600000),
};

export default config;
