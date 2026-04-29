import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = ({ 
  label, 
  options = [], 
  error, 
  className, 
  containerClassName,
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'w-full appearance-none px-4 py-3 bg-[#F0F3FF] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1428C9]/10 transition-all text-sm text-[#111827] font-medium cursor-pointer',
            error && 'ring-2 ring-red-500/20',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>}
    </div>
  );
};

export default Select;
