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
    async fetchTasks(page = 1, limit = 10) {
      this.loading = true
      this.error = null

      try {
        const tasks = await TaskService.fetchTasks(page, limit)
        this.tasks = tasks
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
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create task'
      } finally {
        this.loading = false
      }
    },

    async updateTask(task: Task) {
      this.loading = true
      this.error = null

      try {
        const updatedTask = await TaskService.updateTask(task)
        const index = this.tasks.findIndex((t) => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = updatedTask
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
