import { QuadrantZone } from '@/components/tasks/QuadrantZone';
import { StagingZone } from '@/components/tasks/StagingZone';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import type { CreateTaskInput, QuadrantType, Task } from '@/types';
import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import {
  ActionIcon,
  Container,
  Grid,
  Loader,
  Menu,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconBolt,
  IconClock,
  IconDotsVertical,
  IconEye,
  IconEyeOff,
  IconTrash,
} from '@tabler/icons-react';
import { useState } from 'react';

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
  const [showStagingZone, setShowStagingZone] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  // Group tasks by quadrant
  const tasksByQuadrant = {
    staging: getStagingTasks().filter(
      task => showCompletedTasks || !task.completed
    ),
    Q1: getTasksByQuadrant('Q1').filter(
      task => showCompletedTasks || !task.completed
    ),
    Q2: getTasksByQuadrant('Q2').filter(
      task => showCompletedTasks || !task.completed
    ),
    Q3: getTasksByQuadrant('Q3').filter(
      task => showCompletedTasks || !task.completed
    ),
    Q4: getTasksByQuadrant('Q4').filter(
      task => showCompletedTasks || !task.completed
    ),
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const newQuadrant = destination.droppableId as QuadrantType;
    const isMovingToStaging = newQuadrant === 'staging';
    const isMovingFromStaging = source.droppableId === 'staging';

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
    <Container size="xl" py="md">
      <Stack gap="xl">
        {/* View Controls Menu */}
        <Menu shadow="md" width={250} position="bottom-start">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              size="lg"
              aria-label="View options"
              style={{ alignSelf: 'flex-start' }}
            >
              <IconDotsVertical size={20} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>View Options</Menu.Label>
            <Menu.Item
              closeMenuOnClick={false}
              leftSection={
                showStagingZone ? (
                  <IconEye size={16} />
                ) : (
                  <IconEyeOff size={16} />
                )
              }
            >
              <Switch
                label="Show Staging Zone"
                checked={showStagingZone}
                onChange={event =>
                  setShowStagingZone(event.currentTarget.checked)
                }
                styles={{
                  root: { width: '100%' },
                  body: { width: '100%', justifyContent: 'space-between' },
                }}
              />
            </Menu.Item>
            <Menu.Item
              closeMenuOnClick={false}
              leftSection={
                showCompletedTasks ? (
                  <IconEye size={16} />
                ) : (
                  <IconEyeOff size={16} />
                )
              }
            >
              <Switch
                label="Show Completed Tasks"
                checked={showCompletedTasks}
                onChange={event =>
                  setShowCompletedTasks(event.currentTarget.checked)
                }
                styles={{
                  root: { width: '100%' },
                  body: { width: '100%', justifyContent: 'space-between' },
                }}
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

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
