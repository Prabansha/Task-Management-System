import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/store'
import { checkAuth } from './store/slices/authSlice'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { Loader2 } from 'lucide-react'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(checkAuth() as any)
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard\" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard\" replace /> : <Register />} 
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  )
}

export default App