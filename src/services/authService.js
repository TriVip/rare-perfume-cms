import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Mock data for demo purposes
const DEMO_USER = {
  id: 1,
  name: 'Admin User',
  email: 'admin@rareperfume.com',
  role: 'admin',
  avatar: null
}

const DEMO_CREDENTIALS = {
  email: 'admin@rareperfume.com',
  password: 'admin123'
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Mock authentication functions for demo
const mockLogin = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.email === DEMO_CREDENTIALS.email &&
        credentials.password === DEMO_CREDENTIALS.password
      ) {
        const mockToken = 'demo-jwt-token-' + Date.now()
        resolve({
          data: {
            token: mockToken,
            user: DEMO_USER,
            message: 'Login successful'
          }
        })
      } else {
        reject({
          response: {
            data: {
              message: 'Invalid email or password'
            },
            status: 401
          }
        })
      }
    }, 1000) // Simulate network delay
  })
}

const mockGetCurrentUser = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem('token')
      if (token && token.startsWith('demo-jwt-token-')) {
        resolve({
          data: DEMO_USER
        })
      } else {
        reject({
          response: {
            data: {
              message: 'Unauthorized'
            },
            status: 401
          }
        })
      }
    }, 500)
  })
}

// Check if we should use mock data (when no backend is available)
const shouldUseMock = () => {
  // Use mock when API_BASE_URL contains localhost:3001 (default backend URL)
  return API_BASE_URL.includes('localhost:3001')
}

export const authAPI = {
  login: (credentials) => {
    if (shouldUseMock()) {
      return mockLogin(credentials)
    }
    return apiClient.post('/auth/login', credentials)
  },
  
  register: (userData) => {
    if (shouldUseMock()) {
      return Promise.reject({
        response: {
          data: { message: 'Registration not available in demo mode' },
          status: 400
        }
      })
    }
    return apiClient.post('/auth/register', userData)
  },
  
  getCurrentUser: () => {
    if (shouldUseMock()) {
      return mockGetCurrentUser()
    }
    return apiClient.get('/auth/me')
  },
  
  refreshToken: () => {
    if (shouldUseMock()) {
      return Promise.resolve({ data: { token: 'demo-jwt-token-refreshed-' + Date.now() } })
    }
    return apiClient.post('/auth/refresh')
  },
  
  logout: () => {
    if (shouldUseMock()) {
      return Promise.resolve({ data: { message: 'Logged out successfully' } })
    }
    return apiClient.post('/auth/logout')
  },
}

export default apiClient 
