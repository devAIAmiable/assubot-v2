import config from '@/config/env';

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

const isBrowser = typeof window !== 'undefined';

const ensureDataLayer = () => {
  if (!isBrowser) {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }
};

export type AccountMethod = 'email' | 'google';
export type RequestStatus = 'success' | 'error';
export type PaymentStatus = 'success' | 'error';
export type CreditBalanceStatus = 'low' | 'ok' | 'critical';
export type CreditRefreshSource = 'manual' | 'auto';
export type CreditHistorySource = 'button' | 'auto';
export type ComparateurStep = 'history' | 'type' | 'form' | 'loading' | 'results' | string;
export type GuardType = 'protected_route' | 'profile_completion';
export type ContractCreationMethod = 'upload' | 'manual';
export type SortOrder = 'asc' | 'desc';

type GtmEventPayloads = {
  page_view: {
    page_path: string;
    page_title?: string;
  };
  account_creation_success: {
    method: AccountMethod;
    user_id?: string;
  };
  account_creation_error: {
    method: AccountMethod;
    error_message?: string;
  };
  login_success: {
    method: AccountMethod;
    user_id?: string;
  };
  login_error: {
    method: AccountMethod;
    error_message?: string;
  };
  forgot_password_request: {
    status: RequestStatus;
    error_message?: string;
  };
  reset_password_submit: {
    status: RequestStatus;
    error_message?: string;
  };
  account_verification_view: {
    token_present: boolean;
    source?: string;
  };
  account_verification_result: {
    status: RequestStatus;
    error_message?: string;
  };
  guard_redirect: {
    guard: GuardType;
    destination: string;
    reason?: string;
  };
  profile_personal_saved: {
    status: RequestStatus;
    error_message?: string;
  };
  profile_address_saved: {
    status: RequestStatus;
    error_message?: string;
  };
  profile_password_change: {
    status: RequestStatus;
    error_message?: string;
  };
  profile_avatar_upload: {
    status: RequestStatus;
    error_message?: string;
    file_size_kb?: number;
  };
  credit_balance_status: {
    balance: number;
    status: CreditBalanceStatus;
    threshold: number;
  };
  credit_history_view: {
    source: CreditHistorySource;
  };
  credit_transactions_refresh: {
    source: CreditRefreshSource;
  };
  credit_payment_error: {
    pack_id?: string;
    error_message?: string;
  };
  credit_pack_checkout: {
    pack_id: string;
    pack_name: string;
    credit_amount: number;
    price_eur: number;
  };
  credit_pack_purchase: {
    pack_id: string;
    pack_name: string;
    credit_amount: number;
    price_eur: number;
    payment_status: PaymentStatus;
  };
  comparateur_step_change: {
    from: ComparateurStep;
    to: ComparateurStep;
    category?: string | null;
  };
  comparateur_form_submit: {
    category?: string | null;
    status: RequestStatus;
    error_message?: string;
  };
  comparateur_results_loaded: {
    session_id: string;
    category?: string | null;
    offers_count: number;
  };
  comparateur_filter_change: {
    filter: string;
    value: string | number | boolean | Array<string | number>;
  };
  comparateur_ai_question: {
    session_id?: string;
    has_response: boolean;
  };
  chat_created: {
    chat_id: string;
    has_contracts: boolean;
    contracts_count: number;
  };
  chat_selected: {
    chat_id: string;
  };
  chat_renamed: {
    chat_id: string;
  };
  chat_deleted: {
    chat_id: string;
  };
  chat_message_sent: {
    chat_id: string;
    message_length: number;
  };
  chat_message_error: {
    chat_id?: string;
    error_message?: string;
  };
  chat_quick_action: {
    chat_id: string;
    action_label: string;
  };
  chat_search: {
    query_length: number;
  };
  contract_search: {
    query_length: number;
  };
  contract_filter_change: {
    filter: string;
    value: string;
  };
  contract_sort_change: {
    sort_by: string;
    sort_order: SortOrder;
  };
  contract_create_submit: {
    method: ContractCreationMethod;
    status: RequestStatus;
    error_message?: string;
  };
  contract_edit_save: {
    contract_id: string;
    status: RequestStatus;
    error_message?: string;
  };
  contract_delete: {
    contract_id: string;
    status: 'confirm' | 'cancel' | 'success';
  };
  cta_click: {
    label: string;
    location: string;
    destination?: string;
  };
  navigation_redirect: {
    from: string;
    to: string;
    reason?: string;
  };
};

