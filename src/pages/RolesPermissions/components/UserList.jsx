import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Search, UserPlus, ChevronDown, Check } from 'lucide-react';

const UserList = ({ users, selectedUserIds, onToggleUser, searchQuery, setSearchQuery, roles, onAssignRole }) => {
  return (
    <div className="h-[500px] flex flex-col border border-gray-100 bg-white">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un collaborateur par nom ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">

        {/* Unified Users Table */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-l-2 border-primary pl-2">
            Collaborateurs ({users.length})
          </h3>
          {users.length === 0 ? (
            <div className="p-4 bg-gray-50 border border-dashed border-gray-200 text-center">
              <p className="text-xs text-gray-500 font-medium">Aucun collaborateur trouvé.</p>
            </div>
          ) : (
            <div className="border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 p-3"></th>
                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Collaborateur</th>
                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-10">Rôle / Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <UserRow
                      key={user.id}
                      user={user}
                      isSelected={selectedUserIds.includes(user.id)}
                      onToggle={() => onToggleUser(user)}
                      roles={roles}
                      onAssignRole={onAssignRole}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

/* ── Unified Table Row for all users ── */
const UserRow = ({ user, isSelected, onToggle, roles, onAssignRole }) => {
  const currentRole = roles.find(r => r.id === user.roleId);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAssign = (role) => {
    setIsOpen(false);
    onAssignRole && onAssignRole(user.id, role.id);
  };

  return (
    <tr 
      onClick={onToggle}
      className={clsx(
        "group cursor-pointer transition-colors border-b border-gray-100 last:border-0",
        isSelected ? "bg-primary/5" : "bg-white hover:bg-gray-50"
      )}
    >
      <td className="p-3 text-center w-12">
        <div className={clsx(
          "w-5 h-5 mx-auto flex items-center justify-center border-2 transition-all",
          isSelected
            ? "bg-primary border-primary"
            : "bg-white border-gray-200 group-hover:border-gray-400"
        )}>
          {isSelected && <Check size={12} className="text-white stroke-[3]" />}
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className={clsx(
                "w-8 h-8 object-cover border-2",
                isSelected ? "border-primary" : "border-gray-200"
              )}
            />
            <div className={clsx(
              "absolute -bottom-1 -right-1 w-2.5 h-2.5 border-2 border-white",
              user.online ? "bg-green-500" : "bg-gray-300"
            )} />
          </div>
          <div className="flex flex-col">
            <span className={clsx(
              "text-sm font-bold",
              isSelected ? "text-primary" : "text-text-dark"
            )}>
              {user.name}
            </span>
            <span className="text-[10px] text-gray-500">{user.email}</span>
          </div>
        </div>
      </td>
      <td className="p-3 relative text-right pr-6" onClick={e => e.stopPropagation()}>
        <div ref={dropdownRef} className="inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              "inline-flex items-center gap-2 px-3 py-1.5 transition-all text-[10px] font-bold uppercase border",
              currentRole 
                ? "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300" 
                : "bg-primary border-primary text-white hover:bg-primary/90"
            )}
          >
            {currentRole ? (
              <>
                <div className={clsx("w-2 h-2", currentRole.color || "bg-gray-500")} />
                <span>{currentRole.name}</span>
              </>
            ) : (
              <>
                <UserPlus size={12} />
                <span>Rôle</span>
              </>
            )}
            <ChevronDown size={11} className={clsx("transition-transform", isOpen && "rotate-180")} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 z-[99] shadow-xl text-left">
              <div className="p-2 border-b border-gray-100 bg-gray-50">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {currentRole ? "Modifier le rôle de" : "Attribuer un rôle à"}
                </p>
                <p className="text-xs font-bold text-text-dark truncate">{user.name}</p>
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleAssign(role)}
                    className={clsx(
                      "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/5 hover:text-primary transition-colors text-left border-b border-gray-50 last:border-0",
                      user.roleId === role.id && "bg-primary/5 text-primary"
                    )}
                  >
                    <div className={clsx("w-2 h-2 shrink-0", role.color || "bg-gray-500")} />
                    <span className="text-sm font-medium truncate">
                      {role.name}
                    </span>
                    {user.roleId === role.id && <Check size={12} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserList;
