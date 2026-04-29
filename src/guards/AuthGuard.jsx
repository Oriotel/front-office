import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuth } from '@/store/slices/authSlice';

/**
 * AuthGuard — Protects routes that require authentication
 * Redirects to /login if user is not authenticated
 */
const AuthGuard = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { passwordChangeRequired, twoFactorPending } = useSelector(selectAuth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect pending auth steps to appropriate pages
    if (twoFactorPending) {
      return <Navigate to="/auth/2fa" replace />;
    }
    if (passwordChangeRequired) {
      return <Navigate to="/auth/change-password" replace />;
    }
    // Save intended destination for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
