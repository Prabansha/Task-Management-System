import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
})

// Index for better query performance
taskSchema.index({ assignedTo: 1, status: 1 })
taskSchema.index({ assignedBy: 1 })

export const Task = mongoose.model('Task', taskSchema)