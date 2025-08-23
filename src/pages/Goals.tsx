import { GoalCard } from '@/components/goals/GoalCard';
import type { CreateGoalInput, Goal } from '@/types';
import { generateId } from '@/utils';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Container,
  Group,
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

// Mock data for development
const mockGoals: Goal[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Master Advanced React Hooks',
    description:
      'Deep dive into custom hooks, useContext, and useReducer to build scalable React applications.',
    category: 'learning',
    timeframe: '3_months',
    color: 'violet',
    archived: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Run a Half Marathon',
    description:
      'Follow a structured 12-week training plan, including speed work and long runs.',
    category: 'health',
    timeframe: '6_months',
    color: 'green',
    archived: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Automate Monthly Financial Report',
    description:
      'Develop a Python script to automatically pull data from bank APIs and generate monthly reports.',
    category: 'financial',
    timeframe: '3_months',
    color: 'yellow',
    archived: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Volunteer for a Community Project',
    description:
      'Dedicate 4 hours a week to a local environmental cleanup initiative.',
    category: 'personal',
    timeframe: 'ongoing',
    color: 'orange',
    archived: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '5',
    userId: 'user1',
    title: 'Complete Cloud Certification (AWS)',
    description:
      'Study for and pass the AWS Certified Solutions Architect – Associate exam.',
    category: 'career',
    timeframe: '6_months',
    color: 'blue',
    archived: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '6',
    userId: 'user1',
    title: 'Read 12 Non-Fiction Books',
    description:
      'Read one non-fiction book per month covering topics such as psychology, business, and self-improvement.',
    category: 'learning',
    timeframe: '1_year',
    color: 'violet',
    archived: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '7',
    userId: 'user1',
    title: 'Start a Personal Blog on Productivity',
    description:
      'Set up a personal blog to share insights and tips on productivity, with weekly posts.',
    category: 'career',
    timeframe: 'ongoing',
    color: 'blue',
    archived: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '8',
    userId: 'user1',
    title: 'Improve Cardiovascular Health',
    description:
      'Engage in at least 30 minutes of moderate-intensity exercise 5 days a week.',
    category: 'health',
    timeframe: '1_year',
    color: 'green',
    archived: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// Mock task counts for goals
const mockTaskCounts = {
  '1': { total: 3, completed: 1 },
  '2': { total: 5, completed: 2 },
  '3': { total: 1, completed: 1 },
  '4': { total: 2, completed: 0 },
  '5': { total: 4, completed: 0 },
  '6': { total: 1, completed: 0 },
  '7': { total: 7, completed: 3 },
  '8': { total: 6, completed: 4 },
};

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
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [quickCreateExpanded, setQuickCreateExpanded] = useState(false);

  // Filter goals based on active filter
  const filteredGoals = useMemo(() => {
    if (activeFilter === 'all') {
      return goals.filter(goal => !goal.archived);
    }
    return goals.filter(
      goal => !goal.archived && goal.category === activeFilter
    );
  }, [goals, activeFilter]);

  const handleCreateGoal = async (goalData: CreateGoalInput) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newGoal: Goal = {
        id: generateId(),
        userId: 'user1',
        ...goalData,
        color: 'blue',
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setGoals(prev => [...prev, newGoal]);
      setCreateGoalOpened(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    console.log('Edit goal:', goal);
    // TODO: Implement edit functionality
  };

  const handleDeleteGoal = (goalId: string) => {
    console.log('Delete goal:', goalId);
    // TODO: Implement delete functionality with confirmation
  };

  const handleArchiveGoal = (goalId: string) => {
    console.log('Archive goal:', goalId);
    // TODO: Implement archive functionality
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Title order={1} size="h2" fw={700} mb="xs">
            My Active Goals
          </Title>
          <Text size="md" style={{ color: 'var(--mantine-color-gray-6)' }}>
            Track your objectives and make consistent progress towards what
            matters most.
          </Text>
        </Box>

        {/* Quick Create Goal Form */}
        <Paper shadow="sm" radius="md" withBorder>
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
                  size={20}
                  style={{ color: 'var(--mantine-color-blue-6)' }}
                />
                <Title order={3} size="h4" fw={600}>
                  Quick Create Goal
                </Title>
              </Group>
              <ActionIcon
                variant="subtle"
                size="lg"
                style={{
                  color: 'var(--mantine-color-gray-6)',
                  pointerEvents: 'none', // Prevent double click handling
                }}
              >
                {quickCreateExpanded ? (
                  <IconChevronUp size={18} stroke={1.5} />
                ) : (
                  <IconChevronDown size={18} stroke={1.5} />
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
        <Box>
          <Tabs
            value={activeFilter}
            onChange={value => setActiveFilter(value || 'all')}
          >
            <Tabs.List>
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
                          g => !g.archived && g.category === filter.value
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
        {filteredGoals.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
            {filteredGoals.map(goal => {
              const taskCount = mockTaskCounts[
                goal.id as keyof typeof mockTaskCounts
              ] || { total: 0, completed: 0 };
              return (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  taskCount={taskCount.total}
                  completedTaskCount={taskCount.completed}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onArchive={handleArchiveGoal}
                />
              );
            })}
          </SimpleGrid>
        ) : (
          <Center py="xl">
            <Stack align="center" gap="md">
              <IconTarget size={48} color="var(--mantine-color-gray-4)" />
              <Text
                size="lg"
                fw={500}
                style={{ color: 'var(--mantine-color-gray-6)' }}
              >
                No goals found
              </Text>
              <Text
                size="sm"
                style={{ color: 'var(--mantine-color-gray-6)' }}
                ta="center"
              >
                {activeFilter === 'all'
                  ? 'Get started by creating your first goal!'
                  : `No goals in the ${activeFilter} category yet.`}
              </Text>
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={() => setQuickCreateExpanded(true)}
              >
                Create Your First Goal
              </Button>
            </Stack>
          </Center>
        )}
      </Stack>
    </Container>
  );
}
