import { AUTH_ENDPOINTS } from '../constants/authConstants';

/**
 * Authentication Service Layer
 * 
 * This service provides a clean interface for auth API calls.
 * Currently uses mock data — swap with real API calls when backend is ready.
 * 
 * All methods return Promises to match real API behavior.
 */

// Simulated network delay
const simulateDelay = (ms = 1200) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database for development
const MOCK_USERS = {
  'admin@oriotel.com': {
    id: '1',
    email: 'admin@oriotel.com',
    firstName: 'Admin',
    lastName: 'Oriotel',
    role: 'admin',
    userType: null,
    mustChangePassword: false,
    twoFactorEnabled: true,
    permissions: ['*'],
    avatar: null,
  },
  'animateur@oriotel.com': {
    id: '2',
    email: 'animateur@oriotel.com',
    firstName: 'Mohammed',
    lastName: 'Alami',
    role: 'interne',
    userType: 'animateur',
    mustChangePassword: true,
    twoFactorEnabled: false,
    permissions: ['view_dashboard', 'manage_events'],
    avatar: null,
  },
  'agence@oriotel.com': {
    id: '3',
    email: 'agence@oriotel.com',
    firstName: 'Sara',
    lastName: 'Benali',
    role: 'externe',
    userType: 'agence',
    mustChangePassword: false,
    twoFactorEnabled: false,
    permissions: ['view_dashboard', 'submit_requests'],
    avatar: null,
  },
};

const MOCK_PASSWORD = 'Oriotel@2026';
const MOCK_2FA_CODE = '123456';
const MOCK_TOKEN = 'mock-jwt-token-' + Date.now();

class AuthService {
  /**
   * Login user with email and password
   * @param {Object} credentials - { email, password, role, userType }
   * @returns {Promise<Object>} - { user, token, refreshToken }
   */
  async login({ email, password, role, userType }) {
    await simulateDelay();

    const user = MOCK_USERS[email.toLowerCase()];

    if (!user || password !== MOCK_PASSWORD) {
      throw new Error('Email ou mot de passe incorrect');
    }

    if (user.role !== role) {
      throw new Error(`Ce compte n'est pas associé au rôle "${role}"`);
    }

    if (userType && user.userType !== userType) {
      throw new Error(`Type de compte invalide pour cet utilisateur`);
    }

    return {
      user,
      token: MOCK_TOKEN,
      refreshToken: 'mock-refresh-token-' + Date.now(),
      requiresTwoFactor: user.twoFactorEnabled,
      requiresPasswordChange: user.mustChangePassword,
    };
  }

  /**
   * Register a new user (submit access request to admin)
   * @param {Object} data - Registration form data
   * @returns {Promise<Object>} - { message, requestId }
   */
  async register(data) {
    await simulateDelay(1500);

    // Simulate email uniqueness check
    if (MOCK_USERS[data.email.toLowerCase()]) {
      throw new Error('Un compte avec cette adresse email existe déjà');
    }

    return {
      message: 'Votre demande d\'accès a été soumise avec succès. Un administrateur examinera votre demande.',
      requestId: 'REQ-' + Date.now(),
    };
  }

  /**
   * Verify 2FA code
   * @param {Object} data - { code, tempToken }
   * @returns {Promise<Object>} - { verified, token }
   */
  async verify2FA({ code }) {
    await simulateDelay(800);

    if (code !== MOCK_2FA_CODE) {
      throw new Error('Code de vérification invalide');
    }

    return {
      verified: true,
      token: MOCK_TOKEN,
    };
  }

  /**
   * Change password (forced on first login)
   * @param {Object} data - { currentPassword, newPassword }
   * @returns {Promise<Object>} - { success, message }
   */
  async changePassword({ currentPassword, newPassword }) {
    await simulateDelay();

    if (currentPassword !== MOCK_PASSWORD) {
      throw new Error('Le mot de passe actuel est incorrect');
    }

    return {
      success: true,
      message: 'Mot de passe modifié avec succès',
    };
  }

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  async logout() {
    await simulateDelay(300);
    // Clear tokens, session, etc.
    return { success: true };
  }

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise<Object>} - { token, refreshToken }
   */
  async refreshToken(refreshToken) {
    await simulateDelay(500);
    return {
      token: 'mock-jwt-token-refreshed-' + Date.now(),
      refreshToken: 'mock-refresh-token-refreshed-' + Date.now(),
    };
  }

  /**
   * Get current authenticated user profile
   * @returns {Promise<Object>} - User profile data
   */
  async getCurrentUser() {
    await simulateDelay(500);
    // In real implementation, this would use the stored token
    return MOCK_USERS['admin@oriotel.com'];
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
