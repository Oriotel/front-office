import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component with variants, loading state, and icon support
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClass = 'auth-btn';
  const variantClass = `auth-btn--${variant}`;
  const sizeClass = `auth-btn--${size}`;
  const widthClass = fullWidth ? 'auth-btn--full' : '';
  const loadingClass = isLoading ? 'auth-btn--loading' : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="auth-btn-spinner" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={18} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon size={18} />}
        </>
      )}
    </button>
  );
};

export default Button;
