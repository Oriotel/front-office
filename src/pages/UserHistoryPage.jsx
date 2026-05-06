import React, { useState, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Search, ChevronLeft, ChevronRight, Clock, Activity, Monitor,
  Filter, Download, ShieldCheck, RefreshCw, X, FileText, Calendar,
  Globe, AlertCircle, Loader2, User, CheckCircle2
} from 'lucide-react';
import { ACTION_TYPES, ROLES_COLORS } from './historyData';

const ITEMS_PER_PAGE = 8;
const B = { blue: '#1428C9', slate: '#111827' };

// ── Mock Data Generator ──────────────────────────────────────────────────────
const generateMockLogs = () => {
  const users = ['Admin Oriotel', 'Sarra Mejri', 'Ahmed Ben Ali', 'Yassine K.'];
  const roles = ['Administrateur', 'Animateur', 'Agence', 'Administrateur'];
  const types = ['connexion', 'modification', 'creation', 'suppression', 'export', 'anomalie'];
  const modules = ['Identity', 'Subscriptions', 'Operations', 'Communication', 'Stock'];
  
  return Array.from({ length: 45 }).map((_, i) => {
    const userIdx = i % users.length;
    const type = types[i % types.length];
    const module = modules[i % modules.length];
    return {
      id: 1000 + i,
      user: users[userIdx],
      role: roles[userIdx],
      type: type,
      module: module,
      action: `${type.charAt(0).toUpperCase() + type.slice(1)} effectuée dans le module ${module}`,
      detail: `L'utilisateur ${users[userIdx]} a effectué une opération de type ${type} sur les ressources du module ${module}. Tout s'est déroulé normalement.`,
      date: new Date(Date.now() - i * 3600000).toISOString(),
      ip: `192.168.1.${10 + i}`,
    };
  });
};

const MOCK_DATA = generateMockLogs();

