import { Eye, Pencil, Phone, Mail, Hash } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { cn } from '../../utils/cn';
import { ROLE_STYLES, STATUS_STYLES } from '../../constants/users';

const UserCard = ({ user, onEdit, onView }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      {/* Top Section: Avatar & Basic Info */}
      <div className="flex items-start gap-4 mb-5">
        <div className="relative">
          <img src={user.avatar} alt="" className="w-14 h-14 rounded-2xl border border-gray-100 shadow-sm object-cover" />
          <div className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
            user.statut === 'Actif' ? "bg-green-500" : "bg-gray-300"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-[#111827] truncate">{user.prenom} {user.nom}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-bold text-[#1428C9] bg-[#F0F3FF] px-2 py-0.5 rounded-lg border border-[#1428C9]/5">
              {user.identifiant}
            </span>
            <Badge className={cn("scale-90 origin-left", STATUS_STYLES[user.statut])}>
              {user.statut}
            </Badge>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center shrink-0">
            <Mail size={14} />
          </div>
          <p className="text-xs font-medium truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center shrink-0">
            <Phone size={14} />
          </div>
          <p className="text-xs font-medium">{user.telephone}</p>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center shrink-0">
            <Hash size={14} />
          </div>
          <div className="flex items-center gap-2">
            <Badge className={ROLE_STYLES[user.role]}>{user.role}</Badge>
          </div>
        </div>
      </div>

      {/* Actions — status is read-only, no toggle */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onView(user)}
          className="flex-1 py-2.5"
          icon={Eye}
        >
          Voir
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(user)}
          className="flex-1 py-2.5"
          icon={Pencil}
        >
          Éditer
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
