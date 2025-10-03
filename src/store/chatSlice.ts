import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Chat, ChatFilters, ChatState, QuickAction } from '../types/chat';

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  quickActions: {}, // Initialize empty quick actions storage
};

// Note: Les thunks asynchrones sont maintenant gérés par RTK Query dans chatsApi.ts

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Actions synchrones
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },

    setFilters: (state, action: PayloadAction<Partial<ChatFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearError: (state) => {
      state.error = null;
    },

    clearCurrentChat: (state) => {
      state.currentChat = null;
    },

    // Mise à jour optimiste des chats
    updateChatInList: (state, action: PayloadAction<Chat>) => {
      // Vérifier que state.chats existe et est un tableau
      if (!state.chats || !Array.isArray(state.chats)) {
        state.chats = [];
      }
      const index = state.chats.findIndex((chat) => chat.id === action.payload.id);
      if (index !== -1) {
        state.chats[index] = action.payload;
      }
    },

    // Suppression optimiste d'un chat
    removeChatFromList: (state, action: PayloadAction<string>) => {
      // Vérifier que state.chats existe et est un tableau
      if (!state.chats || !Array.isArray(state.chats)) {
        state.chats = [];
        return;
      }
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
    },

    // Quick actions management
    setQuickActions: (state, action: PayloadAction<{ chatId: string; actions: QuickAction[] }>) => {
      const { chatId, actions } = action.payload;
      // Ensure quickActions is always an object
      if (!state.quickActions) {
        state.quickActions = {};
      }
      state.quickActions[chatId] = actions;
    },

    clearQuickActions: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      // Ensure quickActions is always an object
      if (!state.quickActions) {
        state.quickActions = {};
        return;
      }
      delete state.quickActions[chatId];
    },

    clearAllQuickActions: (state) => {
      state.quickActions = {};
    },

    // Optimistic message updates
    addOptimisticMessage: () => {
      // This will be handled by RTK Query cache updates
      // The optimistic message will be added to the cache
    },

    updateChatLastMessage: (state, action: PayloadAction<{ chatId: string; message: import('../types/chat').ChatMessage }>) => {
      const { chatId, message } = action.payload;
      if (state.currentChat && state.currentChat.id === chatId) {
        state.currentChat.lastMessage = {
          id: message.id,
          content: message.content,
          role: message.role,
          createdAt: message.createdAt,
        };
        state.currentChat.updatedAt = message.createdAt;
      }
    },
  },
  // Note: Les extraReducers sont maintenant gérés par RTK Query dans chatsApi.ts
});

export const {
  setCurrentChat,
  setFilters,
  clearError,
  clearCurrentChat,
  updateChatInList,
  removeChatFromList,
  setQuickActions,
  clearQuickActions,
  clearAllQuickActions,
  addOptimisticMessage,
  updateChatLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
