import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { taskAPI } from '../../services/api'

export interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedTo: string
  assignedBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
}

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  filter: {
    status: string
    priority: string
    assignedTo: string
  }
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filter: {
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
  },
}

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTasks()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks')
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const response = await taskAPI.createTask(taskData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task')
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.updateTask(id, updates)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task')
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskAPI.deleteTask(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task')
    }
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<TaskState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: Task['status'] }>) => {
      const task = state.tasks.find(t => t._id === action.payload.id)
      if (task) {
        task.status = action.payload.status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { setFilter, clearError, updateTaskStatus } = taskSlice.actions
export default taskSlice.reducer