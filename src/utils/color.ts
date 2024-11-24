/**
 * Get the color based on the status of the task.
 *
 * @param status - The status of the task.
 * @returns color for the status.
 */

export const getStatusColor = (status: string) => {
  const colors = {
    Pending: 'orange',
    'In Progress': 'blue',
    Completed: 'green',
  }
  return colors[status as keyof typeof colors] || 'grey'
}

/**
 * Get the color based on the priority of the task.
 *
 * @param priority - The priority of the task.
 * @returns color for the priority.
 */
export const getPriorityColor = (priority: string) => {
  const colors = {
    Low: 'success',
    Medium: 'warning',
    High: 'error',
  }
  return colors[priority as keyof typeof colors] || 'grey'
}
