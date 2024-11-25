import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import TaskDashboard from '@/views/TaskDashboard.vue'
import { useTaskStore } from '@/stores/taskStore'
import { createRouter, createWebHistory } from 'vue-router'
import type { Task } from '@/types/Task'

// Define component interface
interface TaskDashboardInstance {
  filteredTasks: Task[]
  showForm: boolean
  showDeleteDialog: boolean
  selectedTask: Task | null
  editTask: (task: Task) => void
  deleteTask: (task: Task) => void
  viewTaskDetails: (task: Task) => void
  onTaskSaved: () => void
}
// Mock child components
vi.mock('@/components/tasks/TaskList.vue', () => ({
  default: {
    name: 'TaskList',
    template: '<div data-testid="task-list"></div>',
  },
}))

vi.mock('@/components/tasks/TaskForm.vue', () => ({
  default: {
    name: 'TaskForm',
    template: '<div data-testid="task-form"></div>',
  },
}))

vi.mock('@/components/common/LoadingSpinner.vue', () => ({
  default: {
    name: 'LoadingSpinner',
    template: '<div data-testid="loading-spinner"></div>',
  },
}))

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/task/:id', component: {} }],
})

describe('TaskDashboard', () => {
  let wrapper: VueWrapper<TaskDashboardInstance>
  let taskStore: ReturnType<typeof useTaskStore>

  const mockTasks = [
    {
      id: 1,
      title: 'Task 1',
      status: 'Pending',
      priority: 'High',
      dueDate: '2024-01-01',
    },
    {
      id: 2,
      title: 'Task 2',
      status: 'In Progress',
      priority: 'Low',
      dueDate: '2024-01-02',
    },
  ]

  beforeEach(() => {
    wrapper = mount(TaskDashboard, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              task: { tasks: mockTasks, loading: false, error: null },
            },
          }),
          router,
        ],
      },
    }) as VueWrapper<TaskDashboardInstance>
    taskStore = useTaskStore()
  })

  it('fetches tasks on mount', () => {
    expect(taskStore.fetchTasks).toHaveBeenCalled()
  })

  it('displays loading spinner when loading', async () => {
    await wrapper.vm.$nextTick()
    taskStore.loading = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="task-list"]').exists()).toBe(false)
  })

  it('displays error message when there is an error', async () => {
    taskStore.error = 'Failed to fetch tasks'
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Failed to fetch tasks')
    expect(wrapper.find('[data-testid="task-list"]').exists()).toBe(false)
  })

  it('opens task form dialog for new task', async () => {
    const addButton = wrapper.find('[data-testid="new-task-button"]')

    if (!addButton.exists()) {
      throw new Error('Button not found')
    }

    await addButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showForm).toBe(true)
    expect(wrapper.vm.selectedTask).toBeNull()
  })

  it('opens task form dialog for editing', async () => {
    const taskWithDescription = {
      ...mockTasks[0],
      description: '',
      status: 'Pending' as const,
      priority: 'Low' as const,
    }
    wrapper.vm.editTask(taskWithDescription)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showForm).toBe(true)
    expect(wrapper.vm.selectedTask).toEqual(taskWithDescription)
  })

  it('handles task deletion', async () => {
    const taskWithDescription = {
      ...mockTasks[0],
      description: '',
      status: 'Pending' as const,
      priority: 'Low' as const,
    }
    wrapper.vm.deleteTask(taskWithDescription)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showDeleteDialog).toBe(true)
    expect(wrapper.vm.selectedTask).toEqual(taskWithDescription)

    const deleteButton = wrapper.find('[data-testid="confirm-delete-button"]')
    await deleteButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(taskStore.deleteTask).toHaveBeenCalledWith(taskWithDescription.id)
  })

  it('navigates to task details', async () => {
    const routerPushSpy = vi.spyOn(router, 'push')
    const taskWithDescription = {
      ...mockTasks[0],
      description: '',
      status: 'Pending' as const,
      priority: 'Low' as const,
    }
    wrapper.vm.viewTaskDetails(taskWithDescription)

    expect(routerPushSpy).toHaveBeenCalledWith('/task/1')
  })

  it('handles task save completion', async () => {
    const taskWithDescription = {
      ...mockTasks[0],
      description: '',
      status: 'Pending' as const,
      priority: 'Low' as const,
    }
    wrapper.vm.selectedTask = taskWithDescription
    wrapper.vm.showForm = true

    wrapper.vm.onTaskSaved()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showForm).toBe(false)
    expect(wrapper.vm.selectedTask).toBeNull()
  })
})
