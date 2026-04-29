import { Bell, Search, User, Globe, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';

const Header = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap = {
    'users': 'Utilisateurs',
    'settings': 'Paramètres',
    'dashboard': 'Tableau de bord'
  };

  return (
    <header className="min-h-[4rem] py-3 lg:py-0 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm px-4 md:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:h-16">
        {/* Left: Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-medium overflow-x-auto whitespace-nowrap no-scrollbar py-1">
          <Link to="/" className="text-gray-400 hover:text-[#1428C9] transition-colors shrink-0">Accueil</Link>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const name = breadcrumbMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

            return (
              <div key={to} className="flex items-center gap-2 shrink-0">
                <ChevronRight size={14} className="text-gray-300" />
                {last ? (
                  <span className="font-bold text-[#111827]">{name}</span>
                ) : (
                  <Link to={to} className="text-gray-400 hover:text-[#1428C9] transition-colors">
                    {name}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-between lg:justify-end gap-2 md:gap-4 w-full lg:w-auto">
          <Input 
            icon={Search}
            placeholder="Rechercher..."
            containerClassName="flex-1 lg:w-80 lg:flex-none"
            className="py-2"
          />

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="sm" className="relative p-2 md:p-2.5">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#1428C9] rounded-full border-2 border-white"></span>
            </Button>

            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-bold">
              <Globe size={18} />
              <span>FR</span>
            </Button>

            {/* Profile */}
            <div className="flex items-center pl-2 md:pl-4 border-l border-gray-100 ml-1 md:ml-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:border-[#1428C9]/30 transition-all">
                <User size={20} className="md:size-22" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
