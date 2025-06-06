// @ts-ignore
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { logout } from '../store/slices/authSlice'
import { CheckSquare, LogOut, User, Settings } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-xs text-gray-500">Task Management System</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-error-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout