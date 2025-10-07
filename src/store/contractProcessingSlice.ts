import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ContractProcessingState {
  processingContractIds: string[]; // Array of contract IDs currently being processed
}

const initialState: ContractProcessingState = {
  processingContractIds: [],
};

const contractProcessingSlice = createSlice({
  name: 'contractProcessing',
  initialState,
  reducers: {
    startProcessing: (state, action: PayloadAction<string>) => {
      const contractId = action.payload;
      if (!state.processingContractIds.includes(contractId)) {
        state.processingContractIds.push(contractId);
      }
    },
    stopProcessing: (state, action: PayloadAction<string>) => {
      const contractId = action.payload;
      state.processingContractIds = state.processingContractIds.filter((id) => id !== contractId);
    },
    clearAllProcessing: (state) => {
      state.processingContractIds = [];
    },
  },
});

export const { startProcessing, stopProcessing, clearAllProcessing } = contractProcessingSlice.actions;

export default contractProcessingSlice.reducer;

// Selectors
export const selectIsContractProcessing = (state: { contractProcessing: ContractProcessingState }, contractId: string) =>
  state.contractProcessing.processingContractIds.includes(contractId);

export const selectProcessingContractIds = (state: { contractProcessing: ContractProcessingState }) => state.contractProcessing.processingContractIds;
