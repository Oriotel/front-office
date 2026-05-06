import { ChevronLeft, ChevronRight } from 'lucide-react';
import UserTableHeader from './UserTableHeader';
import UserTableRow from './UserTableRow';
import UserCard from './UserCard';
import Button from '../common/Button';

const UserTable = ({ users, onEdit, onView, onDelete }) => {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-sm border border-gray-100 p-12 mt-8 text-center">
        <p className="text-gray-400 font-medium">Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Mobile/Tablet View (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden lg:block bg-white rounded-sm border border-gray-100 transition-all shadow-sm max-w-full overflow-hidden">
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="w-full text-left border-collapse table-fixed lg:table-auto">
            <UserTableHeader />
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onView={onView}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-5 bg-white border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 italic">
          Affichage de <span className="text-[#111827] font-bold">1</span> à <span className="text-[#111827] font-bold">{users.length}</span> sur <span className="text-[#111827] font-bold">{users.length}</span>
        </p>
        <div className="flex items-center gap-6">
          <button className="text-gray-300 hover:text-gray-400 transition-colors cursor-not-allowed">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 bg-[#1428C9] text-white rounded-sm text-sm font-bold flex items-center justify-center">1</button>
            <button className="text-sm font-bold text-gray-400 hover:text-[#111827] transition-colors px-2">2</button>
            <button className="text-sm font-bold text-gray-400 hover:text-[#111827] transition-colors px-2">3</button>
            <span className="text-sm font-bold text-gray-300 px-1">...</span>
          </div>
          <button className="text-gray-300 hover:text-[#1428C9] transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
