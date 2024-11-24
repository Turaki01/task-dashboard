<template>
  <div>
    <!-- Desktop view -->
    <v-data-table
      v-if="!isMobile"
      :headers="headers"
      :items="tasks"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>
            <v-chip :color="getStatusColor(item.status)" size="small">
              {{ item.status }}
            </v-chip>
          </td>
          <td>
            <v-chip :color="getPriorityColor(item.priority)" size="small">
              {{ item.priority }}
            </v-chip>
          </td>
          <td>{{ formatDate(item.dueDate) }}</td>
          <td>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn size="small" variant="text" v-bind="props">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="$emit('view', item)" :value="'view'">
                  <v-list-item-title>View</v-list-item-title>
                </v-list-item>
                <v-list-item @click="$emit('edit', item)" :value="'edit'">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="$emit('delete', item)" :value="'delete'" color="error">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Mobile view -->
    <v-container fluid v-else>
      <v-row>
        <v-col cols="12" md="6" v-for="task in tasks" :key="task.id">
          <v-card class="mb-4">
            <v-card-title class="d-flex justify-space-between align-center">
              <div class="text-truncate">{{ task.title }}</div>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    variant="text"
                    size="small"
                    v-bind="props"
                  ></v-btn>
                </template>
                <v-list>
                  <v-list-item @click="$emit('view', task)" :value="'view'">
                    <v-list-item-title>View</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$emit('edit', task)" :value="'edit'">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$emit('delete', task)" :value="'delete'" color="error">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-title>

            <v-card-text>
              <div class="text-body-2 mb-2">{{ task.description }}</div>
              <div class="d-flex flex-wrap gap-2">
                <v-chip :color="getStatusColor(task.status)" size="small">
                  {{ task.status }}
                </v-chip>
                <v-chip :color="getPriorityColor(task.priority)" size="small">
                  {{ task.priority }}
                </v-chip>
                <v-chip size="small" variant="outlined">
                  Due: {{ formatDate(task.dueDate) }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import type { Task } from '@/types/Task'

const props = defineProps<{
  tasks: Task[]
  loading?: boolean
}>()

defineEmits<{
  (e: 'edit', task: Task): void
  (e: 'delete', task: Task): void
  (e: 'view', task: Task): void
}>()

const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

const headers = ref([
  {
    title: 'Title',
    align: 'start',
    sortable: true,
    key: 'title',
  },
  {
    title: 'Description',
    align: 'start',
    sortable: false,
    key: 'description',
  },
  {
    title: 'Status',
    align: 'center',
    sortable: true,
    key: 'status',
  },
  {
    title: 'Priority',
    align: 'center',
    sortable: true,
    key: 'priority',
  },
  {
    title: 'Due Date',
    align: 'center',
    sortable: true,
    key: 'dueDate',
  },
  {
    title: 'Actions',
    align: 'end',
    sortable: false,
    key: 'actions',
  },
])

const getStatusColor = (status: string) => {
  const colors = {
    Pending: 'warning',
    'In Progress': 'info',
    Completed: 'success',
  }
  return colors[status as keyof typeof colors] || 'grey'
}

const getPriorityColor = (priority: string) => {
  const colors = {
    Low: 'success',
    Medium: 'warning',
    High: 'error',
  }
  return colors[priority as keyof typeof colors] || 'grey'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.v-data-table :deep(.v-data-table-footer) {
  justify-content: center;
}

.gap-2 {
  gap: 8px;
}
</style>
