import axios from 'axios'

// Create axios instance
const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') + '/api',
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('Forbidden access')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Internal server error')
          break
        default:
          console.error('An error occurred:', error.response.data)
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server')
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
