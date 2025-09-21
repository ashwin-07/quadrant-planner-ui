import type { Task } from '@/types';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Group,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { TaskCard } from './TaskCard';

interface StagingZoneProps {
  tasks: Task[];
  onAddTask: () => void;
  onToggleComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function StagingZone({
  tasks,
  onAddTask,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}: StagingZoneProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box
      style={{
        border: '2px dashed var(--mantine-color-blue-3)',
        borderRadius: 'var(--mantine-radius-lg)',
        backgroundColor: 'var(--mantine-color-blue-0)',
        marginBottom: 'var(--mantine-spacing-xl)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <Box
        p="md"
        style={{
          borderBottom: expanded
            ? '1px solid var(--mantine-color-blue-2)'
            : 'none',
          backgroundColor: 'var(--mantine-color-blue-1)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onClick={() => setExpanded(prev => !prev)}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'var(--mantine-color-blue-2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'var(--mantine-color-blue-1)';
        }}
      >
        <Group justify="space-between" align="center" mb="xs">
          <Group gap="xs">
            <Title order={3} size="h4" c="blue.7">
              Staging Zone
            </Title>
            {tasks.length > 0 && (
              <Text size="sm" c="blue.6" fw={500}>
                ({tasks.length})
              </Text>
            )}
          </Group>
          <Group gap="sm">
            <Button
              leftSection={<IconPlus size={16} />}
              color="blue"
              size="sm"
              onClick={e => {
                e.stopPropagation();
                onAddTask();
              }}
            >
              Stage New Task
            </Button>
            <ActionIcon
              variant="subtle"
              size="lg"
              style={{
                color: 'var(--mantine-color-blue-6)',
                pointerEvents: 'none', // Prevent double click handling
              }}
            >
              {expanded ? (
                <IconChevronUp size={18} />
              ) : (
                <IconChevronDown size={18} />
              )}
            </ActionIcon>
          </Group>
        </Group>

        <Text
          size="sm"
          c="dimmed"
          style={{
            opacity: expanded ? 1 : 0.7,
            transition: 'opacity 0.2s ease',
          }}
        >
          Stage quick thoughts here, then organize into quadrants
        </Text>
      </Box>

      {/* Collapsible Droppable area */}
      <Collapse in={expanded}>
        <Droppable droppableId="staging" direction="horizontal">
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              p="md"
              style={{
                minHeight: '120px',
                backgroundColor: snapshot.isDraggingOver
                  ? 'var(--mantine-color-blue-1)'
                  : 'var(--mantine-color-blue-0)',
                transition: 'background-color 0.2s ease',
              }}
            >
              {tasks.length === 0 ? (
                <Box
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--mantine-color-gray-5)',
                  }}
                >
                  <Text size="sm" c="dimmed">
                    No staged tasks
                  </Text>
                  <Text size="xs" c="dimmed" mt="xs">
                    Add quick thoughts here before organizing
                  </Text>
                </Box>
              ) : (
                <Group
                  gap="md"
                  style={{ flexWrap: 'nowrap', overflowX: 'auto' }}
                >
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            minWidth: '200px',
                            maxWidth: '250px',
                          }}
                        >
                          <TaskCard
                            task={task}
                            onToggleComplete={onToggleComplete}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            isDragging={snapshot.isDragging}
                            quadrantColor="blue"
                          />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Group>
              )}
            </Box>
          )}
        </Droppable>
      </Collapse>
    </Box>
  );
}
