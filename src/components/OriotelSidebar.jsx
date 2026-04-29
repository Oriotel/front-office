import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, CheckSquare, Package, Clock,
  Wallet, MessageSquare, Users, Settings, ChevronDown,
  ChevronRight, ChevronLeft, Activity, LayoutGrid
} from 'lucide-react';

const B = { blue: '#1428C9', white: '#F9FAFB', slate: '#111827' };

const NAV_SECTIONS = [
  {
    id: 'main',
    label: 'MAIN MENU',
    items: [
      { id: 'dashboard',    label: 'Dashboard',          icon: LayoutDashboard },
      { id: 'historique',   label: 'Historique',         icon: Activity,      active: true },
      { id: 'souscription', label: 'Souscriptions',      icon: FileText },
      { id: 'taches',       label: 'Tâches',             icon: CheckSquare },
      { id: 'stock',        label: 'Stock',              icon: Package },
      { id: 'pointage',     label: 'Pointage & Heures',  icon: Clock },
      { id: 'comptabilite', label: 'Comptabilité',       icon: Wallet },
      { id: 'communication',label: 'Communication',      icon: MessageSquare },
    ],
  },
];

const BOTTOM_ITEMS = [
  { id: 'users',    label: 'Utilisateurs', icon: Users },
  { id: 'settings', label: 'Paramètres',   icon: Settings },
];

const OriotelSidebar = ({ collapsed, onToggle }) => {
  const [openSections, setOpenSections] = useState({ main: true });

  const toggleSection = (id) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside
      className="flex flex-col h-screen transition-all duration-300 select-none flex-shrink-0"
      style={{
        width: collapsed ? 64 : 230,
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: `3px solid ${B.blue}` }}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5" style={{ color: B.blue }} />
            <span className="font-bold text-sm tracking-wide" style={{ color: B.slate }}>oriotel</span>
            <span className="font-black text-sm" style={{ color: B.blue }}>.</span>
          </div>
        )}
        {collapsed && <LayoutGrid className="w-5 h-5 mx-auto" style={{ color: B.blue }} />}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:opacity-80 transition-all ml-auto flex-shrink-0"
          style={{ background: `${B.blue}15`, color: B.blue }}
          title={collapsed ? 'Déplier' : 'Réduire'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1">
        {NAV_SECTIONS.map(section => (
          <div key={section.id}>
            {/* Section Header */}
            <button
              onClick={() => !collapsed && toggleSection(section.id)}
              className="w-full flex items-center justify-between px-4 py-2.5 mb-1 rounded-xl mx-2 transition-all font-bold text-xs tracking-widest"
              style={{
                width: collapsed ? 'calc(100% - 16px)' : 'calc(100% - 16px)',
                background: B.blue,
                color: '#fff',
              }}
              title={collapsed ? section.label : ''}
            >
              {!collapsed && <span>{section.label}</span>}
              {collapsed && <span className="mx-auto text-xs">≡</span>}
              {!collapsed && (
                openSections[section.id]
                  ? <ChevronDown className="w-4 h-4" />
                  : <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Items */}
            {(collapsed || openSections[section.id]) && section.items.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all group rounded-xl mx-auto"
                  style={{
                    width: 'calc(100% - 16px)',
                    marginLeft: 8,
                    background: item.active ? `${B.blue}12` : 'transparent',
                    color:      item.active ? B.blue : '#6b7280',
                    borderLeft: item.active ? `3px solid ${B.blue}` : '3px solid transparent',
                  }}
                  title={collapsed ? item.label : ''}
                  onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background=`${B.blue}08`; e.currentTarget.style.color=B.blue; } }}
                  onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6b7280'; } }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="py-3 space-y-1" style={{ borderTop: '1px solid #f3f4f6' }}>
        {BOTTOM_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-xl"
              style={{ width:'calc(100% - 16px)', marginLeft:8, color:'#6b7280' }}
              title={collapsed ? item.label : ''}
              onMouseEnter={e => { e.currentTarget.style.background=`${B.blue}08`; e.currentTarget.style.color=B.blue; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6b7280'; }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default OriotelSidebar;
