/**
 * Utility function for combining class names
 * Equivalent to the popular 'cn' utility from many design systems
 */

export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ');
}