import type { GoalCategory } from '@/types';

export const QUADRANT_CONFIG = {
  Q1: {
    title: 'DO FIRST',
    subtitle: 'Important & Urgent',
    color: 'red',
    description: 'Handle crises and urgent deadlines here',
    emoji: '🚨',
  },
  Q2: {
    title: 'SCHEDULE',
    subtitle: 'Important, Not Urgent',
    color: 'green',
    description:
      'Your most important work lives here - schedule time for these',
    emoji: '🎯',
  },
  Q3: {
    title: 'DELEGATE',
    subtitle: 'Urgent, Not Important',
    color: 'yellow',
    description: 'Delegate or find ways to automate these tasks',
    emoji: '⚡',
  },
  Q4: {
    title: 'ELIMINATE',
    subtitle: 'Not Important, Not Urgent',
    color: 'gray',
    description: 'Question whether these tasks are necessary',
    emoji: '🗑️',
  },
} as const;

export const GOAL_CATEGORIES: Record<
  GoalCategory,
  { label: string; color: string; emoji: string }
> = {
  career: { label: 'Career', color: 'blue', emoji: '💼' },
  health: { label: 'Health', color: 'green', emoji: '🏃' },
  relationships: { label: 'Relationships', color: 'pink', emoji: '❤️' },
  learning: { label: 'Learning', color: 'violet', emoji: '📚' },
  financial: { label: 'Financial', color: 'yellow', emoji: '💰' },
  personal: { label: 'Personal', color: 'orange', emoji: '🌟' },
};

export const GOAL_TIMEFRAMES = {
  '3_months': '3 Months',
  '6_months': '6 Months',
  '1_year': '1 Year',
  ongoing: 'Ongoing',
} as const;

export const STAGING_ZONE_CONFIG = {
  maxItems: 5,
  title: 'Staging Zone',
  subtitle: 'Stage quick thoughts here, then organize into quadrants',
  color: 'blue',
  emoji: '📦',
} as const;

export const APP_CONFIG = {
  maxActiveGoals: 12,
  defaultTaskEstimate: 30, // minutes
  q2HealthyPercentage: 30,
  stagingWarningDays: 3,
} as const;
