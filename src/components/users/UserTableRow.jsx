import { Eye, Pencil } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { cn } from '../../utils/cn';
import { ROLE_STYLES, STATUS_STYLES } from '../../constants/users';

const UserTableRow = ({ user, onEdit, onView }) => {
  return (
    <tr className="hover:bg-[#F0F3FF]/50 hover:scale-[1.01] hover:z-10 transition-all duration-300 ease-in-out group border-b border-gray-50 last:border-0 relative animate-in fade-in slide-in-up">
      {/* 1. Photo */}
      <td className="px-6 py-4">
        <div className="relative w-10 h-10">
          {user.photo ? (
            <img src={user.photo} alt="" className="w-10 h-10 rounded-sm border border-gray-100 bg-white object-cover transition-all duration-300" />
          ) : (
            <div className="w-10 h-10 rounded-sm border border-gray-100 bg-slate-50 flex items-center justify-center text-[11px] font-bold text-slate-400 uppercase transition-all duration-300 group-hover:bg-slate-100">
              {user.prenom?.[0]}{user.nom?.[0]}
            </div>
          )}
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
            user.statut === 'Actif' ? "bg-green-500" : "bg-gray-300"
          )} />
        </div>
      </td>

      {/* 2. Nom & Prénom */}
      <td className="px-6 py-4">
        <p className="text-sm font-bold text-[#111827] whitespace-nowrap transition-colors group-hover:text-[#1428C9]">{user.prenom} {user.nom}</p>
      </td>

      {/* 3. Identifiant */}
      <td className="px-6 py-4">
        <span className="text-[10px] font-bold text-[#1428C9] bg-[#F0F3FF] px-2.5 py-1 rounded-sm border border-[#1428C9]/10 whitespace-nowrap transition-all duration-300">
          {user.identifiant}
        </span>
      </td>

      {/* 4. Email */}
      <td className="px-6 py-4">
        <p className="text-xs text-gray-500 font-medium truncate max-w-[150px] group-hover:text-gray-700 transition-colors duration-200" title={user.email}>
          {user.email}
        </p>
      </td>

      {/* 5. Téléphone */}
      <td className="px-6 py-4">
        <p className="text-xs font-bold text-[#111827] whitespace-nowrap">{user.telephone}</p>
      </td>

      {/* 6. CIN / ID */}
      <td className="px-6 py-4">
        <p className="text-xs font-medium text-gray-500 whitespace-nowrap">{user.cin || '-'}</p>
      </td>

      {/* 7. Rôle */}
      <td className="px-6 py-4">
        <Badge className={cn("whitespace-nowrap transition-all duration-300", ROLE_STYLES[user.role])}>{user.role}</Badge>
      </td>

      {/* 8. Date Naiss. */}
      <td className="px-6 py-4 text-center">
        <p className="text-xs text-gray-500 font-medium whitespace-nowrap">{user.dateNaissance || '-'}</p>
      </td>

      {/* 9. Création */}
      <td className="px-6 py-4">
        <p className="text-[11px] text-gray-400 font-medium italic whitespace-nowrap">{user.dateCreation}</p>
      </td>

      {/* 10. Statut */}
      <td className="px-6 py-4">
        <Badge className={cn("whitespace-nowrap transition-all duration-300", STATUS_STYLES[user.statut])}>{user.statut}</Badge>
      </td>

      {/* 11. Actions */}
      <td className="px-6 py-4 text-right pr-8">
        <div className="flex items-center justify-end gap-1 transition-all duration-300">
          <Button variant="ghost" size="sm" onClick={() => onView(user)} title="Voir le profil" icon={Eye} className="text-gray-400 hover:text-[#1428C9] hover:bg-[#F0F3FF]" />
          <Button variant="ghost" size="sm" onClick={() => onEdit(user)} title="Modifier" icon={Pencil} className="text-gray-400 hover:text-orange-600 hover:bg-orange-50" />
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
