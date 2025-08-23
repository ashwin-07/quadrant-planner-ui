// Date utility functions for Quadrant Planner

import {
  addDays,
  differenceInDays,
  differenceInHours,
  endOfMonth,
  endOfWeek,
  format,
  isThisMonth,
  isThisWeek,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

/**
 * Format date for display in UI
 */
export function formatDate(
  date: string | Date,
  pattern = 'MMM d, yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, pattern);
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInHours = differenceInHours(now, dateObj);
  const diffInDays = differenceInDays(now, dateObj);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else {
    return formatDate(dateObj, 'MMM d');
  }
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dueDate: string | Date): boolean {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const now = new Date();
  return dateObj < now;
}

/**
 * Check if a date is due today
 */
export function isDueToday(dueDate: string | Date): boolean {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isToday(dateObj);
}

/**
 * Check if a date is due this week
 */
export function isDueThisWeek(dueDate: string | Date): boolean {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isThisWeek(dateObj);
}

/**
 * Check if a date is due this month
 */
export function isDueThisMonth(dueDate: string | Date): boolean {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isThisMonth(dateObj);
}

/**
 * Get days until due date
 */
export function getDaysUntilDue(dueDate: string | Date): number {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const now = new Date();
  return differenceInDays(dateObj, now);
}

/**
 * Get hours since a date (useful for staging time calculation)
 */
export function getHoursSince(date: string | Date): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  return differenceInHours(now, dateObj);
}

/**
 * Get due date status with color and text
 */
export function getDueDateStatus(dueDate?: string | Date): {
  status: 'overdue' | 'due-today' | 'due-soon' | 'upcoming' | 'none';
  color: 'red' | 'orange' | 'yellow' | 'blue' | 'gray';
  text: string;
} {
  if (!dueDate) {
    return { status: 'none', color: 'gray', text: 'No due date' };
  }

  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const daysUntil = getDaysUntilDue(dateObj);

  if (daysUntil < 0) {
    return {
      status: 'overdue',
      color: 'red',
      text: `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'}`,
    };
  } else if (daysUntil === 0) {
    return { status: 'due-today', color: 'orange', text: 'Due today' };
  } else if (daysUntil <= 3) {
    return {
      status: 'due-soon',
      color: 'yellow',
      text: `Due in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
    };
  } else {
    return {
      status: 'upcoming',
      color: 'blue',
      text: formatDate(dateObj, 'MMM d'),
    };
  }
}

/**
 * Get date range for analytics periods
 */
export function getDateRange(period: 'week' | 'month' | 'quarter' | 'year'): {
  start: Date;
  end: Date;
} {
  const now = new Date();

  switch (period) {
    case 'week':
      return {
        start: startOfWeek(now),
        end: endOfWeek(now),
      };
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case 'quarter': {
      const quarterStart = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3,
        1
      );
      const quarterEnd = new Date(
        quarterStart.getFullYear(),
        quarterStart.getMonth() + 3,
        0
      );
      return {
        start: quarterStart,
        end: quarterEnd,
      };
    }
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31),
      };
    default:
      return {
        start: startOfWeek(now),
        end: endOfWeek(now),
      };
  }
}

/**
 * Convert minutes to human readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Get next business day (Monday-Friday)
 */
export function getNextBusinessDay(from: Date = new Date()): Date {
  let nextDay = addDays(from, 1);

  // Skip weekends (Saturday = 6, Sunday = 0)
  while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
    nextDay = addDays(nextDay, 1);
  }

  return nextDay;
}

/**
 * Check if current time is business hours (9 AM - 6 PM, Mon-Fri)
 */
export function isBusinessHours(date: Date = new Date()): boolean {
  const day = date.getDay();
  const hour = date.getHours();

  // Monday = 1, Friday = 5
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}
