import type { CreditBalanceStatus, CreditHistorySource, CreditRefreshSource, PaymentStatus } from './types';

import { pushEvent } from './core';

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
