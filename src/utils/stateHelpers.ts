import type { ChatMessage, ChatState } from '../types/chat';
import type { Contract, ContractsState, User, UserState } from '../types';

// Type for the persisted state (with optional properties due to redux-persist)
type PersistedState = {
  user?: UserState;
  contracts?: ContractsState;
  chat?: ChatState;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
};

// Type-safe state accessors that handle redux-persist
export const getUser = (state: PersistedState): User | null => {
  return state.user?.currentUser || null;
};

export const getUserState = (state: PersistedState): UserState => {
  return (
    state.user || {
      currentUser: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      loginAttempts: 0,
    }
  );
};

export const getContracts = (state: PersistedState): Contract[] => {
  return state.contracts?.contracts || [];
};

export const getContractsState = (state: PersistedState): ContractsState => {
  return (
    state.contracts || {
      contracts: [],
      searchQuery: '',
      selectedType: 'all',
      selectedStatus: 'all',
      loading: false,
      error: null,
    }
  );
};

// Note: These functions are deprecated as they use the old ChatState structure
// The new ChatModule uses RTK Query and the new ChatState structure
export const getChatSessions = () => {
  return [];
};

export const getCurrentChatSession = () => {
  return null;
};

export const getChatMessages = (): ChatMessage[] => {
  return [];
};

export const getChatIsTyping = (): boolean => {
  return false;
};

export const getChatQuickReplies = () => {
  return [];
};

export const getSelectedContractIds = (): string[] => {
  return [];
};

export const getChatSearchQuery = (): string => {
  return '';
};

export const getChatSearchResults = (): ChatMessage[] => {
  return [];
};

export const getChatState = (state: PersistedState): ChatState => {
  return (
    state.chat || {
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
      quickActions: {},
    }
  );
};
