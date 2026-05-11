import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#1428C9]/20 border-t-[#1428C9] rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chargement des messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-[#1428C9]/5 rounded-sm flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#1428C9]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-[#111827] mb-1">Aucun message</h3>
        <p className="text-xs text-gray-400">Envoyez le premier message pour commencer la conversation</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col space-y-6">
      {messages.map((message, index) => {
        const isFirstInGroup = index === 0 || messages[index - 1].user_id !== message.user_id;
        return (
          <MessageBubble 
            key={message.id || index} 
            message={message} 
            showAvatar={isFirstInGroup}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
