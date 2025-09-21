import { GoalCard } from '@/components/goals/GoalCard';
import { useGoals } from '@/hooks/useGoals';
import type { CreateGoalInput, Goal } from '@/types';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Group,
  Loader,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconFilter,
  IconPlus,
  IconTarget,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'career', label: 'Career' },
  { value: 'health', label: 'Health' },
  { value: 'learning', label: 'Learning' },
  { value: 'financial', label: 'Financial' },
  { value: 'personal', label: 'Personal' },
  { value: 'relationships', label: 'Relationships' },
];

export function Goals() {
  // Use the Goals API hook
  const { goals, loading, error, createGoal, deleteGoal, refreshGoals } =
    useGoals({ archived: false });

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [quickCreateExpanded, setQuickCreateExpanded] = useState(false);

  // Filter goals based on active filter
  const filteredGoals = useMemo(() => {
    if (activeFilter === 'all') {
      return goals.filter(goal => !(goal.archived ?? false));
    }
    return goals.filter(
      goal => !(goal.archived ?? false) && goal.category === activeFilter
    );
  }, [goals, activeFilter]);

  const handleCreateGoal = async (goalData: CreateGoalInput) => {
    try {
      await createGoal(goalData);
      setQuickCreateExpanded(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
      // Error is already handled in the hook with notifications
    }
  };

  const handleEditGoal = (goal: Goal) => {
    console.log('Edit goal:', goal);
    // TODO: Implement edit modal/form
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
    } catch (error) {
      console.error('Failed to delete goal:', error);
      // Error is already handled in the hook with notifications
    }
    // TODO: Implement delete functionality with confirmation
  };

  const handleArchiveGoal = (goalId: string) => {
    console.log('Archive goal:', goalId);
    // TODO: Implement archive functionality
  };

  return (
    <Box p="md" style={{ width: '100%', maxWidth: 'none', minWidth: '100%' }}>
      <Stack gap="lg" style={{ width: '100%', minWidth: '100%' }}>
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Box>
            <Title order={1} size="h2" fw={700} mb="xs">
              My Active Goals
            </Title>
            <Text size="md" style={{ color: 'var(--mantine-color-gray-6)' }}>
              Track your objectives and make consistent progress towards what
              matters most.
            </Text>
          </Box>

          {/* Refresh Button */}
          <Button
            variant="light"
            leftSection={loading ? <Loader size={16} /> : undefined}
            onClick={refreshGoals}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </Group>

        {/* Error Display */}
        {error && (
          <Paper
            p="md"
            style={{
              backgroundColor: 'var(--mantine-color-red-0)',
              border: '1px solid var(--mantine-color-red-3)',
            }}
          >
            <Group>
              <Text size="sm" style={{ color: 'var(--mantine-color-red-6)' }}>
                Error loading goals: {error}
              </Text>
              <Button
                size="xs"
                variant="light"
                style={{ color: 'var(--mantine-color-red-6)' }}
                onClick={refreshGoals}
              >
                Retry
              </Button>
            </Group>
          </Paper>
        )}

        {/* Quick Create Goal Form */}
        <Paper shadow="sm" radius="md" withBorder style={{ width: '100%' }}>
          <Box
            p="md"
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'background-color 0.2s ease',
            }}
            onClick={() => setQuickCreateExpanded(prev => !prev)}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                'var(--mantine-color-gray-0)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <IconTarget
                  size={16}
                  style={{ color: 'var(--mantine-color-blue-6)' }}
                />
                <Title order={4} size="h5" fw={600}>
                  Quick Create Goal
                </Title>
              </Group>
              <ActionIcon
                variant="subtle"
                size="md"
                style={{
                  color: 'var(--mantine-color-gray-6)',
                  pointerEvents: 'none', // Prevent double click handling
                }}
              >
                {quickCreateExpanded ? (
                  <IconChevronUp size={16} stroke={1.5} />
                ) : (
                  <IconChevronDown size={16} stroke={1.5} />
                )}
              </ActionIcon>
            </Group>

            <Text
              size="sm"
              style={{ color: 'var(--mantine-color-gray-6)' }}
              mt="xs"
            >
              Define your next objective with ease.
            </Text>
          </Box>

          <Collapse in={quickCreateExpanded}>
            <Box px="md" pb="md">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const goalData = {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    category: formData.get('category') as
                      | 'career'
                      | 'health'
                      | 'learning'
                      | 'financial'
                      | 'personal'
                      | 'relationships',
                    timeframe: formData.get('timeframe') as
                      | '3_months'
                      | '6_months'
                      | '1_year'
                      | 'ongoing',
                  };
                  if (goalData.title.trim()) {
                    handleCreateGoal(goalData);
                    (e.target as HTMLFormElement).reset();
                  }
                }}
              >
                <Stack gap="md" mt="md">
                  <TextInput
                    name="title"
                    label="Goal Title"
                    placeholder="e.g., Learn a new programming language"
                    required
                    size="sm"
                  />

                  <Textarea
                    name="description"
                    label="Description"
                    placeholder="Provide a detailed description of your goal, including steps and expected outcomes."
                    minRows={3}
                    size="sm"
                  />

                  <Group grow>
                    <Select
                      name="category"
                      label="Category"
                      placeholder="Select category"
                      data={[
                        { value: 'career', label: '💼 Career' },
                        { value: 'health', label: '🏃 Health' },
                        { value: 'learning', label: '📚 Learning' },
                        { value: 'financial', label: '💰 Financial' },
                        { value: 'personal', label: '🌟 Personal' },
                        { value: 'relationships', label: '❤️ Relationships' },
                      ]}
                      defaultValue="career"
                      required
                      size="sm"
                    />

                    <Select
                      name="timeframe"
                      label="Target Timeframe"
                      placeholder="Select timeframe"
                      data={[
                        { value: '3_months', label: '3 months' },
                        { value: '6_months', label: '6 months' },
                        { value: '1_year', label: '1 year' },
                        { value: 'ongoing', label: 'Ongoing' },
                      ]}
                      defaultValue="3_months"
                      required
                      size="sm"
                    />
                  </Group>

                  <Group justify="flex-end" mt="sm">
                    <Button
                      type="submit"
                      leftSection={<IconPlus size={16} />}
                      loading={loading}
                    >
                      Create Goal
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Box>
          </Collapse>
        </Paper>

        {/* Category Filter Tabs */}
        <Box style={{ width: '100%' }}>
          <Tabs
            value={activeFilter}
            onChange={value => setActiveFilter(value || 'all')}
          >
            <Tabs.List style={{ width: '100%' }}>
              {categoryFilters.map(filter => (
                <Tabs.Tab
                  key={filter.value}
                  value={filter.value}
                  leftSection={
                    filter.value === 'all' ? <IconFilter size={14} /> : null
                  }
                >
                  {filter.label}
                  {filter.value !== 'all' && (
                    <Badge
                      size="xs"
                      variant="transparent"
                      ml={4}
                      style={{ color: 'var(--mantine-color-gray-6)' }}
                    >
                      {
                        goals.filter(
                          g =>
                            !(g.archived ?? false) &&
                            g.category === filter.value
                        ).length
                      }
                    </Badge>
                  )}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Box>

        {/* Goals Grid */}
        {loading && goals.length === 0 ? (
          <Center style={{ minHeight: '40vh', padding: '2rem 0' }}>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text
                size="md"
                fw={500}
                style={{ color: 'var(--mantine-color-gray-6)' }}
              >
                Loading your goals...
              </Text>
            </Stack>
          </Center>
        ) : filteredGoals.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
            {filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                taskCount={0} // TODO: Get real task count from API
                completedTaskCount={0} // TODO: Get real completed task count from API
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onArchive={handleArchiveGoal}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center style={{ minHeight: '40vh', padding: '2rem 0' }}>
            <Stack align="center" gap="md">
              <IconTarget size={48} color="var(--mantine-color-gray-4)" />
              <div style={{ textAlign: 'center' }}>
                <Text
                  size="lg"
                  fw={600}
                  style={{ color: 'var(--mantine-color-gray-7)' }}
                  mb="sm"
                >
                  No goals found
                </Text>
                <Text
                  size="sm"
                  style={{ color: 'var(--mantine-color-gray-6)' }}
                  mb="md"
                >
                  {activeFilter === 'all'
                    ? 'Get started by creating your first goal!'
                    : `No goals in the ${activeFilter} category yet.`}
                </Text>
              </div>
              <Button
                size="md"
                leftSection={<IconPlus size={16} />}
                onClick={() => setQuickCreateExpanded(true)}
              >
                Create Your First Goal
              </Button>
            </Stack>
          </Center>
        )}
      </Stack>
    </Box>
  );
}
