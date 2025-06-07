import type { ChatMessage, ChatState, Contract, ContractsState, QuickReply, User, UserState } from '../types';

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
	return state.user || { 
		currentUser: null, 
		isAuthenticated: false, 
		loading: false, 
		error: null, 
		loginAttempts: 0 
	};
};

export const getContracts = (state: PersistedState): Contract[] => {
	return state.contracts?.contracts || [];
};

export const getContractsState = (state: PersistedState): ContractsState => {
	return state.contracts || {
		contracts: [],
		searchQuery: '',
		selectedType: 'all',
		selectedStatus: 'all',
		loading: false,
		error: null
	};
};

export const getChatSessions = (state: PersistedState) => {
	return state.chat?.sessions || [];
};

export const getCurrentChatSession = (state: PersistedState) => {
	const sessions = state.chat?.sessions || [];
	const currentSessionId = state.chat?.currentSessionId;
	return sessions.find(session => session.id === currentSessionId) || null;
};

export const getChatMessages = (state: PersistedState): ChatMessage[] => {
	const currentSession = getCurrentChatSession(state);
	return currentSession?.messages || [];
};

export const getChatIsTyping = (state: PersistedState): boolean => {
	return state.chat?.isTyping || false;
};

export const getChatQuickReplies = (state: PersistedState): QuickReply[] => {
	return state.chat?.quickReplies || [];
};

export const getSelectedContractIds = (state: PersistedState): string[] => {
	return state.chat?.selectedContractIds || [];
};

export const getChatSearchQuery = (state: PersistedState): string => {
	return state.chat?.searchQuery || '';
};

export const getChatSearchResults = (state: PersistedState): ChatMessage[] => {
	return state.chat?.searchResults || [];
};

export const getChatState = (state: PersistedState): ChatState => {
	return state.chat || {
		sessions: [],
		currentSessionId: null,
		selectedContractIds: [],
		isTyping: false,
		isConnected: true,
		quickReplies: [],
		error: null,
		searchQuery: '',
		searchResults: [],
	};
}; 