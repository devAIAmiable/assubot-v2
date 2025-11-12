import { FaCheck, FaEdit, FaPlus, FaSearch, FaSpinner, FaTimes, FaTrash } from 'react-icons/fa';
import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import dayjs from 'dayjs';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

import Avatar from '../ui/Avatar';
import ChatListLoader from '../ui/ChatListLoader';
import type { Chat, ChatContract } from '../../types/chat';
import type { PaginatedChatResponse } from '../../types/chat';
import { cleanAssistantMessage } from '../../utils/chatHelpers';

export interface ChatSidebarProps {
  className?: string;
  chats: Chat[];
  currentChatId?: string;
  paginationLoading: boolean;
  pagination?: PaginatedChatResponse['pagination'];
  apiError: unknown;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onStartEdit: (chatId: string, initialTitle: string) => void;
  onConfirmEdit: (chatId: string) => void;
  onCancelEdit: () => void;
  onDeleteChat: (chatId: string) => void;
  onEditTitleChange: (value: string) => void;
  editingChatId: string | null;
  editingTitle: string;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

const renderApiError = (apiError: unknown): string => {
  if (!apiError) return '';
  if (typeof apiError === 'string') return apiError;
  try {
    return JSON.stringify(apiError);
  } catch {
    return 'Une erreur est survenue';
  }
};

const ChatSidebarComponent: React.FC<ChatSidebarProps> = ({
  className,
  chats,
  currentChatId,
  paginationLoading,
  pagination,
  apiError,
  searchQuery,
  onSearchChange,
  onOpenNewChat,
  onSelectChat,
  onStartEdit,
  onConfirmEdit,
  onCancelEdit,
  onDeleteChat,
  onEditTitleChange,
  editingChatId,
  editingTitle,
  goToNextPage,
  goToPrevPage,
}) => {
  const errorMessage = renderApiError(apiError);

  return (
    <div className={`${className ? className : 'w-full md:w-1/3'} bg-white border-r border-gray-200 flex flex-col`}>
      {/* Header */}
      <div className="bg-[#1e51ab] p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Conversations</h2>
          <button onClick={onOpenNewChat} className="p-2 text-white hover:text-gray-200 hover:bg-[#1a4599] rounded-full transition-colors">
            <FaPlus />
          </button>
        </div>

        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Rechercher ou démarrer une nouvelle discussion"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="chat-sidebar-list flex-1 overflow-y-auto">
        {paginationLoading ? (
          <ChatListLoader count={5} className="py-4" />
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaTimes className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de connexion</h3>
            <p className="text-gray-500 text-sm mb-4">Impossible de charger les conversations. Vérifiez votre connexion.</p>
            <div className="text-xs text-gray-400 mb-4">Erreur: {errorMessage}</div>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#1a4599] transition-colors text-sm">
              Réessayer
            </button>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Avatar isAssistant />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation</h3>
            <p className="text-gray-500 text-sm mb-4">Commencez une nouvelle conversation pour voir vos discussions ici.</p>
            <button onClick={onOpenNewChat} className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#1a4599] transition-colors text-sm">
              Nouvelle conversation
            </button>
          </div>
        ) : (
          <>
            {chats.map((chat: Chat) => (
              <div
                key={chat.id}
                className={`group relative mx-3 my-1 rounded-xl cursor-pointer transition-all duration-200 ${
                  currentChatId === chat.id ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'hover:bg-gray-50 hover:shadow-sm'
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                {editingChatId === chat.id ? (
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Avatar isAssistant />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => onEditTitleChange(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              onConfirmEdit(chat.id);
                            } else if (event.key === 'Escape') {
                              event.preventDefault();
                              onCancelEdit();
                            }
                          }}
                        />
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onConfirmEdit(chat.id)}
                          className="p-2 text-green-600 hover:text-green-700 bg-gray-100 rounded-lg transition-colors"
                          aria-label="Confirmer"
                        >
                          <FaCheck className="text-sm" />
                        </button>
                        <button onClick={onCancelEdit} className="p-2 text-red-600 hover:text-red-700 bg-gray-100 rounded-lg transition-colors" aria-label="Annuler">
                          <FaTimes className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-base truncate mb-1 ${currentChatId === chat.id ? 'text-blue-900' : 'text-gray-900'}`}>{chat.title}</h3>
                            <div className={`text-sm truncate ${currentChatId === chat.id ? 'text-blue-600' : 'text-gray-500'}`}>
                              {chat.lastMessage?.content ? (
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeSanitize]}
                                  components={{
                                    p: ({ children }) => <span>{children}</span>,
                                    strong: ({ children }) => <span>{children}</span>,
                                    em: ({ children }) => <span>{children}</span>,
                                    code: ({ children }) => <span>{children}</span>,
                                    pre: ({ children }) => <span>{children}</span>,
                                    h1: ({ children }) => <span>{children}</span>,
                                    h2: ({ children }) => <span>{children}</span>,
                                    h3: ({ children }) => <span>{children}</span>,
                                    h4: ({ children }) => <span>{children}</span>,
                                    h5: ({ children }) => <span>{children}</span>,
                                    h6: ({ children }) => <span>{children}</span>,
                                    ul: ({ children }) => <span>{children}</span>,
                                    ol: ({ children }) => <span>{children}</span>,
                                    li: ({ children }) => <span>{children}</span>,
                                    blockquote: ({ children }) => <span>{children}</span>,
                                    a: ({ children }) => <span>{children}</span>,
                                    img: () => <span>[Image]</span>,
                                    table: ({ children }) => <span>{children}</span>,
                                    thead: ({ children }) => <span>{children}</span>,
                                    tbody: ({ children }) => <span>{children}</span>,
                                    tr: ({ children }) => <span>{children}</span>,
                                    th: ({ children }) => <span>{children}</span>,
                                    td: ({ children }) => <span>{children}</span>,
                                    hr: () => <span>---</span>,
                                    br: () => <span> </span>,
                                  }}
                                >
                                  {chat.lastMessage.role === 'assistant' ? cleanAssistantMessage(chat.lastMessage.content) : chat.lastMessage.content}
                                </ReactMarkdown>
                              ) : (
                                'Aucun message'
                              )}
                            </div>
                            {chat.contracts && chat.contracts.length > 0 && (
                              <p className="text-xs text-gray-400 truncate mt-1">{chat.contracts.map((item: ChatContract) => item.name).join(', ')}</p>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className={`text-xs ${currentChatId === chat.id ? 'text-blue-500' : 'text-gray-400'}`}>
                              {dayjs(chat.lastMessage?.createdAt || chat.updatedAt).format('DD MMM')}
                            </span>
                            <div className="flex gap-1 transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onStartEdit(chat.id, chat.title);
                                }}
                                className={`p-2 rounded-full transition-colors ${
                                  currentChatId === chat.id ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                                aria-label="Renommer la conversation"
                              >
                                <FaEdit className="text-xs" />
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onDeleteChat(chat.id);
                                }}
                                className={`p-2 rounded-full transition-colors ${
                                  currentChatId === chat.id ? 'text-blue-600 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                }`}
                                aria-label="Supprimer la conversation"
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
  );
};

export const ChatSidebar = memo(ChatSidebarComponent);
ChatSidebar.displayName = 'ChatSidebar';
