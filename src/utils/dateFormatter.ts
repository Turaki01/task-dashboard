/**
 * Format date to 'YYYY-MM-DD' format.
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 */

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
