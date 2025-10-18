import { QuadrantZone } from '@/components/tasks/QuadrantZone';
import { StagingZone } from '@/components/tasks/StagingZone';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import type { CreateTaskInput, QuadrantType, Task } from '@/types';
import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import {
  ActionIcon,
  Box,
  Container,
  Grid,
  Group,
  Loader,
  Menu,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAdjustments,
  IconAlertTriangle,
  IconBolt,
  IconClock,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function Board() {
  const {
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTask,
    getTasksByQuadrant,
    getStagingTasks,
  } = useTasks();

  const [taskFormOpened, setTaskFormOpened] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] =
    useState<QuadrantType>('staging');
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Load preferences from localStorage
  const [showStagingZone, setShowStagingZone] = useState(() => {
    const saved = localStorage.getItem('showStagingZone');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showCompletedTasks, setShowCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('showCompletedTasks');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Task positions stored in localStorage for client-side ordering
  const [taskPositions, setTaskPositions] = useState<Record<string, number>>(
    () => {
      const saved = localStorage.getItem('taskPositions');
      return saved !== null ? JSON.parse(saved) : {};
    }
  );

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('showStagingZone', JSON.stringify(showStagingZone));
  }, [showStagingZone]);

  useEffect(() => {
    localStorage.setItem(
      'showCompletedTasks',
      JSON.stringify(showCompletedTasks)
    );
  }, [showCompletedTasks]);

  // Save task positions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('taskPositions', JSON.stringify(taskPositions));
  }, [taskPositions]);

  // Helper function to sort tasks by position (localStorage or backend)
  const sortTasksByPosition = (tasks: Task[]) => {
    return tasks.sort((a, b) => {
      // Use localStorage position if available, otherwise fall back to backend position
      const posA = taskPositions[a.id] ?? a.position;
      const posB = taskPositions[b.id] ?? b.position;
      return posA - posB;
    });
  };

  // Group tasks by quadrant and sort by position
  const tasksByQuadrant = {
    staging: sortTasksByPosition(
      getStagingTasks().filter(task => showCompletedTasks || !task.completed)
    ),
    Q1: sortTasksByPosition(
      getTasksByQuadrant('Q1').filter(
        task => showCompletedTasks || !task.completed
      )
    ),
    Q2: sortTasksByPosition(
      getTasksByQuadrant('Q2').filter(
        task => showCompletedTasks || !task.completed
      )
    ),
    Q3: sortTasksByPosition(
      getTasksByQuadrant('Q3').filter(
        task => showCompletedTasks || !task.completed
      )
    ),
    Q4: sortTasksByPosition(
      getTasksByQuadrant('Q4').filter(
        task => showCompletedTasks || !task.completed
      )
    ),
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const newQuadrant = destination.droppableId as QuadrantType;
    const isMovingToStaging = newQuadrant === 'staging';
    const isMovingFromStaging = source.droppableId === 'staging';

    // Update localStorage positions optimistically with 0-based indexing
    const sourceQuadrant = source.droppableId as QuadrantType;
    const tasksInSource =
      sourceQuadrant === 'staging'
        ? tasksByQuadrant.staging
        : tasksByQuadrant[sourceQuadrant as 'Q1' | 'Q2' | 'Q3' | 'Q4'];

    const tasksInDestination =
      newQuadrant === 'staging'
        ? tasksByQuadrant.staging
        : tasksByQuadrant[newQuadrant as 'Q1' | 'Q2' | 'Q3' | 'Q4'];

    const updatedPositions = { ...taskPositions };

    // If moving within the same quadrant, reorder tasks
    if (source.droppableId === destination.droppableId) {
      const reorderedTasks = Array.from(tasksInSource);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);

      // Update positions for all tasks in this quadrant (0-based)
      reorderedTasks.forEach((task, index) => {
        updatedPositions[task.id] = index;
      });
    } else {
      // Moving between different quadrants
      // Update source quadrant positions (0-based)
      tasksInSource
        .filter(task => task.id !== draggableId)
        .forEach((task, index) => {
          updatedPositions[task.id] = index;
        });

      // Update destination quadrant positions (0-based)
      const destTasks = [...tasksInDestination];
      destTasks.splice(
        destination.index,
        0,
        tasksInSource.find(t => t.id === draggableId)!
      );
      destTasks.forEach((task, index) => {
        updatedPositions[task.id] = index;
      });
    }

    setTaskPositions(updatedPositions);

    try {
      if (source.droppableId === destination.droppableId) {
        // Reordering within the same quadrant
        await moveTask(
          draggableId,
          newQuadrant,
          destination.index,
          isMovingToStaging ? true : undefined
        );
      } else {
        // Moving between quadrants
        // Explicitly set isStaged based on destination
        await moveTask(
          draggableId,
          newQuadrant,
          destination.index,
          isMovingToStaging ? true : isMovingFromStaging ? false : undefined
        );
      }

      notifications.show({
        title: 'Task moved',
        message: `Task moved to ${newQuadrant === 'staging' ? 'Staging Zone' : newQuadrant}`,
        color: 'blue',
      });
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to move task:', error);
    }
  };

  const handleAddTask = (quadrant: QuadrantType) => {
    setSelectedQuadrant(quadrant);
    setEditingTask(undefined);
    setTaskFormOpened(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskFormOpened(true);
  };

  const handleCreateTask = async (taskData: CreateTaskInput) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }

      setTaskFormOpened(false);
      setEditingTask(undefined);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to save task:', error);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to toggle task completion:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to delete task:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Container size="xl" py="md">
        <Stack align="center" gap="md" style={{ minHeight: '60vh' }}>
          <Loader size="lg" />
          <Text size="lg">Loading your tasks...</Text>
        </Stack>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container size="xl" py="md">
        <Stack align="center" gap="md" style={{ minHeight: '60vh' }}>
          <Text size="lg" style={{ color: 'var(--mantine-color-red-6)' }}>
            Failed to load tasks
          </Text>
          <Text style={{ color: 'var(--mantine-color-gray-6)' }}>{error}</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md" style={{ position: 'relative' }}>
      {/* Floating View Controls Menu */}
      <Menu shadow="md" width={250} position="bottom-end">
        <Menu.Target>
          <ActionIcon
            variant="filled"
            size="lg"
            color="gray"
            aria-label="View options"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 100,
            }}
          >
            <IconAdjustments size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>View Options</Menu.Label>
          <Box p="xs">
            <Stack gap="sm">
              <Group justify="space-between" wrap="nowrap">
                <Text size="sm">Show Staging Zone</Text>
                <Switch
                  checked={showStagingZone}
                  onChange={event =>
                    setShowStagingZone(event.currentTarget.checked)
                  }
                />
              </Group>
              <Group justify="space-between" wrap="nowrap">
                <Text size="sm">Show Completed Tasks</Text>
                <Switch
                  checked={showCompletedTasks}
                  onChange={event =>
                    setShowCompletedTasks(event.currentTarget.checked)
                  }
                />
              </Group>
            </Stack>
          </Box>
        </Menu.Dropdown>
      </Menu>

      <Stack gap="xl">
        {/* Empty spacer for floating menu button */}
        <Box style={{ height: '8px' }} />

        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Staging Zone */}
          {showStagingZone && (
            <StagingZone
              tasks={tasksByQuadrant.staging}
              onAddTask={() => handleAddTask('staging')}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {/* Quadrants Grid */}
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <QuadrantZone
                quadrant="Q1"
                title="Q1: Important, Urgent"
                description="Critical tasks requiring immediate attention"
                icon={<IconAlertTriangle size={20} />}
                color="red-quadrant"
                tasks={tasksByQuadrant.Q1}
                onAddTask={handleAddTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <QuadrantZone
                quadrant="Q2"
                title="Q2: Important, Not Urgent"
                description="Strategic tasks for long-term success"
                icon={<IconBolt size={20} />}
                color="green-quadrant"
                tasks={tasksByQuadrant.Q2}
                onAddTask={handleAddTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <QuadrantZone
                quadrant="Q3"
                title="Q3: Not Important, Urgent"
                description="Interruptions that can often be delegated"
                icon={<IconClock size={20} />}
                color="yellow-quadrant"
                tasks={tasksByQuadrant.Q3}
                onAddTask={handleAddTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <QuadrantZone
                quadrant="Q4"
                title="Q4: Not Important, Not Urgent"
                description="Time wasters that should be eliminated"
                icon={<IconTrash size={20} />}
                color="gray-quadrant"
                tasks={tasksByQuadrant.Q4}
                onAddTask={handleAddTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </Grid.Col>
          </Grid>
        </DragDropContext>

        {/* Task Form Modal */}
        <TaskForm
          opened={taskFormOpened}
          onClose={() => {
            setTaskFormOpened(false);
            setEditingTask(undefined);
          }}
          onSubmit={handleCreateTask}
          task={editingTask}
          defaultQuadrant={selectedQuadrant}
        />
      </Stack>
    </Container>
  );
}
