// Core application types for Quadrant Planner
// Based on Stephen Covey's Time Management Matrix

export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type QuadrantType = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'staging';

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
  name: string;
  fullName?: string;
  avatarUrl?: string;
  onboarded: boolean;
  lastLoginAt: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  colorScheme: 'light' | 'dark' | 'auto';
  defaultQuadrant: QuadrantType;
  stagingReminders: boolean;
  emailNotifications: boolean;
  weeklyReview: boolean;
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

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubtaskCreate {
  title: string;
}

export interface SubtaskUpdate {
  id: string;
  title: string;
  completed?: boolean;
}

export interface Task {
  id: string;
  userId: string;
  goalId?: string;
  title: string;
  description?: string;
  quadrant: QuadrantType;
  dueDate?: string;
  estimatedMinutes?: number;
  priority: TaskPriority;
  tags: string[];
  completed: boolean;
  isStaged: boolean;
  position: number;
  stagedAt?: string;
  organizedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
  goal?: Goal;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface QuadrantDistribution {
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
  staging?: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  goalId?: string;
  quadrant: QuadrantType;
  dueDate?: string;
  estimatedMinutes?: number;
  priority?: TaskPriority;
  tags?: string[];
  subtasks?: (SubtaskCreate | SubtaskUpdate)[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  goalId?: string;
  quadrant?: QuadrantType;
  dueDate?: string;
  estimatedMinutes?: number;
  priority?: TaskPriority;
  tags?: string[];
  completed?: boolean;
  isStaged?: boolean;
  position?: number;
  subtasks?: (SubtaskCreate | SubtaskUpdate)[];
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

// Analytics and Insights Types
export interface AnalyticsData {
  userId: string;
  period: AnalyticsPeriod;
  startDate: string;
  endDate: string;
  taskDistribution: QuadrantDistribution;
  goalProgress: Record<string, GoalStats>;
  stagingEfficiency: StagingEfficiency;
  productivity: ProductivityMetrics;
  insights: Insight[];
}

export type AnalyticsPeriod = 'week' | 'month' | 'quarter' | 'year';

export interface GoalStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
  averageTaskAge: number; // days
  lastActivityAt?: string;
}

export interface StagingEfficiency {
  averageStagingTime: number; // hours
  itemsStaged: number;
  itemsProcessed: number;
  processingRate: number; // percentage
  oldestStagedItem?: {
    taskId: string;
    daysSinceStaged: number;
  };
}

export interface ProductivityMetrics {
  tasksCreated: number;
  tasksCompleted: number;
  completionRate: number;
  q2Focus: number; // percentage of tasks in Q2
  goalBalance: number; // how evenly distributed tasks are across goals
  streakDays: number;
}

export interface Insight {
  id: string;
  type: InsightType;
  severity: 'info' | 'warning' | 'success' | 'error';
  title: string;
  description: string;
  actionable: boolean;
  action?: {
    label: string;
    url?: string;
    handler?: string;
  };
  createdAt: string;
  dismissedAt?: string;
}

export type InsightType =
  | 'q2_focus'
  | 'staging_overflow'
  | 'goal_imbalance'
  | 'overdue_tasks'
  | 'low_productivity'
  | 'good_progress'
  | 'streak_achievement';

// Application State Types
export interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  draggedTask: Task | null;
}

export interface GoalState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  selectedGoal: Goal | null;
  activeGoals: Goal[];
  archivedGoals: Goal[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Component Props Types
export interface QuadrantCardProps {
  quadrant: QuadrantType;
  tasks: Task[];
  onTaskCreate: (task: CreateTaskInput) => void;
  onTaskUpdate: (task: UpdateTaskInput) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskDrop: (taskId: string, targetQuadrant: QuadrantType) => void;
  loading?: boolean;
}

export interface TaskCardProps {
  task: Task;
  goal?: Goal;
  onUpdate: (task: UpdateTaskInput) => void;
  onDelete: (taskId: string) => void;
  onEdit: () => void;
  draggable?: boolean;
  compact?: boolean;
}

export interface GoalCardProps {
  goal: Goal;
  onUpdate: (goal: UpdateGoalInput) => void;
  onDelete: (goalId: string) => void;
  onEdit: () => void;
  showTasks?: boolean;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Constants
export const QUADRANT_LIMITS = {
  staging: 5,
  maxActiveGoals: 12,
  maxTasksPerGoal: 50,
  maxTagsPerTask: 10,
} as const;

export const TIME_PERIODS = {
  day: 1,
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
} as const;
