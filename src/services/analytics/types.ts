export type AccountMethod = 'email' | 'google';
export type RequestStatus = 'success' | 'error';
export type PaymentStatus = 'success' | 'error';
export type CreditBalanceStatus = 'low' | 'ok' | 'critical';
export type CreditRefreshSource = 'manual' | 'auto';
export type CreditHistorySource = 'button' | 'auto';
export type ComparateurStep = 'history' | 'type' | 'form' | 'loading' | 'results' | string;
export type GuardType = 'protected_route' | 'profile_completion' | 'terms_acceptance';
export type ContractCreationMethod = 'upload' | 'manual';
export type SortOrder = 'asc' | 'desc';

export type GtmEventPayloads = {
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
export type GtmEvent<K extends GtmEventName = GtmEventName> = { event: K } & GtmEventPayloads[K];
