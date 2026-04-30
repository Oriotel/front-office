import React from 'react';
import { Mail, Phone, ShieldCheck } from 'lucide-react';

const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 mb-4 overflow-hidden shadow-sm">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          user?.name ? user.name.charAt(0).toUpperCase() : 'U'
        )}
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name || 'Nom de l\'utilisateur'}</h2>
      
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
        <ShieldCheck size={16} />
        {user?.role || 'Administrateur'}
      </div>
      
      <div className="w-full space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
            <Mail size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Adresse email</p>
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email || 'email@exemple.com'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
            <Phone size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Téléphone</p>
            <p className="text-sm font-medium text-gray-900 truncate">{user?.phone || '+33 6 00 00 00 00'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