export type GtmEventName = keyof GtmEventPayloads;
type GtmEvent<K extends GtmEventName = GtmEventName> = { event: K } & GtmEventPayloads[K];

export const pushEvent = <K extends GtmEventName>(event: GtmEvent<K>): boolean => {
  if (!config.enableAnalytics || !config.gtmContainerId || !isBrowser) {
    return false;
  }

  ensureDataLayer();

  window.dataLayer.push({
    ...event,
    app_environment: config.environment,
    app_version: config.appVersion,
  });

  return true;
};

export const trackPageView = (pagePath: string, pageTitle?: string): boolean => {
  return pushEvent({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle,
  });
};

export const trackAccountCreationSuccess = (params: { method: AccountMethod; userId?: string }) => {
  return pushEvent({
    event: 'account_creation_success',
    method: params.method,
    user_id: params.userId,
  });
};

export const trackAccountCreationError = (params: { method: AccountMethod; errorMessage?: string }) => {
  return pushEvent({
    event: 'account_creation_error',
    method: params.method,
    error_message: params.errorMessage,
  });
};

export const trackLoginSuccess = (params: { method: AccountMethod; userId?: string }) => {
  return pushEvent({
    event: 'login_success',
    method: params.method,
    user_id: params.userId,
  });
};

export const trackLoginError = (params: { method: AccountMethod; errorMessage?: string }) => {
  return pushEvent({
    event: 'login_error',
    method: params.method,
    error_message: params.errorMessage,
  });
};

