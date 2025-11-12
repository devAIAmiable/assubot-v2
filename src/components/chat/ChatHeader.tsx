import { FaArrowLeft } from 'react-icons/fa';
import React, { memo } from 'react';

import Avatar from '../ui/Avatar';
import type { Chat } from '../../types/chat';

interface ChatHeaderProps {
  chat: Chat;
  contractNames: string;
  onBack: () => void;
}

const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({ chat, contractNames, onBack }) => {
  return (
    <div className="bg-[#1e51ab] p-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="md:hidden p-2 text-blue-200 hover:text-white hover:bg-blue-600 rounded-full transition-colors" aria-label="Retour aux conversations">
          <FaArrowLeft />
        </button>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Avatar isLogo />
        </div>
        <div>
          <h1 className="text-white font-medium">{chat.title}</h1>
          {contractNames && <p className="text-xs text-blue-100 mt-1">{contractNames}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">{/* Reserved for future actions */}</div>
    </div>
  );
};

export const ChatHeader = memo(ChatHeaderComponent);
ChatHeader.displayName = 'ChatHeader';
