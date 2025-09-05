import { QuadrantZone } from '@/components/tasks/QuadrantZone';
import { StagingZone } from '@/components/tasks/StagingZone';
import { TaskForm } from '@/components/tasks/TaskForm';
import type { CreateTaskInput, QuadrantType, Task } from '@/types';
import { generateId } from '@/utils';
import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import {
  Button,
  Container,
  Grid,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconBolt,
  IconClock,
  IconTrash,
} from '@tabler/icons-react';
import { useState } from 'react';

// Mock data for development
const mockTasks: Task[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Prepare Q3 presentation',
    description: 'Create slides for quarterly business review',
    quadrant: 'Q1',
    priority: 'high',
    completed: false,
    isStaged: false,
    dueDate: '2024-07-25',
    estimatedMinutes: 120,
    tags: ['Work'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Resolve critical bug in API',
    description: 'Fix the authentication issue affecting users',
    quadrant: 'Q1',
    priority: 'high',
    completed: false,
    isStaged: false,
    dueDate: '2024-07-24',
    estimatedMinutes: 180,
    tags: ['Work'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Schedule performance reviews',
    description: 'Set up one-on-ones with team members',
    quadrant: 'Q2',
    priority: 'medium',
    completed: false,
    isStaged: false,
    dueDate: '2024-08-15',
    estimatedMinutes: 60,
    tags: ['Work'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Research new project management tools',
    description: 'Evaluate options for better team coordination',
    quadrant: 'Q2',
    priority: 'medium',
    completed: false,
    isStaged: false,
    dueDate: '2024-08-30',
    estimatedMinutes: 90,
    tags: ['Learning'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '5',
    userId: 'user1',
    title: 'Plan vacation for next year',
    description: 'Research destinations and book time off',
    quadrant: 'Q2',
    priority: 'low',
    completed: false,
    isStaged: false,
    estimatedMinutes: 45,
    tags: ['Personal'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '6',
    userId: 'user1',
    title: 'Order new office supplies',
    description: 'Restock pens, notebooks, and printer paper',
    quadrant: 'Q3',
    priority: 'low',
    completed: false,
    isStaged: false,
    estimatedMinutes: 15,
    tags: ['Work'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '7',
    userId: 'user1',
    title: 'Update client contact list',
    description: 'Add new contacts and update existing information',
    quadrant: 'Q3',
    priority: 'low',
    completed: false,
    isStaged: false,
    estimatedMinutes: 30,
    tags: ['Work'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '8',
    userId: 'user1',
    title: 'Organize old email archives',
    description: 'Clean up and organize old email folders',
    quadrant: 'Q4',
    priority: 'low',
    completed: false,
    isStaged: false,
    estimatedMinutes: 60,
    tags: ['Personal'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '9',
    userId: 'user1',
    title: 'Declutter physical files',
    description: 'Sort through and organize paper documents',
    quadrant: 'Q4',
    priority: 'low',
    completed: false,
    isStaged: false,
    estimatedMinutes: 45,
    tags: ['Personal'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '10',
    userId: 'user1',
    title: 'Draft project proposal',
    description: 'Create initial draft for the new initiative',
    quadrant: 'staging',
    priority: 'medium',
    completed: false,
    isStaged: true,
    estimatedMinutes: 90,
    tags: ['Work'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '11',
    userId: 'user1',
    title: 'Call insurance company',
    description: 'Update policy information',
    quadrant: 'staging',
    priority: 'medium',
    completed: false,
    isStaged: true,
    estimatedMinutes: 20,
    tags: ['Personal'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '12',
    userId: 'user1',
    title: 'Brainstorm blog post ideas',
    description: 'Come up with topics for next month',
    quadrant: 'staging',
    priority: 'low',
    completed: false,
    isStaged: true,
    estimatedMinutes: 30,
    tags: ['Work'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '13',
    userId: 'user1',
    title: 'Review quarterly budget',
    description: 'Analyze spending and adjust allocations',
    quadrant: 'staging',
    priority: 'medium',
    completed: false,
    isStaged: true,
    estimatedMinutes: 60,
    tags: ['Work'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '14',
    userId: 'user1',
    title: 'Plan weekend grocery list',
    description: 'Prepare shopping list for the week',
    quadrant: 'staging',
    priority: 'low',
    completed: false,
    isStaged: true,
    estimatedMinutes: 10,
    tags: ['Personal'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

export function Board() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [taskFormOpened, setTaskFormOpened] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] =
    useState<QuadrantType>('staging');
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [loading, setLoading] = useState(false);
  const [simpleModalOpened, setSimpleModalOpened] = useState(false);

  // Group tasks by quadrant
  const tasksByQuadrant = {
    staging: tasks.filter(task => task.quadrant === 'staging'),
    Q1: tasks.filter(task => task.quadrant === 'Q1'),
    Q2: tasks.filter(task => task.quadrant === 'Q2'),
    Q3: tasks.filter(task => task.quadrant === 'Q3'),
    Q4: tasks.filter(task => task.quadrant === 'Q4'),
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same quadrant
      const quadrant = source.droppableId as QuadrantType;
      const quadrantTasks = [...tasksByQuadrant[quadrant]];
      const [removed] = quadrantTasks.splice(source.index, 1);
      quadrantTasks.splice(destination.index, 0, removed);

      // Update the tasks array (this is a simplified version)
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === draggableId) {
            return { ...task, quadrant };
          }
          return task;
        })
      );
    } else {
      // Moving between quadrants
      const newQuadrant = destination.droppableId as QuadrantType;
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === draggableId) {
            return {
              ...task,
              quadrant: newQuadrant,
              isStaged: newQuadrant === 'staging',
            };
          }
          return task;
        })
      );

      notifications.show({
        title: 'Task moved',
        message: `Task moved to ${newQuadrant === 'staging' ? 'Staging Zone' : newQuadrant}`,
        color: 'blue',
      });
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
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTask: Task = {
        id: generateId(),
        userId: 'user1',
        ...taskData,
        completed: false,
        isStaged: taskData.quadrant === 'staging',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingTask) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === editingTask.id
              ? { ...newTask, id: editingTask.id }
              : task
          )
        );
        notifications.show({
          title: 'Task updated',
          message: 'Task has been successfully updated',
          color: 'green',
        });
      } else {
        setTasks(prevTasks => [...prevTasks, newTask]);
        notifications.show({
          title: 'Task created',
          message: 'New task has been added to your board',
          color: 'green',
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: 'Failed to save task. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    notifications.show({
      title: 'Task deleted',
      message: 'Task has been removed from your board',
      color: 'red',
    });
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1} size="h2" fw={700} mb="xs">
            Task Board
          </Title>
          <Text size="md" style={{ color: 'var(--mantine-color-gray-6)' }}>
            Organize your tasks using the Eisenhower Matrix. Drag and drop to
            prioritize effectively.
          </Text>
          <Button onClick={() => setSimpleModalOpened(true)} mt="md">
            Test Simple Modal
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Staging Zone */}
          <StagingZone
            tasks={tasksByQuadrant.staging}
            onAddTask={() => handleAddTask('staging')}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />

          {/* Quadrants Grid */}
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <QuadrantZone
                quadrant="Q1"
                title="Q1: Important, Urgent"
                description="Critical tasks requiring immediate attention"
                icon={<IconAlertTriangle size={20} />}
                tasks={tasksByQuadrant.Q1}
                onAddTask={handleAddTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                color="red"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <QuadrantZone
                quadrant="Q2"
                title="Q2: Important, Not Urgent"
                description="Strategic tasks for long-term success"
                icon={<IconBolt size={20} />}
                tasks={tasksByQuadrant.Q2}
                onAddTask={handleAddTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                color="green"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <QuadrantZone
                quadrant="Q3"
                title="Q3: Not Important, Urgent"
                description="Interruptions that can often be delegated"
                icon={<IconClock size={20} />}
                tasks={tasksByQuadrant.Q3}
                onAddTask={handleAddTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                color="yellow"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <QuadrantZone
                quadrant="Q4"
                title="Q4: Not Important, Not Urgent"
                description="Activities to minimize or eliminate"
                icon={<IconTrash size={20} />}
                tasks={tasksByQuadrant.Q4}
                onAddTask={handleAddTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                color="gray"
              />
            </Grid.Col>
          </Grid>
        </DragDropContext>
      </Stack>

      {/* Modals placed outside of container and DragDropContext */}
      <Modal
        opened={simpleModalOpened}
        onClose={() => setSimpleModalOpened(false)}
        title="Simple Test Modal"
        size="sm"
        centered
        withCloseButton
        portalProps={{ target: document.body }}
        styles={{
          modal: {
            position: 'fixed !important',
            top: '50vh !important',
            left: '50vw !important',
            transform: 'translate(-50%, -50%) !important',
            zIndex: '9999 !important',
          },
          overlay: {
            position: 'fixed !important',
            top: '0 !important',
            left: '0 !important',
            width: '100vw !important',
            height: '100vh !important',
            zIndex: '9998 !important',
          },
        }}
      >
        <Stack gap="md">
          <Text>This modal is outside DragDropContext</Text>
          <TextInput label="Test Input" placeholder="Type here..." />
          <Button onClick={() => setSimpleModalOpened(false)}>Close</Button>
        </Stack>
      </Modal>

      <TaskForm
        opened={taskFormOpened}
        onClose={() => setTaskFormOpened(false)}
        onSubmit={handleCreateTask}
        loading={loading}
        task={editingTask}
        defaultQuadrant={selectedQuadrant}
      />
    </Container>
  );
}
