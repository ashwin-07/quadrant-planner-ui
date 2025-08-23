// Task utility functions for Quadrant Planner

import type {
  Goal,
  QuadrantDistribution,
  QuadrantType,
  StagingEfficiency,
  Task,
  TaskPriority,
} from '@/types';
import { getHoursSince, isOverdue } from './date';

/**
 * Filter tasks by quadrant
 */
export function filterTasksByQuadrant(
  tasks: Task[],
  quadrant: QuadrantType
): Task[] {
  if (quadrant === 'staging') {
    return tasks.filter(task => task.isStaged);
  }
  return tasks.filter(task => !task.isStaged && task.quadrant === quadrant);
}

/**
 * Get tasks distribution across quadrants
 */
export function getQuadrantDistribution(tasks: Task[]): QuadrantDistribution {
  const distribution: QuadrantDistribution = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
    staging: 0,
  };

  tasks.forEach(task => {
    if (task.isStaged) {
      distribution.staging!++;
    } else {
      distribution[task.quadrant]++;
    }
  });

  return distribution;
}

/**
 * Calculate Q2 focus percentage
 */
export function calculateQ2Focus(tasks: Task[]): number {
  const activeTasks = tasks.filter(task => !task.completed && !task.isStaged);
  if (activeTasks.length === 0) return 0;

  const q2Tasks = activeTasks.filter(task => task.quadrant === 'Q2');
  return Math.round((q2Tasks.length / activeTasks.length) * 100);
}

/**
 * Get staging efficiency metrics
 */
export function getStagingEfficiency(tasks: Task[]): StagingEfficiency {
  const stagedTasks = tasks.filter(task => task.isStaged);
  const processedTasks = tasks.filter(task => task.organizedAt);

  let totalStagingTime = 0;
  let oldestStagedItem: { taskId: string; daysSinceStaged: number } | undefined;
  let maxDaysStaged = 0;

  stagedTasks.forEach(task => {
    if (task.stagedAt) {
      const hoursStaged = getHoursSince(task.stagedAt);
      totalStagingTime += hoursStaged;

      const daysStaged = Math.floor(hoursStaged / 24);
      if (daysStaged > maxDaysStaged) {
        maxDaysStaged = daysStaged;
        oldestStagedItem = {
          taskId: task.id,
          daysSinceStaged: daysStaged,
        };
      }
    }
  });

  const averageStagingTime =
    stagedTasks.length > 0 ? totalStagingTime / stagedTasks.length : 0;

  const processingRate =
    stagedTasks.length + processedTasks.length > 0
      ? Math.round(
          (processedTasks.length /
            (stagedTasks.length + processedTasks.length)) *
            100
        )
      : 0;

  return {
    averageStagingTime,
    itemsStaged: stagedTasks.length,
    itemsProcessed: processedTasks.length,
    processingRate,
    oldestStagedItem,
  };
}

/**
 * Get overdue tasks
 */
export function getOverdueTasks(tasks: Task[]): Task[] {
  return tasks.filter(
    task => !task.completed && task.dueDate && isOverdue(task.dueDate)
  );
}

/**
 * Sort tasks by priority and due date
 */
export function sortTasks(tasks: Task[]): Task[] {
  const priorityOrder: Record<TaskPriority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...tasks].sort((a, b) => {
    // First sort by completion status (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then by priority
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // Then by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }

    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Get task priority color
 */
export function getTaskPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'urgent':
      return 'red';
    case 'high':
      return 'orange';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'gray';
    default:
      return 'gray';
  }
}

/**
 * Estimate total time for tasks
 */
export function estimateTotalTime(tasks: Task[]): number {
  return tasks.reduce((total, task) => {
    return total + (task.estimatedMinutes || 0);
  }, 0);
}

/**
 * Group tasks by goal
 */
export function groupTasksByGoal(
  tasks: Task[],
  goals: Goal[]
): Record<string, Task[]> {
  const grouped: Record<string, Task[]> = {};

  // Initialize with goal IDs
  goals.forEach(goal => {
    grouped[goal.id] = [];
  });

  // Add ungrouped category for tasks without goals
  grouped['ungrouped'] = [];

  tasks.forEach(task => {
    if (task.goalId && grouped[task.goalId]) {
      grouped[task.goalId].push(task);
    } else {
      grouped['ungrouped'].push(task);
    }
  });

  return grouped;
}

/**
 * Check if task can be moved to staging (staging limit check)
 */
export function canMoveToStaging(tasks: Task[], maxStagingItems = 5): boolean {
  const stagedTasks = tasks.filter(task => task.isStaged);
  return stagedTasks.length < maxStagingItems;
}

/**
 * Generate task suggestions based on patterns
 */
export function generateTaskSuggestions(tasks: Task[]): string[] {
  const suggestions: string[] = [];

  const q2Percentage = calculateQ2Focus(tasks);
  if (q2Percentage < 30) {
    suggestions.push(
      'Consider adding more Important, Not Urgent tasks (Q2) to focus on long-term goals'
    );
  }

  const overdueTasks = getOverdueTasks(tasks);
  if (overdueTasks.length > 0) {
    suggestions.push(
      `You have ${overdueTasks.length} overdue task${overdueTasks.length === 1 ? '' : 's'}. Consider addressing these first.`
    );
  }

  const stagingEfficiency = getStagingEfficiency(tasks);
  if (stagingEfficiency.itemsStaged >= 5) {
    suggestions.push(
      'Your staging zone is full. Take time to organize these items into proper quadrants.'
    );
  }

  const completedToday = tasks.filter(
    task =>
      task.completed &&
      task.completedAt &&
      new Date(task.completedAt).toDateString() === new Date().toDateString()
  );

  if (completedToday.length === 0) {
    suggestions.push(
      'Start your day by completing at least one task from your Q2 quadrant.'
    );
  }

  return suggestions;
}

/**
 * Validate task data (basic validation)
 */
export function validateTaskData(task: Partial<Task>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!task.title || task.title.trim().length === 0) {
    errors.push('Task title is required');
  }

  if (task.title && task.title.length > 200) {
    errors.push('Task title must be less than 200 characters');
  }

  if (task.description && task.description.length > 1000) {
    errors.push('Task description must be less than 1000 characters');
  }

  if (
    task.estimatedMinutes &&
    (task.estimatedMinutes < 1 || task.estimatedMinutes > 480)
  ) {
    errors.push('Estimated time must be between 1 minute and 8 hours');
  }

  if (task.tags && task.tags.length > 10) {
    errors.push('Tasks can have at most 10 tags');
  }

  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.push('Invalid due date');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get task completion streak
 */
export function getTaskCompletionStreak(tasks: Task[]): number {
  const completedTasks = tasks
    .filter(task => task.completed && task.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    );

  let streak = 0;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const task of completedTasks) {
    const completedDate = new Date(task.completedAt!);
    completedDate.setHours(0, 0, 0, 0);

    if (completedDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate goal balance score (how evenly tasks are distributed across goals)
 */
export function calculateGoalBalance(tasks: Task[], goals: Goal[]): number {
  if (goals.length === 0) return 100;

  const tasksByGoal = groupTasksByGoal(
    tasks.filter(task => !task.completed),
    goals
  );
  const taskCounts = Object.values(tasksByGoal).map(
    goalTasks => goalTasks.length
  );

  if (taskCounts.length === 0) return 100;

  const average =
    taskCounts.reduce((sum, count) => sum + count, 0) / taskCounts.length;
  const variance =
    taskCounts.reduce((sum, count) => sum + Math.pow(count - average, 2), 0) /
    taskCounts.length;

  // Lower variance = better balance, scale to 0-100
  const maxVariance = Math.pow(average, 2); // Worst case: all tasks in one goal
  const balanceScore = Math.max(0, 100 - (variance / maxVariance) * 100);

  return Math.round(balanceScore);
}
