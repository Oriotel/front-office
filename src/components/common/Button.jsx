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
    primary: 'bg-[#1428C9] text-white hover:bg-[#0F1DA0] shadow-lg shadow-blue-900/20',
    secondary: 'bg-[#F0F3FF] text-[#1428C9] hover:bg-[#E0E7FF]',
    outline: 'border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#111827]',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/10',
    ghost: 'text-gray-400 hover:text-[#1428C9] hover:bg-[#F0F3FF]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button 
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
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
