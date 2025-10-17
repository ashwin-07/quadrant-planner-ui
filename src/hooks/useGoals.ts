import { useAuth } from '@/contexts/AuthContext';
import { GoalsApiService } from '@/services/goalsApi';
import type {
  CreateGoalInput,
  Goal,
  GoalCategory,
  UpdateGoalInput,
} from '@/types';
import { notifications } from '@mantine/notifications';
import { useCallback, useEffect, useState } from 'react';

interface UseGoalsOptions {
  category?: GoalCategory;
  archived?: boolean;
  autoFetch?: boolean;
}

interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  refreshGoals: () => Promise<void>;
  createGoal: (goalData: CreateGoalInput) => Promise<void>;
  updateGoal: (goalId: string, goalData: UpdateGoalInput) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  getGoalStats: (goalId: string) => Promise<{
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    completionRate: number;
  } | null>;
}

export function useGoals(options: UseGoalsOptions = {}): UseGoalsReturn {
  const { user } = useAuth();
  const { category, archived = false, autoFetch = true } = options;

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals from API
  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await GoalsApiService.getGoals({
        category,
        archived,
        limit: 100, // Get all goals for now
      });

      setGoals(response.goals);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch goals';
      setError(errorMessage);
      console.error('Error fetching goals:', err);

      notifications.show({
        title: 'Error',
        message: 'Failed to load goals. Please try again.',
        color: 'red-quadrant',
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, category, archived]);

  // Auto-fetch on mount and dependency changes
  useEffect(() => {
    if (autoFetch && user?.id) {
      fetchGoals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, user?.id, category, archived]);

  // Create a new goal
  const createGoal = useCallback(
    async (goalData: CreateGoalInput) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      try {
        const response = await GoalsApiService.createGoal(goalData);

        // Add the new goal to the local state
        setGoals(prev => [...prev, response.goal]);

        notifications.show({
          title: 'Success',
          message: 'Goal created successfully!',
          color: 'green-quadrant',
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create goal';
        console.error('Error creating goal:', err);

        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red-quadrant',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  // Update an existing goal
  const updateGoal = useCallback(
    async (goalId: string, goalData: UpdateGoalInput) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      try {
        const response = await GoalsApiService.updateGoal(goalId, goalData);

        // Update the goal in local state
        setGoals(prev =>
          prev.map(goal => (goal.id === goalId ? response.goal : goal))
        );

        notifications.show({
          title: 'Success',
          message: 'Goal updated successfully!',
          color: 'green-quadrant',
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update goal';
        console.error('Error updating goal:', err);

        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red-quadrant',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  // Delete a goal
  const deleteGoal = useCallback(
    async (goalId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      try {
        await GoalsApiService.deleteGoal(goalId);

        // Remove the goal from local state
        setGoals(prev => prev.filter(goal => goal.id !== goalId));

        notifications.show({
          title: 'Success',
          message: 'Goal deleted successfully!',
          color: 'green-quadrant',
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete goal';
        console.error('Error deleting goal:', err);

        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red-quadrant',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  // Get goal statistics
  const getGoalStats = useCallback(
    async (goalId: string) => {
      if (!user?.id) {
        return null;
      }

      try {
        const stats = await GoalsApiService.getGoalStats(goalId);
        return stats;
      } catch (err) {
        console.error('Error fetching goal stats:', err);
        return null;
      }
    },
    [user?.id]
  );

  return {
    goals,
    loading,
    error,
    refreshGoals: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalStats,
  };
}
