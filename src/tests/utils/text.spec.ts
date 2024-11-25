import { describe, it, expect } from 'vitest'
import { truncateText } from '@/utils/text'

describe('truncateText', () => {
  it('should return the original string if its length is less than or equal to maxLength', () => {
    const str = 'Hello World'
    const maxLength = 20
    expect(truncateText(str, maxLength)).toBe(str)
  })

  it('should return the original string if it is shorter than or equal to maxLength, even with a custom suffix', () => {
    const str = 'Short text'
    const maxLength = 20
    const suffix = ' [more]'
    expect(truncateText(str, maxLength, suffix)).toBe(str)
  })

  it('should handle an empty string correctly', () => {
    const str = ''
    const maxLength = 5
    expect(truncateText(str, maxLength)).toBe('')
  })

  it('should handle maxLength equal to suffix length', () => {
    const str = 'Hello World'
    const maxLength = 3
    const suffix = '...'
    expect(truncateText(str, maxLength, suffix)).toBe('...')
  })
})
