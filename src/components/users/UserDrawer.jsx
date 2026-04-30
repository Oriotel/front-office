import { X, Camera, Info, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { USER_ROLES } from '../../constants/users';

const DEFAULT_ROLES = Object.values(USER_ROLES);

const UserDrawer = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: USER_ROLES.ASSISTANT,
    cin: '',
    adresse: '',
    dateNaissance: '',
  });

  const [availableRoles, setAvailableRoles] = useState(DEFAULT_ROLES);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // If the user has a custom role not in the list, add it
      if (initialData.role && !availableRoles.includes(initialData.role)) {
        setAvailableRoles(prev => [...prev, initialData.role]);
      }
    } else {
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        role: USER_ROLES.ASSISTANT,
        cin: '',
        adresse: '',
        dateNaissance: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    setRoleDropdownOpen(false);
  };

  const handleAddNewRole = () => {
    const trimmed = newRoleName.trim();
    if (!trimmed) return;
    if (availableRoles.includes(trimmed)) {
      // Already exists – just select it
      setFormData(prev => ({ ...prev, role: trimmed }));
    } else {
      setAvailableRoles(prev => [...prev, trimmed]);
      setFormData(prev => ({ ...prev, role: trimmed }));
    }
    setNewRoleName('');
    setIsAddingRole(false);
    setRoleDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[500px] bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-8 flex items-center justify-between border-b border-gray-50">
          <h2 className="text-2xl font-bold text-[#111827]">
            {initialData ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} icon={X} />
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 pb-8 space-y-6 pt-4">
          {/* Photo Upload Placeholder */}
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-300">
              <Camera size={32} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Photo de profil</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="Dupont" required />
            <Input label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Jean" required />
          </div>

          <Input label="Email professionnel" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemple@oriotel.com" required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+33..." />
            <Input label="CIN / Identité" name="cin" value={formData.cin} onChange={handleChange} placeholder="AB123456" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Date de naissance" type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} />
            <Input label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Ville, Code Postal" />
          </div>

          {/* Simple Professional Select */}
          <Select 
            label="Attribuer un rôle"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={availableRoles.map(role => ({ value: role, label: role }))}
          />

          {!isAddingRole ? (
            <button
              type="button"
              onClick={() => setIsAddingRole(true)}
              className="text-[10px] font-bold text-[#1428C9] uppercase tracking-widest ml-1 hover:underline"
            >
              + Créer un rôle personnalisé
            </button>
          ) : (
            <div className="bg-[#F0F3FF] p-4 rounded-2xl border-2 border-dashed border-[#1428C9]/20 animate-in slide-in-up duration-300">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-[#1428C9] uppercase tracking-widest">Nouveau rôle</label>
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={newRoleName}
                    onChange={e => setNewRoleName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewRole(); } if (e.key === 'Escape') setIsAddingRole(false); }}
                    placeholder="ex: Manager Regional"
                    className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1428C9]/20"
                  />
                  <Button variant="primary" size="sm" onClick={handleAddNewRole} className="h-10 px-6">Créer</Button>
                  <button type="button" onClick={() => setIsAddingRole(false)} className="p-2 text-gray-400"><X size={20} /></button>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-[#F0F3FF] rounded-xl border border-blue-100 flex gap-3">
            <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <p className="text-[11px] text-[#1428C9] leading-relaxed font-bold">
              L'identifiant (format OR-YYYY-XXX) et le mot de passe provisoire seront générés automatiquement et envoyés par email.
            </p>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Button variant="outline" className="flex-1" onClick={onClose} type="button">Annuler</Button>
            <Button variant="primary" className="flex-[2]" type="submit">
              {initialData ? 'Mettre à jour' : 'Valider la création'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserDrawer;
