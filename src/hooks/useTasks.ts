import { useAuth } from '@/contexts/AuthContext';
import { TasksApiService } from '@/services/tasksApi';
import type {
  CreateTaskInput,
  Task,
  TaskQuadrant,
  UpdateTaskInput,
} from '@/types';
import { notifications } from '@mantine/notifications';
import { useCallback, useEffect, useState } from 'react';

interface UseTasksReturn {
  // Data
  tasks: Task[];
  loading: boolean;
  error: string | null;

  // Actions
  createTask: (taskData: CreateTaskInput) => Promise<void>;
  updateTask: (taskId: string, taskData: UpdateTaskInput) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  moveTask: (
    taskId: string,
    quadrant: TaskQuadrant,
    position?: number,
    isStaged?: boolean
  ) => Promise<void>;
  bulkUpdateTasks: (
    updates: Array<{
      taskId: string;
      quadrant?: TaskQuadrant;
      position?: number;
      isStaged?: boolean;
    }>
  ) => Promise<void>;

  // Utilities
  refreshTasks: () => Promise<void>;
  getTasksByQuadrant: (quadrant: TaskQuadrant) => Task[];
  getStagingTasks: () => Task[];
}

export function useTasks(): UseTasksReturn {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await TasksApiService.getTasks({
        includeGoal: true,
        limit: 200, // Get all tasks
      });

      setTasks(response.tasks);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red-quadrant',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new task
  const createTask = useCallback(
    async (taskData: CreateTaskInput) => {
      if (!user) return;

      try {
        const response = await TasksApiService.createTask(taskData);

        setTasks(prev => [...prev, response.task]);

        notifications.show({
          title: 'Success',
          message: 'Task created successfully',
          color: 'green-quadrant',
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create task';
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red-quadrant',
        });
        throw err;
      }
    },
    [user]
  );

  // Update an existing task
  const updateTask = useCallback(
    async (taskId: string, taskData: UpdateTaskInput) => {
      if (!user) return;

      try {
        const response = await TasksApiService.updateTask(taskId, {
          ...taskData,
          userId: user.id,
        });

        setTasks(prev =>
          prev.map(task => (task.id === taskId ? response.task : task))
        );

        notifications.show({
          title: 'Success',
          message: 'Task updated successfully',
          color: 'green-quadrant',
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update task';
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red-quadrant',
        });
        throw err;
      }
    },
    [user]
  );

  // Delete a task
  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user) return;

      try {
        await TasksApiService.deleteTask(taskId);

        setTasks(prev => prev.filter(task => task.id !== taskId));

        notifications.show({
          title: 'Success',
          message: 'Task deleted successfully',
          color: 'green-quadrant',
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete task';
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red-quadrant',
        });
        throw err;
      }
    },
    [user]
  );

  // Toggle task completion status
  const toggleTaskCompletion = useCallback(
    async (taskId: string) => {
      if (!user) return;

      try {
        const task = tasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');

        const response = await TasksApiService.toggleTaskCompletion(
          taskId,
          !task.completed
        );

        setTasks(prev =>
          prev.map(task => (task.id === taskId ? response.task : task))
        );

        const action = task.completed
          ? 'marked as incomplete'
          : 'marked as complete';

        notifications.show({
          title: 'Success',
          message: `Task ${action}`,
          color: 'green-quadrant',
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to toggle task completion';
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red-quadrant',
        });
        throw err;
      }
    },
    [user, tasks]
  );

  // Move a task to a different quadrant/position
  const moveTask = useCallback(
    async (
      taskId: string,
      quadrant: TaskQuadrant,
      position?: number,
      isStaged?: boolean
    ) => {
      if (!user) return;

      try {
        const response = await TasksApiService.moveTask(taskId, {
          userId: user.id,
          quadrant,
          position,
          isStaged,
        });

        setTasks(prev =>
          prev.map(task => (task.id === taskId ? response.task : task))
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to move task';
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red-quadrant',
        });
        throw err;
      }
    },
    [user]
  );

  // Bulk update tasks (for drag & drop multiple)
  const bulkUpdateTasks = useCallback(
    async (
      updates: Array<{
        taskId: string;
        quadrant?: TaskQuadrant;
        position?: number;
        isStaged?: boolean;
      }>
    ) => {
      if (!user) return;

      try {
        await TasksApiService.bulkUpdateTasks({
          userId: user.id,
          updates,
        });

        // Refresh tasks to get updated positions
        await fetchTasks();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update tasks';
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red-quadrant',
        });
        throw err;
      }
    },
    [user, fetchTasks]
  );

  // Refresh tasks
  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  // Get tasks by quadrant
  const getTasksByQuadrant = useCallback(
    (quadrant: TaskQuadrant) => {
      return tasks.filter(task => task.quadrant === quadrant);
    },
    [tasks]
  );

  // Get staging tasks
  const getStagingTasks = useCallback(() => {
    return tasks.filter(task => task.isStaged);
  }, [tasks]);

  // Load tasks on mount
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  return {
    // Data
    tasks,
    loading,
    error,

    // Actions
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTask,
    bulkUpdateTasks,

    // Utilities
    refreshTasks,
    getTasksByQuadrant,
    getStagingTasks,
  };
}
