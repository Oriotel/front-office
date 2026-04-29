import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Reusable Input component with label, icon, error state, and validation feedback
 */
const Input = forwardRef(({
  label,
  type = 'text',
  icon: Icon,
  error,
  helperText,
  className = '',
  required = false,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`auth-input-group ${className}`}>
      {label && (
        <label htmlFor={id} className="auth-input-label">
          {label}
          {required && <span className="auth-input-required">*</span>}
        </label>
      )}
      <div className={`auth-input-wrapper ${error ? 'auth-input-wrapper--error' : ''}`}>
        {Icon && (
          <span className="auth-input-icon">
            <Icon size={18} />
          </span>
        )}
        <input
          ref={ref}
          id={id}
          type={inputType}
          className="auth-input"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-input-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {error && !isPassword && (
          <span className="auth-input-error-icon">
            <AlertCircle size={16} />
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="auth-input-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="auth-input-helper">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
