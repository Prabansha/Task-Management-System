import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { CheckCircle, Clock, Circle, TrendingUp } from 'lucide-react'

const TaskStats: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)

  // Filter tasks based on user role
  const userTasks = user?.role === 'admin' 
    ? tasks 
    : tasks.filter(task => task.assignedTo === user?.id)

  const stats = {
    total: userTasks.length,
    todo: userTasks.filter(task => task.status === 'todo').length,
    inprogress: userTasks.filter(task => task.status === 'inprogress').length,
    done: userTasks.filter(task => task.status === 'done').length,
  }

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: TrendingUp,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: Circle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      title: 'In Progress',
      value: stats.inprogress,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: stats.done,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              {stat.title === 'Completed' && stats.total > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {completionRate}% completion rate
                </p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskStats