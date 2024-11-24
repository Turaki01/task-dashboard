export interface FormErrors {
  title: string[]
  description: string[]
  status: string[]
  priority: string[]
  dueDate: string[]
}

export const statusOptions = ['Pending', 'In Progress', 'Completed'] as const
export const priorityOptions = ['Low', 'Medium', 'High'] as const

export type TaskStatus = (typeof statusOptions)[number]
export type TaskPriority = (typeof priorityOptions)[number]

export const taskValidation = {
  titleRules: [
    (v: string) => !!v || 'Title is required',
    (v: string) => (v && v.length >= 3) || 'Title must be at least 3 characters',
    (v: string) => (v && v.length <= 100) || 'Title must be less than 100 characters',
    (v: string) => /^[a-zA-Z0-9\s\-_.,!?()]+$/.test(v) || 'Title contains invalid characters',
  ],

  descriptionRules: [
    (v: string) => !!v || 'Description is required',
    (v: string) => (v && v.length >= 10) || 'Description must be at least 10 characters',
    (v: string) => (v && v.length <= 500) || 'Description must be less than 500 characters',
  ],

  statusRules: [
    (v: string) => !!v || 'Status is required',
    (v: string) => statusOptions.includes(v as TaskStatus) || 'Invalid status',
  ],

  priorityRules: [
    (v: string) => !!v || 'Priority is required',
    (v: string) => priorityOptions.includes(v as TaskPriority) || 'Invalid priority',
  ],

  getDueDateRules() {
    return [
      (v: string) => !!v || 'Due date is required',
      (v: string) => {
        const selectedDate = new Date(v)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return selectedDate >= today || 'Due date cannot be in the past'
      },
    ]
  },

  createEmptyErrors(): FormErrors {
    return {
      title: [],
      description: [],
      status: [],
      priority: [],
      dueDate: [],
    }
  },

  clearError(errors: FormErrors, field: keyof FormErrors): void {
    errors[field] = []
  },

  clearAllErrors(errors: FormErrors): void {
    Object.keys(errors).forEach((key) => {
      errors[key as keyof FormErrors] = []
    })
  },
}
