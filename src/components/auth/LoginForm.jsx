import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, ChevronDown } from 'lucide-react';
import { loginSchema } from '../../validators/authValidators';
import { LOGIN_TABS, USER_ROLES } from '../../constants/authConstants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import useAuth from '@/hooks/useAuth';
import { useState } from 'react';

/**
 * Login Form component with role-based tabs (Admin, Interne, Externe)
 */
const LoginForm = () => {
  const [activeTab, setActiveTab] = useState(USER_ROLES.ADMIN);
  const { login, isLoading, error, clearError } = useAuth();

  const activeTabConfig = LOGIN_TABS.find(tab => tab.id === activeTab);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: USER_ROLES.ADMIN,
      userType: '',
      rememberMe: false,
    },
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setValue('role', tabId);
    setValue('userType', '');
    clearError();
  };

  const onSubmit = async (data) => {
    await login(data);
  };

  return (
    <div className="login-form">
      {/* Role Tabs */}
      <div className="login-tabs">
        {LOGIN_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`login-tab ${activeTab === tab.id ? 'login-tab--active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <span className="login-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={clearError}
          className="login-alert"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="login-form-fields" noValidate>
        {/* User Type Select (for Interne & Externe) */}
        {activeTabConfig?.subtypes && (
          <div className="auth-input-group">
            <label htmlFor="login-userType" className="auth-input-label">
              Type de compte
              <span className="auth-input-required">*</span>
            </label>
            <div className={`auth-select-wrapper ${errors.userType ? 'auth-input-wrapper--error' : ''}`}>
              <select
                id="login-userType"
                className="auth-select"
                {...register('userType')}
              >
                <option value="">Sélectionnez votre type</option>
                {activeTabConfig.subtypes.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="auth-select-icon" />
            </div>
            {errors.userType && (
              <p className="auth-input-error" role="alert">{errors.userType.message}</p>
            )}
          </div>
        )}

        <Input
          id="login-email"
          label="Adresse email"
          type="email"
          icon={Mail}
          placeholder="votre@email.com"
          required
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />

        <Input
          id="login-password"
          label="Mot de passe"
          type="password"
          icon={Lock}
          placeholder="Votre mot de passe"
          required
          error={errors.password?.message}
          autoComplete="current-password"
          {...register('password')}
        />

        {/* Remember me & Forgot password */}
        <div className="login-options">
          <label className="login-remember" htmlFor="login-remember">
            <input
              type="checkbox"
              id="login-remember"
              className="login-checkbox"
              {...register('rememberMe')}
            />
            <span className="login-remember-checkmark"></span>
            <span>Se souvenir de moi</span>
          </label>
          <a href="/forgot-password" className="login-forgot">
            Mot de passe oublié ?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Se connecter
        </Button>
      </form>

      {/* Register link (only for Interne & Externe) */}
      {activeTab !== USER_ROLES.ADMIN && (
        <div className="login-register-link">
          <span>Pas encore de compte ?</span>
          <a href="/register">Demander l&apos;accès</a>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
