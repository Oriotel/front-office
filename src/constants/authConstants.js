/**
 * Authentication module constants
 * Centralized configuration for the Identity Service
 */

// User roles matching the Identity Service use case actors
export const USER_ROLES = {
  ADMIN: 'admin',
  INTERNE: 'interne',
  EXTERNE: 'externe',
};

// Sub-types for internal users
export const INTERNAL_TYPES = {
  ANIMATEUR: 'animateur',
  ASSISTANT: 'assistant',
};

// Sub-types for external users
export const EXTERNAL_TYPES = {
  AGENCE: 'agence',
  OPERATEUR: 'operateur',
};

export const REGISTRATION_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  VERIFICATION_REQUIRED: 'verification_required',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Auth flow steps
export const AUTH_STEPS = {
  LOGIN: 'login',
  TWO_FACTOR: 'two_factor',
  FORCE_PASSWORD_CHANGE: 'force_password_change',
  AUTHENTICATED: 'authenticated',
};

// Password policy
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
  SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

// Login tab configuration
export const LOGIN_TABS = [
  {
    id: USER_ROLES.ADMIN,
    labelKey: 'auth.login.tabs.admin',
    label: 'Administrateur',
    icon: 'Shield',
  },
  {
    id: USER_ROLES.INTERNE,
    labelKey: 'auth.login.tabs.interne',
    label: 'Interne',
    icon: 'Building2',
    subtypes: [
      { value: INTERNAL_TYPES.ANIMATEUR, label: 'Animateur' },
      { value: INTERNAL_TYPES.ASSISTANT, label: 'Assistant' },
    ],
  },
  {
    id: USER_ROLES.EXTERNE,
    labelKey: 'auth.login.tabs.externe',
    label: 'Externe',
    icon: 'Globe',
    subtypes: [
      { value: EXTERNAL_TYPES.AGENCE, label: 'Agence' },
      { value: EXTERNAL_TYPES.OPERATEUR, label: 'Opérateur' },
    ],
  },
];

// API endpoints (matching backend Identity Service v1)
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_REGISTRATION: '/auth/register/verify',
  LOGOUT: '/auth/logout',
  VERIFY_2FA: '/auth/two-factor/verify',
  RESEND_2FA: '/auth/two-factor/resend',
  CHANGE_PASSWORD: '/auth/change-password',
  FORCE_CHANGE_PASSWORD: '/auth/force-change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
};
