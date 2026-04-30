import { Search, RotateCcw, Plus, Calendar } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { USER_ROLES, USER_STATUS } from '../../constants/users';

const UserFilters = ({ userCount, searchQuery, onSearchChange, filters, onFilterChange, onReset, onNewUser }) => {
  const roleOptions = [
    { value: '', label: 'Tous les rôles' },
    ...Object.values(USER_ROLES).map(role => ({ value: role, label: role }))
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    ...Object.values(USER_STATUS).map(status => ({ value: status, label: status }))
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
            <span className="bg-[#1428C9]/5 text-[#1428C9] px-3 py-1 rounded-full font-bold text-[11px] border border-[#1428C9]/10 shadow-sm transition-all duration-300 hover:shadow-md">
              {userCount} utilisateurs au total
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mise à jour en temps réel</span>
          </p>
        </div>
        <Button onClick={onNewUser} icon={Plus} className="w-full md:w-auto h-12 shadow-xl shadow-blue-900/20 active:scale-95 transition-all duration-300">
          Nouvel utilisateur
        </Button>
      </div>

      <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <Input
          icon={Search}
          placeholder="Rechercher par nom, identifiant..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          containerClassName="w-full lg:flex-1"
          className="bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all duration-300"
        />

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <Select
            options={roleOptions}
            value={filters.role}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="min-w-[150px] bg-gray-50/50 hover:bg-gray-50 transition-all duration-300"
          />
          <Select
            options={statusOptions}
            value={filters.statut}
            onChange={(e) => onFilterChange('statut', e.target.value)}
            className="min-w-[140px] bg-gray-50/50 hover:bg-gray-50 transition-all duration-300"
          />

          {/* Date filter */}
          <div className="relative flex items-center group">
            <Calendar size={15} className="absolute left-3 text-gray-400 pointer-events-none group-focus-within:text-[#1428C9] transition-colors" />
            <input
              type="date"
              value={filters.dateCreation || ''}
              onChange={(e) => onFilterChange('dateCreation', e.target.value)}
              title="Filtrer par date de création"
              className="pl-9 pr-4 h-12 text-sm bg-gray-50/50 border-2 border-transparent rounded-xl text-[#111827] font-semibold focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#1428C9]/5 focus:border-[#1428C9]/20 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            />
          </div>

          {/* Prominent Reset button */}
          <button
            onClick={onReset}
            title="Réinitialiser les filtres"
            className="flex items-center justify-center w-12 h-12 bg-[#1428C9] text-white rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#1428C9]/90 hover:shadow-xl active:scale-90 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
