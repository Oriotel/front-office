import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ConversationsPanel from '../../components/communication/ConversationsPanel';
import ChatContainer from '../../components/communication/ChatContainer';
import UserDetailsPanel from '../../components/communication/UserDetailsPanel';
import communicationService from '../../services/communicationService';
import useAuth from '../../hooks/useAuth';

const CommunicationPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'chat'

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await communicationService.getConversations();
      setConversations(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setShowDetails(false);
    setMobileView('chat');
    communicationService.markAsRead(conv.id).catch(console.error);
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  return (
    <div className="communication-page w-full mx-auto pb-0 animate-in fade-in slide-in-up duration-500 overflow-hidden">
      {/* Page Header - Responsive padding */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 md:mb-6 px-1 md:px-0">
        <div className="space-y-1">
          <h1 className="text-xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Communication
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 md:mt-2">
            <span className="bg-[#1428C9]/5 text-[#1428C9] px-2 md:px-3 py-0.5 md:py-1 rounded-sm font-bold text-[10px] md:text-[11px] border border-[#1428C9]/10">
              {conversations.length} conversations
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-200 hidden xs:block" />
            <span className="text-[10px] md:text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Messagerie interne
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="bg-white border border-slate-100 rounded-sm overflow-hidden relative shadow-sm"
           style={{ height: 'calc(100vh - 180px)', minHeight: '450px' }}>
        
        <div className="flex h-full w-full relative">

          {/* Left Panel: Conversations List */}
          <div className={`
            ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}
            w-full md:w-72 lg:w-80 border-r border-slate-100 flex-shrink-0 flex-col h-full bg-white z-20
          `}>
            <ConversationsPanel
              conversations={conversations}
              selectedId={selectedConversation?.id}
              onSelect={handleSelectConversation}
              loading={loading}
              refresh={fetchConversations}
            />
          </div>

          {/* Center Panel: Chat Area */}
          <div className={`
            ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}
            flex-1 flex-col h-full relative bg-white z-10
          `}>
            {selectedConversation ? (
              <>
                {/* Mobile Back Button (only visible on small screens when in chat view) */}
                <div className="md:hidden flex items-center px-4 py-2 border-b border-slate-50 bg-white">
                  <button 
                    onClick={handleBackToList}
                    className="flex items-center gap-2 text-[#1428C9] font-bold text-xs uppercase tracking-wider"
                  >
                    <ChevronLeft size={16} />
                    Retour
                  </button>
                </div>
                
                <ChatContainer
                  conversation={selectedConversation}
                  onToggleDetails={() => setShowDetails(prev => !prev)}
                  showDetails={showDetails}
                />
              </>
            ) : (
              <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400 space-y-4">
                <div className="w-20 h-20 rounded-sm bg-[#1428C9]/5 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#1428C9]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#111827]">Aucune conversation sélectionnée</p>
                  <p className="text-xs text-gray-400 mt-1">Choisissez une conversation pour commencer</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Details (Overlay on mobile, sidebar on desktop) */}
          <AnimatePresence>
            {selectedConversation && showDetails && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="
                  absolute md:relative right-0 top-0 bottom-0
                  w-full sm:w-80 md:w-72 lg:w-80 
                  border-l border-slate-100 bg-white 
                  shadow-xl md:shadow-none z-30
                  flex flex-col h-full overflow-hidden
                "
              >
                <UserDetailsPanel
                  conversation={selectedConversation}
                  onClose={() => setShowDetails(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Overlay for mobile details */}
          {showDetails && (
            <div 
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-25"
              onClick={() => setShowDetails(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
