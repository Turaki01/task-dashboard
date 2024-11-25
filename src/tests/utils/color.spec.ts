import { describe, it, expect } from 'vitest'
import { getStatusColor, getPriorityColor } from '@/utils/color'

describe('getStatusColor', () => {
  it('should return the correct color for "Pending" status', () => {
    expect(getStatusColor('Pending')).toBe('orange')
  })

  it('should return the correct color for "In Progress" status', () => {
    expect(getStatusColor('In Progress')).toBe('blue')
  })

  it('should return the correct color for "Completed" status', () => {
    expect(getStatusColor('Completed')).toBe('green')
  })

  it('should return "grey" for an unknown status', () => {
    expect(getStatusColor('Unknown')).toBe('grey')
  })
})

describe('getPriorityColor', () => {
  it('should return the correct color for "Low" priority', () => {
    expect(getPriorityColor('Low')).toBe('success')
  })

  it('should return the correct color for "Medium" priority', () => {
    expect(getPriorityColor('Medium')).toBe('warning')
  })

  it('should return the correct color for "High" priority', () => {
    expect(getPriorityColor('High')).toBe('error')
  })

  it('should return "grey" for an unknown priority', () => {
    expect(getPriorityColor('Unknown')).toBe('grey')
  })
})
