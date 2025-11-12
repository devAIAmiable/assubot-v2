import './ChatModule.css';
import 'dayjs/locale/fr';

import type { ChatContract, CreateChatRequest, QuickAction } from '../types/chat';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetChatMessagesQuery, useGetChatsQuery } from '../store/chatsApi';

import { AnimatePresence } from 'framer-motion';
import Avatar from './ui/Avatar';
import { ChatHeader } from './chat/ChatHeader';
import { ChatInput } from './chat/ChatInput';
import { ChatMessageList } from './chat/ChatMessageList';
import { ChatSidebar } from './chat/ChatSidebar';
import { DeleteChatModal } from './chat/DeleteChatModal';
import { ErrorToast } from './chat/ErrorToast';
import { NewChatModal } from './chat/NewChatModal';
import {
  trackChatCreated,
  trackChatDeleted,
  trackChatMessageError,
  trackChatMessageSent,
  trackChatQuickAction,
  trackChatRenamed,
  trackChatSearch,
  trackChatSelected,
} from '@/services/analytics/gtm';
import dayjs from 'dayjs';
import { useAppSelector } from '../store/hooks';
import { useChatPagination } from '../hooks/useChatPagination';
import { useChats } from '../hooks/useChats';
import { useGetContractsQuery } from '../store/contractsApi';
import { useSendMessage } from '../hooks/useSendMessage';

dayjs.locale('fr');

