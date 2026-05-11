import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserMinus, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Pencil, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Calendar,
  X
} from 'lucide-react';


// --- Sub-components ---

const StatsCard = ({ icon: Icon, title, value, badge, badgeColor, borderColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className={`bg-white p-6 rounded-2xl shadow-sm border-b-4 ${borderColor} flex flex-col justify-between h-full transition-shadow hover:shadow-md`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${borderColor.replace('border-', 'bg-').replace('-500', '-50')}`}>
        <Icon size={24} className={borderColor.replace('border-', 'text-')} />
      </div>
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
        {badge}
      </span>
    </div>
    <div>
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-2xl font-extrabold text-[#111827]">{value}</p>
    </div>
  </motion.div>
);

const FilterBar = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between mb-6 mt-8">
    <div className="flex flex-wrap gap-4 items-center flex-1">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher un employé..." 
          className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1428C9]/20 focus:border-[#1428C9] transition-all text-sm"
        />
      </div>
      <select className="bg-[#F9FAFB] border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1428C9]/20">
        <option>Statut: Tous</option>
        <option>Présent</option>
        <option>Retard</option>
        <option>Absent</option>
        <option>Incomplet</option>
      </select>
      <select className="bg-[#F9FAFB] border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1428C9]/20">
        <option>Rôle: Tous</option>
        <option>Réception</option>
        <option>Maintenance</option>
        <option>Cuisine</option>
      </select>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="date" 
          className="pl-9 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1428C9]/20"
        />
      </div>
    </div>
  </div>
);

const AttendanceRow = ({ data, index, onEdit }) => {
  const isLate = data.status === 'Retard';
  const isAbsent = data.status === 'Absent';
  
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Présent': return 'bg-green-100 text-green-700';
      case 'Retard': return 'bg-orange-100 text-orange-700';
      case 'Incomplet': return 'bg-gray-100 text-gray-700';
      case 'Absent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.tr 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isLate ? 'bg-orange-50/30' : ''} ${isAbsent ? 'bg-red-50/30' : ''}`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1428C9]/10 flex items-center justify-center text-[#1428C9] font-bold text-xs">
            {data.name.charAt(0)}
          </div>
          <span className="font-semibold text-[#111827]">{data.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{data.role}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{data.date}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-700">{data.arrival}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-700">{data.departure}</td>
      <td className="px-6 py-4 text-sm font-bold text-[#111827]">{data.total}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(data.status)}`}>
          {data.status}
        </span>
      </td>
      <td className="px-6 py-4">
        {data.anomaly && (
          <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase bg-red-100 text-red-600 border border-red-200">
            {data.anomaly}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-[#1428C9] transition-all">
            <Eye size={18} />
          </button>
          <button 
            onClick={() => onEdit(data)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-[#1428C9] transition-all"
          >
            <Pencil size={18} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

const EditModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#111827]/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[400px] bg-white rounded-[24px] shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-[#1428C9] p-6 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4">Correction manuelle</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
                  {data.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{data.name}</h3>
                  <p className="text-white/70 text-sm">{data.role}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Date concernée</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    defaultValue={data.date}
                    className="w-full pl-12 pr-4 py-3 bg-blue-50/50 border-none rounded-xl text-[#111827] font-semibold focus:ring-2 focus:ring-[#1428C9]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Heure arrivée</label>
                  <input 
                    type="text" 
                    defaultValue={data.arrival !== '--:--' ? data.arrival : '09:00 AM'}
                    className="w-full px-4 py-3 bg-blue-50/50 border-none rounded-xl text-[#111827] font-semibold focus:ring-2 focus:ring-[#1428C9]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Heure départ</label>
                  <input 
                    type="text" 
                    defaultValue={data.departure !== '--:--' ? data.departure : '06:00 PM'}
                    className="w-full px-4 py-3 bg-blue-50/50 border-none rounded-xl text-[#111827] font-semibold focus:ring-2 focus:ring-[#1428C9]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Raison de la correction</label>
                <textarea 
                  placeholder="Ex: Oubli de badgeage, Problème technique borne..."
                  className="w-full px-4 py-3 bg-blue-50/50 border-none rounded-xl text-[#111827] font-semibold focus:ring-2 focus:ring-[#1428C9]/20 transition-all min-h-[100px] resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 bg-blue-50 text-[#1428C9] font-bold rounded-xl hover:bg-blue-100 transition-all active:scale-95"
                >
                  Annuler
                </button>
                <button 
                  className="flex-1 py-4 bg-[#1428C9] text-white font-bold rounded-xl hover:bg-[#0f1f9c] shadow-lg shadow-[#1428C9]/20 transition-all active:scale-95"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main Page Component ---

const WorkTimeManagement = () => {
  const [activePeriod, setActivePeriod] = useState('Aujourd’hui');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const periods = ['Aujourd’hui', 'Cette semaine', 'Ce mois', 'Personnalisé'];

  const handleEdit = (data) => {
    setSelectedAttendance(data);
    setIsEditModalOpen(true);
  };

  const mockData = [
    {
      name: "Amélie Martin",
      role: "Réception",
      date: "24/05/2024",
      arrival: "08:02",
      departure: "17:15",
      total: "8h 13m",
      status: "Présent",
      anomaly: null
    },
    {
      name: "Jean Dupont",
      role: "Maintenance",
      date: "24/05/2024",
      arrival: "09:45",
      departure: "18:00",
      total: "7h 15m",
      status: "Retard",
      anomaly: "RETARD +45M"
    },
    {
      name: "Marc Lemoine",
      role: "Cuisine",
      date: "24/05/2024",
      arrival: "08:00",
      departure: "--:--",
      total: "--",
      status: "Incomplet",
      anomaly: null
    },
    {
      name: "Sophie Bernard",
      role: "Réception",
      date: "24/05/2024",
      arrival: "--:--",
      departure: "--:--",
      total: "0h",
      status: "Absent",
      anomaly: "NON JUSTIFIÉ"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-12">
      <EditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        data={selectedAttendance} 
      />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight mb-1">Temps de travail</h1>
          <p className="text-gray-500 font-medium">Suivi et gestion des pointages du personnel ORIOTEL.</p>
        </div>

        <div className="flex items-center gap-4 bg-gray-100/50 p-1 rounded-xl">
          <div className="flex p-1 bg-gray-200/50 rounded-lg">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activePeriod === period 
                    ? 'bg-white text-[#1428C9] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-[#1428C9] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#0f1f9c] transition-all shadow-lg shadow-[#1428C9]/20 active:scale-95">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon={Users}
          title="PRÉSENTS AUJOURD'HUI"
          value="42 / 45"
          badge="STABLE"
          badgeColor="bg-green-100 text-green-600"
          borderColor="border-green-500"
          delay={0.1}
        />
        <StatsCard 
          icon={UserMinus}
          title="ABSENTS"
          value="3"
          badge="+2 VS HIER"
          badgeColor="bg-red-100 text-red-600"
          borderColor="border-red-500"
          delay={0.2}
        />
        <StatsCard 
          icon={AlertTriangle}
          title="RETARDS DÉTECTÉS"
          value="12"
          badge="ALERTE"
          badgeColor="bg-orange-100 text-orange-600"
          borderColor="border-orange-500"
          delay={0.3}
        />
        <StatsCard 
          icon={Clock}
          title="HEURES SUPPLÉMENTAIRES"
          value="84h estim."
          badge="PÉRIODE"
          badgeColor="bg-blue-100 text-blue-600"
          borderColor="border-blue-500"
          delay={0.4}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Personnel</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrivée</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Départ</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Anomalie</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, idx) => (
                <AttendanceRow key={idx} data={row} index={idx} onEdit={handleEdit} />
              ))}
            </tbody>
          </table>
        </div>


        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            Affichage de <span className="text-[#111827] font-bold">4</span> sur <span className="text-[#111827] font-bold">45</span> employés
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-all">
              <ChevronLeft size={18} />
            </button>
            <button className="w-9 h-9 bg-[#1428C9] text-white rounded-lg font-bold text-sm shadow-md shadow-[#1428C9]/20">1</button>
            <button className="w-9 h-9 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all">2</button>
            <button className="w-9 h-9 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all">3</button>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkTimeManagement;
