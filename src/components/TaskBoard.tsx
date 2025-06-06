import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { RootState } from '../store/store'
import { updateTask, updateTaskStatus } from '../store/slices/taskSlice'
import { Task } from '../store/slices/taskSlice'
import TaskColumn from './TaskColumn'
import TaskCard from './TaskCard'
import { useState } from 'react'
import toast from 'react-hot-toast'

const TaskBoard: React.FC = () => {
  const dispatch = useDispatch()
  const { tasks, filter } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Filter tasks based on current filters and user role
  const filteredTasks = tasks.filter(task => {
    // Role-based filtering
    if (user?.role !== 'admin' && task.assignedTo !== user?.id) {
      return false
    }

    // Status filter
    if (filter.status !== 'all' && task.status !== filter.status) {
      return false
    }

    // Priority filter
    if (filter.priority !== 'all' && task.priority !== filter.priority) {
      return false
    }

    // Assigned to filter (for admins)
    if (filter.assignedTo !== 'all' && task.assignedTo !== filter.assignedTo) {
      return false
    }

    return true
  })

  // Group tasks by status
  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    inprogress: filteredTasks.filter(task => task.status === 'inprogress'),
    done: filteredTasks.filter(task => task.status === 'done'),
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t._id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task['status']
    const task = tasks.find(t => t._id === taskId)

    if (!task || task.status === newStatus) return

    // Optimistic update
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }))

    try {
      await dispatch(updateTask({ 
        id: taskId, 
        updates: { status: newStatus } 
      }) as any).unwrap()
      
      toast.success(`Task moved to ${newStatus.replace('inprogress', 'in progress')}`)
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateTaskStatus({ id: taskId, status: task.status }))
      toast.error('Failed to update task status')
    }
  }

  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasksByStatus.todo, color: 'gray' },
    { id: 'inprogress', title: 'In Progress', tasks: tasksByStatus.inprogress, color: 'blue' },
    { id: 'done', title: 'Done', tasks: tasksByStatus.done, color: 'green' },
  ]

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <TaskColumn
            key={column.id}
            id={column.id as Task['status']}
            title={column.title}
            tasks={column.tasks}
            color={column.color}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default TaskBoard