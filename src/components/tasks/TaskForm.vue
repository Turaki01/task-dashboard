<template>
  <v-dialog v-model="dialogModel" max-width="600px">
    <v-card class="pt-4">
      <v-card-title>
        <span class="text-h5">{{ isEditing ? 'Edit Task' : 'New Task' }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="submit" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.title"
                  :rules="[...taskValidation.titleRules, validateDuplicateTitle]"
                  label="Title"
                  required
                  :error-messages="errors.title"
                  @input="clearError('title')"
                  maxlength="100"
                  counter
                  :disabled="loading"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  :rules="taskValidation.descriptionRules"
                  label="Description"
                  required
                  :error-messages="errors.description"
                  @input="clearError('description')"
                  maxlength="500"
                  counter
                  auto-grow
                  rows="3"
                  :disabled="loading"
                ></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.status"
                  :items="statusOptions"
                  :rules="taskValidation.statusRules"
                  label="Status"
                  required
                  :error-messages="errors.status"
                  @update:model-value="clearError('status')"
                  :disabled="loading"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.priority"
                  :items="priorityOptions"
                  :rules="taskValidation.priorityRules"
                  label="Priority"
                  required
                  :error-messages="errors.priority"
                  @update:model-value="clearError('priority')"
                  :disabled="loading"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.dueDate"
                  :rules="taskValidation.getDueDateRules()"
                  label="Due Date"
                  type="date"
                  required
                  :error-messages="errors.dueDate"
                  @input="clearError('dueDate')"
                  :min="minDate"
                  :disabled="loading"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="pb-8">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="closeDialog" :disabled="loading">Cancel</v-btn>
        <v-btn color="primary" @click="submit" :loading="loading" :disabled="!valid || loading">
          <v-icon start v-if="!loading">
            {{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}
          </v-icon>
          {{ isEditing ? 'Update Task' : 'Create Task' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { Task } from '@/types/Task'
import { useTaskStore } from '@/stores/taskStore'
import {
  taskValidation,
  FormErrors,
  statusOptions,
  priorityOptions,
} from '@/validators/taskValidation'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  task: {
    type: Object as () => Task | null,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:model-value', 'saved'])
const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value),
})

const taskStore = useTaskStore()
const form = ref<InstanceType<(typeof import('vuetify/components'))['VForm']> | null>(null)
const valid = ref(false)
const loading = ref(false)

// minimum date (today)
const minDate = computed(() => new Date().toISOString().split('T')[0])

// Form error handling
const errors = reactive<FormErrors>(taskValidation.createEmptyErrors())

const clearError = (field: keyof FormErrors) => {
  taskValidation.clearError(errors, field)
}

// Validate duplicate title
const validateDuplicateTitle = (value: string) => {
  if (!value) return true

  const normalizedTitle = value.trim().toLowerCase()
  const existingTask = taskStore.tasks.find((task) => {
    if (props.task?.id === task.id) return false
    return task.title.trim().toLowerCase() === normalizedTitle
  })

  return !existingTask || 'A task with this title already exists'
}

// Form data
const formData = reactive<Task>({
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
  dueDate: new Date().toISOString().split('T')[0],
})

const isEditing = computed(() => !!props.task)

const resetForm = () => {
  if (form.value) {
    form.value.resetValidation()
  }
  taskValidation.clearAllErrors(errors)
  Object.assign(formData, {
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
  })
}

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      const formattedTask = {
        ...newTask,
        dueDate: new Date(newTask.dueDate).toISOString().split('T')[0],
      }
      Object.assign(formData, formattedTask)
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

const validateForm = async (): Promise<boolean> => {
  if (!form.value) return false

  const isValid = await form.value.validate()

  if (!isValid) {
    const fields = ['title', 'description', 'status', 'priority', 'dueDate'] as const
    fields.forEach((field) => {
      const fieldErrors = form.value?.items.find((item) => item.id === field)?.errorBucket || []
      errors[field] = fieldErrors
    })
  }

  return isValid
}

const closeDialog = () => {
  dialogModel.value = false
  resetForm()
}

const submit = async () => {
  const isValid = await validateForm()
  if (!isValid) return

  loading.value = true
  try {
    if (isEditing.value && props.task?.id) {
      await taskStore.updateTask({ ...formData, id: props.task.id })
      emit('saved')
    } else {
      await taskStore.createTask(formData)
      emit('saved')
    }
    closeDialog()
  } catch (error) {
    console.error('Error saving task:', error)
  } finally {
    loading.value = false
  }
}
</script>
