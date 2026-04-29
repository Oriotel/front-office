import { Eye, Pencil, ToggleLeft, ToggleRight } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { cn } from '../../utils/cn';
import { ROLE_STYLES, STATUS_STYLES } from '../../constants/users';

const UserTableRow = ({ user, onEdit, onToggleStatus, onView }) => {
  return (
    <tr className="hover:bg-[#F0F3FF]/30 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={user.avatar} alt="" className="w-11 h-11 rounded-xl border border-gray-100 bg-white object-cover" />
            <div className={cn(
              "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white",
              user.statut === 'Actif' ? "bg-green-500" : "bg-gray-300"
            )} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#111827] leading-tight">{user.prenom} {user.nom}</p>
            <p className="text-xs text-gray-400 mt-1">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-bold text-[#1428C9] bg-[#F0F3FF] px-2.5 py-1 rounded-lg border border-[#1428C9]/5">{user.identifiant}</span>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm font-medium text-[#111827]">{user.telephone}</p>
        <p className="text-[11px] text-gray-400 mt-1 font-medium italic">Créé le {user.dateCreation}</p>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2 items-start">
          <Badge className={ROLE_STYLES[user.role]}>{user.role}</Badge>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">{user.type}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge className={STATUS_STYLES[user.statut]}>{user.statut}</Badge>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => onView(user)} title="Voir le profil" icon={Eye} />
          <Button variant="ghost" size="sm" onClick={() => onEdit(user)} title="Modifier" icon={Pencil} className="hover:text-orange-600 hover:bg-orange-50" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onToggleStatus(user)} 
            title="Changer statut"
            className={user.statut === 'Actif' ? "text-green-500 hover:bg-green-50" : ""}
          >
            {user.statut === 'Actif' ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
