import React from 'react';
import { Search, HelpCircle, Bell, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="p-2.5 hover:bg-gray-100 text-gray-500 hover:text-primary transition-all active:scale-95 flex items-center justify-center border border-transparent hover:border-primary/10"
        >
          <Menu size={22} />
        </button>
        <div className="hidden sm:flex items-center gap-3">
           <img src="/logo_oriotel.png" alt="Oriotel" className="h-7 w-auto object-contain" />
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-6 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search activities, roles or settings..." 
            className="w-full pl-12 pr-4 py-2.5 bg-bg-light border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm outline-none text-text-dark"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-text-dark transition-colors text-sm font-medium">
          <HelpCircle size={18} />
          <span>Docs</span>
        </button>
        <div className="hidden md:block w-px h-6 bg-gray-100" />
        <div className="flex items-center gap-2 md:gap-4">
          <button className="relative p-2.5 text-gray-500 hover:text-text-dark transition-all hover:bg-gray-50">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white" />
          </button>
          <button className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-50 transition-all group">
            <div className="w-9 h-9 bg-primary text-white flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
              AD
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-bold text-text-dark">Admin User</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-tight">Super Admin</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
