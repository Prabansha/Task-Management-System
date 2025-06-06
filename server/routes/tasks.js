import express from 'express'
import { body, validationResult } from 'express-validator'
import { Task } from '../models/Task.js'
import { User } from '../models/User.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// Get all tasks (with role-based filtering)
router.get('/', auth, async (req, res) => {
  try {
    let query = {}
    
    // If user is not admin, only show their assigned tasks
    if (req.user.role !== 'admin') {
      query.assignedTo = req.user._id
    }
    
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
    
    res.json(tasks)
  } catch (error) {
    console.error('Get tasks error:', error)
    res.status(500).json({ message: 'Server error while fetching tasks' })
  }
})

// Create new task
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'inprogress', 'done']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { title, description, priority, status, dueDate, assignedTo } = req.body

    // Determine who the task is assigned to
    let taskAssignedTo = assignedTo || req.user._id
    
    // If user is not admin, they can only assign tasks to themselves
    if (req.user.role !== 'admin' && assignedTo && assignedTo !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only assign tasks to yourself' })
    }

    // Validate assigned user exists
    const assignedUser = await User.findById(taskAssignedTo)
    if (!assignedUser) {
      return res.status(400).json({ message: 'Assigned user not found' })
    }

    const task = new Task({
      title,
      description,
      priority,
      status: status || 'todo',
      assignedTo: taskAssignedTo,
      assignedBy: req.user._id,
      dueDate: dueDate ? new Date(dueDate) : undefined
    })

    await task.save()
    
    // Populate the task before sending response
    await task.populate('assignedTo', 'name email')
    await task.populate('assignedBy', 'name email')

    res.status(201).json(task)
  } catch (error) {
    console.error('Create task error:', error)
    res.status(500).json({ message: 'Server error while creating task' })
  }
})

// Update task
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Title cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'inprogress', 'done']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    // Check permissions: admin can update any task, users can only update their assigned tasks
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own tasks' })
    }

    const { title, description, priority, status, dueDate, assignedTo } = req.body

    // If assignedTo is being changed, validate permissions and user existence
    if (assignedTo && assignedTo !== task.assignedTo.toString()) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can reassign tasks' })
      }
      
      const assignedUser = await User.findById(assignedTo)
      if (!assignedUser) {
        return res.status(400).json({ message: 'Assigned user not found' })
      }
    }

    // Update task fields
    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (priority !== undefined) task.priority = priority
    if (status !== undefined) task.status = status
    if (assignedTo !== undefined) task.assignedTo = assignedTo
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null

    await task.save()
    
    // Populate the task before sending response
    await task.populate('assignedTo', 'name email')
    await task.populate('assignedBy', 'name email')

    res.json(task)
  } catch (error) {
    console.error('Update task error:', error)
    res.status(500).json({ message: 'Server error while updating task' })
  }
})

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    // Check permissions: admin can delete any task, users can only delete their assigned tasks
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own tasks' })
    }

    await Task.findByIdAndDelete(req.params.id)
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    res.status(500).json({ message: 'Server error while deleting task' })
  }
})

// Get task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    // Check permissions: admin can view any task, users can only view their assigned tasks
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only view your own tasks' })
    }

    res.json(task)
  } catch (error) {
    console.error('Get task error:', error)
    res.status(500).json({ message: 'Server error while fetching task' })
  }
})

export default router