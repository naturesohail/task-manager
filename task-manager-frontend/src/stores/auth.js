import { defineStore } from 'pinia'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null
  }),
  actions: {
    async register(userData) {
      try {
        const response = await axios.post(`${baseUrl}/register`, userData)
        this.token = response.data.token
        localStorage.setItem('token', this.token)
        return true
      } catch (error) {
        console.error('Registration failed:', error)
        return false
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post(`${baseUrl}/login`, credentials)
        this.token = response.data.token
        localStorage.setItem('token', this.token)
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },
    logout() {
      axios.post(`${baseUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      this.token = null
      localStorage.removeItem('token')
    }
  }
})