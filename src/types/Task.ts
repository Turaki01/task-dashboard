export interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
}

export interface Subtask {
  id: number
  title: string
  completed: boolean
}

export interface Task {
  id?: number
  title: string
  description: string
  status: 'Pending' | 'In Progress' | 'Completed'
  priority: 'Low' | 'Medium' | 'High'
  dueDate: string
  subtasks?: Subtask[]
}
