import { memo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import Tooltip from './Tooltip';

const NavItem = memo(({ item, isActive, onClose }) => {
  return (
    <li className="relative group list-none w-full px-3">
      <Link
        to={item.href}
        onClick={() => onClose && onClose()}
        className={cn(
          // Base layout
          "flex items-center gap-4 w-full h-12 rounded-sm transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "active:scale-95 px-4",
          // Desktop specific: center icons when collapsed
          "lg:justify-center lg:px-0",
          // Active vs Inactive styles
          isActive
            ? "bg-[#1428C9] text-white shadow-lg shadow-[#1428C9]/20"
            : "text-gray-400 hover:bg-gray-50 hover:text-[#111827]",
          // Browser compatibility and performance
          "will-change-[background-color,transform] transform-gpu"
        )}
      >
        {/* Icon wrapper for perfect centering */}
        <div className="flex items-center justify-center min-w-[24px] pointer-events-none">
          {item.icon}
        </div>

        {/* Label - hidden on desktop collapsed state */}
        <span className={cn(
          "text-sm font-bold transition-all duration-300",
          "lg:hidden block" // Hidden on desktop because sidebar is collapsed by default
        )}>
          {item.name}
        </span>

        {/* Desktop Tooltip */}
        <Tooltip name={item.name} />
      </Link>
    </li>
  );
});

export default NavItem;
