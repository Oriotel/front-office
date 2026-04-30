import { cn } from '../../utils/cn';

const Input = ({ 
  label, 
  error, 
  icon: Icon,
  className, 
  containerClassName,
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#1428C9]">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1428C9] transition-colors duration-200" size={18} />
        )}
        <input
          autoComplete="off"
          className={cn(
            'w-full bg-[#F0F3FF] border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#1428C9]/20 focus:ring-4 focus:ring-[#1428C9]/5 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) text-sm text-[#111827] font-semibold placeholder:text-gray-300',
            Icon ? 'pl-11 pr-4' : 'px-4',
            'py-3',
            error && 'border-red-500/20 focus:border-red-500/30 focus:ring-red-500/5',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>}
    </div>
  );
};

export default Input;
