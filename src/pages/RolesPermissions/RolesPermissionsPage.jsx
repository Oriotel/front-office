import React, { useState, useMemo } from 'react';
import RoleList from './components/RoleList';
import PermissionMatrix from './components/PermissionMatrix';
import UserList from './components/UserList';
import { Save, ShieldCheck, X } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { clsx } from 'clsx';

// MOCK_USERS 
const MOCK_USERS = [
  { id: 1, roleId: 'admin', name: 'Jean Dupont', email: 'jean.dupont@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=1', online: true },
  { id: 2, roleId: 'admin', name: 'Marie Curie', email: 'marie.curie@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=2', online: false },
  { id: 3, roleId: 'admin', name: 'Thomas Pesquet', email: 't.pesquet@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=3', online: true },
  { id: 4, roleId: 'assistant', name: 'Alice Martin', email: 'a.martin@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=4', online: true },
  { id: 5, roleId: 'assistant', name: 'Bob Durand', email: 'b.durand@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=5', online: true },
  { id: 6, roleId: 'animator', name: 'Charlie West', email: 'c.west@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=6', online: false },
  { id: 7, roleId: 'counter', name: 'David Smith', email: 'd.smith@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=7', online: true },
  { id: 8, roleId: 'supervisor', name: 'Elena G.', email: 'e.gomez@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=8', online: true },
  { id: 9, roleId: null, name: 'Lucas Martin', email: 'l.martin@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=9', online: false },
  { id: 10, roleId: null, name: 'Sophie L.', email: 'sophie@oriotel.fr', avatar: 'https://i.pravatar.cc/150?u=10', online: true },
];

const INITIAL_ROLES_DATA = [
  { id: 'admin', name: 'Administrateur', users: 3, color: 'bg-indigo-500' },
  { id: 'assistant', name: 'Assistant', users: 2, color: 'bg-emerald-500' },
  { id: 'animator', name: 'Animateur', users: 1, color: 'bg-amber-500' },
  { id: 'counter', name: 'Compteur', users: 1, color: 'bg-rose-500' },
  { id: 'supervisor', name: 'Superviseur', users: 1, color: 'bg-blue-500' },
];

