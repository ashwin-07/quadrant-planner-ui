import { GoalsApiService } from '@/services/goalsApi';
import type { Goal } from '@/types';
import { useCallback, useState } from 'react';

interface UseGoalSearchReturn {
  searchGoals: (query: string) => Promise<Goal[]>;
  loading: boolean;
  error: string | null;
}

export function useGoalSearch(): UseGoalSearchReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchGoals = useCallback(async (query: string): Promise<Goal[]> => {
    if (!query || query.length < 2) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await GoalsApiService.searchGoals({
        q: query,
        archived: false, // Only search active goals
        limit: 20, // Limit results for better performance
      });

      return response.goals;
    } catch (err) {
      console.error('Failed to search goals:', err);
      setError('Failed to search goals. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchGoals,
    loading,
    error,
  };
}
