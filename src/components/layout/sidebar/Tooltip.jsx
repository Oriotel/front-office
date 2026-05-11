import { memo } from 'react';
import { cn } from '../../../utils/cn';

const Tooltip = memo(({ name }) => {
  return (
    <span className={cn(
      "absolute left-20 px-3 py-2 rounded-sm whitespace-nowrap text-xs font-bold text-white bg-[#111827] z-[100]",
      // Transitions and Animations
      "opacity-0 translate-x-[-10px] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
      "lg:group-hover:opacity-100 lg:group-hover:translate-x-0",
      // Mobile hiding
      "hidden lg:block",
      // Browser compatibility and performance
      "will-change-[opacity,transform] transform-gpu"
    )}>
      {name}
      {/* Arrow */}
      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#111827] rotate-45 transform-gpu" />
    </span>
  );
});

export default Tooltip;
