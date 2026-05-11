import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Image as ImageIcon, X } from 'lucide-react';

const ChatInput = ({ onSend }) => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() || files.length > 0) {
      onSend(content, files);
      setContent('');
      setFiles([]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 px-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#F9FAFB] border border-slate-100 px-3 py-1.5 rounded-sm group">
              <span className="text-[10px] font-bold text-[#111827] truncate max-w-[120px]">{file.name}</span>
              <button 
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3 px-2">
        <div className="flex-1 relative flex items-end bg-[#F9FAFB] border border-slate-100 rounded-sm focus-within:border-[#1428C9]/30 focus-within:ring-1 focus-within:ring-[#1428C9]/10 transition-all">
          <div className="flex items-center gap-1 p-2">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-[#1428C9] hover:bg-white rounded-sm transition-all"
            >
              <Paperclip size={18} />
            </button>
            <button 
              type="button"
              className="p-2 text-gray-400 hover:text-[#1428C9] hover:bg-white rounded-sm transition-all"
            >
              <Smile size={18} />
            </button>
          </div>

          <textarea
            rows="1"
            placeholder="Écrivez votre message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-[#111827] py-3 pr-4 resize-none min-h-[44px] max-h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <input 
            type="file" 
            multiple 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          disabled={!content.trim() && files.length === 0}
          className="w-12 h-12 bg-[#1428C9] text-white rounded-sm flex items-center justify-center hover:bg-[#1428C9]/90 active:scale-90 transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:scale-100 shadow-lg shadow-[#1428C9]/10"
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
