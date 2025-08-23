// Core application types

export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type GoalCategory =
  | 'career'
  | 'health'
  | 'relationships'
  | 'learning'
  | 'financial'
  | 'personal';

export type GoalTimeframe = '3_months' | '6_months' | '1_year' | 'ongoing';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  onboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  color: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  goalId?: string;
  title: string;
  description?: string;
  quadrant?: Quadrant;
  dueDate?: string;
  estimatedMinutes?: number;
  completed: boolean;
  isStaged: boolean;
  position: number;
  stagedAt: string;
  organizedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  goal?: Goal;
}

export interface QuadrantDistribution {
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  goalId?: string;
  quadrant?: Quadrant;
  dueDate?: string;
  estimatedMinutes?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  goalId?: string;
  quadrant?: Quadrant;
  dueDate?: string;
  estimatedMinutes?: number;
  completed?: boolean;
  isStaged?: boolean;
  position?: number;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  color?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  category?: GoalCategory;
  timeframe?: GoalTimeframe;
  color?: string;
  archived?: boolean;
}
