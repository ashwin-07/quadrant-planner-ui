import type { CreateTaskInput, QuadrantType, Task } from '@/types';
import { validateTask } from '@/utils/validation';
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

interface TaskFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (task: CreateTaskInput) => void;
  loading?: boolean;
  task?: Task; // For editing
  defaultQuadrant?: QuadrantType;
}

const quadrantOptions = [
  { value: 'staging', label: 'Staging Zone' },
  { value: 'Q1', label: 'Q1: Important, Urgent' },
  { value: 'Q2', label: 'Q2: Important, Not Urgent' },
  { value: 'Q3', label: 'Q3: Not Important, Urgent' },
  { value: 'Q4', label: 'Q4: Not Important, Not Urgent' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function TaskForm({
  opened,
  onClose,
  onSubmit,
  loading,
  task,
  defaultQuadrant = 'staging',
}: TaskFormProps) {
  const form = useForm<CreateTaskInput>({
    initialValues: {
      title: task?.title || '',
      description: task?.description || '',
      quadrant: task?.quadrant || defaultQuadrant,
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate || undefined,
      estimatedMinutes: task?.estimatedMinutes || undefined,
      tags: task?.tags || [],
      goalId: task?.goalId || undefined,
    },
    validate: {
      title: value => {
        const result = validateTask({
          title: value,
          quadrant: 'staging',
          priority: 'medium',
          tags: [],
        });
        return result.errors.find(error => error.includes('title')) || null;
      },
      estimatedMinutes: value => {
        if (value && (value < 1 || value > 480)) {
          return 'Estimated time must be between 1 and 480 minutes';
        }
        return null;
      },
    },
  });

  const handleSubmit = (values: CreateTaskInput) => {
    onSubmit(values);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="md"
      centered
      zIndex={1000}
      portalProps={{ target: document.body }}
      styles={{
        modal: {
          position: 'fixed !important',
          top: '50vh !important',
          left: '50vw !important',
          transform: 'translate(-50%, -50%) !important',
          margin: '0 !important',
        },
        overlay: {
          position: 'fixed !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
        },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Task Title"
            placeholder="e.g., Call insurance company"
            required
            {...form.getInputProps('title')}
          />

          <Textarea
            label="Description"
            placeholder="Optional details about this task..."
            minRows={3}
            {...form.getInputProps('description')}
          />

          <Group grow>
            <Select
              label="Quadrant"
              placeholder="Select quadrant"
              data={quadrantOptions}
              required
              {...form.getInputProps('quadrant')}
            />

            <Select
              label="Priority"
              placeholder="Select priority"
              data={priorityOptions}
              required
              {...form.getInputProps('priority')}
            />
          </Group>

          <Group grow>
            <DateInput
              label="Due Date"
              placeholder="Select due date"
              clearable
              {...form.getInputProps('dueDate')}
            />

            <TextInput
              label="Estimated Time (minutes)"
              placeholder="e.g., 30"
              type="number"
              min={1}
              max={480}
              {...form.getInputProps('estimatedMinutes')}
            />
          </Group>

          <TagsInput
            label="Tags"
            placeholder="Add tags..."
            description="Press Enter to add tags"
            {...form.getInputProps('tags')}
          />

          <Text size="xs" c="dimmed">
            You can drag tasks between quadrants after creation to reorganize
            them.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
