import { setActivePinia, createPinia } from 'pinia'
import { describe, it, beforeEach, vi, expect } from 'vitest'
import { useTaskStore } from '@/stores/taskStore'
import TaskService from '@/services/taskService'
import type { Task } from '@/types/Task'

// Mock the TaskService
vi.mock('@/services/taskService', () => ({
  default: {
    fetchTasks: vi.fn(),
    createTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}))

describe('useTaskStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with the correct default state', () => {
    const taskStore = useTaskStore()

    expect(taskStore.tasks).toEqual([])
    expect(taskStore.loading).toBe(false)
    expect(taskStore.error).toBeNull()
  })

  it('fetches tasks and updates the state', async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'quis ut nam facilis et officia qui',
        description: 'nam facilis et officia description 1',
        dueDate: '2024-11-25',
        status: 'Pending',
        priority: 'Low',
      },
      {
        id: 2,
        title: 'fugiat veniam minus',
        description: 'ugiat veniam minus description 2',
        dueDate: '2024-11-26',
        status: 'Completed',
        priority: 'High',
      },
    ]

    vi.mocked(TaskService.fetchTasks).mockResolvedValue(mockTasks)

    const taskStore = useTaskStore()
    await taskStore.fetchTasks()

    expect(taskStore.tasks).toEqual(mockTasks)
    expect(taskStore.loading).toBe(false)
    expect(taskStore.error).toBeNull()
  })

  it('creates a task and updates the state', async () => {
    const newTaskInput = {
      title: 'New Task',
      description: 'New task description',
      dueDate: '2024-11-27',
      status: 'Pending' as const,
      priority: 'Medium' as const,
    }

    // Mock the response from the API
    const createdTask: Task = {
      ...newTaskInput,
      id: 3,
    }

    vi.mocked(TaskService.createTask).mockResolvedValue(createdTask)

    const taskStore = useTaskStore()
    await taskStore.createTask(newTaskInput)

    expect(TaskService.createTask).toHaveBeenCalledWith(newTaskInput)
    expect(taskStore.tasks).toHaveLength(1)
    expect(taskStore.tasks[0]).toEqual(createdTask)
    expect(taskStore.loading).toBe(false)
    expect(taskStore.error).toBeNull()
  })

  it('deletes a task and updates the state', async () => {
    const initialTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2024-11-25',
        status: 'Pending',
        priority: 'Low',
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        dueDate: '2024-11-26',
        status: 'Completed',
        priority: 'High',
      },
    ]

    const taskStore = useTaskStore()
    taskStore.tasks = initialTasks

    vi.mocked(TaskService.deleteTask).mockResolvedValue(undefined)

    await taskStore.deleteTask(1)

    expect(taskStore.tasks).toHaveLength(1)
    expect(taskStore.tasks[0].id).toBe(2)
    expect(taskStore.loading).toBe(false)
    expect(taskStore.error).toBeNull()
  })

  it('sorts tasks by due date using sortedTasks getter', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Task A',
        description: 'Description A',
        dueDate: '2024-12-01',
        status: 'Pending',
        priority: 'Low',
      },
      {
        id: 2,
        title: 'Task B',
        description: 'Description B',
        dueDate: '2024-11-25',
        status: 'Pending',
        priority: 'Low',
      },
    ]

    const taskStore = useTaskStore()
    taskStore.tasks = mockTasks

    const sortedTasks = taskStore.sortedTasks

    expect(sortedTasks[0].dueDate).toBe('2024-11-25')
    expect(sortedTasks[1].dueDate).toBe('2024-12-01')
  })

  it('filters tasks by status using filterTasksByStatus getter', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Task A',
        description: 'Description A',
        dueDate: '2024-12-01',
        status: 'Pending',
        priority: 'Low',
      },
      {
        id: 2,
        title: 'Task B',
        description: 'Description B',
        dueDate: '2024-11-25',
        status: 'Completed',
        priority: 'Low',
      },
    ]

    const taskStore = useTaskStore()
    taskStore.tasks = mockTasks

    const pendingTasks = taskStore.filterTasksByStatus('Pending')

    expect(pendingTasks).toHaveLength(1)
    expect(pendingTasks[0].status).toBe('Pending')
  })
})
