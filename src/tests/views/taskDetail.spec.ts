import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import TaskDetails from '@/views/TaskDetail.vue'
import { useTaskStore } from '@/stores/taskStore'
import { createRouter, createWebHistory } from 'vue-router'
import type { Task, Subtask } from '@/types/Task'

interface TaskDetailsInstance {
  task: Task | null
  subtasks: Subtask[]
  newSubtask: string
  showEditDialog: boolean
  updateLocalTask: () => void
  editTask: () => void
  onTaskUpdated: () => Promise<void>
  addSubtask: () => Promise<void>
  updateSubtask: (subtask: Subtask) => Promise<void>
}

// Mock child components
vi.mock('@/components/tasks/TaskForm.vue', () => ({
  default: {
    name: 'TaskForm',
    template: '<div data-testid="task-form"></div>',
  },
}))

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/task/:id', component: {} }],
})

describe('TaskDetails', () => {
  let wrapper: VueWrapper<TaskDetailsInstance>
  let taskStore: ReturnType<typeof useTaskStore>

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'Pending',
    priority: 'High',
    dueDate: '2024-01-01',
    subtasks: [
      { id: 1, title: 'Subtask 1', completed: false },
      { id: 2, title: 'Subtask 2', completed: true },
    ],
  }

  beforeEach(async () => {
    await router.push('/task/1')

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        task: {
          tasks: [mockTask],
          loading: false,
          error: null,
        },
      },
    })

    wrapper = mount(TaskDetails, {
      global: {
        plugins: [pinia, router],
        stubs: {
          TaskForm: true,
        },
      },
    }) as VueWrapper<TaskDetailsInstance>

    taskStore = useTaskStore()

    await wrapper.vm.$nextTick()

    await flushPromises()
  })

  it('fetches tasks on mount if store is empty', async () => {
    taskStore.tasks = []
    await mount(TaskDetails, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              task: { tasks: [], loading: false, error: null },
            },
          }),
          router,
        ],
      },
    })
    expect(taskStore.fetchTasks).toHaveBeenCalled()
  })

  it('opens edit dialog when edit button is clicked', async () => {
    const editButton = wrapper.find('[data-testid="edit-task-button"]')
    await editButton.trigger('click')

    expect(wrapper.vm.showEditDialog).toBe(true)
  })

  it('updates task after edit dialog is saved', async () => {
    wrapper.vm.showEditDialog = true
    await wrapper.vm.onTaskUpdated()

    expect(wrapper.vm.showEditDialog).toBe(false)
  })

  it('navigates back when back button is clicked', async () => {
    const routerBackSpy = vi.spyOn(router, 'back')
    const backButton = wrapper.find('[data-testid="back-button"]')
    await backButton.trigger('click')

    expect(routerBackSpy).toHaveBeenCalled()
  })

  it('shows error message when task is not found', async () => {
    router.push('/task/999')
    await wrapper.vm.updateLocalTask()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Task not found')
  })

  it('watches for task store changes and updates local task', async () => {
    const updatedMockTask = {
      ...mockTask,
      title: 'Updated Title',
    }

    taskStore.tasks = [updatedMockTask]

    await wrapper.vm.updateLocalTask()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.task?.title).toBe('Updated Title')
  })
})
