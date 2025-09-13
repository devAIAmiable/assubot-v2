import type { Chat, ChatFilters, CreateChatRequest, UpdateChatRequest } from '../types/chat';
import {
	clearCurrentChat,
	clearError,
	removeChatFromList,
	setCurrentChat,
	setFilters,
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
	const { currentChat, filters } = useAppSelector((state) => state.chat);

	// RTK Query hooks
	const [createChatMutation, { isLoading: createLoading, error: createError }] =
		useCreateChatMutation();
	const [updateChatMutation, { isLoading: updateLoading, error: updateError }] =
		useUpdateChatMutation();
	const [deleteChatMutation, { isLoading: deleteLoading, error: deleteError }] =
		useDeleteChatMutation();

	// Actions
	const createNewChat = useCallback(
		async (data: CreateChatRequest) => {
			const result = await createChatMutation(data).unwrap();
			// The API returns { chat: Chat; message: string }, so we need to extract the chat
			const chat = result.chat || result;
			dispatch(setCurrentChat(chat));
			return chat;
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

	// Computed values
	const loading = createLoading || updateLoading || deleteLoading;
	const error = createError || updateError || deleteError;

	return {
		// State
		currentChat,
		loading,
		error,
		filters,

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
	};
};
