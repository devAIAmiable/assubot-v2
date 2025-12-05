interface AppConfig {
  // Core API URLs
  coreApiUrl: string;

  // AI API URLs
  aiApiUrl: string;

  // App Configuration
  appName: string;
  appVersion: string;
  environment: string;

  // Feature Flags
  enableAnalytics: boolean;
  enableDebugMode: boolean;
  gtmContainerId: string;
  umamiScriptUrl: string;
  umamiApiUrl: string;
  umamiWebsiteId: string;
  enableComparateur: boolean;

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

const appEnvironment = getEnvVar('VITE_APP_ENV', 'local');
const isProductionEnvironment = appEnvironment === 'production';

/**
 * Derives Umami API URL from script URL by removing /script.js suffix
 * Falls back to http://localhost:3000 if script URL is not set
 */
const getUmamiApiUrl = (): string => {
  const scriptUrl = getEnvVar('VITE_UMAMI_SCRIPT_URL', '');
  if (!scriptUrl) {
    return 'http://localhost:3000';
  }

  // Remove /script.js suffix if present
  if (scriptUrl.endsWith('/script.js')) {
    return scriptUrl.replace('/script.js', '');
  }

  // Remove trailing slash if present
  const baseUrl = scriptUrl.replace(/\/$/, '');

  // Extract base URL (protocol + host + port)
  try {
    const url = new URL(baseUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    // If URL parsing fails, try to extract base by removing /script.js or last path segment
    return baseUrl.split('/').slice(0, -1).join('/') || 'http://localhost:3000';
  }
};

export const config: AppConfig = {
  // Core API URLs
  coreApiUrl: getEnvVar('VITE_CORE_API_URL', 'http://localhost:3000/api/v1'),

  // AI API URLs
  aiApiUrl: getEnvVar('VITE_AI_API_URL', 'http://localhost:3001/api/v1'),

  // App Configuration
  appName: getEnvVar('VITE_APP_NAME', 'AssuBot'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  environment: appEnvironment,

  // Feature Flags
  enableAnalytics: getEnvVarAsBoolean('VITE_ENABLE_ANALYTICS', false),
  enableDebugMode: getEnvVarAsBoolean('VITE_ENABLE_DEBUG_MODE', false),
  gtmContainerId: getEnvVar('VITE_GTM_CONTAINER_ID', ''),
  umamiScriptUrl: getEnvVar('VITE_UMAMI_SCRIPT_URL', ''),
  umamiApiUrl: getUmamiApiUrl(),
  umamiWebsiteId: getEnvVar('VITE_UMAMI_WEBSITE_ID', ''),
  enableComparateur: !isProductionEnvironment && getEnvVarAsBoolean('VITE_ENABLE_COMPARATEUR', true),

  // Timeouts
  apiTimeout: getEnvVarAsNumber('VITE_API_TIMEOUT', 10000),
  sessionTimeout: getEnvVarAsNumber('VITE_SESSION_TIMEOUT', 3600000),
};

export default config;
