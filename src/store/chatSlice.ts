import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Chat, ChatFilters, ChatState } from '../types/chat';

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
} = chatSlice.actions;

export default chatSlice.reducer;
