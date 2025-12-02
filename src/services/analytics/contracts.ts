import type { ContractCreationMethod, RequestStatus, SortOrder } from './types';
import { pushEvent } from './core';

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
