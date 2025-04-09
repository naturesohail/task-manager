import { defineStore } from 'pinia'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false
  }),
  actions: {
    async fetchTasks() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${baseUrl}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.tasks = response.data

        console.log("Tasks Fetch successfully-",this.tasks);
        
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        this.loading = false
      }
    },
    async addTask(taskData) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${baseUrl}/tasks`, taskData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.tasks.push(response.data)
        return true
      } catch (error) {
        console.error('Error adding task:', error)
        return false
      }
    },
    async updateTask(task) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.put(`${baseUrl}/tasks/${task.id}`, task, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        return true
      } catch (error) {
        console.error('Error updating task:', error)
        return false
      }
    },
    async deleteTask(taskId) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${baseUrl}/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.tasks = this.tasks.filter(task => task.id !== taskId)
        return true
      } catch (error) {
        console.error('Error deleting task:', error)
        return false
      }
    }
  }
})