import type { ChatMessage, QuickAction } from '../../types/chat';
import React, { memo } from 'react';

import Avatar from '../ui/Avatar';
import DocumentReferences from '../DocumentReferences';
import Loader from '../ui/Loader';
import MessageLoader from '../ui/MessageLoader';
import ReactMarkdown from 'react-markdown';
import type { User } from '../../store/userSlice';
import UserAvatar from '../ui/UserAvatar';
import { cleanAssistantMessage } from '../../utils/chatHelpers';
import dayjs from 'dayjs';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

export interface ChatMessageListProps {
  messages: ChatMessage[];
  messagesLoading: boolean;
  isInitialMessageLoad: boolean;
  isAssistantTyping: boolean;
  quickActions: QuickAction[];
  onQuickAction: (action: QuickAction) => void;
  isSendingMessage: boolean;
  currentUser: User | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatMessageListComponent: React.FC<ChatMessageListProps> = ({
  messages,
  messagesLoading,
  isInitialMessageLoad,
  isAssistantTyping,
  quickActions,
  onQuickAction,
  isSendingMessage,
  currentUser,
  messagesEndRef,
}) => {
  return (
    <div className="chat-messages flex-1 p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-4">
        {(messagesLoading || isInitialMessageLoad) && (
          <div className="flex justify-center py-8">
            <Loader size="lg" text="Chargement des messages..." />
          </div>
        )}

        {!messagesLoading && !isInitialMessageLoad && messages.length > 0
          ? messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && <Avatar isAssistant />}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm border ${
                    message.role === 'user' ? 'bg-[#1e51ab] text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-tl-sm border-gray-200'
                  }`}
                >
                  <div className="text-sm prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSanitize]}
                      components={{
                        h1: ({ children }) => <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-sm font-semibold mb-2 mt-2 first:mt-0">{children}</h4>,
                        h5: ({ children }) => <h5 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h5>,
                        h6: ({ children }) => <h6 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h6>,
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        del: ({ children }) => <del className="line-through text-gray-500">{children}</del>,
                        u: ({ children }) => <u className="underline">{children}</u>,
                        ul: ({ children }) => <ul className="mb-2 last:mb-0 ml-4 list-disc space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 last:mb-0 ml-4 list-decimal space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        code: ({ children, className }) => {
                          const isInline = !className;
                          return isInline ? (
                            <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                          ) : (
                            <code className="block bg-gray-100 text-gray-800 p-2 rounded text-xs font-mono overflow-x-auto">{children}</code>
                          );
                        },
                        pre: ({ children }) => <pre className="bg-gray-100 text-gray-800 p-2 rounded text-xs font-mono overflow-x-auto mb-2 last:mb-0">{children}</pre>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2 last:mb-0 text-gray-600">{children}</blockquote>,
                        hr: () => <hr className="border-gray-300 my-3" />,
                        a: ({ href, children }) => (
                          <a href={href || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                            {children}
                          </a>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto mb-4 last:mb-0">
                            <table className="min-w-full border border-gray-300 rounded-lg text-sm">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => <thead>{children}</thead>,
                        tbody: ({ children }) => <tbody className="divide-y divide-gray-100">{children}</tbody>,
                        tr: ({ children }) => <tr>{children}</tr>,
                        th: ({ children, align }) => (
                          <th className={`px-4 py-3 text-left font-semibold ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}>{children}</th>
                        ),
                        td: ({ children, align }) => (
                          <td className={`px-4 py-3 ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}>{children}</td>
                        ),
                        img: ({ src, alt }) => <img src={src} alt={alt || ''} className="max-w-full h-auto rounded mb-2 last:mb-0" />,
                        br: () => <br />,
                      }}
                    >
                      {message.role === 'assistant' ? cleanAssistantMessage(message.content) : message.content}
                    </ReactMarkdown>
                  </div>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>{dayjs(message.createdAt).format('HH:mm')}</p>
                  {message.role === 'assistant' && message.documentReferences && message.documentReferences.length > 0 && (
                    <DocumentReferences references={message.documentReferences} className="mt-3" />
                  )}
                </div>
                {message.role === 'user' && <UserAvatar user={currentUser} size="md" />}
              </div>
            ))
          : !messagesLoading &&
            !isInitialMessageLoad &&
            messages.length === 0 && (
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <Avatar isAssistant />
                  <p className="text-gray-500 text-sm">Aucun message dans cette conversation</p>
                </div>
              </div>
            )}

        {isAssistantTyping && <MessageLoader />}

        {!messagesLoading && !isInitialMessageLoad && quickActions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center py-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onQuickAction(action)}
                disabled={isSendingMessage}
                className="group relative px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-[#1e51ab] hover:border-[#1e51ab] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    p: ({ children }) => <span className="whitespace-nowrap">{children}</span>,
                    strong: ({ children }) => <strong className="font-medium">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                  }}
                >
                  {action.label}
                </ReactMarkdown>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1e51ab]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export const ChatMessageList = memo(ChatMessageListComponent);
ChatMessageList.displayName = 'ChatMessageList';
