import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import useAuth from '../../hooks/useAuth';
import { FileText, Download } from 'lucide-react';

const MessageBubble = ({ message, showAvatar }) => {
  const { user } = useAuth();
  const isOwn = message.user_id === user?.id;

  const getTime = (date) => {
    try {
      return format(new Date(date), 'HH:mm', { locale: fr });
    } catch (e) {
      return '';
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className={`flex items-end gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar column */}
      <div className="w-8 flex-shrink-0">
        {showAvatar && !isOwn && (
          <div className="w-8 h-8 rounded-sm bg-[#1428C9]/10 text-[#1428C9] flex items-center justify-center text-[10px] font-bold border border-[#1428C9]/5">
            {getInitials(message.user?.name)}
          </div>
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {showAvatar && !isOwn && (
          <span className="text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">
            {message.user?.name}
          </span>
        )}
        
        <div className={`px-4 py-2.5 rounded-sm relative group shadow-sm transition-all duration-300 ${
          isOwn 
            ? 'bg-[#1428C9] text-white' 
            : 'bg-white border border-slate-100 text-[#111827]'
        }`}>
          {/* Attachments */}
          {message.attachments?.map((file, i) => (
            <div key={i} className={`mb-2 p-2 rounded-sm flex items-center gap-3 border ${
              isOwn ? 'bg-white/10 border-white/20' : 'bg-[#F9FAFB] border-slate-100'
            }`}>
              <div className={`p-2 rounded-sm ${isOwn ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate">{file.name}</p>
                <p className={`text-[9px] ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button className={`p-1.5 rounded-sm transition-all ${
                isOwn ? 'hover:bg-white/20' : 'hover:bg-white shadow-sm'
              }`}>
                <Download size={14} />
              </button>
            </div>
          ))}

          <p className="text-xs leading-relaxed whitespace-pre-wrap font-medium">
            {message.content}
          </p>

          <span className={`text-[9px] mt-1.5 block font-bold uppercase tracking-widest ${
            isOwn ? 'text-white/60' : 'text-gray-400'
          }`}>
            {getTime(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
