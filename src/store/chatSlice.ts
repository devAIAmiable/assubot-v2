import type { ChatMessage, ChatSession, ChatState, QuickReply } from '../types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import chatService from '../utils/chatService';

// Generate unique ID for messages and sessions
const generateId = (): string => {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate session title from first user message
const generateSessionTitle = (firstMessage: string): string => {
	const words = firstMessage.split(' ').slice(0, 6);
	return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
};

// Async thunks for chat actions
export const sendMessage = createAsyncThunk(
	'chat/sendMessage',
	async ({ message, payload, contractIds }: { 
		message: string; 
		payload?: string; 
		contractIds?: string[] 
	}) => {
		const response = await chatService.sendMessage(message, payload, contractIds);
		return response;
	}
);

export const initializeChat = createAsyncThunk(
	'chat/initializeChat',
	async () => {
		const greeting = await chatService.getGreeting();
		return greeting;
	}
);

// Initial state
const initialState: ChatState = {
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

// Chat slice
const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		// Session management
		createNewSession: (state, action: PayloadAction<{ title?: string } | undefined>) => {
			const sessionId = generateId();
			const customTitle = action.payload?.title;
			const newSession: ChatSession = {
				id: sessionId,
				title: customTitle || 'Nouvelle conversation',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				messages: [],
				selectedContractIds: [...state.selectedContractIds],
				messageCount: 0,
			};
			
			state.sessions.unshift(newSession);
			state.currentSessionId = sessionId;
			state.quickReplies = [];
		},
		
		switchSession: (state, action: PayloadAction<string>) => {
			const sessionId = action.payload;
			const session = state.sessions.find(s => s.id === sessionId);
			if (session) {
				state.currentSessionId = sessionId;
				state.selectedContractIds = [...session.selectedContractIds];
				state.quickReplies = [];
			}
		},
		
		deleteSession: (state, action: PayloadAction<string>) => {
			const sessionId = action.payload;
			state.sessions = state.sessions.filter(s => s.id !== sessionId);
			
			// If deleting current session, switch to most recent or create new
			if (state.currentSessionId === sessionId) {
				if (state.sessions.length > 0) {
					state.currentSessionId = state.sessions[0].id;
					state.selectedContractIds = [...state.sessions[0].selectedContractIds];
				} else {
					state.currentSessionId = null;
					state.selectedContractIds = [];
				}
			}
		},
		
		// Contract selection
		toggleContractSelection: (state, action: PayloadAction<string>) => {
			const contractId = action.payload;
			const index = state.selectedContractIds.indexOf(contractId);
			
			if (index === -1) {
				state.selectedContractIds.push(contractId);
			} else {
				state.selectedContractIds.splice(index, 1);
			}
			
			// Update current session's selected contracts
			const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
			if (currentSession) {
				currentSession.selectedContractIds = [...state.selectedContractIds];
			}
		},
		
		setSelectedContracts: (state, action: PayloadAction<string[]>) => {
			state.selectedContractIds = action.payload;
			
			// Update current session's selected contracts
			const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
			if (currentSession) {
				currentSession.selectedContractIds = [...action.payload];
			}
		},
		
		clearContractSelection: (state) => {
			state.selectedContractIds = [];
			
			// Update current session's selected contracts
			const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
			if (currentSession) {
				currentSession.selectedContractIds = [];
			}
		},
		
		// Message management
		addUserMessage: (state, action: PayloadAction<string>) => {
			const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
			if (!currentSession) return;
			
			const userMessage: ChatMessage = {
				id: generateId(),
				content: action.payload,
				sender: 'user',
				timestamp: new Date().toISOString(),
				contractIds: state.selectedContractIds.length > 0 ? [...state.selectedContractIds] : undefined,
			};
			
			currentSession.messages.push(userMessage);
			currentSession.messageCount++;
			currentSession.updatedAt = new Date().toISOString();
			
			// Update session title if it's the first user message
			if (currentSession.title === 'Nouvelle conversation' && currentSession.messages.filter(m => m.sender === 'user').length === 1) {
				currentSession.title = generateSessionTitle(action.payload);
			}
			
			state.quickReplies = []; // Clear quick replies when user sends a message
		},
		
		addBotMessage: (state, action: PayloadAction<{ content: string; quickReplies?: QuickReply[] }>) => {
			const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
			if (!currentSession) return;
			
			const botMessage: ChatMessage = {
				id: generateId(),
				content: action.payload.content,
				sender: 'bot',
				timestamp: new Date().toISOString(),
				contractIds: state.selectedContractIds.length > 0 ? [...state.selectedContractIds] : undefined,
			};
			
			currentSession.messages.push(botMessage);
			currentSession.messageCount++;
			currentSession.updatedAt = new Date().toISOString();
			state.quickReplies = action.payload.quickReplies || [];
		},
		
		// Search functionality
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
			
			if (action.payload.trim() === '') {
				state.searchResults = [];
				return;
			}
			
			// Search across all messages in all sessions
			const query = action.payload.toLowerCase();
			const results: ChatMessage[] = [];
			
			state.sessions.forEach(session => {
				session.messages.forEach(message => {
					if (message.content.toLowerCase().includes(query)) {
						results.push({
							...message,
							// Add session info for context
							content: `[${session.title}] ${message.content}`,
						});
					}
				});
			});
			
			state.searchResults = results.slice(0, 50); // Limit to 50 results
		},
		
		clearSearch: (state) => {
			state.searchQuery = '';
			state.searchResults = [];
		},
		
		// Utility actions
		setTyping: (state, action: PayloadAction<boolean>) => {
			state.isTyping = action.payload;
		},
		
		setConnected: (state, action: PayloadAction<boolean>) => {
			state.isConnected = action.payload;
		},
		
		clearError: (state) => {
			state.error = null;
		},
		
		setQuickReplies: (state, action: PayloadAction<QuickReply[]>) => {
			state.quickReplies = action.payload;
		},

		// Update session title
		updateSessionTitle: (state, action: PayloadAction<{ sessionId: string; title: string }>) => {
			const session = state.sessions.find(s => s.id === action.payload.sessionId);
			if (session) {
				session.title = action.payload.title;
				session.updatedAt = new Date().toISOString();
			}
		},
	},
	extraReducers: (builder) => {
		builder
			// Initialize chat
			.addCase(initializeChat.pending, (state) => {
				state.isTyping = true;
				state.error = null;
			})
			.addCase(initializeChat.fulfilled, (state, action) => {
				state.isTyping = false;
				
				// Create new session if none exists
				let currentSession = state.sessions.find(s => s.id === state.currentSessionId);
				if (!currentSession) {
					const sessionId = generateId();
					currentSession = {
						id: sessionId,
						title: 'Conversation avec AssuBot',
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						messages: [],
						selectedContractIds: [],
						messageCount: 0,
					};
					state.sessions.unshift(currentSession);
					state.currentSessionId = sessionId;
				}
				
				const botMessage: ChatMessage = {
					id: generateId(),
					content: action.payload.message,
					sender: 'bot',
					timestamp: new Date().toISOString(),
				};
				
				currentSession.messages.push(botMessage);
				currentSession.messageCount++;
				currentSession.updatedAt = new Date().toISOString();
				state.quickReplies = action.payload.quickReplies || [];
			})
			.addCase(initializeChat.rejected, (state, action) => {
				state.isTyping = false;
				state.error = action.error.message || 'Erreur lors de l\'initialisation du chat';
			})
			
			// Send message
			.addCase(sendMessage.pending, (state) => {
				state.isTyping = true;
				state.error = null;
			})
			.addCase(sendMessage.fulfilled, (state, action) => {
				state.isTyping = false;
				
				const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
				if (!currentSession) return;
				
				const botMessage: ChatMessage = {
					id: generateId(),
					content: action.payload.message,
					sender: 'bot',
					timestamp: new Date().toISOString(),
					contractIds: state.selectedContractIds.length > 0 ? [...state.selectedContractIds] : undefined,
				};
				
				currentSession.messages.push(botMessage);
				currentSession.messageCount++;
				currentSession.updatedAt = new Date().toISOString();
				state.quickReplies = action.payload.quickReplies || [];
			})
			.addCase(sendMessage.rejected, (state, action) => {
				state.isTyping = false;
				state.error = action.error.message || 'Erreur lors de l\'envoi du message';
			});
	},
});

export const {
	createNewSession,
	switchSession,
	deleteSession,
	toggleContractSelection,
	setSelectedContracts,
	clearContractSelection,
	addUserMessage,
	addBotMessage,
	setSearchQuery,
	clearSearch,
	setTyping,
	setConnected,
	clearError,
	setQuickReplies,
	updateSessionTitle,
} = chatSlice.actions;

export default chatSlice.reducer; 