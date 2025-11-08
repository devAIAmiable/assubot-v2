import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import React, { memo } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface ChatInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  sendingMessage: boolean;
  globalLoading: boolean;
}

const ChatInputComponent: React.FC<ChatInputProps> = ({ message, onMessageChange, onSend, onKeyDown, sendingMessage, globalLoading }) => {
  const isDisabled = !message.trim() || sendingMessage || globalLoading;

  return (
    <div className="bg-white p-4 border-t border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <TextareaAutosize
            placeholder="Posez votre question"
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            onKeyDown={onKeyDown}
            minRows={1}
            maxRows={4}
            className="text-sm chat-textarea w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent resize-none"
          />
          <button
            onClick={onSend}
            disabled={isDisabled}
            className={`absolute right-2 bottom-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1e51ab] text-white hover:bg-[#1a4599] hover:scale-105 shadow-md hover:shadow-lg'
            }`}
            aria-label="Envoyer le message"
          >
            {sendingMessage ? <FaSpinner className="animate-spin text-xs" /> : <FaPaperPlane className="text-xs" />}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-gray-500 text-center">
            Votre espace de conversation est confidentiel. Le ChatBot repose sur une IA, veuillez vérifier les informations importantes.
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatInput = memo(ChatInputComponent);
ChatInput.displayName = 'ChatInput';
