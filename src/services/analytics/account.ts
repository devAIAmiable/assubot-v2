import type { AccountMethod, GuardType, RequestStatus } from './types';

import { pushEvent } from './core';

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
