import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import UsersPage from './pages/UsersPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/users" replace />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Paramètres</h1></div>} />
      </Route>
    </Routes>
  )
}

export default App