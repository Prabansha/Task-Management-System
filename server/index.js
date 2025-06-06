import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'TaskFlow API is running!' })
})

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow'

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    
    // Create demo users and tasks
    createDemoData()
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })

// Create demo data
async function createDemoData() {
  try {
    const { User } = await import('./models/User.js')
    const { Task } = await import('./models/Task.js')
    
    // Check if demo users already exist
    const existingAdmin = await User.findOne({ email: 'admin@demo.com' })
    if (existingAdmin) return
    
    // Create demo admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'password123',
      role: 'admin'
    })
    await admin.save()
    
    // Create demo regular user
    const user = new User({
      name: 'John Doe',
      email: 'user@demo.com',
      password: 'password123',
      role: 'user'
    })
    await user.save()
    
    // Create demo tasks
    const demoTasks = [
      {
        title: 'Setup project repository',
        description: 'Initialize the project repository with proper structure and documentation',
        status: 'done',
        priority: 'high',
        assignedTo: admin._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() - 86400000) // Yesterday
      },
      {
        title: 'Design user interface mockups',
        description: 'Create wireframes and mockups for the main dashboard and task management interface',
        status: 'inprogress',
        priority: 'medium',
        assignedTo: user._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 172800000) // 2 days from now
      },
      {
        title: 'Implement authentication system',
        description: 'Build JWT-based authentication with login, register, and protected routes',
        status: 'todo',
        priority: 'high',
        assignedTo: admin._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 259200000) // 3 days from now
      },
      {
        title: 'Write API documentation',
        description: 'Document all API endpoints with examples and response formats',
        status: 'todo',
        priority: 'low',
        assignedTo: user._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 604800000) // 1 week from now
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment pipeline',
        status: 'todo',
        priority: 'medium',
        assignedTo: admin._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 432000000) // 5 days from now
      }
    ]
    
    await Task.insertMany(demoTasks)
    console.log('Demo data created successfully')
    
  } catch (error) {
    console.error('Error creating demo data:', error)
  }
}