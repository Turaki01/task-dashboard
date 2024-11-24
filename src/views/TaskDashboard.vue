<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-container fluid>
          <v-card-title class="d-flex align-center mb-5">
            <v-row>
              <v-col cols="12" md="8">
                <h1 class="text-h5">Task Dashboard</h1>
              </v-col>
              <v-col cols="12" md="4" class="d-flex justify-start justify-md-end">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="showTaskForm"
                  :disabled="loading"
                >
                  New Task
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="filters.status"
                  :items="['All', 'Pending', 'In Progress', 'Completed']"
                  label="Filter by Status"
                  @update:model-value="applyFilters"
                  :disabled="loading"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="filters.priority"
                  :items="['All', 'Low', 'Medium', 'High']"
                  label="Filter by Priority"
                  @update:model-value="applyFilters"
                  :disabled="loading"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn-toggle v-model="sortOrder" mandatory :disabled="loading">
                  <v-btn value="asc">
                    <v-icon>mdi-sort-ascending</v-icon>
                  </v-btn>
                  <v-btn value="desc">
                    <v-icon>mdi-sort-descending</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>

            <div class="tasks-container">
              <LoadingSpinner
                v-if="loading"
                size="large"
                color="primary"
                show-label
                label="Loading tasks..."
              />

              <div v-else-if="error" class="text-center py-8">
                <v-icon color="error" size="large" class="mb-2">mdi-alert-circle</v-icon>
                <p class="text-body-1 text-error">{{ error }}</p>
                <v-btn color="primary" @click="retryFetch" class="mt-4">Retry</v-btn>
              </div>

              <TaskList
                v-else
                :tasks="filteredTasks"
                @edit="editTask"
                @delete="deleteTask"
                @view="viewTaskDetails"
              />
            </div>
          </v-card-text>
        </v-container>
      </v-col>
    </v-row>

    <!-- Task Form Dialog -->
    <TaskForm v-model="showForm" :task="selectedTask" @saved="onTaskSaved" />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Task</v-card-title>
        <v-card-text>Are you sure you want to delete this task?</v-card-text>
        <v-card-actions class="pt-5 pb-3">
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete" :loading="deleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { Task } from '@/types/Task'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const taskStore = useTaskStore()

const showForm = ref(false)
const showDeleteDialog = ref(false)
const selectedTask = ref<Task | null>(null)
const deleting = ref(false)
const sortOrder = ref('asc')

const filters = ref({
  status: 'All',
  priority: 'All',
})

onMounted(async () => {
  await taskStore.fetchTasks()
})

const filteredTasks = computed(() => {
  let tasks = [...taskStore.tasks]

  if (filters.value.status !== 'All') {
    tasks = tasks.filter((task) => task.status === filters.value.status)
  }
  if (filters.value.priority !== 'All') {
    tasks = tasks.filter((task) => task.priority === filters.value.priority)
  }

  tasks.sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
  })

  return tasks
})

const showTaskForm = () => {
  selectedTask.value = null
  showForm.value = true
}

const editTask = (task: Task) => {
  selectedTask.value = { ...task }
  showForm.value = true
}

const deleteTask = (task: Task) => {
  selectedTask.value = task
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (!selectedTask.value?.id) return

  deleting.value = true
  try {
    await taskStore.deleteTask(selectedTask.value.id)
    showDeleteDialog.value = false
  } finally {
    deleting.value = false
  }
}

const viewTaskDetails = (task: Task) => {
  router.push(`/task/${task.id}`)
}

const onTaskSaved = () => {
  selectedTask.value = null
  showForm.value = false
  taskStore.fetchTasks()
}
</script>

<style scoped>
.tasks-container {
  position: relative;
  min-height: 200px;
}
</style>
