import type { QuadrantType, Task } from '@/types';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { TaskCard } from './TaskCard';

interface QuadrantZoneProps {
  quadrant: QuadrantType;
  title: string;
  description: string;
  icon: React.ReactNode;
  tasks: Task[];
  onAddTask: (quadrant: QuadrantType) => void;
  onToggleComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  color: string;
}

const quadrantColors = {
  Q1: 'red',
  Q2: 'green',
  Q3: 'yellow',
  Q4: 'gray',
  staging: 'blue',
};

export function QuadrantZone({
  quadrant,
  title,
  description,
  icon,
  tasks,
  onAddTask,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  color,
}: QuadrantZoneProps) {
  const themeColor = quadrantColors[quadrant] || color;

  return (
    <Box
      style={{
        height: '100%',
        minHeight: '400px',
        border: `2px solid var(--mantine-color-${themeColor}-3)`,
        borderRadius: 'var(--mantine-radius-lg)',
        backgroundColor: `var(--mantine-color-${themeColor}-0)`,
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box
        p="md"
        style={{
          borderBottom: `1px solid var(--mantine-color-${themeColor}-2)`,
          backgroundColor: `var(--mantine-color-${themeColor}-1)`,
        }}
      >
        <Group justify="space-between" align="center" mb="xs">
          <Group gap="xs">
            <Box style={{ color: `var(--mantine-color-${themeColor}-6)` }}>
              {icon}
            </Box>
            <Title order={4} size="h5" c={`${themeColor}.7`}>
              {title}
            </Title>
          </Group>
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconPlus size={14} />}
            color={themeColor}
            onClick={() => onAddTask(quadrant)}
          >
            Add Task
          </Button>
        </Group>
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </Box>

      {/* Droppable area */}
      <Droppable droppableId={quadrant}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            p="md"
            style={{
              minHeight: '300px',
              backgroundColor: snapshot.isDraggingOver
                ? `var(--mantine-color-${themeColor}-1)`
                : 'transparent',
              transition: 'background-color 0.2s ease',
            }}
          >
            <Stack gap="sm">
              {tasks.length === 0 ? (
                <Box
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--mantine-color-gray-5)',
                  }}
                >
                  <Text size="sm" c="dimmed">
                    No tasks yet
                  </Text>
                  <Text size="xs" c="dimmed" mt="xs">
                    Drag tasks here or click "Add Task"
                  </Text>
                </Box>
              ) : (
                tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <TaskCard
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        isDragging={snapshot.isDragging}
                      />
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </Stack>
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
