import type { BackendContractGuarantee } from '../types/contract';

export interface GuaranteeStats {
  totalCoverages: number;
  totalExclusions: number;
  totalItems: number;
  coveragePercentage: number;
  servicesCount: number;
  hasFinancialInfo: boolean;
}

export interface ServiceStats {
  serviceName: string;
  coveredCount: number;
  excludedCount: number;
  totalCount: number;
  hasFinancialInfo: boolean;
  financialSummary: {
    limit?: string;
    deductible?: string;
    franchise?: string;
    limitation?: string;
  };
}

export interface FinancialSummary {
  hasGeneralDeductible: boolean;
  hasGeneralLimitation: boolean;
  generalDeductible?: string;
  generalLimitation?: string;
  servicesWithFinancials: number;
  totalServices: number;
}

/**
 * Calculate comprehensive statistics for a guarantee
 */
export function calculateGuaranteeStats(guarantee: BackendContractGuarantee): GuaranteeStats {
  const totalCoverages =
    guarantee.details?.reduce((total, detail) => {
      return total + (detail.coverages?.filter((c) => c.type === 'covered').length || 0);
    }, 0) || 0;

  const totalExclusions =
    guarantee.details?.reduce((total, detail) => {
      return total + (detail.coverages?.filter((c) => c.type === 'not_covered').length || 0);
    }, 0) || 0;

  const totalItems = totalCoverages + totalExclusions;
  const coveragePercentage = totalItems > 0 ? Math.round((totalCoverages / totalItems) * 100) : 0;
  const servicesCount = guarantee.details?.length || 0;
  const hasFinancialInfo = Boolean(
    guarantee.deductible ||
      guarantee.limitation ||
      guarantee.details?.some((detail) => detail.limit || detail.plafond || detail.franchise || detail.deductible || detail.limitation)
  );

  return {
    totalCoverages,
    totalExclusions,
    totalItems,
    coveragePercentage,
    servicesCount,
    hasFinancialInfo,
  };
}

/**
 * Calculate statistics for each service within a guarantee
 */
export function calculateServiceStats(guarantee: BackendContractGuarantee): ServiceStats[] {
  if (!guarantee.details) return [];

  return guarantee.details.map((detail) => {
    const coveredCount = detail.coverages?.filter((c) => c.type === 'covered').length || 0;
    const excludedCount = detail.coverages?.filter((c) => c.type === 'not_covered').length || 0;
    const totalCount = coveredCount + excludedCount;
    const hasFinancialInfo = !!(detail.limit || detail.plafond || detail.franchise || detail.deductible || detail.limitation);

    return {
      serviceName: detail.service || 'Service non nommé',
      coveredCount,
      excludedCount,
      totalCount,
      hasFinancialInfo,
      financialSummary: {
        limit: detail.limit,
        deductible: detail.deductible,
        franchise: detail.franchise,
        limitation: detail.limitation,
      },
    };
  });
}

/**
 * Calculate financial summary for the guarantee
 */
export function calculateFinancialSummary(guarantee: BackendContractGuarantee): FinancialSummary {
  const hasGeneralDeductible = !!guarantee.deductible;
  const hasGeneralLimitation = !!guarantee.limitation;
  const servicesWithFinancials = guarantee.details?.filter((detail) => detail.limit || detail.plafond || detail.franchise || detail.deductible || detail.limitation).length || 0;
  const totalServices = guarantee.details?.length || 0;

  return {
    hasGeneralDeductible,
    hasGeneralLimitation,
    generalDeductible: guarantee.deductible || undefined,
    generalLimitation: guarantee.limitation || undefined,
    servicesWithFinancials,
    totalServices,
  };
}

/**
 * Get highlight points for the guarantee
 */
export function getGuaranteeHighlights(guarantee: BackendContractGuarantee): string[] {
  const highlights: string[] = [];
  const stats = calculateGuaranteeStats(guarantee);
  const financial = calculateFinancialSummary(guarantee);

  // Coverage highlights
  if (stats.coveragePercentage >= 80) {
    highlights.push('Couverture étendue');
  } else if (stats.coveragePercentage >= 60) {
    highlights.push('Couverture standard');
  }

  // Financial highlights
  if (financial.hasGeneralDeductible && guarantee.deductible === 'Sans franchise') {
    highlights.push('Sans franchise');
  }

  if (financial.hasGeneralLimitation && guarantee.limitation?.includes('illimité')) {
    highlights.push('Plafond illimité');
  }

  // Service diversity
  if (stats.servicesCount >= 5) {
    highlights.push('Multi-services');
  }

  // High coverage ratio
  if (stats.coveragePercentage >= 70) {
    highlights.push('Excellent ratio couverture');
  }

  return highlights;
}

/**
 * Format financial values for display
 */
export function formatFinancialValue(value: string | undefined): string {
  if (!value) return '-';

  // Handle common patterns
  if (value.toLowerCase().includes('sans franchise')) return 'Sans franchise';
  if (value.toLowerCase().includes('illimité')) return 'Illimité';
  if (value.includes('€')) return value;

  return value;
}

/**
 * Check if a financial value is high/medium/low risk
 */
export function getFinancialRiskLevel(value: string | undefined): 'low' | 'medium' | 'high' | 'none' {
  if (!value) return 'none';

  const lowerValue = value.toLowerCase();

  if (lowerValue.includes('sans franchise') || lowerValue.includes('illimité')) {
    return 'low';
  }

  if (lowerValue.includes('€')) {
    const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
    if (numericValue >= 1000) return 'high';
    if (numericValue >= 200) return 'medium';
    return 'low';
  }

  return 'medium';
}
