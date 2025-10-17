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
  const { searchGoals, loading: searchLoading } = useGoalSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Goal[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the options to prevent unnecessary re-renders
  const allOptions = useMemo(() => {
    return searchResults.map(goal => ({
      value: goal.id,
      label: goal.title,
    }));
  }, [searchResults]);

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
        return;
      }

      // Debounce search by 300ms
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchGoals(query);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        }
      }, 300);
    },
    [searchGoals]
  );

  // Load initial goals when dropdown opens
  const handleDropdownOpen = useCallback(() => {
    // Intentionally empty - user must type to search
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
      placeholder="Type to search for a goal (min 2 characters)..."
      data={allOptions}
      searchable
      clearable
      disabled={disabled}
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
