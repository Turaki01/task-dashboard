export interface Task {
  id?: number
  title: string
  description: string
  status: 'Pending' | 'In Progress' | 'Completed'
  priority: 'Low' | 'Medium' | 'High'
  dueDate: string
}

export interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
}
