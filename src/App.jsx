import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import GuestGuard from '@/guards/GuestGuard'
import AuthGuard from '@/guards/AuthGuard'

import DashboardLayout from './components/layout/DashboardLayout'
import UsersPage from './pages/UsersPage'

// Lazy-loaded auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
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

        {/* Auth flow routes (2FA & password change) */}
        <Route path="/auth/2fa" element={<TwoFactorPage />} />
        <Route path="/auth/change-password" element={<ForcePasswordChangePage />} />

        {/* Protected routes */}
        <Route path="/" element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Paramètres</h1></div>} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/users" replace />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App