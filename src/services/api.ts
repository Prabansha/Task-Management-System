import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },
}

// Task API
export const taskAPI = {
  getTasks: async () => {
    const response = await api.get('/tasks')
    return response.data
  },
  
  createTask: async (taskData: any) => {
    const response = await api.post('/tasks', taskData)
    return response.data
  },
  
  updateTask: async (id: string, updates: any) => {
    const response = await api.put(`/tasks/${id}`, updates)
    return response.data
  },
  
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  },
}

export default api