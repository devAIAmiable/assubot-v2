// Comparison system types matching the API guide

// API supports more categories but we're limiting to auto and home for Phase 1
export type ComparisonCategory = 'auto' | 'home';
export type FullComparisonCategory = 'auto' | 'home' | 'health' | 'life' | 'disability';

export type FormFieldType = 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'date' | 'textarea' | 'card' | 'slider' | 'autocomplete' | 'object';

export interface FormFieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string | Record<string, unknown>;
}

export interface FormFieldOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface FormFieldMask {
  pattern: string;
  placeholder: string;
  guide: boolean;
}

export interface FormFieldShortcut {
  value: string;
  label: string;
  description: string;
}

export interface FormFieldAutocomplete {
  endpoint: string;
  minLength: number;
  debounceMs: number;
}

export interface FormFieldShowWhen {
  field: string;
  equals?: string | number | boolean;
  in?: (string | number | boolean)[];
}

export interface FormField {
  name: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: FormFieldValidation;
  options?: FormFieldOption[];
  helperText?: string;
  showWhen?: FormFieldShowWhen;
  mask?: FormFieldMask;
  shortcuts?: FormFieldShortcut[];
  autocomplete?: FormFieldAutocomplete;
  subsection?: {
    id: string; // Subsection ID (e.g., 'vehicle_usage')
    label: string; // Display label (e.g., 'Usage du véhicule')
  };
  helpText?: string; // Detailed contextual help
  example?: string; // Inline example with usage guidance
  tooltip?: string; // Short tooltip text
}

export interface FormSection {
  title: string;
  fields: FormField[];
  subsections?: Array<{
    id: string;
    label: string;
    fieldCount?: number;
  }>; // Derived from fields' subsection property
}

export interface FormDefinition {
  category: ComparisonCategory;
  sections: FormSection[];
}

// Form data interfaces for different categories
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
  usage: 'personal' | 'commercial' | 'both';
  annualMileage: number;
}

export interface AutoCoverage {
  liability: number;
  collision: boolean;
  comprehensive: boolean;
  uninsuredMotorist: boolean;
  personalInjuryProtection: boolean;
}

export interface AutoPreferences {
  deductible: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
  preferredInsurer?: string;
}

export interface AutoFormData {
  category: 'auto';
  personalInfo: PersonalInfo;
  vehicleInfo: VehicleInfo;
  coverage: AutoCoverage;
  preferences: AutoPreferences;
}

export interface PropertyInfo {
  type: 'apartment' | 'house' | 'condo';
  status: 'owner' | 'renter';
  size: number;
  numberOfRooms: number;
  hasAlarm: boolean;
  securityLevel: 'basic' | 'advanced';
}

export interface HomeCoverage {
  dwelling: boolean;
  personalProperty: boolean;
  liability: boolean;
  additionalLivingExpenses: boolean;
}

export interface HomePreferences {
  deductible: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
  preferredInsurer?: string;
}

export interface HomeFormData {
  category: 'home';
  personalInfo: PersonalInfo;
  propertyInfo: PropertyInfo;
  coverage: HomeCoverage;
  preferences: HomePreferences;
}

export type ComparisonFormData = AutoFormData | HomeFormData;

// API request/response types
export interface ComparisonCalculationRequest {
  category: ComparisonCategory;
  formData: Record<string, unknown>;
  userContractId?: string;
  includeUserContract: boolean;
}

export interface ComparisonOffer {
  id: string;
  insurerName: string;
  offerTitle: string;
  annualPremium: number;
  rating: number;
  matchScore: number;
  keyFeatures: string[];
  description?: string;
  coverage?: Record<string, unknown>;
  exclusions?: string[];
  pros?: string[];
  cons?: string[];
}

export interface ComparisonCalculationResponse {
  sessionId: string;
  category: string;
  totalOffers: number;
  filteredOffers: number;
  offers: ComparisonOffer[];
  userContract?: ComparisonOffer;
  expiresAt: string;
  formData: ComparisonFormData;
}

// Type guards
export function isAutoFormData(data: ComparisonFormData): data is AutoFormData {
  return 'vehicleInfo' in data;
}

export function isHomeFormData(data: ComparisonFormData): data is HomeFormData {
  return 'propertyInfo' in data;
}

// Legacy compatibility types (for migration)
export interface LegacyComparisonOffer {
  id: string;
  insurer: string;
  price: { monthly: number; yearly: number };
  rating: number;
  coverages: { [key: string]: { included: boolean; value?: string } };
  pros: string[];
  cons: string[];
  score: number;
  recommended?: boolean;
  isCurrentContract?: boolean;
}

// Error types
export interface ComparisonError {
  code: string;
  message: string;
  details?: string;
}

export interface ComparisonApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ComparisonError;
}

// Additional types for Phase 2 and extended API functionality
export type ComparisonSessionStatus = 'active' | 'completed' | 'expired' | 'cancelled';

export interface ComparisonSession {
  id: string;
  userId: string;
  category: string;
  status: ComparisonSessionStatus;
  formData: ComparisonFormData;
  resultOfferIds: string[];
  userContractId?: string;
  includeUserContract: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComparisonSessionParams {
  category: ComparisonCategory;
  formData: ComparisonFormData;
  resultOfferIds: string[];
  userContractId?: string;
  includeUserContract: boolean;
}

export interface UpdateComparisonSessionParams {
  status?: ComparisonSessionStatus;
  resultOfferIds?: string[];
}

export interface ComparisonQuery {
  id: string;
  sessionId: string;
  question: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  creditsUsed?: number;
  createdAt: string;
  processedAt?: string;
  errorMessage?: string;
  result?: ComparisonQueryResult;
}

export interface ComparisonQueryResult {
  explanation: string;
  offerMatches: Array<{
    offerId: string;
    relevance: number;
    explanation: string;
  }>;
}

export interface CreateComparisonQueryParams {
  question: string;
}

export interface ComparisonSearchParams {
  category: ComparisonCategory;
  filters?: {
    priceRange?: [number, number];
    insurers?: string[];
    rating?: number;
    features?: string[];
  };
  limit?: number;
  offset?: number;
}

export interface ComparisonOfferDetails extends ComparisonOffer {
  fullDescription?: string;
  termsAndConditions?: string;
  exclusions?: string[];
  benefits?: string[];
  coverageDetails?: Record<string, unknown>;
  pricingDetails?: {
    basePremium: number;
    discounts?: Array<{ name: string; amount: number }>;
    fees?: Array<{ name: string; amount: number }>;
  };
}
