import apiClient from '@/config/axios'

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
  refresh: () => apiClient.post('/auth/refresh'),
}

// Posts API
export const postsAPI = {
  getAll: (params) => apiClient.get('/v1/admin/posts', { params }),
  getById: (id) => apiClient.get(`/v1/admin/posts/${id}`),
  create: (data) => apiClient.post('/v1/admin/posts', data),
  update: (id, data) => apiClient.put(`/v1/admin/posts/${id}`, data),
  delete: (id) => apiClient.delete(`/v1/admin/posts/${id}`),
}

// Categories API
export const categoriesAPI = {
  getAll: (params) => apiClient.get('/v1/admin/categories', { params }),
  getById: (id) => apiClient.get(`/v1/admin/categories/${id}`),
  create: (data) => apiClient.post('/v1/admin/categories', data),
  update: (id, data) => apiClient.put(`/v1/admin/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/v1/admin/categories/${id}`),
}

// Tags API
export const tagsAPI = {
  getAll: (params) => apiClient.get('/v1/admin/tags', { params }),
  getById: (id) => apiClient.get(`/v1/admin/tags/${id}`),
  create: (data) => apiClient.post('/v1/admin/tags', data),
  update: (id, data) => apiClient.put(`/v1/admin/tags/${id}`, data),
  delete: (id) => apiClient.delete(`/v1/admin/tags/${id}`),
}

// Projects API
export const projectsAPI = {
  getAll: (params) => apiClient.get('/v1/admin/projects', { params }),
  getById: (id) => apiClient.get(`/v1/admin/projects/${id}`),
  create: (data) => apiClient.post('/v1/admin/projects', data),
  update: (id, data) => apiClient.put(`/v1/admin/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/v1/admin/projects/${id}`),
}

// Skills API
export const skillsAPI = {
  getAll: (params) => apiClient.get('/skills', { params }),
  getById: (id) => apiClient.get(`/skills/${id}`),
  create: (data) => apiClient.post('/skills', data),
  update: (id, data) => apiClient.put(`/skills/${id}`, data),
  delete: (id) => apiClient.delete(`/skills/${id}`),
}

// Comments API
export const commentsAPI = {
  getAll: (params) => apiClient.get('/comments', { params }),
  getById: (id) => apiClient.get(`/comments/${id}`),
  approve: (id) => apiClient.put(`/comments/${id}/approve`),
  reject: (id) => apiClient.put(`/comments/${id}/reject`),
  delete: (id) => apiClient.delete(`/comments/${id}`),
}

// Media API
export const mediaAPI = {
  getAll: (params) => apiClient.get('/media', { params }),
  upload: (formData) => apiClient.post('/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => apiClient.delete(`/media/${id}`),
}

// About API
export const aboutAPI = {
  getAll: (params) => apiClient.get('/about', { params }),
  getById: (id) => apiClient.get(`/about/${id}`),
  create: (data) => apiClient.post('/about', data),
  update: (id, data) => apiClient.put(`/about/${id}`, data),
  delete: (id) => apiClient.delete(`/about/${id}`),
}
