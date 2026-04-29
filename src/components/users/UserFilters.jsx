import { Search, RotateCcw, Plus } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { USER_ROLES, CONTRACT_TYPES, USER_STATUS } from '../../constants/users';

const UserFilters = ({ userCount, searchQuery, onSearchChange, filters, onFilterChange, onReset, onNewUser }) => {
  const roleOptions = [
    { value: '', label: 'Tous les rôles' },
    ...Object.values(USER_ROLES).map(role => ({ value: role, label: role }))
  ];

  const typeOptions = [
    { value: '', label: 'Tous les types' },
    ...Object.values(CONTRACT_TYPES).map(type => ({ value: type, label: type }))
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    ...Object.values(USER_STATUS).map(status => ({ value: status, label: status }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#111827]">Gestion des utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1">
            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium text-xs border border-blue-100">
              {userCount} utilisateurs au total
            </span>
          </p>
        </div>
        <Button onClick={onNewUser} icon={Plus} className="w-full sm:w-auto shadow-xl shadow-blue-900/20">
          Nouvel utilisateur
        </Button>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">
        <Input 
          icon={Search}
          placeholder="Rechercher par nom, identifiant..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          containerClassName="w-full lg:flex-1"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center gap-2 md:gap-3">
          <Select 
            options={typeOptions}
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full lg:min-w-[130px]"
          />
          <Select 
            options={roleOptions}
            value={filters.role}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="w-full lg:min-w-[160px]"
          />
          <Select 
            options={statusOptions}
            value={filters.statut}
            onChange={(e) => onFilterChange('statut', e.target.value)}
            className="w-full lg:min-w-[130px]"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset} 
            title="Réinitialiser" 
            icon={RotateCcw} 
            className="col-span-2 sm:col-span-1 lg:flex-none py-2.5"
          />
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
