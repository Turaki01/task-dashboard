import { defineStore } from 'pinia'
import TaskService from '@/services/taskService'
import type { Task, TaskState } from '@/types/Task'

export const useTaskStore = defineStore('taskStore', {
  state: (): TaskState => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Persist tasks to local storage
    persistToLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    async fetchTasks(page = 1, limit = 10) {
      this.loading = true
      this.error = null

      try {
        const storedTasks = localStorage.getItem('tasks')
        if (storedTasks) {
          this.tasks = JSON.parse(storedTasks)
        } else {
          const tasks = await TaskService.fetchTasks(page, limit)
          this.tasks = tasks
          this.persistToLocalStorage()
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An unknown error occurred'
      } finally {
        this.loading = false
      }
    },

    async createTask(task: Task) {
      this.loading = true
      this.error = null

      try {
        const newTask = await TaskService.createTask(task)
        this.tasks.push(newTask)
        this.persistToLocalStorage()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create task'
      } finally {
        this.loading = false
      }
    },

    async updateTask(updatedTask: Task) {
      this.loading = true
      this.error = null

      try {
        const index = this.tasks.findIndex((task) => task.id === updatedTask.id)
        if (index !== -1) {
          this.tasks[index] = updatedTask
          this.persistToLocalStorage()
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update task'
      } finally {
        this.loading = false
      }
    },

    async deleteTask(taskId: number) {
      this.loading = true
      this.error = null

      try {
        await TaskService.deleteTask(taskId)
        this.tasks = this.tasks.filter((task) => task.id !== taskId)
        this.persistToLocalStorage()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete task'
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    sortedTasks(): Task[] {
      return [...this.tasks].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
    },

    filterTasksByStatus: (state) => (status: Task['status']) => {
      return state.tasks.filter((task) => task.status === status)
    },

    filterTasksByPriority: (state) => (priority: Task['priority']) => {
      return state.tasks.filter((task) => task.priority === priority)
    },
  },
})
