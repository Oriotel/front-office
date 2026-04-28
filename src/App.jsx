import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
)

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
      </Routes>
    </Suspense>
  )
}

export default App