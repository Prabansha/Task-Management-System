// @ts-ignore
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { fetchTasks } from '../store/slices/taskSlice'
import TaskBoard from '../components/TaskBoard'
import TaskModal from '../components/TaskModal'
import TaskFilters from '../components/TaskFilters'
import TaskStats from '../components/TaskStats'
import { Plus, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard: React.FC = () => {
  const dispatch = useDispatch()
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchTasks() as any)
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleCreateTask = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'admin' ? 'Manage all tasks across your team' : 'Manage your personal tasks'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={handleCreateTask}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <TaskStats />

      {/* Filters */}
      {showFilters && (
        <div className="animate-slide-up">
          <TaskFilters />
        </div>
      )}

      {/* Task Board */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="loading-spinner h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        </div>
      ) : (
        <TaskBoard />
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard