import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import GuestGuard from '@/guards/GuestGuard'
import AuthGuard from '@/guards/AuthGuard'

// Lazy-loaded auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const RegisterVerifyPage = lazy(() => import('@/pages/auth/RegisterVerifyPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ForcePasswordChangePage = lazy(() => import('@/pages/auth/ForcePasswordChangePage'))
const TwoFactorPage = lazy(() => import('@/pages/auth/TwoFactorPage'))

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="auth-loading-spinner">
      <div className="auth-loading-dot"></div>
      <div className="auth-loading-dot"></div>
      <div className="auth-loading-dot"></div>
    </div>
  </div>
)

// Placeholder dashboard for post-login redirect
const DashboardPlaceholder = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0a0e1a',
    color: '#fff',
    fontFamily: 'Montserrat, sans-serif',
  }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 Bienvenue sur le Dashboard</h1>
      <p style={{ opacity: 0.7 }}>Authentification réussie. Le module Dashboard sera développé prochainement.</p>
    </div>
  </div>
)

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Auth routes (Guest only) */}
        <Route path="/login" element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        } />
        <Route path="/register" element={
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        } />
        <Route path="/register/verify" element={
          <GuestGuard>
            <RegisterVerifyPage />
          </GuestGuard>
        } />
        <Route path="/forgot-password" element={
          <GuestGuard>
            <ForgotPasswordPage />
          </GuestGuard>
        } />

        {/* Auth flow routes (2FA & password change) */}
        <Route path="/auth/2fa" element={<TwoFactorPage />} />
        <Route path="/auth/change-password" element={<ForcePasswordChangePage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <DashboardPlaceholder />
          </AuthGuard>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App