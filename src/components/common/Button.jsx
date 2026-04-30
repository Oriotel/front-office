import { cn } from '../../utils/cn';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-[#1428C9] text-white hover:bg-[#1428C9]/90 hover:shadow-xl shadow-lg shadow-blue-900/20 active:bg-[#1428C9]',
    secondary: 'bg-[#F0F3FF] text-[#1428C9] hover:bg-[#E0E7FF] active:bg-[#F0F3FF]',
    outline: 'border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#111827] active:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/10 active:bg-red-800',
    ghost: 'text-gray-400 hover:text-[#1428C9] hover:bg-[#F0F3FF] active:bg-[#F0F3FF]/80',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button 
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1) active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
      {children}
    </button>
  );
};

export default Button;
