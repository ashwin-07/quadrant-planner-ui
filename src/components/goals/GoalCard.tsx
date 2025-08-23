import type { Goal } from '@/types';
import { getGoalCategoryColor } from '@/utils';
import { GOAL_CATEGORIES } from '@/utils/constants';
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  Menu,
  Progress,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconArchive,
  IconChecklist,
  IconDots,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goal;
  taskCount: number;
  completedTaskCount: number;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onArchive: (goalId: string) => void;
}

export function GoalCard({
  goal,
  taskCount,
  completedTaskCount,
  onEdit,
  onDelete,
  onArchive,
}: GoalCardProps) {
  const [menuOpened, setMenuOpened] = useState(false);

  const categoryConfig = GOAL_CATEGORIES[goal.category];
  const completionRate =
    taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

  // Get timeframe display
  const getTimeframeDisplay = (timeframe: string) => {
    switch (timeframe) {
      case '3_months':
        return '3 months';
      case '6_months':
        return '6 months';
      case '1_year':
        return '1 year';
      case 'ongoing':
        return 'Ongoing';
      default:
        return timeframe;
    }
  };

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{
        borderLeft: `4px solid var(--mantine-color-${getGoalCategoryColor(goal.category)}-5)`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)';
      }}
    >
      <Stack gap="sm">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Group gap="xs" style={{ flex: 1 }}>
            <Text size="lg">{categoryConfig.emoji}</Text>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text fw={600} size="md" lineClamp={2}>
                {goal.title}
              </Text>
            </div>
          </Group>

          <Menu
            position="bottom-end"
            opened={menuOpened}
            onClose={() => setMenuOpened(false)}
            onOpen={() => setMenuOpened(true)}
          >
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={e => e.stopPropagation()}
              >
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={14} />}
                onClick={e => {
                  e.stopPropagation();
                  onEdit(goal);
                }}
              >
                Edit Goal
              </Menu.Item>
              <Menu.Item
                leftSection={<IconArchive size={14} />}
                onClick={e => {
                  e.stopPropagation();
                  onArchive(goal.id);
                }}
              >
                Archive
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(goal.id);
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {/* Description */}
        {goal.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {goal.description}
          </Text>
        )}

        {/* Meta Info */}
        <Group justify="space-between" align="center">
          <Badge
            color={getGoalCategoryColor(goal.category)}
            variant="light"
            size="sm"
          >
            {categoryConfig.label}
          </Badge>
          <Text size="xs" c="dimmed">
            {getTimeframeDisplay(goal.timeframe)}
          </Text>
        </Group>

        {/* Progress */}
        {taskCount > 0 && (
          <Box>
            <Group justify="space-between" mb={4}>
              <Group gap={4}>
                <IconChecklist size={14} color="var(--mantine-color-gray-6)" />
                <Text size="xs" c="dimmed">
                  {completedTaskCount}/{taskCount} tasks
                </Text>
              </Group>
              <Text size="xs" c="dimmed" fw={500}>
                {completionRate}%
              </Text>
            </Group>
            <Progress
              value={completionRate}
              color={getGoalCategoryColor(goal.category)}
              size="sm"
              radius="md"
            />
          </Box>
        )}

        {/* No tasks state */}
        {taskCount === 0 && (
          <Group gap={4}>
            <IconChecklist size={14} color="var(--mantine-color-gray-4)" />
            <Text size="xs" c="dimmed">
              No tasks yet
            </Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
