import { Routes, Route } from 'react-router-dom'
import RolesPermissionsPage from './pages/RolesPermissions/RolesPermissionsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RolesPermissionsPage />} />
      <Route path="/roles-permissions" element={<RolesPermissionsPage />} />
      <Route path="*" element={<RolesPermissionsPage />} />
    </Routes>
  )
}

export default App