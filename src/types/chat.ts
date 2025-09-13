export interface Chat {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	contractIds: string[];
	isDeleted: boolean;
	userId: string;
	contracts?: Contract[];
	lastMessage?: {
		id: string;
		content: string;
		role: 'user' | 'assistant';
		createdAt: string;
	};
}

export interface ChatMessage {
	id: string;
	chatId: string;
	content: string;
	role: 'user' | 'assistant';
	createdAt: string;
	updatedAt: string;
	metadata?: Record<string, unknown>;
}

export interface Contract {
	id: string;
	name: string;
	category: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateChatRequest {
	title?: string;
	contractIds?: string[];
}

export interface UpdateChatRequest {
	title?: string;
}

export interface SendMessageRequest {
	content: string;
	role: 'user' | 'assistant';
}

export interface SendMessageResponse {
	message: ChatMessage;
	chat: Chat;
}

export interface PaginatedChatResponse {
	chats: Chat[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

export interface ChatFilters {
	page?: number;
	limit?: number;
	sortBy?: 'createdAt' | 'updatedAt' | 'title';
	sortOrder?: 'asc' | 'desc';
	search?: string;
}

export interface MessageFilters {
	page?: number;
	limit?: number;
	sortBy?: 'createdAt';
	sortOrder?: 'asc' | 'desc';
}

export interface PaginatedMessageResponse {
	messages: ChatMessage[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

export interface ChatState {
	chats: Chat[];
	currentChat: Chat | null;
	loading: boolean;
	error: string | null;
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	} | null;
	filters: ChatFilters;
}
