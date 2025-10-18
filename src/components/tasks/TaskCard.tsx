import type { Task } from '@/types';
import { getDueDateStatus } from '@/utils/date';
import {
  ActionIcon,
  Badge,
  Card,
  Checkbox,
  Group,
  Menu,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconCalendar,
  IconDots,
  IconEdit,
  IconGripVertical,
  IconTrash,
} from '@tabler/icons-react';
import Linkify from 'linkify-react';
import { forwardRef } from 'react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  isDragging?: boolean;
  quadrantColor?: string;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  (
    {
      task,
      onToggleComplete,
      onEdit,
      onDelete,
      onToggleSubtask,
      isDragging,
      quadrantColor,
      ...props
    },
    ref
  ) => {
    // const categoryConfig = GOAL_CATEGORIES[
    //   task.goalId ? 'career' : 'personal'
    // ] // Default fallback
    const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;
    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const totalSubtasks = task.subtasks.length;

    return (
      <Card
        ref={ref}
        shadow="sm"
        padding="sm"
        radius="md"
        withBorder
        style={{
          cursor: 'grab',
          opacity: isDragging ? 0.5 : 1,
          transform: isDragging ? 'rotate(5deg)' : 'none',
          transition: 'all 0.2s ease',
          borderLeft: `4px solid ${
            quadrantColor
              ? `var(--mantine-color-${quadrantColor}-6)`
              : task.priority === 'high'
                ? 'var(--mantine-color-red-6)'
                : task.priority === 'medium'
                  ? 'var(--mantine-color-yellow-6)'
                  : 'var(--mantine-color-gray-5)'
          }`,
        }}
        {...props}
      >
        <Stack gap="xs">
          {/* Header with checkbox and menu */}
          <Group justify="space-between" align="flex-start">
            <Group gap="xs" style={{ flex: 1 }}>
              <Checkbox
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                size="sm"
              />
              <Text
                size="sm"
                fw={500}
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed
                    ? 'var(--mantine-color-gray-5)'
                    : 'var(--mantine-color-gray-8)',
                  flex: 1,
                }}
                lineClamp={2}
              >
                {task.title}
              </Text>
            </Group>

            <Group gap={4}>
              <ActionIcon variant="subtle" size="sm" color="gray">
                <IconGripVertical size={12} />
              </ActionIcon>

              <Menu position="bottom-end" withArrow>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="sm" color="gray">
                    <IconDots size={12} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => onEdit(task)}
                  >
                    Edit Task
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => onDelete(task.id)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>

          {/* Description */}
          {task.description && (
            <Text size="xs" c="dimmed" lineClamp={2}>
              <Linkify
                options={{
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'task-link',
                }}
              >
                {task.description}
              </Linkify>
            </Text>
          )}

          {/* Subtasks */}
          {totalSubtasks > 0 && (
            <Stack gap={4}>
              {task.subtasks.map(subtask => (
                <Group key={subtask.id} gap="xs" align="flex-start">
                  <Checkbox
                    size="xs"
                    checked={subtask.completed}
                    onChange={() => onToggleSubtask?.(task.id, subtask.id)}
                    disabled={!onToggleSubtask}
                    style={{ marginTop: '2px' }}
                  />
                  <Text
                    size="xs"
                    style={{
                      textDecoration: subtask.completed
                        ? 'line-through'
                        : 'none',
                      color: subtask.completed
                        ? 'var(--mantine-color-gray-5)'
                        : 'var(--mantine-color-gray-7)',
                      flex: 1,
                      wordBreak: 'break-word',
                    }}
                  >
                    <Linkify
                      options={{
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'task-link',
                      }}
                    >
                      {subtask.title}
                    </Linkify>
                  </Text>
                </Group>
              ))}
              <Text size="xs" style={{ color: 'var(--mantine-color-gray-6)' }}>
                {completedSubtasks}/{totalSubtasks} completed
              </Text>
            </Stack>
          )}

          {/* Footer with metadata */}
          <Group justify="space-between" align="center">
            <Group gap="xs">
              {/* Category badge */}
              {task.tags && task.tags.length > 0 && (
                <Badge size="xs" variant="light" color="blue">
                  {task.tags[0]}
                </Badge>
              )}

              {/* Due date */}
              {task.dueDate && dueDateStatus && (
                <Group gap={4}>
                  <IconCalendar
                    size={12}
                    style={{
                      color: `var(--mantine-color-${dueDateStatus.color}-6)`,
                    }}
                  />
                  <Text
                    size="xs"
                    style={{
                      color: `var(--mantine-color-${dueDateStatus.color}-6)`,
                    }}
                    fw={dueDateStatus.status === 'overdue' ? 600 : 400}
                  >
                    {dueDateStatus.text}
                  </Text>
                </Group>
              )}
            </Group>

            {/* Estimated time */}
            {task.estimatedMinutes && (
              <Text size="xs" c="dimmed">
                {task.estimatedMinutes}m
              </Text>
            )}
          </Group>
        </Stack>
      </Card>
    );
  }
);

TaskCard.displayName = 'TaskCard';
