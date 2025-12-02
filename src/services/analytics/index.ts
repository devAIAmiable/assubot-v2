// Core exports
export { pushEvent, trackPageView } from './core';

// Type exports
export type {
  AccountMethod,
  RequestStatus,
  PaymentStatus,
  CreditBalanceStatus,
  CreditRefreshSource,
  CreditHistorySource,
  ComparateurStep,
  GuardType,
  ContractCreationMethod,
  SortOrder,
  GtmEventPayloads,
  GtmEventName,
  GtmEvent,
} from './types';

// Account tracking
export {
  trackAccountCreationSuccess,
  trackAccountCreationError,
  trackLoginSuccess,
  trackLoginError,
  trackForgotPasswordRequest,
  trackResetPasswordSubmit,
  trackAccountVerificationView,
  trackAccountVerificationResult,
  trackGuardRedirect,
} from './account';

// Profile tracking
export { trackProfilePersonalSaved, trackProfileAddressSaved, trackProfilePasswordChange, trackProfileAvatarUpload } from './profile';

// Credits tracking
export {
  trackCreditBalanceStatus,
  trackCreditHistoryView,
  trackCreditTransactionsRefresh,
  trackCreditPaymentError,
  trackCreditPackCheckout,
  trackCreditPackPurchase,
} from './credits';

// Comparateur tracking
export { trackComparateurStepChange, trackComparateurFormSubmit, trackComparateurResultsLoaded, trackComparateurFilterChange, trackComparateurAiQuestion } from './comparateur';

// Chat tracking
export {
  trackChatCreated,
  trackChatSelected,
  trackChatRenamed,
  trackChatDeleted,
  trackChatMessageSent,
  trackChatMessageError,
  trackChatQuickAction,
  trackChatSearch,
} from './chat';

// Contracts tracking
export { trackContractSearch, trackContractFilterChange, trackContractSortChange, trackContractCreateSubmit, trackContractEditSave, trackContractDelete } from './contracts';

// Navigation tracking
export { trackCtaClick, trackNavigationRedirect } from './navigation';
