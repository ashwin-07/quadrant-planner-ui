import type {
  CreateGoalInput,
  Goal,
  GoalCategory,
  GoalTimeframe,
  UpdateGoalInput,
} from '@/types';
import { apiClient } from './api';

// Transform API response to match frontend Goal interface
// Note: Server uses camelCase for all fields
function transformGoal(apiGoal: Record<string, unknown>): Goal {
  return {
    id: apiGoal.id as string,
    userId: apiGoal.userId as string,
    title: apiGoal.title as string,
    description: apiGoal.description as string,
    category: apiGoal.category as GoalCategory,
    timeframe: apiGoal.timeframe as GoalTimeframe,
    color: (apiGoal.color as string) || '',
    archived: (apiGoal.archived as boolean) || false,
    createdAt: apiGoal.createdAt as string,
    updatedAt: apiGoal.updatedAt as string,
  };
}

// API response types based on the backend API design
interface GoalsListResponse {
  goals: Goal[];
  total: number;
  hasMore: boolean;
}

interface GoalResponse {
  goal: Goal;
}

interface GoalStatsResponse {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
  averageTaskAge: number;
  lastActivityAt: string;
}

interface GetGoalsParams {
  category?: GoalCategory;
  archived?: boolean;
  limit?: number;
  offset?: number;
}

interface SearchGoalsParams {
  q: string; // Search query (required, min 2 chars)
  category?: GoalCategory;
  archived?: boolean;
  includeStats?: boolean;
  limit?: number;
  offset?: number;
}

type CreateGoalRequest = CreateGoalInput;

type UpdateGoalRequest = UpdateGoalInput;

// Goals API service class
export class GoalsApiService {
  // Get all goals for a user
  static async getGoals(params: GetGoalsParams): Promise<GoalsListResponse> {
    const queryParams: Record<string, string> = {};

    if (params.category) queryParams.category = params.category;
    if (params.archived !== undefined)
      queryParams.archived = params.archived.toString();
    if (params.limit) queryParams.limit = params.limit.toString();
    if (params.offset) queryParams.offset = params.offset.toString();

    const response = await apiClient.get<Record<string, unknown>>(
      '/goals',
      queryParams
    );

    // Transform the response to match our Goal interface
    return {
      goals: (response.goals as Record<string, unknown>[]).map(transformGoal),
      total: response.total as number,
      hasMore: response.has_more as boolean,
    };
  }

  // Search goals by title
  static async searchGoals(
    params: SearchGoalsParams
  ): Promise<GoalsListResponse> {
    const queryParams: Record<string, string> = {
      q: params.q, // Required search query
    };

    if (params.category) queryParams.category = params.category;
    if (params.archived !== undefined)
      queryParams.archived = params.archived.toString();
    if (params.includeStats !== undefined)
      queryParams.include_stats = params.includeStats.toString();
    if (params.limit) queryParams.limit = params.limit.toString();
    if (params.offset) queryParams.offset = params.offset.toString();

    const response = await apiClient.get<Record<string, unknown>>(
      '/goals/search',
      queryParams
    );

    return {
      goals: (response.goals as Record<string, unknown>[]).map(transformGoal),
      total: response.total as number,
      hasMore: response.has_more as boolean,
    };
  }

  // Create a new goal
  static async createGoal(goalData: CreateGoalRequest): Promise<GoalResponse> {
    const response = await apiClient.post<Record<string, unknown>>(
      '/goals',
      goalData
    );

    // Transform the response to match our Goal interface
    return {
      goal: transformGoal(response),
    };
  }

  // Update an existing goal
  static async updateGoal(
    goalId: string,
    goalData: UpdateGoalRequest
  ): Promise<GoalResponse> {
    const response = await apiClient.put<Record<string, unknown>>(
      `/goals/${goalId}`,
      goalData
    );

    // Transform the response to match our Goal interface
    return {
      goal: transformGoal(response),
    };
  }

  // Delete a goal
  static async deleteGoal(goalId: string): Promise<void> {
    return apiClient.delete<void>(`/goals/${goalId}`);
  }

  // Get goal with tasks
  static async getGoalWithTasks(goalId: string): Promise<{
    goal: Goal;
    tasks: Array<{
      id: string;
      title: string;
      completed: boolean;
      quadrant: string;
    }>;
    stats: GoalStatsResponse;
  }> {
    return apiClient.get(`/goals/${goalId}`, {
      includeTasks: 'true',
    });
  }

  // Get goal statistics
  static async getGoalStats(goalId: string): Promise<GoalStatsResponse> {
    return apiClient.get<GoalStatsResponse>(`/goals/${goalId}/stats`);
  }
}

// Export individual functions for easier importing
export const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalWithTasks,
  getGoalStats,
} = GoalsApiService;
