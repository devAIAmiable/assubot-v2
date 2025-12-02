import { pushEvent } from './core';

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