const ChatModule: React.FC = () => {
  const { currentChat, loading, error, filters, createNewChat, updateChatById, deleteChatById, selectChat, clearChatError, getChatQuickActions, clearChatQuickActions } =
    useChats();

  const { chats: paginatedChats, loading: paginationLoading, pagination, goToNextPage, goToPrevPage, search } = useChatPagination();
  const { error: apiError } = useGetChatsQuery(filters || {});

  const { data: messagesData, isLoading: messagesLoading } = useGetChatMessagesQuery(
    { chatId: currentChat?.id || '', filters: { page: 1, limit: 50, sortOrder: 'asc' } },
    { skip: !currentChat?.id }
  );

  const { sendUserMessage, isLoading: sendingMessage, isTyping: isAssistantTyping } = useSendMessage();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const messages = useMemo(() => messagesData?.messages || [], [messagesData?.messages]);

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [currentContractNames, setCurrentContractNames] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newChatTitle, setNewChatTitle] = useState('');
  const [selectedContractIds, setSelectedContractIds] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const [isInitialMessageLoad, setIsInitialMessageLoad] = useState(false);
  const quickActions = currentChat ? getChatQuickActions(currentChat.id) : [];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentChatId = currentChat?.id ?? null;

  const openNewChatModal = useCallback(() => setShowNewChatModal(true), []);
  const closeNewChatModal = useCallback(() => setShowNewChatModal(false), []);
  const cancelEdit = useCallback(() => {
    setEditingChatId(null);
    setEditingTitle('');
  }, []);
  const startEdit = useCallback((chatId: string, title: string) => {
    setEditingChatId(chatId);
    setEditingTitle(title);
  }, []);

  const { data: contractsData } = useGetContractsQuery({
    page: 1,
    limit: 100,
    search: '',
    category: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: ['active'],
  });
  const contracts = useMemo(() => contractsData?.data ?? [], [contractsData?.data]);
  const contractsById = useMemo(() => {
    const map = new Map<string, string>();
    contracts.forEach((contract) => {
      if (contract?.id && contract?.name) {
        map.set(contract.id, contract.name);
      }
    });
    return map;
  }, [contracts]);
  const chatsById = useMemo(() => new Map(paginatedChats.map((chat) => [chat.id, chat])), [paginatedChats]);

  useEffect(() => {
    if (!currentChat) {
      setCurrentContractNames('');
      return;
    }

    const directNames = currentChat.contracts?.map((item: ChatContract) => item?.name).filter((name): name is string => Boolean(name)) ?? [];

    let resolvedNames = directNames;

    if (resolvedNames.length === 0 && Array.isArray(currentChat.contractIds) && currentChat.contractIds.length > 0) {
      resolvedNames = currentChat.contractIds.map((id) => contractsById.get(id)).filter((name): name is string => Boolean(name));
    }

    setCurrentContractNames(resolvedNames.join(', '));
  }, [contractsById, currentChat]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      search('');
      return;
    }
    trackChatSearch({ queryLength: searchQuery.trim().length });
    search(searchQuery);
  }, [searchQuery, search]);

  useEffect(() => {
    if (!currentChat) {
      setIsInitialMessageLoad(false);
      return;
    }

    if (messagesLoading) {
      setIsInitialMessageLoad(true);
      return;
    }

    if (messages.length > 0) {
      setIsInitialMessageLoad(false);
      return;
    }

    const timer = setTimeout(() => setIsInitialMessageLoad(false), 500);
    return () => clearTimeout(timer);
  }, [currentChat, messagesLoading, messages.length]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [currentChat?.id, isAssistantTyping, messages.length]);

  const handleCreateChat = useCallback(async () => {
    const chatData: CreateChatRequest = {
      title: newChatTitle.trim() || `Conversation ${dayjs().format('DD/MM/YYYY')}`,
      contractIds: selectedContractIds.length > 0 ? selectedContractIds : undefined,
    };

    try {
      const result = await createNewChat(chatData);
      trackChatCreated({
        chatId: result.chat.id,
        hasContracts: selectedContractIds.length > 0,
        contractsCount: selectedContractIds.length,
      });
      if (selectedContractIds.length > 0) {
        const selectedNames = selectedContractIds.map((id) => contractsById.get(id)).filter((name): name is string => Boolean(name));
        if (selectedNames.length > 0) {
          setCurrentContractNames(selectedNames.join(', '));
        }
      }
      closeNewChatModal();
      setNewChatTitle('');
      setSelectedContractIds([]);
      setShowChatList(true);
    } catch (creationError) {
      console.error('Erreur lors de la création du chat:', creationError);
    }
  }, [closeNewChatModal, contractsById, createNewChat, newChatTitle, selectedContractIds]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      const selectedChat = chatsById.get(chatId);
      if (!selectedChat) return;

      trackChatSelected({ chatId });
      selectChat(selectedChat);
      cancelEdit();
      setShowChatList(false);
    },
    [cancelEdit, chatsById, selectChat]
  );

  const handleUpdateChatTitle = useCallback(
    async (chatId: string) => {
      if (!editingTitle.trim()) return;

      try {
        await updateChatById(chatId, { title: editingTitle.trim() });
        trackChatRenamed({ chatId });
        cancelEdit();
      } catch (updateError) {
        console.error('Erreur lors de la mise à jour du chat:', updateError);
      }
    },
    [cancelEdit, editingTitle, updateChatById]
  );

  const handleDeleteChat = useCallback((chatId: string) => {
    setChatToDelete(chatId);
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteChat = useCallback(async () => {
    if (!chatToDelete) return;

    try {
      await deleteChatById(chatToDelete);
      if (currentChatId === chatToDelete) {
        selectChat(null);
        setShowChatList(true);
      }
      trackChatDeleted({ chatId: chatToDelete });
      setShowDeleteModal(false);
      setChatToDelete(null);
    } catch (deleteError) {
      console.error('Erreur lors de la suppression du chat:', deleteError);
    }
  }, [chatToDelete, currentChatId, deleteChatById, selectChat]);

  const cancelDeleteChat = useCallback(() => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  }, []);

  const handleBackToChatList = useCallback(() => {
    setShowChatList(true);
    selectChat(null);
  }, [selectChat]);

  const toggleContractSelection = useCallback((contractId: string) => {
    setSelectedContractIds((prev) => {
      if (prev.includes(contractId)) {
        return prev.filter((id) => id !== contractId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, contractId];
    });
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !currentChatId || sendingMessage) return;

    const messageContent = messageInput.trim();
    setMessageInput('');

    try {
      await sendUserMessage(currentChatId, messageContent);
      trackChatMessageSent({
        chatId: currentChatId,
        messageLength: messageContent.length,
      });
    } catch (sendError) {
      console.error("Erreur lors de l'envoi du message:", sendError);
      trackChatMessageError({
        chatId: currentChatId,
        errorMessage: sendError instanceof Error ? sendError.message : 'send_failed',
      });
      setMessageInput(messageContent);
    }
  }, [currentChatId, messageInput, sendUserMessage, sendingMessage]);

  const handleQuickAction = useCallback(
    async (action: QuickAction) => {
      if (!currentChatId || sendingMessage) return;

      try {
        clearChatQuickActions(currentChatId);
        trackChatQuickAction({
          chatId: currentChatId,
          actionLabel: action.label,
        });
        await sendUserMessage(currentChatId, action.instructions);
      } catch (quickActionError) {
        console.error("Erreur lors de l'envoi de l'action rapide:", quickActionError);
        trackChatMessageError({
          chatId: currentChatId,
          errorMessage: quickActionError instanceof Error ? quickActionError.message : 'quick_action_failed',
        });
      }
    },
    [clearChatQuickActions, currentChatId, sendUserMessage, sendingMessage]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full" style={{ height: 'calc(100vh - 140px)' }}>
      <ChatSidebar
        className={`${showChatList ? 'flex' : 'hidden md:flex'} w-full md:w-1/3`}
        chats={paginatedChats}
        currentChatId={currentChat?.id}
        paginationLoading={paginationLoading}
        pagination={pagination}
        apiError={apiError}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewChat={openNewChatModal}
        onSelectChat={handleSelectChat}
        onStartEdit={startEdit}
        onConfirmEdit={handleUpdateChatTitle}
        onCancelEdit={cancelEdit}
        onDeleteChat={handleDeleteChat}
        onEditTitleChange={setEditingTitle}
        editingChatId={editingChatId}
        editingTitle={editingTitle}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
      />

      <div className={`flex-1 flex flex-col bg-white ${showChatList ? 'hidden md:flex' : 'flex'}`}>
        {currentChat ? (
          <>
            <ChatHeader chat={currentChat} contractNames={currentContractNames} onBack={handleBackToChatList} />

            <ChatMessageList
              messages={messages}
              messagesLoading={messagesLoading}
              isInitialMessageLoad={isInitialMessageLoad}
              isAssistantTyping={isAssistantTyping}
              quickActions={quickActions}
              onQuickAction={handleQuickAction}
              isSendingMessage={sendingMessage}
              currentUser={currentUser}
              messagesEndRef={messagesEndRef}
            />

            <ChatInput
              message={messageInput}
              onMessageChange={setMessageInput}
              onSend={handleSendMessage}
              onKeyDown={handleKeyDown}
              sendingMessage={sendingMessage}
              globalLoading={loading}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md px-4">
              <Avatar isAssistant size="xl" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">AI'A</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Commencez une conversation avec AI'A.
                <br />
                Posez vos questions et obtenez des réponses personnalisées.
              </p>
              <button onClick={openNewChatModal} className="bg-[#1e51ab] text-white px-6 py-3 rounded-lg hover:bg-[#1a4599] transition-colors font-medium">
                Nouvelle conversation
              </button>
            </div>
          </div>
        )}
      </div>

      <NewChatModal
        isOpen={showNewChatModal}
        loading={loading}
        newChatTitle={newChatTitle}
        contracts={contracts}
        selectedContractIds={selectedContractIds}
        onTitleChange={setNewChatTitle}
        onToggleContract={toggleContractSelection}
        onCreate={handleCreateChat}
        onClose={closeNewChatModal}
      />

      <DeleteChatModal isOpen={showDeleteModal} loading={loading} onConfirm={confirmDeleteChat} onCancel={cancelDeleteChat} />

      <AnimatePresence>{error && <ErrorToast message={typeof error === 'string' ? error : 'Une erreur est survenue'} onClose={clearChatError} />}</AnimatePresence>
    </div>
  );
};

export default ChatModule;
