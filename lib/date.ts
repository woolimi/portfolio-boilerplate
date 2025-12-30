import { DateTime } from 'luxon';

/**
 * Get current date at midnight (00:00:00) in ISO 8601 format
 * @returns ISO 8601 formatted date string
 */
export function getCurrentDateMidnight(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

/**
 * Format blog date using luxon (Korean locale only)
 * @param date - ISO 8601 formatted date string
 * @returns Formatted date string
 */
export function formatBlogDate(date: string): string {
  const dt = DateTime.fromISO(date);

  if (!dt.isValid) {
    return date; // Return original if invalid
  }

  return dt.setLocale('ko').toFormat('yyyy년 M월 d일');
}
