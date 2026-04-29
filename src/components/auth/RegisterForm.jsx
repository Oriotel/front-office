import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, Phone, Building2, ChevronDown, FileText } from 'lucide-react';
import { registerSchema } from '@/validators/authValidators';
import { USER_ROLES, INTERNAL_TYPES, EXTERNAL_TYPES } from '@/constants/authConstants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import useAuth from '@/hooks/useAuth';
import { useState } from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';

/**
 * Registration form — Submits access request to admin
 * Available for Interne (Animateur, Assistant) and Externe (Agence, Opérateur) users
 */
const RegisterForm = () => {
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.INTERNE);
  const { register: registerUser, isLoading, error, clearError, registrationStatus, registrationMessage, resetRegistration } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: USER_ROLES.INTERNE,
      userType: '',
      companyName: '',
      reason: '',
      acceptTerms: false,
    },
  });

  const watchedRole = watch('role');
  const subtypes = watchedRole === USER_ROLES.INTERNE
    ? Object.values(INTERNAL_TYPES).map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))
    : Object.values(EXTERNAL_TYPES).map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }));

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setValue('role', role);
    setValue('userType', '');
  };

  const onSubmit = async (data) => {
    await registerUser(data);
  };

  // Success state
  if (registrationStatus === 'success') {
    return (
      <div className="register-success">
        <div className="register-success-icon">
          <CheckCircle size={64} />
        </div>
        <h2 className="register-success-title">Demande envoyée !</h2>
        <p className="register-success-message">{registrationMessage}</p>
        <div className="register-success-info">
          <p>Vous recevrez une notification par email une fois votre demande traitée par l&apos;administrateur.</p>
        </div>
        <div className="register-success-actions">
          <a href="/login" className="register-success-link">
            <ArrowLeft size={18} />
            <span>Retour à la connexion</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="register-form">
      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={clearError}
          className="register-alert"
        />
      )}

      {/* Info Alert */}
      <Alert
        type="info"
        title="Demande d'accès"
        message="Remplissez ce formulaire pour demander un accès à la plateforme. Votre demande sera examinée par un administrateur."
        dismissible={false}
        className="register-info"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="register-form-fields" noValidate>
        {/* Role Selection */}
        <div className="register-role-select">
          <label className="auth-input-label">Type d&apos;utilisateur <span className="auth-input-required">*</span></label>
          <div className="register-role-options">
            <button
              type="button"
              className={`register-role-btn ${selectedRole === USER_ROLES.INTERNE ? 'register-role-btn--active' : ''}`}
              onClick={() => handleRoleChange(USER_ROLES.INTERNE)}
            >
              <Building2 size={20} />
              <span>Interne</span>
              <small>Animateur, Assistant</small>
            </button>
            <button
              type="button"
              className={`register-role-btn ${selectedRole === USER_ROLES.EXTERNE ? 'register-role-btn--active' : ''}`}
              onClick={() => handleRoleChange(USER_ROLES.EXTERNE)}
            >
              <User size={20} />
              <span>Externe</span>
              <small>Agence, Opérateur</small>
            </button>
          </div>
        </div>

        {/* User Type */}
        <div className="auth-input-group">
          <label htmlFor="register-userType" className="auth-input-label">
            Fonction / Type
            <span className="auth-input-required">*</span>
          </label>
          <div className={`auth-select-wrapper ${errors.userType ? 'auth-input-wrapper--error' : ''}`}>
            <select
              id="register-userType"
              className="auth-select"
              {...register('userType')}
            >
              <option value="">Sélectionnez votre fonction</option>
              {subtypes.map((sub) => (
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

        {/* Name Fields */}
        <div className="register-row">
          <Input
            id="register-firstName"
            label="Prénom"
            icon={User}
            placeholder="Votre prénom"
            required
            error={errors.firstName?.message}
            autoComplete="given-name"
            {...register('firstName')}
          />
          <Input
            id="register-lastName"
            label="Nom"
            icon={User}
            placeholder="Votre nom"
            required
            error={errors.lastName?.message}
            autoComplete="family-name"
            {...register('lastName')}
          />
        </div>

        <Input
          id="register-email"
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
          id="register-phone"
          label="Numéro de téléphone"
          type="tel"
          icon={Phone}
          placeholder="+212 6XX XXX XXX"
          required
          error={errors.phone?.message}
          autoComplete="tel"
          {...register('phone')}
        />

        {/* Company name (for Externe) */}
        {selectedRole === USER_ROLES.EXTERNE && (
          <Input
            id="register-companyName"
            label="Nom de l'entreprise"
            icon={Building2}
            placeholder="Nom de votre entreprise"
            error={errors.companyName?.message}
            autoComplete="organization"
            {...register('companyName')}
          />
        )}

        {/* Reason / Justification */}
        <div className="auth-input-group">
          <label htmlFor="register-reason" className="auth-input-label">
            Motif de la demande
            <span className="auth-input-required">*</span>
          </label>
          <div className={`auth-input-wrapper auth-textarea-wrapper ${errors.reason ? 'auth-input-wrapper--error' : ''}`}>
            <FileText size={18} className="auth-textarea-icon" />
            <textarea
              id="register-reason"
              className="auth-textarea"
              placeholder="Décrivez brièvement la raison de votre demande d'accès..."
              rows={4}
              {...register('reason')}
            />
          </div>
          {errors.reason && (
            <p className="auth-input-error" role="alert">{errors.reason.message}</p>
          )}
        </div>

        {/* Terms & Conditions */}
        <label className="register-terms" htmlFor="register-acceptTerms">
          <input
            type="checkbox"
            id="register-acceptTerms"
            className="login-checkbox"
            {...register('acceptTerms')}
          />
          <span className="login-remember-checkmark"></span>
          <span>
            J&apos;accepte les{' '}
            <a href="/terms" className="register-terms-link">conditions d&apos;utilisation</a>
            {' '}et la{' '}
            <a href="/privacy" className="register-terms-link">politique de confidentialité</a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="auth-input-error" role="alert">{errors.acceptTerms.message}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Soumettre la demande
        </Button>
      </form>

      <div className="login-register-link">
        <span>Vous avez déjà un compte ?</span>
        <a href="/login">Se connecter</a>
      </div>
    </div>
  );
};

export default RegisterForm;