const fmtDate = (d) => {
  if (!d) return '–';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ entry, onClose }) => {
  if (!entry) return null;
  const ti = ACTION_TYPES[entry.type] || { label: entry.type, color: 'bg-gray-100 text-gray-600 border-gray-200' };

  const exportFiche = () => {
    try {
      const doc = new jsPDF();
      
      // Header Blue Bar
      doc.setFillColor(20, 40, 201);
      doc.rect(0, 0, 210, 25, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('ORIOTEL ERP - FICHE D\'ACTION', 14, 16);
      
      // Table Data
      autoTable(doc, {
        startY: 35,
        head: [['Champ', 'Détails de l\'enregistrement']],
        body: [
          ['ID Log', `#${entry.id}`],
          ['Utilisateur', entry.user],
          ['Rôle', entry.role],
          ['Module', entry.module],
          ['Type d\'action', ti.label],
          ['Description', entry.action],
          ['Date & Heure', fmtDate(entry.date)],
          ['Adresse IP', entry.ip],
          ['Commentaire', entry.detail || 'Aucun détail supplémentaire'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [20, 40, 201], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45, fillColor: [245, 247, 250] } },
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Généré le ${new Date().toLocaleString()} · Page ${i} sur ${pageCount}`, 14, 285);
      }

      doc.save(`oriotel_action_${entry.id}.pdf`);
    } catch (err) {
      console.error('Erreur export PDF:', err);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Détail de l'action</h2>
              <p className="text-xs text-gray-400">#{entry.id} · {entry.module}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-[#1428C9] flex-shrink-0">
              {entry.user?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-slate-800">{entry.user}</div>
              <div className="text-xs text-gray-500">{entry.role}</div>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${ti.color} flex-shrink-0`}>{ti.label}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">Action</p>
            <p className="text-sm font-medium text-slate-800">{entry.action}</p>
          </div>

          {entry.detail && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">{entry.detail}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'Date & Heure', value: fmtDate(entry.date) },
              { icon: Globe, label: 'Adresse IP', value: entry.ip },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-2">
                <Icon className="w-3.5 h-3.5 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">{label}</p>
                  <p className="text-xs font-mono font-medium text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5 pt-2">
          <button onClick={exportFiche} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold bg-[#1428C9] hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <Download className="w-4 h-4" /> Exporter en PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const UserHistoryPage = () => {
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Simulation loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter Logic (Client-side for Mock)
  const filteredLogs = useMemo(() => {
    return MOCK_DATA.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUser = selectedUser === '' || log.user === selectedUser;
      const matchesType = selectedType === '' || log.type === selectedType;
      const matchesModule = selectedModule === '' || log.module === selectedModule;
      
      const logDate = new Date(log.date);
      const matchesFrom = dateFrom === '' || logDate >= new Date(dateFrom);
      const matchesTo = dateTo === '' || logDate <= new Date(dateTo);
      
      return matchesSearch && matchesUser && matchesType && matchesModule && matchesFrom && matchesTo;
    });
  }, [searchTerm, selectedUser, selectedType, selectedModule, dateFrom, dateTo]);

  // Pagination Logic
  const totalItems = filteredLogs.length;
  const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentItems = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Stats (Based on filtered data)
  const stats = useMemo(() => ({
    total: filteredLogs.length,
    connexions: filteredLogs.filter(l => l.type === 'connexion').length,
    creations: filteredLogs.filter(l => l.type === 'creation').length,
    anomalies: filteredLogs.filter(l => l.type === 'anomalie').length,
  }), [filteredLogs]);

  // Derived filters
  const filterOptions = {
    users: [...new Set(MOCK_DATA.map(l => l.user))],
    modules: [...new Set(MOCK_DATA.map(l => l.module))],
    types: Object.keys(ACTION_TYPES)
  };

  const clearFilters = () => { 
    setSearchTerm(''); setSelectedUser(''); setSelectedType(''); setSelectedModule(''); setDateFrom(''); setDateTo(''); 
    setCurrentPage(1);
  };
  
  const activeCount = [selectedUser, selectedType, selectedModule, dateFrom, dateTo].filter(Boolean).length;

  const exportPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape' });
      
      // Professional Header
      doc.setFillColor(20, 40, 201);
      doc.rect(0, 0, 297, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ORIOTEL ERP - RAPPORT D\'ACTIVITE UTILISATEURS', 14, 13);
      
      autoTable(doc, {
        startY: 25,
        head: [['Utilisateur', 'Rôle', 'Module', 'Action', 'Date & Heure', 'IP']],
        body: filteredLogs.map(r => [
          r.user, 
          r.role, 
          r.module, 
          r.action, 
          fmtDate(r.date), 
          r.ip
        ]),
        headStyles: { fillColor: [20, 40, 201], fontSize: 9 },
        styles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        margin: { top: 25 },
      });

      doc.save(`oriotel_historique_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('Erreur export global:', err);
      alert('Erreur lors de l\'exportation de la liste.');
    }
  };

  const inputCls = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {selectedEntry && <DetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Historique des Actions</h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            Mode Test Actif ·
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{totalItems} entrées trouvées</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${showFilters || activeCount > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {activeCount > 0 && <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">{activeCount}</span>}
          </button>
          <button
            onClick={exportPDF} disabled={filteredLogs.length === 0}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold bg-[#1428C9] hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
          >
            <Download className="w-4 h-4" /> Exporter PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total actions', value: stats.total, color: '#1428C9', icon: Activity },
          { label: 'Connexions', value: stats.connexions, color: '#059669', icon: Globe },
          { label: 'Créations', value: stats.creations, color: '#7c3aed', icon: CheckCircle2 },
          { label: 'Anomalies', value: stats.anomalies, color: '#dc2626', icon: AlertCircle },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
              <s.icon className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: s.color }} />
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{s.label}</div>
            <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: stats.total ? `${(s.value / stats.total) * 100}%` : '0%', background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text" placeholder="Rechercher par utilisateur ou description..."
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
          value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top duration-300">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1"><User className="w-3 h-3" /> Utilisateur</label>
            <select className={inputCls} value={selectedUser} onChange={e => { setSelectedUser(e.target.value); setCurrentPage(1); }}>
              <option value="">Tous les utilisateurs</option>
              {filterOptions.users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1"><Activity className="w-3 h-3" /> Type d'action</label>
            <select className={inputCls} value={selectedType} onChange={e => { setSelectedType(e.target.value); setCurrentPage(1); }}>
              <option value="">Tous les types</option>
              {filterOptions.types.map(t => <option key={t} value={t}>{ACTION_TYPES[t]?.label || t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Module concerné</label>
            <select className={inputCls} value={selectedModule} onChange={e => { setSelectedModule(e.target.value); setCurrentPage(1); }}>
              <option value="">Tous les modules</option>
              {filterOptions.modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1"><Clock className="w-3 h-3" /> Période de temps</label>
            <div className="flex gap-2">
              <input type="date" className={`${inputCls} flex-1`} value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }} />
              <input type="date" className={`${inputCls} flex-1`} value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }} />
            </div>
          </div>
          {activeCount > 0 && (
            <button onClick={clearFilters} className="sm:col-span-2 lg:col-span-4 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors pt-3 border-t border-dashed border-gray-100 mt-2">
              <RefreshCw className="w-3.5 h-3.5" /> Réinitialiser tous les filtres
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Utilisateur', 'Type / Action', 'Module', 'Date & Heure', 'IP'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!loading && currentItems.map((item) => {
                const ti = ACTION_TYPES[item.type] || { label: item.type, color: 'bg-gray-100 text-gray-500 border-gray-200' };
                const roleColor = ROLES_COLORS[item.role?.toLowerCase()] || 'bg-gray-50 text-gray-400 border-gray-100';
                
                return (
                  <tr key={item.id} onClick={() => setSelectedEntry(item)}
                    className="cursor-pointer hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white bg-[#1428C9] flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                          {item.user?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800">{item.user}</div>
                          <div className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border mt-0.5 inline-block ${roleColor}`}>{item.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${ti.color}`}>{ti.label}</span>
                      <p className="text-gray-500 text-xs mt-1 font-medium line-clamp-1">{item.action}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap">{item.module}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        {fmtDate(item.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-400 font-mono text-xs">
                        <Monitor className="w-3.5 h-3.5 flex-shrink-0" />{item.ip}
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-3/4" /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredLogs.length === 0 && (
            <div className="text-center py-32 px-6 flex-1">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-200" />
              </div>
              <h3 className="font-bold text-slate-700">Aucun résultat trouvé</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Nous n'avons trouvé aucune action correspondant à vos critères de recherche ou de filtrage.</p>
              <button onClick={clearFilters} className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200">
                Réinitialiser la vue
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && lastPage > 1 && (
          <div className="mt-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Page <span className="text-slate-800">{currentPage}</span> / <span className="text-slate-800">{lastPage}</span> · Total : <span className="text-blue-600">{totalItems} résultats</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-2.5 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 transition-all shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: lastPage }, (_, i) => {
                const p = i + 1;
                // Simple logic for brevity, shows all pages if few, else dots (skipped for this mock)
                return (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black transition-all border shadow-sm ${currentPage === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))} disabled={currentPage === lastPage}
                className="p-2.5 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 transition-all shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default UserHistoryPage;
