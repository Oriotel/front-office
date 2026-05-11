import React from 'react';
import { X, User, Bell, Shield, Trash2, Mail, Phone, Calendar } from 'lucide-react';

const UserDetailsPanel = ({ conversation, onClose }) => {
  const otherUser = conversation.other_user;
  const name = conversation.type === 'group' ? conversation.name : otherUser?.name;
  const initials = name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  const sections = [
    {
      title: 'Coordonnées',
      items: [
        { icon: Mail, label: 'Email', value: otherUser?.email || 'N/A' },
        { icon: Phone, label: 'Téléphone', value: otherUser?.phone || 'N/A' },
        { icon: Calendar, label: 'Membre depuis', value: 'Mai 2024' },
      ]
    },
    {
      title: 'Paramètres',
      items: [
        { icon: Bell, label: 'Notifications', value: 'Activées', color: 'text-[#1428C9]' },
        { icon: Shield, label: 'Confidentialité', value: 'Privé' },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-100">
        <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Détails</h2>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:bg-slate-50 hover:text-[#111827] rounded-sm transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="p-8 flex flex-col items-center text-center border-b border-slate-100 bg-[#F9FAFB]/30">
          <div className="w-20 h-20 rounded-sm bg-[#1428C9]/10 text-[#1428C9] flex items-center justify-center text-2xl font-bold border border-[#1428C9]/10 shadow-sm mb-4">
            {initials}
          </div>
          <h3 className="text-lg font-bold text-[#111827]">{name}</h3>
          <p className="text-xs font-bold text-[#1428C9] uppercase tracking-widest mt-1">
            {conversation.type === 'group' ? 'Groupe de discussion' : (otherUser?.role || 'Utilisateur')}
          </p>
          
          <div className="flex gap-2 mt-6 w-full">
            <button className="flex-1 bg-[#1428C9] text-white py-2.5 rounded-sm text-xs font-bold shadow-lg shadow-[#1428C9]/10 hover:bg-[#1428C9]/90 transition-all active:scale-95">
              Profil complet
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">
                {section.title}
              </h4>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-slate-100 rounded-sm group hover:border-[#1428C9]/20 transition-all">
                    <div className="p-2 bg-white rounded-sm shadow-sm text-gray-400 group-hover:text-[#1428C9] transition-all">
                      <item.icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.label}</p>
                      <p className={`text-xs font-bold truncate ${item.color || 'text-[#111827]'}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div className="pt-4 space-y-4">
             <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] px-1">
                Zone de danger
              </h4>
              <button className="w-full flex items-center gap-3 p-3 text-red-500 bg-red-50 border border-red-100 rounded-sm hover:bg-red-100 transition-all group">
                <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Supprimer la conversation</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPanel;