const RolesPermissionsPage = () => {
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState(INITIAL_ROLES_DATA);
  const [users, setUsers] = useState(MOCK_USERS);

  // Single selection: string instead of array
  const [selectedRole, setSelectedRole] = useState('admin');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const [permissions, setPermissions] = useState({
    'Utilisateurs': { 'Lecture': true, 'Création': true, 'Modification': true },
    'Stock': { 'Lecture': true, 'Export': true },
  });

  // Calculate roles for display dynamically
  const displayRoles = useMemo(() => {
    return roles.map(r => ({
      ...r,
      users: users.filter(u => u.roleId === r.id).length
    }));
  }, [roles, users]);

  // Handle single role selection
  const handleSelectRole = (roleId) => {
    setSelectedRole(roleId);
    // Clear user selection when role changes
    setSelectedUsers([]);
  };

  // Toggle a user in/out of selected set
  const handleToggleUser = (user) => {
    setSelectedUsers(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  };

  // Filtered users: show users belonging to the selected role
  const roleUsers = useMemo(() => {
    let all = users;
    if (searchQuery.trim() !== '') {
      all = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return all.filter(u => u.roleId === selectedRole);
  }, [selectedRole, searchQuery, users]);

  // Summary labels
  const selectedRoleName = displayRoles.find(r => r.id === selectedRole)?.name;

  const handleTogglePermission = (module, action) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action]
      }
    }));
  };

  const handleAddRole = () => {
    if (newRoleName.trim() === '') return;
    const newId = newRoleName.toLowerCase().replace(/\s+/g, '_');
    setRoles([...roles, { id: newId, name: newRoleName, users: 0, color: 'bg-gray-700' }]);
    setIsModalOpen(false);
    setNewRoleName('');
    setSelectedRole(newId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-32">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-text-dark tracking-tight">Gestion des accès</h1>
            <p className="text-gray-500 text-sm">Configuration centralisée des permissions d'équipes.</p>
          </div>

        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 border-b border-gray-100 pb-4">
          <StepIndicator number={1} label="Rôles" active={step >= 1} current={step === 1} onClick={() => setStep(1)} badge={selectedRole ? 1 : 0} />
          <div className="h-px w-10 bg-gray-200" />
          <StepIndicator number={2} label="Collaborateurs" active={step >= 2} current={step === 2} onClick={() => setStep(2)} badge={selectedUsers.length} />
          <div className="h-px w-10 bg-gray-200" />
          <StepIndicator number={3} label="Permissions" active={step >= 3} current={step === 3} onClick={() => step >= 2 && setStep(3)} disabled={step < 2} />
        </div>

        {/* Step content */}
        <div className="bg-white border border-gray-200 p-6 min-h-[50vh]">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-text-dark tracking-tight">Étape 1 : Choisir un rôle</h2>
                  <p className="text-xs text-gray-500 mt-1">Sélectionnez le rôle à configurer</p>
                </div>
                {selectedRole && (
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                  >
                    Désélectionner
                  </button>
                )}
              </div>
              <RoleList
                roles={displayRoles}
                selectedRoles={selectedRole ? [selectedRole] : []}
                onToggleRole={handleSelectRole}
                onDoubleClickRole={(roleId) => {
                  handleSelectRole(roleId);
                  setStep(2);
                }}
                onAddRole={() => setIsModalOpen(true)}
              />
              <div className="mt-8 flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  {!selectedRole
                    ? 'Veuillez sélectionner un rôle.'
                    : `Rôle sélectionné : ${selectedRoleName}`}
                </p>
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedRole}
                  className="px-8 py-3 bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-bold text-text-dark tracking-tight">Étape 2 : Définir la cible</h2>
                  <p className="text-xs text-gray-500 mt-1">Sélection multiple — {selectedUsers.length} collaborateur(s) sélectionné(s)</p>
                </div>
                {selectedUsers.length > 0 && (
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                  >
                    Tout déselectionner
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Rôle filtré : <strong className="text-primary font-black">{selectedRoleName}</strong>. Passez cette étape pour appliquer au rôle complet.
              </p>

              <UserList
                users={roleUsers}
                selectedUserIds={selectedUsers.map(u => u.id)}
                onToggleUser={handleToggleUser}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roles={roles}
                onAssignRole={(userId, roleId) => {
                  setUsers(prev => prev.map(u => u.id === userId ? { ...u, roleId } : u));
                }}
              />

              <div className="mt-8 flex justify-between items-center">
                <button onClick={() => setStep(1)} className="px-8 py-3 bg-gray-100 text-gray-600 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                  ← Retour
                </button>
                <button onClick={() => setStep(3)} className="px-8 py-3 bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors">
                  {selectedUsers.length > 0
                    ? `Configurer ${selectedUsers.length} collaborateur(s) →`
                    : 'Configurer le(s) rôle(s) complet(s) →'}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="border-b border-gray-100 pb-4 flex flex-wrap gap-4 items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-dark tracking-tight">
                    Étape 3 : Permissions {selectedUsers.length > 0 ? 'individuelles' : 'de groupe'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedUsers.length > 0
                      ? `Appliqué à : ${selectedUsers.map(u => u.name.split(' ')[0]).join(', ')}`
                      : `Appliqué au rôle : ${selectedRoleName}`}
                  </p>
                </div>

                {/* Selection summary pills */}
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.length > 0
                    ? selectedUsers.map(u => (
                      <span key={u.id} className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 text-primary text-[10px] font-bold uppercase">
                        <img src={u.avatar} className="w-4 h-4 object-cover" alt="" />
                        {u.name.split(' ')[0]}
                      </span>
                    ))
                    : (
                      <span className="px-3 py-1 bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase">
                        {selectedRoleName}
                      </span>
                    )
                  }
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Matrice des modules</h3>
                <PermissionMatrix permissions={permissions} onToggle={handleTogglePermission} />
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button onClick={() => setStep(2)} className="px-8 py-3 bg-gray-100 text-gray-600 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                  ← Modifier la cible
                </button>
                <button className="px-10 py-3 bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-3">
                  <Save size={18} />
                  Sauvegarder les droits
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-text-dark">Ajouter un nouveau rôle</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
            </div>
            <div className="p-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nom du rôle</label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                placeholder="Ex: Responsable RH"
                autoFocus
                className="w-full border-2 border-gray-200 p-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-600 font-bold text-sm uppercase hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleAddRole} disabled={!newRoleName.trim()} className="px-5 py-2.5 bg-primary text-white font-bold text-sm uppercase hover:bg-primary/90 disabled:opacity-50">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

/* Step indicator with optional badge */
const StepIndicator = ({ number, label, active, current, onClick, disabled, badge }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      "flex items-center gap-3 px-2 py-1 transition-colors",
      disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer group"
    )}
  >
    <div className="relative">
      <div className={clsx(
        "w-8 h-8 flex items-center justify-center text-xs font-bold transition-all",
        current ? "bg-primary text-white border-2 border-primary" :
          active ? "bg-primary/10 text-primary border-2 border-primary/20 group-hover:border-primary/40" :
            "bg-gray-100 text-gray-400 border-2 border-gray-200"
      )}>
        {number}
      </div>
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[9px] font-black flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
    <span className={clsx(
      "text-sm font-bold uppercase tracking-tight",
      current ? "text-primary" : active ? "text-text-dark" : "text-gray-400"
    )}>
      {label}
    </span>
  </button>
);

export default RolesPermissionsPage;
