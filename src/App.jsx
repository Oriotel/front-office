import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import UserHistoryPage from './pages/UserHistoryPage'

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
) 

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/historique" element={<UserHistoryPage />} />
      </Routes>
    </Suspense>
  )
}

export default App