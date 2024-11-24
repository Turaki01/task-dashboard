<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center py-2">
            <v-btn icon @click="router.back()">
              <v-icon size="md">mdi-arrow-left</v-icon>
            </v-btn>
            <span class="ml-4 text-body">Task Details</span>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="editTask"> Edit </v-btn>
          </v-card-title>

          <v-card-text class="mt-8" v-if="task">
            <v-row>
              <v-col cols="12" md="6">
                <div class="text-subtitle-1">Title</div>
                <div>{{ task.title }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-subtitle-1">Status</div>
                <v-chip :color="getStatusColor(task.status)" text-color="white">
                  {{ task.status }}
                </v-chip>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-subtitle-1">Priority</div>
                <v-chip :color="getPriorityColor(task.priority)" text-color="white">
                  {{ task.priority }}
                </v-chip>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-subtitle-1">Due Date</div>
                <div>{{ formatDate(task.dueDate) }}</div>
              </v-col>

              <v-col cols="12">
                <div class="text-subtitle-1">Description</div>
                <div class="mt-2">{{ task.description }}</div>
              </v-col>
            </v-row>

            <!-- Subtasks Section -->
            <v-row class="mt-4">
              <v-col cols="12">
                <div class="text-h6">Subtasks</div>
                <v-list v-if="subtasks.length > 0">
                  <v-list-item v-for="subtask in subtasks" :key="subtask.id">
                    <v-list-item-title>
                      <v-checkbox
                        v-model="subtask.completed"
                        :label="subtask.title"
                        @change="updateSubtask(subtask)"
                      ></v-checkbox>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-alert v-else type="info" text="No subtasks available"></v-alert>

                <!-- Subtask Form -->
                <v-form @submit.prevent="addSubtask" class="mt-4">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="newSubtask"
                        label="New Subtask"
                        hide-details
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-btn color="primary" class="h-100" type="submit" :disabled="!newSubtask">
                        Add Subtask
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text v-else>
            <v-alert type="error">Task not found</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Task Dialog -->
    <TaskForm v-model="showEditDialog" :task="task" @saved="onTaskUpdated" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import TaskForm from '@/components/tasks/TaskForm.vue'
import { Task } from '@/types/Task'
import { formatDate } from '@/utils/dateFormatter'

interface Subtask {
  id: number
  title: string
  completed: boolean
}

const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()

const task = ref<Task | null>(null)
const subtasks = ref<Subtask[]>([])
const newSubtask = ref('')
const showEditDialog = ref(false)

onMounted(async () => {
  const taskId = Number(route.params.id)
  task.value = taskStore.tasks.find((t) => t.id === taskId) || null

  if (!task.value) {
    try {
      await taskStore.fetchTasks()
      task.value = taskStore.tasks.find((t) => t.id === taskId) || null
    } catch (error) {
      console.error('Error fetching task:', error)
    }
  }
})

const getStatusColor = (status: string) => {
  const colors = {
    Pending: 'orange',
    'In Progress': 'blue',
    Completed: 'green',
  }
  return colors[status as keyof typeof colors] || 'grey'
}

const getPriorityColor = (priority: string) => {
  const colors = {
    Low: 'green',
    Medium: 'orange',
    High: 'red',
  }
  return colors[priority as keyof typeof colors] || 'grey'
}

const editTask = () => {
  showEditDialog.value = true
}

const onTaskUpdated = async () => {
  showEditDialog.value = false
  const taskId = Number(route.params.id)
  await taskStore.fetchTasks()
  task.value = taskStore.tasks.find((t) => t.id === taskId) || null
}

const addSubtask = () => {
  if (!newSubtask.value) return

  subtasks.value.push({
    id: Date.now(),
    title: newSubtask.value,
    completed: false,
  })

  newSubtask.value = ''
}

const updateSubtask = (subtask: Subtask) => {
  // Implement subtask update logic here
  console.log('Updating subtask:', subtask)
}
</script>

<style scoped>
.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.text-h6 {
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;
}
</style>
