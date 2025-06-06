import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { setFilter } from '../store/slices/taskSlice'
import { Filter, X } from 'lucide-react'

const TaskFilters: React.FC = () => {
  const dispatch = useDispatch()
  const { filter } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilter({ [key]: value }))
  }

  const clearFilters = () => {
    dispatch(setFilter({
      status: 'all',
      priority: 'all',
      assignedTo: 'all',
    }))
  }

  const hasActiveFilters = filter.status !== 'all' || filter.priority !== 'all' || filter.assignedTo !== 'all'

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={filter.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="input"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Assigned To Filter (for admins) */}
        {user?.role === 'admin' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned To
            </label>
            <select
              value={filter.assignedTo}
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              className="input"
            >
              <option value="all">All Users</option>
              <option value={user.id}>Myself</option>
              {/* In a real app, you'd fetch team members */}
              <option value="team-member-1">Team Member 1</option>
              <option value="team-member-2">Team Member 2</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskFilters