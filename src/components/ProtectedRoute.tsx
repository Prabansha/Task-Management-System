import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../store/store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default ProtectedRoute