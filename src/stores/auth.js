import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  const fetchUser = async () => {
    try {
      const response = await authAPI.me()
      user.value = response.user
      return response
    } catch (error) {
      // If fetching user fails, clear auth data
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      throw error
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    fetchUser
  }
})
