import React, { useState, useEffect } from 'react';
import { Info, MoreVertical } from 'lucide-react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import communicationService from '../../services/communicationService';

const ChatContainer = ({ conversation, onToggleDetails, showDetails }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await communicationService.getMessages(conversation.id);
        const data = Array.isArray(response) ? response : response?.data || [];
        setMessages([...data].reverse());
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation.id]);

  const handleSendMessage = async (content, files) => {
    try {
      let response;
      if (files && files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files[]', file));
        if (content) formData.append('content', content);
        response = await communicationService.sendMessage(conversation.id, formData);
      } else {
        response = await communicationService.sendMessage(conversation.id, { content });
      }
      
      const newMessage = response?.data || response;
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const name = conversation.type === 'group' ? conversation.name : conversation.other_user?.name;
  const initials = name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-[#1428C9]/10 text-[#1428C9] rounded-sm flex items-center justify-center text-sm font-bold border border-[#1428C9]/5">
              {initials}
            </div>
            {conversation.other_user?.online && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827] leading-none mb-1">
              {name}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {conversation.other_user?.online ? 'En ligne' : 'Dernière connexion récemment'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleDetails}
            className={`p-2 rounded-sm transition-all ${
              showDetails 
                ? 'bg-[#1428C9] text-white shadow-lg shadow-[#1428C9]/20' 
                : 'text-gray-400 hover:bg-slate-50 hover:text-[#111827]'
            }`}
            title="Détails"
          >
            <Info size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:bg-slate-50 hover:text-[#111827] rounded-sm transition-all">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative bg-[#F9FAFB]/50">
        <MessageList messages={messages} loading={loading} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-6 py-1 bg-white border-t border-slate-50">
          <p className="text-[10px] font-bold text-[#1428C9] uppercase tracking-widest animate-pulse">
            {typingUsers.length === 1 ? `${typingUsers[0]} écrit...` : 'Plusieurs personnes écrivent...'}
          </p>
        </div>
      )}

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;
