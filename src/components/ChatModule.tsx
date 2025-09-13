import './ChatModule.css';
import 'dayjs/locale/fr';

import { AnimatePresence, motion } from 'framer-motion';
import {
	FaArrowLeft,
	FaCheck,
	FaEdit,
	FaEllipsisV,
	FaPaperPlane,
	FaPlus,
	FaRobot,
	FaSearch,
	FaSpinner,
	FaTimes,
	FaTrash,
} from 'react-icons/fa';
import React, { useEffect, useRef, useState } from 'react';
import { useGetChatMessagesQuery, useGetChatsQuery } from '../store/chatsApi';

import ChatListLoader from './ui/ChatListLoader';
import type { CreateChatRequest } from '../types/chat';
import Loader from './ui/Loader';
import MessageLoader from './ui/MessageLoader';
import TextareaAutosize from 'react-textarea-autosize';
import UserAvatar from './ui/UserAvatar';
import dayjs from 'dayjs';
import { useAppSelector } from '../store/hooks';
import { useChatPagination } from '../hooks/useChatPagination';
import { useChats } from '../hooks/useChats';
import { useGetContractsQuery } from '../store/contractsApi';
import { useSendMessage } from '../hooks/useSendMessage';

dayjs.locale('fr');

const ChatModule: React.FC = () => {
	const {
		currentChat,
		loading,
		error,
		createNewChat,
		updateChatById,
		deleteChatById,
		selectChat,
		clearChatError,
	} = useChats();

	const {
		chats: paginatedChats,
		loading: paginationLoading,
		pagination,
		goToNextPage,
		goToPrevPage,
		search,
	} = useChatPagination();

	// Get error from RTK Query
	const { error: apiError } = useGetChatsQuery(useChats().filters || {});

	// Get messages for the current chat
	const { data: messagesData, isLoading: messagesLoading } = useGetChatMessagesQuery(
		{ chatId: currentChat?.id || '', filters: { page: 1, limit: 50, sortOrder: 'asc' } },
		{
			skip: !currentChat?.id,
		}
	);

	// Send message hook
	const {
		sendUserMessage,
		isLoading: sendingMessage,
		isTyping: isAssistantTyping,
	} = useSendMessage();

	// Get current user info
	const currentUser = useAppSelector((state) => state.user.currentUser);

	// Get the messages array
	const messages = messagesData?.messages || [];

	// États locaux
	const [showNewChatModal, setShowNewChatModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [chatToDelete, setChatToDelete] = useState<string | null>(null);
	const [editingChatId, setEditingChatId] = useState<string | null>(null);
	const [editingTitle, setEditingTitle] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [newChatTitle, setNewChatTitle] = useState('');
	const [selectedContractIds, setSelectedContractIds] = useState<string[]>([]);
	const [messageInput, setMessageInput] = useState('');
	const [showChatList, setShowChatList] = useState(true); // Mobile navigation state
	const [isInitialMessageLoad, setIsInitialMessageLoad] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Récupération des contrats pour la sélection
	const { data: contractsData } = useGetContractsQuery({
		page: 1,
		limit: 100,
		search: '',
		category: 'all',
		sortBy: 'createdAt',
		sortOrder: 'desc',
		status: ['active'],
	});

	const contracts = contractsData?.data || [];

	// Effets
	useEffect(() => {
		if (searchQuery) {
			search(searchQuery);
		}
	}, [searchQuery, search]);

	// Gérer le chargement initial des messages
	useEffect(() => {
		if (currentChat) {
			if (messagesLoading) {
				setIsInitialMessageLoad(true);
			} else if (!messagesLoading && messages.length > 0) {
				setIsInitialMessageLoad(false);
			} else if (!messagesLoading && messages.length === 0) {
				// Délai pour s'assurer que le loader s'affiche même pour les chats vides
				const timer = setTimeout(() => {
					setIsInitialMessageLoad(false);
				}, 500);
				return () => clearTimeout(timer);
			}
		} else {
			setIsInitialMessageLoad(false);
		}
	}, [currentChat, messagesLoading, messages.length]);

	// Handlers
	const handleCreateChat = async () => {
		const chatData: CreateChatRequest = {
			title: newChatTitle.trim() || `Conversation ${dayjs().format('DD/MM/YYYY')}`,
			contractIds: selectedContractIds.length > 0 ? selectedContractIds : undefined,
		};

		try {
			await createNewChat(chatData);
			setShowNewChatModal(false);
			setNewChatTitle('');
			setSelectedContractIds([]);
			// On mobile, show the chat list after creating a new chat
			setShowChatList(true);
		} catch (error) {
			console.error('Erreur lors de la création du chat:', error);
		}
	};

	const handleSelectChat = (chatId: string) => {
		// RTK Query will automatically fetch the chat when we call useGetChatByIdQuery
		// We just need to update the current chat selection
		const selectedChat = paginatedChats.find((chat) => chat.id === chatId);
		if (selectedChat) {
			selectChat(selectedChat);
			// On mobile, hide chat list and show messages
			setShowChatList(false);
		}
	};

	const handleUpdateChatTitle = async (chatId: string) => {
		if (!editingTitle.trim()) return;

		try {
			await updateChatById(chatId, { title: editingTitle.trim() });
			setEditingChatId(null);
			setEditingTitle('');
		} catch (error) {
			console.error('Erreur lors de la mise à jour du chat:', error);
		}
	};

	const handleDeleteChat = (chatId: string) => {
		setChatToDelete(chatId);
		setShowDeleteModal(true);
	};

	const confirmDeleteChat = async () => {
		if (!chatToDelete) return;

		try {
			await deleteChatById(chatToDelete);
			if (currentChat?.id === chatToDelete) {
				selectChat(null);
				// On mobile, show the chat list after deleting current chat
				setShowChatList(true);
			}
			setShowDeleteModal(false);
			setChatToDelete(null);
		} catch (error) {
			console.error('Erreur lors de la suppression du chat:', error);
		}
	};

	const cancelDeleteChat = () => {
		setShowDeleteModal(false);
		setChatToDelete(null);
	};

	const handleBackToChatList = () => {
		setShowChatList(true);
		selectChat(null);
	};

	const toggleContractSelection = (contractId: string) => {
		setSelectedContractIds((prev) =>
			prev.includes(contractId) ? prev.filter((id) => id !== contractId) : [...prev, contractId]
		);
	};

	const handleSendMessage = async () => {
		if (!messageInput.trim() || !currentChat || sendingMessage) return;

		const messageContent = messageInput.trim();
		setMessageInput('');

		try {
			// Envoyer le message utilisateur
			await sendUserMessage(currentChat.id, messageContent);
		} catch (error) {
			console.error("Erreur lors de l'envoi du message:", error);
			// Restaurer le message en cas d'erreur
			setMessageInput(messageContent);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	// Auto-scroll vers le bas des messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [currentChat, isAssistantTyping, messages]);

	// Rendu
	return (
		<div
			className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full"
			style={{ height: 'calc(100vh - 140px)' }}
		>
			{/* Sidebar - Style WhatsApp */}
			<div className={`w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col ${
				showChatList ? 'flex' : 'hidden md:flex'
			}`}>
				{/* Header */}
				<div className="bg-[#1e51ab] p-4 border-b border-gray-200">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-white">Conversations</h2>
						<button
							onClick={() => setShowNewChatModal(true)}
							className="p-2 text-white hover:text-gray-200 hover:bg-[#1a4599] rounded-full transition-colors"
						>
							<FaPlus />
						</button>
					</div>

					{/* Search */}
					<div className="relative">
						<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
						<input
							type="text"
							placeholder="Rechercher ou démarrer une nouvelle discussion"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
						/>
					</div>
				</div>

				{/* Chat List */}
				<div className="chat-sidebar-list flex-1 overflow-y-auto">
					{paginationLoading ? (
						<ChatListLoader count={5} className="py-4" />
					) : apiError ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
								<FaTimes className="text-red-500 text-2xl" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de connexion</h3>
							<p className="text-gray-500 text-sm mb-4">
								Impossible de charger les conversations. Vérifiez votre connexion.
							</p>
							<div className="text-xs text-gray-400 mb-4">Erreur: {JSON.stringify(apiError)}</div>
							<button
								onClick={() => window.location.reload()}
								className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#1a4599] transition-colors text-sm"
							>
								Réessayer
							</button>
						</div>
					) : paginatedChats.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
								<FaRobot className="text-gray-400 text-2xl" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation</h3>
							<p className="text-gray-500 text-sm mb-4">
								Commencez une nouvelle conversation pour voir vos discussions ici.
							</p>
							<button
								onClick={() => setShowNewChatModal(true)}
								className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#1a4599] transition-colors text-sm"
							>
								Nouvelle conversation
							</button>
						</div>
					) : (
						<>
							{paginatedChats.map((chat) => (
								<div
									key={chat.id}
									className={`group relative mx-3 my-1 rounded-xl cursor-pointer transition-all duration-200 ${
										currentChat?.id === chat.id
											? 'bg-blue-50 border border-blue-200 shadow-sm'
											: 'hover:bg-gray-50 hover:shadow-sm'
									}`}
									onClick={() => handleSelectChat(chat.id)}
								>
									{editingChatId === chat.id ? (
										<div className="p-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
													<FaRobot className="text-gray-500 text-sm" />
												</div>
												<div className="flex-1">
													<input
														type="text"
														value={editingTitle}
														onChange={(e) => setEditingTitle(e.target.value)}
														className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														autoFocus
													/>
												</div>
												<div className="flex gap-1">
													<button
														onClick={() => handleUpdateChatTitle(chat.id)}
														className="p-2 text-green-600 hover:text-green-700 bg-gray-100 rounded-lg transition-colors"
													>
														<FaCheck className="text-sm" />
													</button>
													<button
														onClick={() => {
															setEditingChatId(null);
															setEditingTitle('');
														}}
														className="p-2 text-red-600 hover:text-red-700 bg-gray-100 rounded-lg transition-colors"
													>
														<FaTimes className="text-sm" />
													</button>
												</div>
											</div>
										</div>
									) : (
										<div className="p-4">
											<div className="flex items-start gap-3">
												{/* Contenu de la conversation */}
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between">
														<div className="flex-1 min-w-0">
															<h3
																className={`font-semibold text-base truncate mb-1 ${
																	currentChat?.id === chat.id ? 'text-blue-900' : 'text-gray-900'
																}`}
															>
																{chat.title}
															</h3>
															<p
																className={`text-sm truncate ${
																	currentChat?.id === chat.id ? 'text-blue-600' : 'text-gray-500'
																}`}
															>
																{chat.lastMessage?.content || 'Aucun message'}
															</p>
														</div>

														{/* Timestamp et actions */}
														<div className="flex flex-col items-end gap-2">
															<span
																className={`text-xs ${
																	currentChat?.id === chat.id ? 'text-blue-500' : 'text-gray-400'
																}`}
															>
																{dayjs(chat.lastMessage?.createdAt || chat.updatedAt).format(
																	'DD MMM'
																)}
															</span>

															{/* Actions (visible au hover) */}
															<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		setEditingChatId(chat.id);
																		setEditingTitle(chat.title);
																	}}
																	className={`p-2 rounded-full transition-colors ${
																		currentChat?.id === chat.id
																			? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'
																			: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
																	}`}
																>
																	<FaEdit className="text-xs" />
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleDeleteChat(chat.id);
																	}}
																	className={`p-2 rounded-full transition-colors ${
																		currentChat?.id === chat.id
																			? 'text-blue-600 hover:text-red-600 hover:bg-red-50'
																			: 'text-gray-400 hover:text-red-600 hover:bg-red-50'
																	}`}
																>
																	<FaTrash className="text-xs" />
																</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</>
					)}

					{/* Pagination */}
					{pagination && pagination.totalPages > 1 && (
						<div className="p-4 flex justify-center gap-2">
							<button
								onClick={goToPrevPage}
								disabled={!pagination.hasPrev || paginationLoading}
								className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 flex items-center gap-1"
							>
								{paginationLoading && <FaSpinner className="animate-spin text-xs" />}
								Précédent
							</button>
							<span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded">
								{pagination.page} / {pagination.totalPages}
							</span>
							<button
								onClick={goToNextPage}
								disabled={!pagination.hasNext || paginationLoading}
								className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 flex items-center gap-1"
							>
								{paginationLoading && <FaSpinner className="animate-spin text-xs" />}
								Suivant
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Main Content - Style WhatsApp */}
			<div className={`flex-1 flex flex-col bg-white ${
				showChatList ? 'hidden md:flex' : 'flex'
			}`}>
				{currentChat ? (
					<>
						{/* Header */}
						<div className="bg-[#1e51ab] p-4 border-b border-gray-200 flex items-center justify-between">
							<div className="flex items-center gap-3">
								{/* Back button for mobile */}
								<button
									onClick={handleBackToChatList}
									className="md:hidden p-2 text-blue-200 hover:text-white hover:bg-blue-600 rounded-full transition-colors"
								>
									<FaArrowLeft />
								</button>
								<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
									<FaRobot className="text-[#1e51ab]" />
								</div>
								<div>
									<h1 className="text-white font-medium">{currentChat.title}</h1>
									<p className="text-sm text-blue-200">Assistant IA</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button className="p-2 text-blue-200 hover:text-white hover:bg-blue-600 rounded-full">
									<FaSearch />
								</button>
								<button className="p-2 text-blue-200 hover:text-white hover:bg-blue-600 rounded-full">
									<FaEllipsisV />
								</button>
							</div>
						</div>

						{/* Messages Area */}
						<div className="chat-messages flex-1 p-4 bg-gray-50">
							<div className="max-w-4xl mx-auto space-y-4">
								{/* Loading Messages */}
								{(messagesLoading || isInitialMessageLoad) && (
									<div className="flex justify-center py-8">
										<Loader size="lg" text="Chargement des messages..." />
									</div>
								)}

								{/* Messages */}
								{!messagesLoading && !isInitialMessageLoad && messages.length > 0
									? messages.map((message) => (
											<div
												key={message.id}
												className={`flex items-start gap-3 ${
													message.role === 'user' ? 'justify-end' : 'justify-start'
												}`}
											>
												{message.role === 'assistant' && (
													<div className="w-8 h-8 bg-[#1e51ab] rounded-full flex items-center justify-center flex-shrink-0">
														<FaRobot className="text-white text-sm" />
													</div>
												)}
												<div
													className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm border ${
														message.role === 'user'
															? 'bg-[#1e51ab] text-white rounded-br-sm'
															: 'bg-white text-gray-900 rounded-tl-sm border-gray-200'
													}`}
												>
													<p className="text-sm whitespace-pre-wrap">{message.content}</p>
													<p
														className={`text-xs mt-1 ${
															message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
														}`}
													>
														{dayjs(message.createdAt).format('HH:mm')}
													</p>
												</div>
												{message.role === 'user' && <UserAvatar user={currentUser} size="md" />}
											</div>
										))
									: !messagesLoading && !isInitialMessageLoad && messages.length === 0 && (
										<div className="flex justify-center py-8">
											<div className="text-center">
												<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
													<FaRobot className="text-gray-400 text-2xl" />
												</div>
												<p className="text-gray-500 text-sm">Aucun message dans cette conversation</p>
											</div>
										</div>
									)}

								{/* Typing Indicator */}
								{isAssistantTyping && <MessageLoader />}

								<div ref={messagesEndRef} />
							</div>
						</div>

						{/* Message Input */}
						<div className="bg-white p-4 border-t border-gray-200">
							<div className="max-w-4xl mx-auto">
								<div className="flex items-end gap-3">
									<div className="flex-1 relative">
										<TextareaAutosize
											placeholder="Tapez un message"
											value={messageInput}
											onChange={(e) => setMessageInput(e.target.value)}
											onKeyDown={handleKeyDown}
											minRows={1}
											maxRows={4}
											className="chat-textarea w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent resize-none"
										/>
									</div>
									<button
										onClick={handleSendMessage}
										disabled={!messageInput.trim() || sendingMessage || loading}
										className="p-3 bg-[#1e51ab] text-white rounded-full hover:bg-[#1a4599] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										{sendingMessage ? (
											<FaSpinner className="animate-spin" />
										) : (
											<FaPaperPlane />
										)}
									</button>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="flex-1 flex items-center justify-center bg-gray-50">
						<div className="text-center max-w-md px-4">
							<div className="w-32 h-32 bg-[#1e51ab] rounded-full flex items-center justify-center mx-auto mb-6">
								<FaRobot className="text-white text-4xl" />
							</div>
							<h2 className="text-2xl font-semibold text-gray-900 mb-4">Assistant IA</h2>
							<p className="text-gray-600 mb-8 leading-relaxed">
								Commencez une conversation avec votre assistant IA.
								<br />
								Posez vos questions et obtenez des réponses personnalisées.
							</p>
							<button
								onClick={() => setShowNewChatModal(true)}
								className="bg-[#1e51ab] text-white px-6 py-3 rounded-lg hover:bg-[#1a4599] transition-colors font-medium"
							>
								Nouvelle conversation
							</button>
						</div>
					</div>
				)}
			</div>

			{/* New Chat Modal */}
			<AnimatePresence>
				{showNewChatModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
						onClick={() => setShowNewChatModal(false)}
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ duration: 0.2 }}
							className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 bg-[#1e51ab] rounded-full flex items-center justify-center">
									<FaPlus className="text-white" />
								</div>
								<div>
									<h3 className="text-xl font-semibold text-gray-900">Nouvelle conversation</h3>
									<p className="text-gray-500 text-sm">Créez une nouvelle discussion</p>
								</div>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Titre de la conversation{' '}
										<span className="text-gray-400 text-sm">(optionnel)</span>
									</label>
									<input
										type="text"
										value={newChatTitle}
										onChange={(e) => setNewChatTitle(e.target.value)}
										placeholder="Ex: Discussion sur mon contrat auto (laissé vide = titre automatique)"
										className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
										autoFocus
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Contrats liés (optionnel)
									</label>
									<div className="max-h-40 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-300">
										{contracts.length > 0 ? (
											contracts.map((contract) => (
												<label
													key={contract.id}
													className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors"
												>
													<input
														type="checkbox"
														checked={selectedContractIds.includes(contract.id)}
														onChange={() => toggleContractSelection(contract.id)}
														className="w-4 h-4 rounded border-gray-300 text-[#1e51ab] focus:ring-[#1e51ab]"
													/>
													<span className="text-sm text-gray-900 font-medium">{contract.name}</span>
												</label>
											))
										) : (
											<p className="text-gray-500 text-sm text-center py-4">
												Aucun contrat disponible
											</p>
										)}
									</div>
								</div>
							</div>

							<div className="flex justify-end gap-3 mt-6">
								<button
									onClick={() => setShowNewChatModal(false)}
									className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
								>
									Annuler
								</button>
								<button
									onClick={handleCreateChat}
									disabled={loading}
									className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#1a4599] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
								>
									{loading ? (
										<>
											<FaSpinner className="animate-spin" />
											Création...
										</>
									) : (
										'Créer'
									)}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Delete Confirmation Modal */}
			<AnimatePresence>
				{showDeleteModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
						onClick={cancelDeleteChat}
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ duration: 0.2 }}
							className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center gap-3 mb-6">
								<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
									<FaTrash className="text-red-600 text-lg" />
								</div>
								<div>
									<h3 className="text-xl font-semibold text-gray-900">Supprimer la conversation</h3>
									<p className="text-gray-500 text-sm">Cette action est irréversible</p>
								</div>
							</div>

							<div className="mb-6">
								<p className="text-gray-700">
									Êtes-vous sûr de vouloir supprimer cette conversation ? Tous les messages seront
									définitivement supprimés.
								</p>
							</div>

							<div className="flex justify-end gap-3">
								<button
									onClick={cancelDeleteChat}
									className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
								>
									Annuler
								</button>
								<button
									onClick={confirmDeleteChat}
									disabled={loading}
									className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
								>
									{loading ? (
										<>
											<FaSpinner className="animate-spin" />
											Suppression...
										</>
									) : (
										'Supprimer'
									)}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Error Toast */}
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, y: 50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 50, scale: 0.9 }}
						className="fixed bottom-6 right-6 bg-red-500 text-white px-4 py-3 rounded-lg shadow-2xl border border-red-400 max-w-sm"
					>
						<div className="flex items-center justify-between gap-3">
							<span className="font-medium text-sm">
								{typeof error === 'string' ? error : 'Une erreur est survenue'}
							</span>
							<button
								onClick={clearChatError}
								className="p-1 text-red-200 hover:text-white hover:bg-red-600 rounded transition-colors"
							>
								<FaTimes />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ChatModule;
