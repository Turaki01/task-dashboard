import { describe, it, expect } from 'vitest'
import { formatDate } from '@/utils/dateFormatter'

describe('formatDate', () => {
  it('should format a valid date string to the "YYYY-MM-DD" format', () => {
    const date = '2024-11-24T12:00:00Z'
    const expected = 'November 24, 2024'
    expect(formatDate(date)).toBe(expected)
  })

  it('should handle a date string in the format "YYYY-MM-DD"', () => {
    const date = '2023-06-15'
    const expected = 'June 15, 2023'
    expect(formatDate(date)).toBe(expected)
  })

  it('should handle an invalid date string gracefully', () => {
    const date = 'invalid-date'
    const expected = 'Invalid Date'
    expect(formatDate(date)).toBe(expected)
  })

  it('should format the current date correctly', () => {
    const today = new Date()
    const formattedToday = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    expect(formatDate(today.toISOString())).toBe(formattedToday)
  })

  it('should handle a date in a different format (e.g., "MM/DD/YYYY")', () => {
    const date = '11/24/2024'
    const expected = 'November 24, 2024'
    expect(formatDate(date)).toBe(expected)
  })
})
