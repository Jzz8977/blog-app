import axios from 'axios'

// Base configuration
const API_BASE_URL = 'http://23.91.96.52/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Auth token management
let authToken = localStorage.getItem('access_token')

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token')
      authToken = null
      // Optionally redirect to login
    }
    return Promise.reject(error)
  }
)

// Auth methods
export const auth = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password })
      const { access_token } = response.data.data.tokens
      authToken = access_token
      localStorage.setItem('access_token', access_token)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.warn('Logout request failed:', error)
    } finally {
      authToken = null
      localStorage.removeItem('access_token')
    }
  },

  verify: async () => {
    try {
      const response = await api.get('/auth/verify')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

// Articles API
export const articles = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/articles', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  getBySlug: async (slug) => {
    try {
      const response = await api.get(`/articles/slug/${slug}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  create: async (articleData) => {
    try {
      const response = await api.post('/articles', articleData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  update: async (id, articleData) => {
    try {
      const response = await api.put(`/articles/${id}`, articleData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  publish: async (id) => {
    try {
      const response = await api.post(`/articles/${id}/publish`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  archive: async (id) => {
    try {
      const response = await api.post(`/articles/${id}/archive`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

// Categories API
export const categories = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  create: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

// Analytics API
export const analytics = {
  incrementView: async (articleId) => {
    try {
      const response = await api.post(`/analytics/articles/${articleId}/view`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  toggleLike: async (articleId) => {
    try {
      const response = await api.post(`/analytics/articles/${articleId}/like`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  getLikeStatus: async (articleId) => {
    try {
      const response = await api.get(`/analytics/articles/${articleId}/status`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  getDashboard: async (range = 'all') => {
    try {
      const response = await api.get('/analytics/dashboard', { params: { range } })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  getTopArticles: async (limit = 10, range = 'all') => {
    try {
      const response = await api.get('/analytics/articles/top', { 
        params: { limit, range } 
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

// File upload API
export const uploads = {
  uploadThumbnail: async (file) => {
    try {
      const formData = new FormData()
      formData.append('thumbnail', file)
      
      const response = await api.post('/upload/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  deleteFile: async (filename) => {
    try {
      const response = await api.delete(`/uploads/${filename}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

export default api