import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task } from '../store/slices/taskSlice'
import TaskCard from './TaskCard'
import { Circle, Clock, CheckCircle } from 'lucide-react'

interface TaskColumnProps {
  id: Task['status']
  title: string
  tasks: Task[]
  color: string
}

const TaskColumn: React.FC<TaskColumnProps> = ({ id, title, tasks, color }) => {
  const { setNodeRef, isOver } = useDroppable({ id })

  const getIcon = () => {
    switch (id) {
      case 'todo':
        return <Circle className="h-5 w-5" />
      case 'inprogress':
        return <Clock className="h-5 w-5" />
      case 'done':
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Circle className="h-5 w-5" />
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'gray':
        return 'text-gray-600 bg-gray-100'
      case 'blue':
        return 'text-blue-600 bg-blue-100'
      case 'green':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="flex flex-col">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${getColorClasses()}`}>
            {getIcon()}
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`status-column flex-1 ${isOver ? 'drag-over' : ''}`}
      >
        <SortableContext items={tasks.map(task => task._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-sm">No tasks yet</p>
                <p className="text-xs text-gray-400">Drag tasks here or create new ones</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default TaskColumn