export const trackForgotPasswordRequest = (params: { status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'forgot_password_request',
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackResetPasswordSubmit = (params: { status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'reset_password_submit',
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackAccountVerificationView = (params: { tokenPresent: boolean; source?: string }) => {
  return pushEvent({
    event: 'account_verification_view',
    token_present: params.tokenPresent,
    source: params.source,
  });
};

export const trackAccountVerificationResult = (params: { status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'account_verification_result',
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackGuardRedirect = (params: { guard: GuardType; destination: string; reason?: string }) => {
  return pushEvent({
    event: 'guard_redirect',
    guard: params.guard,
    destination: params.destination,
    reason: params.reason,
  });
};

export const trackProfilePersonalSaved = (params: { status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'profile_personal_saved',
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackProfileAddressSaved = (params: { status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'profile_address_saved',
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackProfilePasswordChange = (params: { status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'profile_password_change',
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackProfileAvatarUpload = (params: { status: RequestStatus; errorMessage?: string; fileSizeKb?: number }) => {
  return pushEvent({
    event: 'profile_avatar_upload',
    status: params.status,
    error_message: params.errorMessage,
    file_size_kb: params.fileSizeKb,
  });
};

export const trackCreditBalanceStatus = (params: { balance: number; status: CreditBalanceStatus; threshold: number }) => {
  return pushEvent({
    event: 'credit_balance_status',
    balance: params.balance,
    status: params.status,
    threshold: params.threshold,
  });
};

export const trackCreditHistoryView = (params: { source: CreditHistorySource }) => {
  return pushEvent({
    event: 'credit_history_view',
    source: params.source,
  });
};

export const trackCreditTransactionsRefresh = (params: { source: CreditRefreshSource }) => {
  return pushEvent({
    event: 'credit_transactions_refresh',
    source: params.source,
  });
};

export const trackCreditPaymentError = (params: { packId?: string; errorMessage?: string }) => {
  return pushEvent({
    event: 'credit_payment_error',
    pack_id: params.packId,
    error_message: params.errorMessage,
  });
};

export const trackCreditPackCheckout = (params: { packId: string; packName: string; creditAmount: number; priceEur: number }) => {
  return pushEvent({
    event: 'credit_pack_checkout',
    pack_id: params.packId,
    pack_name: params.packName,
    credit_amount: params.creditAmount,
    price_eur: params.priceEur,
  });
};

export const trackCreditPackPurchase = (params: { packId: string; packName: string; creditAmount: number; priceEur: number; paymentStatus: PaymentStatus }) => {
  return pushEvent({
    event: 'credit_pack_purchase',
    pack_id: params.packId,
    pack_name: params.packName,
    credit_amount: params.creditAmount,
    price_eur: params.priceEur,
    payment_status: params.paymentStatus,
  });
};

export const trackComparateurStepChange = (params: { from: ComparateurStep; to: ComparateurStep; category?: string | null }) => {
  return pushEvent({
    event: 'comparateur_step_change',
    from: params.from,
    to: params.to,
    category: params.category ?? undefined,
  });
};

export const trackComparateurFormSubmit = (params: { category?: string | null; status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'comparateur_form_submit',
    category: params.category ?? undefined,
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackComparateurResultsLoaded = (params: { sessionId: string; category?: string | null; offersCount: number }) => {
  return pushEvent({
    event: 'comparateur_results_loaded',
    session_id: params.sessionId,
    category: params.category ?? undefined,
    offers_count: params.offersCount,
  });
};

export const trackComparateurFilterChange = (params: { filter: string; value: string | number | boolean | Array<string | number> }) => {
  return pushEvent({
    event: 'comparateur_filter_change',
    filter: params.filter,
    value: params.value,
  });
};

export const trackComparateurAiQuestion = (params: { sessionId?: string; hasResponse: boolean }) => {
  return pushEvent({
    event: 'comparateur_ai_question',
    session_id: params.sessionId,
    has_response: params.hasResponse,
  });
};

export const trackChatCreated = (params: { chatId: string; hasContracts: boolean; contractsCount: number }) => {
  return pushEvent({
    event: 'chat_created',
    chat_id: params.chatId,
    has_contracts: params.hasContracts,
    contracts_count: params.contractsCount,
  });
};

export const trackChatSelected = (params: { chatId: string }) => {
  return pushEvent({
    event: 'chat_selected',
    chat_id: params.chatId,
  });
};

export const trackChatRenamed = (params: { chatId: string }) => {
  return pushEvent({
    event: 'chat_renamed',
    chat_id: params.chatId,
  });
};

export const trackChatDeleted = (params: { chatId: string }) => {
  return pushEvent({
    event: 'chat_deleted',
    chat_id: params.chatId,
  });
};

export const trackChatMessageSent = (params: { chatId: string; messageLength: number }) => {
  return pushEvent({
    event: 'chat_message_sent',
    chat_id: params.chatId,
    message_length: params.messageLength,
  });
};

export const trackChatMessageError = (params: { chatId?: string; errorMessage?: string }) => {
  return pushEvent({
    event: 'chat_message_error',
    chat_id: params.chatId,
    error_message: params.errorMessage,
  });
};

export const trackChatQuickAction = (params: { chatId: string; actionLabel: string }) => {
  return pushEvent({
    event: 'chat_quick_action',
    chat_id: params.chatId,
    action_label: params.actionLabel,
  });
};

export const trackChatSearch = (params: { queryLength: number }) => {
  return pushEvent({
    event: 'chat_search',
    query_length: params.queryLength,
  });
};

export const trackContractSearch = (params: { queryLength: number }) => {
  return pushEvent({
    event: 'contract_search',
    query_length: params.queryLength,
  });
};

export const trackContractFilterChange = (params: { filter: string; value: string }) => {
  return pushEvent({
    event: 'contract_filter_change',
    filter: params.filter,
    value: params.value,
  });
};

export const trackContractSortChange = (params: { sortBy: string; sortOrder: SortOrder }) => {
  return pushEvent({
    event: 'contract_sort_change',
    sort_by: params.sortBy,
    sort_order: params.sortOrder,
  });
};

export const trackContractCreateSubmit = (params: { method: ContractCreationMethod; status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'contract_create_submit',
    method: params.method,
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackContractEditSave = (params: { contractId: string; status: RequestStatus; errorMessage?: string }) => {
  return pushEvent({
    event: 'contract_edit_save',
    contract_id: params.contractId,
    status: params.status,
    error_message: params.errorMessage,
  });
};

export const trackContractDelete = (params: { contractId: string; status: 'confirm' | 'cancel' | 'success' }) => {
  return pushEvent({
    event: 'contract_delete',
    contract_id: params.contractId,
    status: params.status,
  });
};

export const trackCtaClick = (params: { label: string; location: string; destination?: string }) => {
  return pushEvent({
    event: 'cta_click',
    label: params.label,
    location: params.location,
    destination: params.destination,
  });
};

export const trackNavigationRedirect = (params: { from: string; to: string; reason?: string }) => {
  return pushEvent({
    event: 'navigation_redirect',
    from: params.from,
    to: params.to,
    reason: params.reason,
  });
};
