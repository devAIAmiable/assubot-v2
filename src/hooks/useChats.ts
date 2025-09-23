import type { Chat, ChatFilters, CreateChatRequest, CreateChatResponse, QuickAction, UpdateChatRequest } from '../types/chat';
import {
	clearCurrentChat,
	clearError,
	clearQuickActions,
	removeChatFromList,
	setCurrentChat,
	setFilters,
	setQuickActions,
	updateChatInList,
} from '../store/chatSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
	useCreateChatMutation,
	useDeleteChatMutation,
	useUpdateChatMutation,
} from '../store/chatsApi';

import { useCallback } from 'react';

export const useChats = () => {
	const dispatch = useAppDispatch();
	const { currentChat, filters, quickActions } = useAppSelector((state) => state.chat);

	// RTK Query hooks
	const [createChatMutation, { isLoading: createLoading, error: createError }] =
		useCreateChatMutation();
	const [updateChatMutation, { isLoading: updateLoading, error: updateError }] =
		useUpdateChatMutation();
	const [deleteChatMutation, { isLoading: deleteLoading, error: deleteError }] =
		useDeleteChatMutation();

	// Actions
	const createNewChat = useCallback(
		async (data: CreateChatRequest): Promise<CreateChatResponse> => {
			const result = await createChatMutation(data).unwrap();
			// The API returns CreateChatResponse with chat and actions
			dispatch(setCurrentChat(result.chat));
			
			// Store quick actions if provided
			if (result.actions && Array.isArray(result.actions)) {
				dispatch(setQuickActions({ chatId: result.chat.id, actions: result.actions }));
			}
			
			return result;
		},
		[createChatMutation, dispatch]
	);

	const updateChatById = useCallback(
		async (id: string, data: UpdateChatRequest) => {
			const result = await updateChatMutation({ id, data }).unwrap();
			dispatch(updateChatInList(result));
			if (currentChat?.id === id) {
				dispatch(setCurrentChat(result));
			}
			return result;
		},
		[updateChatMutation, dispatch, currentChat]
	);

	const deleteChatById = useCallback(
		async (id: string) => {
			const result = await deleteChatMutation(id).unwrap();
			dispatch(removeChatFromList(id));
			if (currentChat?.id === id) {
				dispatch(clearCurrentChat());
			}
			return result;
		},
		[deleteChatMutation, dispatch, currentChat]
	);

	const selectChat = useCallback(
		(chat: Chat | null) => {
			dispatch(setCurrentChat(chat));
		},
		[dispatch]
	);

	const updateFilters = useCallback(
		(newFilters: Partial<ChatFilters>) => {
			dispatch(setFilters(newFilters));
		},
		[dispatch]
	);

	const clearChatError = useCallback(() => {
		dispatch(clearError());
	}, [dispatch]);

	const clearCurrentChatSelection = useCallback(() => {
		dispatch(clearCurrentChat());
	}, [dispatch]);

	// Optimistic updates
	const updateChatOptimistically = useCallback(
		(chat: Chat) => {
			dispatch(updateChatInList(chat));
		},
		[dispatch]
	);

	const removeChatOptimistically = useCallback(
		(id: string) => {
			dispatch(removeChatFromList(id));
		},
		[dispatch]
	);

	// Quick actions management
	const setChatQuickActions = useCallback(
		(chatId: string, actions: QuickAction[]) => {
			dispatch(setQuickActions({ chatId, actions }));
		},
		[dispatch]
	);

	const clearChatQuickActions = useCallback(
		(chatId: string) => {
			dispatch(clearQuickActions(chatId));
		},
		[dispatch]
	);

	const getChatQuickActions = useCallback(
		(chatId: string): QuickAction[] => {
			return quickActions?.[chatId] || [];
		},
		[quickActions]
	);

	// Computed values
	const loading = createLoading || updateLoading || deleteLoading;
	const error = createError || updateError || deleteError;

	return {
		// State
		currentChat,
		loading,
		error,
		filters,
		quickActions,

		// Actions
		createNewChat,
		updateChatById,
		deleteChatById,
		selectChat,
		updateFilters,
		clearChatError,
		clearCurrentChatSelection,

		// Optimistic updates
		updateChatOptimistically,
		removeChatOptimistically,

		// Quick actions management
		setChatQuickActions,
		clearChatQuickActions,
		getChatQuickActions,
	};
};
