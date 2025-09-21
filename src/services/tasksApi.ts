import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskQuadrant,
  UpdateTaskInput,
} from '@/types';
import { apiClient } from './api';

// Transform API response to match frontend Task interface
function transformTask(apiTask: Record<string, unknown>): Task {
  return {
    id: apiTask.id as string,
    userId: apiTask.user_id as string,
    goalId: apiTask.goal_id as string | undefined,
    title: apiTask.title as string,
    description: apiTask.description as string,
    quadrant: apiTask.quadrant as TaskQuadrant,
    dueDate: apiTask.due_date as string | undefined,
    estimatedMinutes: apiTask.estimated_minutes as number | undefined,
    priority: (apiTask.priority as TaskPriority) || 'medium',
    tags: (apiTask.tags as string[]) || [],
    completed: (apiTask.completed as boolean) || false,
    isStaged: (apiTask.is_staged as boolean) || false,
    position: (apiTask.position as number) || 0,
    stagedAt: apiTask.staged_at as string | undefined,
    organizedAt: apiTask.organized_at as string | undefined,
    completedAt: apiTask.completed_at as string | undefined,
    createdAt: apiTask.created_at as string,
    updatedAt: apiTask.updated_at as string,
    goal: apiTask.goal as unknown,
  };
}

// API response types based on the backend API design
interface TasksListResponse {
  tasks: Task[];
  total: number;
  hasMore: boolean;
}

interface TaskResponse {
  task: Task;
}

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueTasks: number;
  stagingTasks: number;
  quadrantDistribution: Record<string, number>;
}

interface StagingZoneResponse {
  status: {
    currentCount: number;
    maxCapacity: number;
    isFull: boolean;
    oldestItem?: Record<string, unknown>;
    processingReminder?: string;
  };
  tasks: Task[];
  suggestions: string[];
}

// Request parameter interfaces
interface GetTasksParams {
  quadrant?: TaskQuadrant;
  goalId?: string;
  completed?: boolean;
  isStaged?: boolean;
  priority?: TaskPriority;
  tags?: string;
  limit?: number;
  offset?: number;
  includeGoal?: boolean;
}

type CreateTaskRequest = CreateTaskInput;

type UpdateTaskRequest = UpdateTaskInput;

interface TaskMoveRequest {
  quadrant: TaskQuadrant;
  position?: number;
  isStaged?: boolean;
}

// Removed unused interface

interface TaskBulkUpdateRequest {
  updates: Array<{
    taskId: string;
    quadrant?: TaskQuadrant;
    position?: number;
    isStaged?: boolean;
  }>;
}

// Tasks API service class
export class TasksApiService {
  // Get all tasks for a user
  static async getTasks(
    params: GetTasksParams = {}
  ): Promise<TasksListResponse> {
    const queryParams: Record<string, string> = {};

    if (params.quadrant) queryParams.quadrant = params.quadrant;
    if (params.goalId) queryParams.goal_id = params.goalId;
    if (params.completed !== undefined)
      queryParams.completed = params.completed.toString();
    if (params.isStaged !== undefined)
      queryParams.is_staged = params.isStaged.toString();
    if (params.priority) queryParams.priority = params.priority;
    if (params.tags) queryParams.tags = params.tags;
    if (params.limit) queryParams.limit = params.limit.toString();
    if (params.offset) queryParams.offset = params.offset.toString();
    if (params.includeGoal !== undefined)
      queryParams.include_goal = params.includeGoal.toString();

    const response = await apiClient.get<Record<string, unknown>>(
      '/tasks',
      queryParams
    );

    // Transform the response to match our Task interface
    return {
      tasks: (response.tasks as Record<string, unknown>[]).map(transformTask),
      total: response.total as number,
      hasMore: response.has_more as boolean,
    };
  }

  // Create a new task
  static async createTask(taskData: CreateTaskRequest): Promise<TaskResponse> {
    const response = await apiClient.post<Record<string, unknown>>(
      '/tasks',
      taskData
    );

    // Transform the response to match our Task interface
    return {
      task: transformTask(response),
    };
  }

  // Get a specific task by ID
  static async getTask(
    taskId: string,
    includeGoal = false
  ): Promise<TaskResponse> {
    const queryParams: Record<string, string> = {};
    if (includeGoal) queryParams.include_goal = 'true';

    const response = await apiClient.get<Record<string, unknown>>(
      `/tasks/${taskId}`,
      queryParams
    );

    // Transform the response to match our Task interface
    return {
      task: transformTask(response),
    };
  }

  // Update an existing task
  static async updateTask(
    taskId: string,
    taskData: UpdateTaskRequest
  ): Promise<TaskResponse> {
    const response = await apiClient.put<Record<string, unknown>>(
      `/tasks/${taskId}`,
      taskData
    );

    // Transform the response to match our Task interface
    return {
      task: transformTask(response),
    };
  }

  // Delete a task
  static async deleteTask(taskId: string): Promise<void> {
    return apiClient.delete<void>(`/tasks/${taskId}`);
  }

  // Toggle task completion status
  static async toggleTaskCompletion(
    taskId: string,
    completed: boolean
  ): Promise<TaskResponse> {
    const response = await apiClient.patch<Record<string, unknown>>(
      `/tasks/${taskId}/toggle`,
      { completed }
    );

    // Transform the response to match our Task interface
    return {
      task: transformTask(response),
    };
  }

  // Move a task to a different quadrant/position
  static async moveTask(
    taskId: string,
    moveData: TaskMoveRequest
  ): Promise<TaskResponse> {
    const response = await apiClient.patch<Record<string, unknown>>(
      `/tasks/${taskId}/move`,
      moveData
    );

    // Transform the response to match our Task interface
    return {
      task: transformTask(response),
    };
  }

  // Bulk update tasks (for drag & drop multiple)
  static async bulkUpdateTasks(
    bulkData: TaskBulkUpdateRequest
  ): Promise<{ success: boolean }> {
    await apiClient.patch<Record<string, unknown>>('/tasks/bulk', bulkData);
    return { success: true };
  }

  // Get staging zone status and tasks
  static async getStagingZone(): Promise<StagingZoneResponse> {
    const response = await apiClient.get<Record<string, unknown>>(
      '/tasks/staging/status'
    );

    return {
      status: {
        currentCount: (response.status as Record<string, unknown>)
          .current_count as number,
        maxCapacity: (response.status as Record<string, unknown>)
          .max_capacity as number,
        isFull: (response.status as Record<string, unknown>).is_full as boolean,
        oldestItem: (response.status as Record<string, unknown>).oldest_item as
          | Record<string, unknown>
          | undefined,
        processingReminder: (response.status as Record<string, unknown>)
          .processing_reminder as string | undefined,
      },
      tasks: ((response.tasks as Record<string, unknown>[]) || []).map(
        transformTask
      ),
      suggestions: (response.suggestions as string[]) || [],
    };
  }

  // Get task statistics summary
  static async getTaskStats(): Promise<TaskStats> {
    const response = await apiClient.get<Record<string, unknown>>(
      '/tasks/stats/summary'
    );

    return {
      totalTasks: response.total_tasks as number,
      completedTasks: response.completed_tasks as number,
      activeTasks: response.active_tasks as number,
      overdueTasks: response.overdue_tasks as number,
      stagingTasks: response.staging_tasks as number,
      quadrantDistribution: response.quadrant_distribution as Record<
        string,
        number
      >,
    };
  }
}
