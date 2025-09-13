import { useCallback, useState } from 'react';

import type { SendMessageRequest } from '../types/chat';
import { useSendMessageMutation } from '../store/chatsApi';

export const useSendMessage = () => {
	const [sendMessageMutation, { isLoading, error }] = useSendMessageMutation();
	const [isTyping, setIsTyping] = useState(false);

	const sendMessage = useCallback(
		async (chatId: string, message: SendMessageRequest) => {
			try {
				const result = await sendMessageMutation({
					chatId,
					message,
				}).unwrap();
				return result;
			} catch (error) {
				throw error;
			}
		},
		[sendMessageMutation]
	);

	const sendUserMessage = useCallback(
		async (chatId: string, content: string) => {
			setIsTyping(true);
			try {
				const result = await sendMessage(chatId, {
					content,
					role: 'user',
				});
				return result;
			} finally {
				setIsTyping(false);
			}
		},
		[sendMessage]
	);

	const sendAssistantMessage = useCallback(
		async (chatId: string, content: string) => {
			setIsTyping(true);
			try {
				const result = await sendMessage(chatId, {
					content,
					role: 'assistant',
				});
				return result;
			} finally {
				setIsTyping(false);
			}
		},
		[sendMessage]
	);

	return {
		sendMessage,
		sendUserMessage,
		sendAssistantMessage,
		isLoading,
		isTyping,
		error,
	};
};
