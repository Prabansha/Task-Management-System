import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { deleteTask } from '../store/slices/taskSlice'
import { Task } from '../store/slices/taskSlice'
import TaskModal from './TaskModal'
import { Calendar, User, MoreVertical, Edit, Trash2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging = false }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-700 border-error-200'
      case 'medium':
        return 'bg-warning-100 text-warning-700 border-warning-200'
      case 'low':
        return 'bg-success-100 text-success-700 border-success-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-3 w-3" />
      case 'medium':
        return <AlertCircle className="h-3 w-3" />
      case 'low':
        return <AlertCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const handleEdit = () => {
    setIsModalOpen(true)
    setShowMenu(false)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(task._id) as any).unwrap()
        toast.success('Task deleted successfully')
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
    setShowMenu(false)
  }

  const canEdit = user?.role === 'admin' || task.assignedTo === user?.id

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="task-card group relative"
        onClick={() => !isDragging && setIsModalOpen(true)}
      >
        {/* Priority Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {getPriorityIcon(task.priority)}
            {task.priority}
          </div>
          
          {canEdit && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-100 transition-all"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit()
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error-600 hover:bg-error-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Task Title */}
        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {task.title}
        </h4>

        {/* Task Description */}
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Task Meta */}
        <div className="space-y-2">
          {task.dueDate && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="h-3 w-3" />
            <span>Assigned to {task.assignedTo === user?.id ? 'you' : 'team member'}</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 rounded-l-lg"></div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
      />
    </>
  )
}

export default TaskCard