import type { RequestStatus } from './types';
import { pushEvent } from './core';

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
