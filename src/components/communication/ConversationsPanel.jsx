import React, { useState } from 'react';
import { Search, Plus, MessageSquare, Users, Hash } from 'lucide-react';

const ConversationsPanel = ({ conversations, selectedId, onSelect, loading, refresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredConversations = conversations.filter(conv => {
    const name = conv.type === 'group' ? conv.name : conv.other_user?.name;
    const matchesSearch = name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'direct') return matchesSearch && conv.type === 'private';
    if (activeTab === 'groups') return matchesSearch && conv.type === 'group';
    return matchesSearch;
  });

  const getInitials = (conv) => {
    const name = conv.type === 'group' ? conv.name : conv.other_user?.name || 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const tabs = [
    { key: 'all', label: 'Tous' },
    { key: 'direct', label: 'Directs' },
    { key: 'groups', label: 'Groupes' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Messages</h2>
          <button
            onClick={refresh}
            className="p-1.5 bg-[#1428C9] text-white rounded-sm hover:bg-[#1428C9]/90 active:scale-95 transition-all duration-300"
            title="Nouvelle conversation"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-[#F9FAFB] border border-slate-100 rounded-sm py-2 pl-9 pr-3 text-xs text-[#111827] focus:outline-none focus:border-[#1428C9]/30 focus:ring-1 focus:ring-[#1428C9]/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3 p-1 bg-[#F9FAFB] border border-slate-100 rounded-sm">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-1 text-[10px] font-bold rounded-sm transition-all uppercase tracking-wide ${
                activeTab === tab.key
                  ? 'bg-[#1428C9] text-white shadow-sm'
                  : 'text-gray-400 hover:text-[#111827]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 bg-slate-100 rounded-sm flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-slate-100 rounded w-2/3" />
                  <div className="h-2 bg-slate-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length > 0 ? (
          <div>
            {filteredConversations.map((conv) => {
              const isActive = selectedId === conv.id;
              const name = conv.type === 'group' ? conv.name : conv.other_user?.name;
              const initials = getInitials(conv);
              const lastMsg = conv.last_message?.content || 'Débuter la conversation...';
              const time = conv.last_message_at
                ? new Date(conv.last_message_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 border-l-2 ${
                    isActive
                      ? 'bg-[#1428C9]/5 border-[#1428C9]'
                      : 'border-transparent hover:bg-[#F9FAFB]'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-sm flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-[#1428C9] text-white' : 'bg-[#1428C9]/10 text-[#1428C9]'
                  }`}>
                    {conv.type === 'group' ? <Users size={14} /> : initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-[#1428C9]' : 'text-[#111827]'}`}>
                        {name}
                      </span>
                      <span className="text-[9px] text-gray-400 font-medium ml-1 flex-shrink-0">{time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-gray-400 truncate flex-1 pr-2">{lastMsg}</p>
                      {conv.unread_count > 0 && (
                        <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-[#1428C9] text-white text-[9px] font-bold rounded-sm flex items-center justify-center px-1">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-[#1428C9]/5 rounded-sm flex items-center justify-center mx-auto mb-3">
              <MessageSquare size={20} className="text-[#1428C9]/30" />
            </div>
            <p className="text-xs font-bold text-gray-400">Aucune conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPanel;
