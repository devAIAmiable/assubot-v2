import config from '../config/env';
import { handleUnauthorizedLogout } from '../utils/authHelpers';
import { isAuthEndpoint } from '../utils/authEndpoints';

interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  status: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T | null;
  error?: string;
}

class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.config.headers,
          ...options.headers,
        },
        credentials: 'include', // Include cookies
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized errors on non-auth endpoints
      if (response.status === 401 && !isAuthEndpoint(endpoint)) {
        handleUnauthorizedLogout();
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          status: 'error',
          error: {
            code: response.status.toString(),
            message: data.error?.message || `HTTP ${response.status}`,
          },
        };
      }

      return {
        success: true,
        status: data.status,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            status: 'error',
            error: {
              code: 'TIMEOUT',
              message: "Délai d'attente dépassé",
            },
          };
        }
      }

      return {
        success: false,
        status: 'error',
        error: {
          code: 'NETWORK_ERROR',
          message: 'Erreur de connexion réseau',
        },
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }
}

// Core API instances
export const coreApi = new ApiClient({
  baseURL: config.coreApiUrl,
  timeout: config.apiTimeout,
});

// AI API instances
export const aiApi = new ApiClient({
  baseURL: config.aiApiUrl,
  timeout: config.apiTimeout,
});

// Export the base ApiClient class for custom instances
export { ApiClient };
export type { ApiConfig, ApiResponse };
