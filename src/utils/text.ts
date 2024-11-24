/**
 * Truncate a string to a specified maximum length with an optional suffix.
 *
 * @param str - The string to truncate.
 * @param maxLength - The maximum length of the string, including the suffix.
 * @param suffix - The string to append at the end if truncation occurs (default: '...').
 * @returns The truncated string with the suffix if applicable.
 */

export const truncateText = (str: string, maxLength: number, suffix: string = '...') => {
  if (str.length <= maxLength) {
    return str
  }

  const truncateLength = maxLength - suffix.length
  return str.slice(0, truncateLength) + suffix
}
