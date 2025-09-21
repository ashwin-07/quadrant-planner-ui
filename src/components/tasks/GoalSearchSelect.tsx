import { useGoals } from '@/hooks/useGoals';
import { useGoalSearch } from '@/hooks/useGoalSearch';
import type { Goal } from '@/types';
import { Select } from '@mantine/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface GoalSearchSelectProps {
  value?: string;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export function GoalSearchSelect({
  value,
  onChange,
  disabled,
}: GoalSearchSelectProps) {
  const { goals, loading: goalsLoading } = useGoals();
  const { searchGoals, loading: searchLoading } = useGoalSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Goal[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the options to prevent unnecessary re-renders
  const allOptions = useMemo(() => {
    if (hasSearched && searchResults.length > 0) {
      // Combine search results with all goals (remove duplicates)
      const combinedGoals = [
        ...goals,
        ...searchResults.filter(
          result => !goals.some(goal => goal.id === result.id)
        ),
      ];

      return combinedGoals.map(goal => ({
        value: goal.id,
        label: goal.title,
      }));
    }

    // Return all goals when no search has been performed
    return goals.map(goal => ({
      value: goal.id,
      label: goal.title,
    }));
  }, [goals, searchResults, hasSearched]);

  // Handle search with debouncing - only search when user types
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!query || query.length < 2) {
        // Reset search results when query is cleared
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      // Debounce search by 500ms
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          setHasSearched(true);
          const results = await searchGoals(query);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        }
      }, 500);
    },
    [searchGoals]
  );

  // Handle dropdown open - load initial goals if not already loaded
  const handleDropdownOpen = useCallback(() => {
    // This will trigger the useGoals hook to load goals if not already loaded
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Select
      label="Goal (Optional)"
      placeholder="Click to see goals or type to search..."
      data={allOptions}
      searchable
      clearable
      disabled={disabled || goalsLoading}
      withinPortal
      zIndex={9999}
      dropdownOpened={undefined}
      value={value}
      onChange={onChange}
      onSearchChange={handleSearch}
      onDropdownOpen={handleDropdownOpen}
      nothingFoundMessage={
        searchLoading
          ? 'Searching goals...'
          : searchQuery.length >= 2
            ? 'No goals found matching your search'
            : 'Start typing to search goals...'
      }
    />
  );
}
