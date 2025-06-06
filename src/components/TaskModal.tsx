import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { RootState } from '../store/store'
import { createTask, updateTask } from '../store/slices/taskSlice'
import { Task } from '../store/slices/taskSlice'
import { X, Calendar, User, Flag, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task
}

interface TaskForm {
  title: string
  description: string
  priority: Task['priority']
  status: Task['status']
  dueDate: string
  assignedTo: string
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const isEditing = !!task

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskForm>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      assignedTo: user?.id || '',
    },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedTo: task.assignedTo,
      })
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        assignedTo: user?.id || '',
      })
    }
  }, [task, reset, user?.id])

  const onSubmit = async (data: TaskForm) => {
    try {
      const taskData = {
        ...data,
        dueDate: data.dueDate || undefined,
      }

      if (isEditing && task) {
        await dispatch(updateTask({ id: task._id, updates: taskData }) as any).unwrap()
        toast.success('Task updated successfully')
      } else {
        await dispatch(createTask(taskData) as any).unwrap()
        toast.success('Task created successfully')
      }
      
      onClose()
    } catch (error) {
      toast.error(isEditing ? 'Failed to update task' : 'Failed to create task')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Task Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="input"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Flag className="h-4 w-4 inline mr-1" />
              Priority
            </label>
            <select {...register('priority')} className="input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Status (only for editing) */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select {...register('status')} className="input">
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          )}

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Due Date (Optional)
            </label>
            <input
              {...register('dueDate')}
              type="date"
              className="input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Assigned To (for admins) */}
          {user?.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Assign To
              </label>
              <select {...register('assignedTo')} className="input">
                <option value={user.id}>Myself</option>
                {/* In a real app, you'd fetch team members */}
                <option value="team-member-1">Team Member 1</option>
                <option value="team-member-2">Team Member 2</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditing ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal