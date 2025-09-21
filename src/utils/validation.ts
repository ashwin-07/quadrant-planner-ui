// Validation utility functions for Quadrant Planner

import type {
  CreateGoalInput,
  CreateTaskInput,
  Goal,
  GoalCategory,
  GoalTimeframe,
  QuadrantType,
  Task,
  TaskPriority,
  UpdateGoalInput,
  UpdateTaskInput,
} from '@/types';

// Validation result interface
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }

  return { valid: errors.length === 0, errors };
}

// Goal validation
export function validateGoal(
  goal: CreateGoalInput | UpdateGoalInput
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if ('title' in goal) {
    if (!goal.title || goal.title.trim().length === 0) {
      errors.push('Goal title is required');
    } else if (goal.title.length > 100) {
      errors.push('Goal title must be less than 100 characters');
    } else if (goal.title.length < 3) {
      warnings.push(
        'Goal titles are more effective when descriptive (3+ characters)'
      );
    }
  }

  // Description validation
  if (goal.description) {
    if (goal.description.length > 500) {
      errors.push('Goal description must be less than 500 characters');
    }
  }

  // Category validation
  if ('category' in goal) {
    const validCategories: GoalCategory[] = [
      'career',
      'health',
      'relationships',
      'learning',
      'financial',
      'personal',
    ];
    if (!goal.category || !validCategories.includes(goal.category)) {
      errors.push('Please select a valid goal category');
    }
  }

  // Timeframe validation
  if ('timeframe' in goal) {
    const validTimeframes: GoalTimeframe[] = [
      '3_months',
      '6_months',
      '1_year',
      'ongoing',
    ];
    if (!goal.timeframe || !validTimeframes.includes(goal.timeframe)) {
      errors.push('Please select a valid timeframe');
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Task validation
export function validateTask(
  task: CreateTaskInput | UpdateTaskInput
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if ('title' in task) {
    if (!task.title || task.title.trim().length === 0) {
      errors.push('Task title is required');
    } else if (task.title.length > 200) {
      errors.push('Task title must be less than 200 characters');
    } else if (task.title.length < 3) {
      warnings.push('Task titles should be descriptive (3+ characters)');
    }
  }

  // Description validation
  if (task.description) {
    if (task.description.length > 1000) {
      errors.push('Task description must be less than 1000 characters');
    }
  }

  // Quadrant validation
  if ('quadrant' in task) {
    const validQuadrants: QuadrantType[] = ['Q1', 'Q2', 'Q3', 'Q4', 'staging'];
    if (!task.quadrant || !validQuadrants.includes(task.quadrant)) {
      errors.push('Please select a valid quadrant');
    }
  }

  // Priority validation
  if (task.priority) {
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(task.priority)) {
      errors.push('Please select a valid priority level');
    }
  }

  // Estimated time validation
  if (task.estimatedMinutes !== undefined) {
    if (task.estimatedMinutes < 0) {
      errors.push('Estimated time cannot be negative');
    } else if (task.estimatedMinutes > 480) {
      errors.push('Estimated time cannot exceed 8 hours (480 minutes)');
    } else if (task.estimatedMinutes > 240) {
      warnings.push(
        'Consider breaking down tasks longer than 4 hours into smaller subtasks'
      );
    }
  }

  // Due date validation
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    const now = new Date();

    if (isNaN(dueDate.getTime())) {
      errors.push('Please enter a valid due date');
    } else if (
      dueDate < new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    ) {
      errors.push('Due date cannot be more than a year in the past');
    } else if (
      dueDate > new Date(now.getFullYear() + 5, now.getMonth(), now.getDate())
    ) {
      warnings.push('Due dates far in the future may need regular review');
    }
  }

  // Tags validation
  if (task.tags) {
    if (task.tags.length > 10) {
      errors.push('Tasks can have at most 10 tags');
    }

    task.tags.forEach((tag, index) => {
      if (!tag || tag.trim().length === 0) {
        errors.push(`Tag ${index + 1} cannot be empty`);
      } else if (tag.length > 30) {
        errors.push(`Tag "${tag}" must be less than 30 characters`);
      }
    });

    // Check for duplicate tags
    const uniqueTags = new Set(task.tags.map(tag => tag.toLowerCase()));
    if (uniqueTags.size !== task.tags.length) {
      warnings.push('Duplicate tags detected');
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Check if goal limit is exceeded
export function validateGoalLimit(
  currentGoals: Goal[],
  isCreating = false
): ValidationResult {
  const errors: string[] = [];
  const maxGoals = 12;

  const activeGoals = currentGoals.filter(goal => !(goal.archived ?? false));
  const goalCount = isCreating ? activeGoals.length + 1 : activeGoals.length;

  if (goalCount > maxGoals) {
    errors.push(
      `You can have at most ${maxGoals} active goals. Consider archiving some goals first.`
    );
  }

  return { valid: errors.length === 0, errors };
}

// Check if staging zone limit is exceeded
export function validateStagingLimit(
  currentTasks: Task[],
  isAdding = false
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const maxStaging = 5;

  const stagedTasks = currentTasks.filter(task => task.isStaged);
  const stagedCount = isAdding ? stagedTasks.length + 1 : stagedTasks.length;

  if (stagedCount > maxStaging) {
    errors.push(
      `Staging zone can hold at most ${maxStaging} items. Please organize some tasks into quadrants first.`
    );
  } else if (stagedCount === maxStaging) {
    warnings.push(
      'Staging zone is at capacity. Consider organizing tasks soon.'
    );
  } else if (stagedCount >= 3) {
    warnings.push(
      'Staging zone is getting full. Regular organization keeps you productive.'
    );
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Validate quadrant transition (business logic)
export function validateQuadrantTransition(
  fromQuadrant: QuadrantType,
  toQuadrant: QuadrantType,
  task: Task
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Prevent moving completed tasks
  if (task.completed && toQuadrant !== fromQuadrant) {
    errors.push('Cannot move completed tasks between quadrants');
    return { valid: false, errors };
  }

  // Staging zone validations
  if (toQuadrant === 'staging') {
    warnings.push(
      'Moving organized tasks back to staging may indicate unclear priorities'
    );
  }

  // Q1 transitions
  if (toQuadrant === 'Q1' && fromQuadrant !== 'Q1') {
    warnings.push(
      'Moving to Q1 (Urgent & Important) - ensure this truly requires immediate attention'
    );
  }

  // Q4 transitions
  if (toQuadrant === 'Q4') {
    warnings.push(
      'Q4 tasks (Not Important, Not Urgent) should be questioned - consider eliminating instead'
    );
  }

  // Q2 encouragement
  if (toQuadrant === 'Q2' && fromQuadrant !== 'Q2') {
    // This is good - no warnings, maybe a positive message
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Validate bulk operations
export function validateBulkOperation(
  operation: 'complete' | 'delete' | 'move',
  tasks: Task[],
  targetQuadrant?: QuadrantType
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (tasks.length === 0) {
    errors.push('No tasks selected for bulk operation');
    return { valid: false, errors };
  }

  if (tasks.length > 20) {
    warnings.push('Bulk operations on many tasks should be done carefully');
  }

  // Operation-specific validations
  switch (operation) {
    case 'complete': {
      const alreadyCompleted = tasks.filter(task => task.completed);
      if (alreadyCompleted.length > 0) {
        warnings.push(`${alreadyCompleted.length} task(s) already completed`);
      }
      break;
    }

    case 'delete': {
      warnings.push('Bulk deletion cannot be undone');
      const incompleteTasks = tasks.filter(task => !task.completed);
      if (incompleteTasks.length > 0) {
        warnings.push(`Deleting ${incompleteTasks.length} incomplete task(s)`);
      }
      break;
    }

    case 'move':
      if (!targetQuadrant) {
        errors.push('Target quadrant required for move operation');
      } else if (targetQuadrant === 'staging') {
        warnings.push(
          'Moving multiple tasks to staging may create organization overhead'
        );
      }
      break;
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Form field validation helpers
export function validateRequired(
  value: unknown,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];

  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateLength(
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): ValidationResult {
  const errors: string[] = [];

  if (min !== undefined && value.length < min) {
    errors.push(`${fieldName} must be at least ${min} characters`);
  }

  if (max !== undefined && value.length > max) {
    errors.push(`${fieldName} must be less than ${max} characters`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateRange(
  value: number,
  fieldName: string,
  min?: number,
  max?: number
): ValidationResult {
  const errors: string[] = [];

  if (min !== undefined && value < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  }

  if (max !== undefined && value > max) {
    errors.push(`${fieldName} must be no more than ${max}`);
  }

  return { valid: errors.length === 0, errors };
}

// Combine multiple validation results
export function combineValidationResults(
  ...results: ValidationResult[]
): ValidationResult {
  const allErrors = results.flatMap(result => result.errors);
  const allWarnings = results.flatMap(result => result.warnings || []);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
  };
}
