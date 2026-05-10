import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import {
  loginUser,
  registerUser,
  verify2FA,
  changePassword,
  logoutUser,
  clearError,
  resetRegistration,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectAuthStep,
  selectRegistrationStatus,
} from '@/store/slices/authSlice';

/**
 * Custom hook for authentication actions and state
 * Provides a clean API for components to interact with auth
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const authStep = useSelector(selectAuthStep);
  const registrationStatus = useSelector(selectRegistrationStatus);

  const handleLogin = useCallback(async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      const { requiresTwoFactor, requiresPasswordChange } = result.payload;
      if (requiresTwoFactor) {
        navigate('/auth/2fa');
      } else if (requiresPasswordChange) {
        navigate('/auth/change-password');
      } else if (result.payload.redirect) {
        navigate(result.payload.redirect);
      } else {
        navigate('/dashboard');
      }
    }
    return result;
  }, [dispatch, navigate]);

  const handleRegister = useCallback(async (data) => {
    const result = await dispatch(registerUser(data));
    return result;
  }, [dispatch]);

  const handleVerify2FA = useCallback(async (data) => {
    const result = await dispatch(verify2FA(data));
    if (verify2FA.fulfilled.match(result)) {
      if (auth.user?.mustChangePassword) {
        navigate('/auth/change-password');
      } else {
        navigate('/dashboard');
      }
    }
    return result;
  }, [dispatch, navigate, auth.user]);

  const handleChangePassword = useCallback(async (data) => {
    const result = await dispatch(changePassword(data));
    if (changePassword.fulfilled.match(result)) {
      navigate('/dashboard');
    }
    return result;
  }, [dispatch, navigate]);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleResetRegistration = useCallback(() => {
    dispatch(resetRegistration());
  }, [dispatch]);

  return {
    // State
    auth,
    user,
    isAuthenticated,
    isLoading,
    error,
    authStep,
    registrationStatus,
    registrationMessage: auth.registrationMessage,
    passwordChangeRequired: auth.passwordChangeRequired,
    twoFactorPending: auth.twoFactorPending,

    // Actions
    login: handleLogin,
    register: handleRegister,
    verify2FA: handleVerify2FA,
    changePassword: handleChangePassword,
    logout: handleLogout,
    clearError: handleClearError,
    resetRegistration: handleResetRegistration,
  };
};

export default useAuth;
