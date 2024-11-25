import type { Task } from '@/types/Task'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

class TaskService {
  async fetchTasks(page = 1, limit = 10): Promise<Task[]> {
    try {
      const response = await axios.get<Task[]>(BASE_URL, {
        params: {
          _page: page,
          _limit: limit,
        },
      })

      return response.data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.title,
        status: 'Pending',
        priority: 'Medium',
        dueDate: new Date().toISOString(),
      }))
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  }

  async createTask(task: Task): Promise<Task> {
    try {
      const response = await axios.post<Task>(BASE_URL, task)
      return response.data
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  async updateTask(task: Task): Promise<Task> {
    if (!task.id) {
      throw new Error('Task ID is required for update')
    }

    try {
      const response = await axios.put<Task>(`${BASE_URL}/${task.id}`, task)
      return response.data
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  async deleteTask(taskId: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/${taskId}`)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }
}

export default new TaskService()
