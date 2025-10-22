import { useLazyGetInsurersQuery } from '../store/insurersApi';

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface AutocompleteResult {
  options: AutocompleteOption[];
  isLoading: boolean;
  error?: string;
}

/**
 * Hook for insurer autocomplete using RTK Query
 */
export const useInsurerAutocomplete = () => {
  const [trigger, result] = useLazyGetInsurersQuery();

  const searchInsurers = async (query: string): Promise<AutocompleteResult> => {
    if (!query || query.length < 2) {
      return { options: [], isLoading: false };
    }

    try {
      const response = await trigger({
        search: query,
        limit: 10,
        isActive: true,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      if (response.data?.data) {
        const options: AutocompleteOption[] = response.data.data.map((insurer) => ({
          value: insurer.id,
          label: insurer.name,
          description: insurer.code,
          icon: insurer.logoUrl ? '🏢' : undefined,
        }));

        return {
          options,
          isLoading: false,
        };
      }

      return { options: [], isLoading: false };
    } catch (error) {
      console.error('Insurer autocomplete error:', error);
      return {
        options: [],
        isLoading: false,
        error: 'Erreur lors de la recherche',
      };
    }
  };

  return {
    searchInsurers,
    isLoading: result.isLoading,
    error: result.error,
  };
};

/**
 * Generic autocomplete service that can be extended for other endpoints
 */
export class AutocompleteService {
  /**
   * Get the appropriate search function based on endpoint
   */
  static getSearchFunction(endpoint: string) {
    switch (endpoint) {
      case '/insurers':
        return useInsurerAutocomplete;
      // Add more endpoints here as needed
      // case '/cities':
      //   return useCityAutocomplete;
      default:
        console.warn(`Unknown autocomplete endpoint: ${endpoint}`);
        return null;
    }
  }

  /**
   * Generic search function that can be extended
   */
  static async searchGeneric(endpoint: string, query: string, minLength: number = 2): Promise<AutocompleteResult> {
    if (!query || query.length < minLength) {
      return { options: [], isLoading: false };
    }

    // For now, only support insurer search
    if (endpoint === '/insurers') {
      // Use the hook in a function component instead
      console.warn('Use useInsurerAutocomplete hook directly in React components');
      return { options: [], isLoading: false };
    }

    // Placeholder for future endpoints
    console.warn(`Generic search not implemented for endpoint: ${endpoint}`);
    return { options: [], isLoading: false };
  }
}
