import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Search, ChevronLeft, ChevronRight, User, Clock, Activity, Monitor, Filter, Download, ShieldCheck, RefreshCw, X, FileText, Calendar, Globe } from 'lucide-react';
import { ACTION_TYPES, ROLES_COLORS, mockHistory } from './historyData';
import OriotelNavbar from '../components/OriotelNavbar';
import OriotelSidebar from '../components/OriotelSidebar';

const ITEMS_PER_PAGE = 8;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

// Brand colors
const B = { blue:'#1428C9', white:'#F9FAFB', slate:'#111827' };

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ entry, onClose }) => {
  if (!entry) return null;
  const ti = ACTION_TYPES[entry.type] || ACTION_TYPES.connexion;

  const exportFiche = () => {
    const doc = new jsPDF();
    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(20, 40, 201);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16); doc.setFont('helvetica', 'bold');
    doc.text('ORIOTEL – Fiche d\'Action', 14, 18);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text(`Généré le : ${fmtDate(new Date().toISOString())}`, 140, 18);
    autoTable(doc, {
      startY: 36,
      head: [['Champ', 'Valeur']],
      body: [
        ['Utilisateur', entry.user], ['Rôle', entry.role],
        ['Type', ti.label], ['Action', entry.action],
        ['Module', entry.module], ['Date & Heure', fmtDate(entry.date)],
        ['Adresse IP', entry.ip], ['Détails', entry.detail],
      ],
      styles: { fillColor: [255,255,255], textColor: [17,24,39], lineColor: [229,231,235], fontSize: 10 },
      headStyles: { fillColor: [20,40,201], textColor: [255,255,255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249,250,251] },
      columnStyles: { 0: { fontStyle:'bold', cellWidth:45 } },
    });
    doc.save(`oriotel_action_${entry.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background:'rgba(17,24,39,0.6)' }} />
      <div className="relative w-full max-w-xl rounded-md overflow-hidden border border-gray-200" style={{ background: B.white }} onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200" style={{ background: B.slate }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: '#1428C930' }}>
              <FileText className="w-5 h-5" style={{ color: B.white }} />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Détail de l'action</h2>
              <p className="text-xs text-gray-400">ID #{entry.id} · {entry.module}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* User Row */}
          <div className="flex items-center gap-4 p-4 rounded-md border border-gray-200 bg-white">
            <div className="w-11 h-11 rounded-md flex items-center justify-center text-white font-bold text-lg" style={{ background: B.blue }}>
              {entry.user.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm" style={{ color: B.slate }}>{entry.user}</div>
              <span className="text-xs px-2 py-0.5 rounded-md font-medium mt-1 inline-block" style={{ background:`${B.blue}15`, color: B.blue, border:`1px solid ${B.blue}30` }}>{entry.role}</span>
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-md border ${ti.color}`}>{ti.label}</span>
          </div>

          {/* Action */}
          <div className="p-4 rounded-xl border border-gray-200 bg-white">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: B.blue }}>Action effectuée</p>
            <p className="text-sm font-medium" style={{ color: B.slate }}>{entry.action}</p>
          </div>

          {/* Detail */}
          <div className="p-4 rounded-xl border border-gray-200 bg-white">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: B.blue }}>Description complète</p>
            <p className="text-sm leading-relaxed text-gray-600">{entry.detail}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'Date & Heure', value: fmtDate(entry.date) },
              { icon: Globe,    label: 'Adresse IP',   value: entry.ip },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-3 rounded-xl border border-gray-200 bg-white flex items-start gap-2">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: B.blue }} />
                <div><p className="text-xs text-gray-400">{label}</p><p className="text-xs font-medium font-mono" style={{ color: B.slate }}>{value}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6">
          <button onClick={exportFiche} className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-white text-sm font-semibold transition-all hover:opacity-90 shadow-none border border-gray-200" style={{ background: B.blue }}>
            <Download className="w-4 h-4" /> Exporter cette fiche en PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const UserHistoryPage = () => {
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedUser, setSelectedUser]     = useState('');
  const [selectedType, setSelectedType]     = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [dateFrom, setDateFrom]             = useState('');
  const [dateTo, setDateTo]                 = useState('');
  const [currentPage, setCurrentPage]       = useState(1);
  const [showFilters, setShowFilters]       = useState(false);
  const [selectedEntry, setSelectedEntry]   = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const uniqueUsers   = useMemo(() => [...new Set(mockHistory.map(i => i.user))], []);
  const uniqueModules = useMemo(() => [...new Set(mockHistory.map(i => i.module))], []);

  const filteredData = useMemo(() => {
    setCurrentPage(1);
    return mockHistory.filter(item => {
      const ms = item.action.toLowerCase().includes(searchTerm.toLowerCase()) || item.user.toLowerCase().includes(searchTerm.toLowerCase());
      const mu = selectedUser   ? item.user   === selectedUser   : true;
      const mt = selectedType   ? item.type   === selectedType   : true;
      const mm = selectedModule ? item.module === selectedModule : true;
      const d  = new Date(item.date);
      const mf = dateFrom ? d >= new Date(dateFrom + 'T00:00:00') : true;
      const mto= dateTo   ? d <= new Date(dateTo   + 'T23:59:59') : true;
      return ms && mu && mt && mm && mf && mto;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedUser, selectedType, selectedModule, dateFrom, dateTo]);

  const totalPages    = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = useMemo(() => filteredData.slice((currentPage-1)*ITEMS_PER_PAGE, currentPage*ITEMS_PER_PAGE), [filteredData, currentPage]);
  const clearFilters  = () => { setSearchTerm(''); setSelectedUser(''); setSelectedType(''); setSelectedModule(''); setDateFrom(''); setDateTo(''); };
  const activeCount   = [selectedUser, selectedType, selectedModule, dateFrom, dateTo].filter(Boolean).length;

  const exportTablePDF = () => {
    const doc = new jsPDF({ orientation:'landscape' });
    doc.setFillColor(249, 250, 251); doc.rect(0,0,297,210,'F');
    doc.setFillColor(20, 40, 201);  doc.rect(0,0,297,24,'F');
    doc.setTextColor(255,255,255); doc.setFontSize(14); doc.setFont('helvetica','bold');
    doc.text('ORIOTEL – Historique des Actions', 14, 16);
    doc.setFontSize(9); doc.setFont('helvetica','normal');
    doc.text(`Généré le : ${fmtDate(new Date().toISOString())} · ${filteredData.length} entrées`, 180, 16);
    autoTable(doc, {
      startY: 30,
      head:[['Utilisateur','Rôle','Type','Action','Module','Date & Heure','IP']],
      body: filteredData.map(r=>[r.user,r.role,ACTION_TYPES[r.type]?.label||r.type,r.action,r.module,fmtDate(r.date),r.ip]),
      styles:{ fillColor:[255,255,255], textColor:[17,24,39], lineColor:[229,231,235], fontSize:8 },
      headStyles:{ fillColor:[20,40,201], textColor:[255,255,255], fontStyle:'bold' },
      alternateRowStyles:{ fillColor:[249,250,251] },
    });
    doc.save(`oriotel_historique_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors shadow-none';

  return (
    <div className="min-h-screen" style={{ background: B.white }}>
      {selectedEntry && <DetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Page Title */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: B.slate }}>Historique des Actions</h1>
            <p className="text-sm text-gray-500 mt-1">Audit trail complet — Identity Service · <span className="font-medium" style={{ color: B.blue }}>{filteredData.length} entrées</span></p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium border border-gray-200 transition-all shadow-none"
              style={{ background: showFilters || activeCount > 0 ? `${B.blue}10` : '#fff', borderColor: showFilters || activeCount > 0 ? B.blue : '#e5e7eb', color: showFilters || activeCount > 0 ? B.blue : B.slate }}>
              <Filter className="w-4 h-4" />
              Filtres
              {activeCount > 0 && <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold shadow-none border-none" style={{ background: B.blue }}>{activeCount}</span>}
            </button>
            <button onClick={exportTablePDF}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md text-white text-sm font-semibold transition-all hover:opacity-90 shadow-none border border-gray-200"
              style={{ background: B.blue }}>
              <Download className="w-4 h-4" /> Exporter PDF
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label:'Total actions',   value: mockHistory.length },
            { label:'Connexions',      value: mockHistory.filter(i=>i.type==='connexion').length },
            { label:'Souscriptions',   value: mockHistory.filter(i=>i.type==='souscription'||i.type==='validation').length },
            { label:'Anomalies/Refus', value: mockHistory.filter(i=>i.type==='anomalie'||i.type==='refus').length },
          ].map((s,i) => (
            <div key={s.label} className="bg-white rounded-md p-5 border border-gray-200 shadow-none transition-all">
              <div className="text-3xl font-bold shadow-none border-none" style={{ color: i===0 ? B.blue : i===1 ? '#059669' : i===2 ? '#7c3aed' : '#dc2626' }}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1 shadow-none border-none">{s.label}</div>
              <div className="mt-3 h-1 rounded-full shadow-none border-none" style={{ background: `${B.blue}15` }}>
                <div className="h-1 rounded-full transition-all shadow-none border-none" style={{ width:`${(s.value/mockHistory.length)*100}%`, background: B.blue }} />
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input id="history-search" type="text" placeholder="Rechercher une action, un utilisateur…"
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-md text-sm outline-none shadow-none transition-all"
            style={{ color: B.slate }}
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          {searchTerm && <button onClick={()=>setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white border border-gray-200 p-5 rounded-md shadow-none grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: B.blue }}><User className="w-3.5 h-3.5" /> Utilisateur</label>
              <select id="filter-user" className={inputCls} style={{ color: B.slate }} value={selectedUser} onChange={e=>setSelectedUser(e.target.value)}>
                <option value="">Tous</option>{uniqueUsers.map(u=><option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: B.blue }}><Activity className="w-3.5 h-3.5" /> Type d'action</label>
              <select id="filter-type" className={inputCls} style={{ color: B.slate }} value={selectedType} onChange={e=>setSelectedType(e.target.value)}>
                <option value="">Tous</option>{Object.entries(ACTION_TYPES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: B.blue }}><ShieldCheck className="w-3.5 h-3.5" /> Module</label>
              <select id="filter-module" className={inputCls} style={{ color: B.slate }} value={selectedModule} onChange={e=>setSelectedModule(e.target.value)}>
                <option value="">Tous</option>{uniqueModules.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: B.blue }}><Clock className="w-3.5 h-3.5" /> Période</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold pointer-events-none" style={{ color: B.blue }}>De</span>
                  <input type="date" id="filter-date-from" className="w-full pl-8 pr-1 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none cursor-pointer" style={{ color: B.slate }}
                    value={dateFrom} max={dateTo||undefined} onChange={e=>setDateFrom(e.target.value)} />
                </div>
                <span className="text-gray-400 text-xs">→</span>
                <div className="flex-1 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold pointer-events-none" style={{ color: B.blue }}>À</span>
                  <input type="date" id="filter-date-to" className="w-full pl-6 pr-1 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none cursor-pointer" style={{ color: B.slate }}
                    value={dateTo} min={dateFrom||undefined} onChange={e=>setDateTo(e.target.value)} />
                </div>
              </div>
              {(dateFrom||dateTo) && <p className="text-xs mt-1 font-medium" style={{ color: B.blue }}>{dateFrom&&dateTo?`${new Date(dateFrom).toLocaleDateString('fr-FR')} → ${new Date(dateTo).toLocaleDateString('fr-FR')}`:dateFrom?`Depuis le ${new Date(dateFrom).toLocaleDateString('fr-FR')}`:`Jusqu'au ${new Date(dateTo).toLocaleDateString('fr-FR')}`}</p>}
            </div>
            {activeCount > 0 && (
              <button onClick={clearFilters} className="md:col-span-4 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors py-2">
                <RefreshCw className="w-4 h-4" /> Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-md shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr style={{ borderBottom:`2px solid ${B.blue}` }}>
                  {['Utilisateur','Type / Action','Module','Date & Heure','IP',''].map(h => (
                    <th key={h} className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: B.blue, background: `${B.blue}08` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? paginatedData.map((item, idx) => {
                  const ti  = ACTION_TYPES[item.type] || ACTION_TYPES.connexion;
                  return (
                    <tr key={item.id} onClick={() => setSelectedEntry(item)}
                      className="cursor-pointer group transition-all"
                      style={{ borderBottom:'1px solid #f3f4f6', background: idx%2===0?'#fff':'#f9fafb' }}
                      onMouseEnter={e => e.currentTarget.style.background=`${B.blue}08`}
                      onMouseLeave={e => e.currentTarget.style.background=idx%2===0?'#fff':'#fafafa'}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-sm text-white flex-shrink-0 transition-transform group-hover:scale-105 shadow-none" style={{ background: B.blue }}>
                            {item.user.charAt(0)}
                          </div>
                          <div className="shadow-none">
                            <div className="font-semibold text-sm shadow-none" style={{ color: B.slate }}>{item.user}</div>
                            <span className="text-xs px-2 py-0.5 rounded-md font-medium mt-0.5 inline-block shadow-none" style={{ background:`${B.blue}12`, color: B.blue, border:`1px solid ${B.blue}25` }}>{item.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${ti.color}`}>{ti.label}</span>
                        <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{item.action}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 shadow-none whitespace-nowrap">{item.module}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: B.blue }} />{fmtDate(item.date)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-mono">
                          <Monitor className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />{item.ip}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-gray-300 group-hover:font-semibold transition-all whitespace-nowrap" style={{ color:'inherit' }}>
                          <span className="group-hover:text-blue-600">Voir détails →</span>
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="6" className="px-6 py-20 text-center">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Aucun résultat trouvé</p>
                    <button onClick={clearFilters} className="mt-3 text-sm font-semibold underline" style={{ color: B.blue }}>Réinitialiser</button>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              Affichage <span className="font-semibold" style={{ color: B.slate }}>{(currentPage-1)*ITEMS_PER_PAGE+(paginatedData.length?1:0)}</span>–<span className="font-semibold" style={{ color: B.slate }}>{Math.min(currentPage*ITEMS_PER_PAGE, filteredData.length)}</span> sur <span className="font-semibold" style={{ color: B.blue }}>{filteredData.length}</span>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1}
                  className="p-2 rounded-md border border-gray-200 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-none"
                  style={{ background: 'white' }} onMouseEnter={e=>e.currentTarget.style.background=B.blue} onMouseLeave={e=>e.currentTarget.style.background='white'}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({length:totalPages}).map((_,i) => (
                  <button key={i} onClick={() => setCurrentPage(i+1)}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold border border-gray-200 transition-all shadow-none"
                    style={{ background: currentPage===i+1 ? B.blue : 'white', color: currentPage===i+1 ? 'white' : B.slate, borderColor: currentPage===i+1 ? B.blue : '#e5e7eb' }}>
                    {i+1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages}
                  className="p-2 rounded-md border border-gray-200 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-none"
                  style={{ background: 'white' }} onMouseEnter={e=>e.currentTarget.style.background=B.blue} onMouseLeave={e=>e.currentTarget.style.background='white'}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserHistoryPage;
