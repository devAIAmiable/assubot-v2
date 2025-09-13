export interface Chat {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	contractIds: string[];
	isDeleted: boolean;
	userId: string;
	messages?: ChatMessage[];
	contracts?: Contract[];
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
	title: string;
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
