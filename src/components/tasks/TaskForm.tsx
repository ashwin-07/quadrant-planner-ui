import { OverlayModal } from '@/components/common/OverlayModal';
import type {
  CreateTaskInput,
  QuadrantType,
  SubtaskCreate,
  SubtaskUpdate,
  Task,
} from '@/types';
import { validateTask } from '@/utils/validation';
import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Group,
  Select,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconGripVertical, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

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
  { value: 'urgent', label: 'Urgent' },
];

// Goal options will be created from the goals data

export function TaskForm({
  opened,
  onClose,
  onSubmit,
  loading,
  task,
  defaultQuadrant = 'staging',
}: TaskFormProps) {
  // Subtask state - manage subtasks separately
  const [subtasks, setSubtasks] = useState<(SubtaskCreate | SubtaskUpdate)[]>(
    []
  );
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const form = useForm<CreateTaskInput & { dueDate?: Date }>({
    initialValues: {
      title: task?.title || '',
      description: task?.description || '',
      quadrant: task?.quadrant || defaultQuadrant,
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
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

  // Update form values when task changes (for editing) or when modal opens/closes
  useEffect(() => {
    if (opened && task) {
      // Parse the date string to a Date object for the DateInput component
      let parsedDate: Date | undefined = undefined;
      if (task.dueDate) {
        try {
          parsedDate = new Date(task.dueDate);
          // Check if date is valid
          if (isNaN(parsedDate.getTime())) {
            parsedDate = undefined;
          }
        } catch (e) {
          console.error('Error parsing due date:', e);
          parsedDate = undefined;
        }
      }

      form.setValues({
        title: task.title || '',
        description: task.description || '',
        quadrant: task.quadrant || defaultQuadrant,
        priority: task.priority || 'medium',
        dueDate: parsedDate,
        estimatedMinutes: task.estimatedMinutes || undefined,
        tags: task.tags || [],
        goalId: task.goalId || undefined,
      });

      // Set subtasks for editing
      const mappedSubtasks: SubtaskUpdate[] =
        task.subtasks?.map(st => ({
          id: st.id,
          title: st.title,
          completed: st.completed,
        })) || [];
      setSubtasks(mappedSubtasks);
    } else if (opened && !task) {
      // Reset form for new task
      form.setValues({
        title: '',
        description: '',
        quadrant: defaultQuadrant,
        priority: 'medium',
        dueDate: undefined,
        estimatedMinutes: undefined,
        tags: [],
        goalId: undefined,
      });
      setSubtasks([]);
    } else if (!opened) {
      // Reset form when modal closes
      form.reset();
      setSubtasks([]);
      setNewSubtaskTitle('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, task, defaultQuadrant]);

  // Subtask handlers
  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: SubtaskCreate & { completed?: boolean } = {
        title: newSubtaskTitle.trim(),
        completed: false,
      };
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleUpdateSubtaskTitle = (index: number, title: string) => {
    const updated = [...subtasks];
    updated[index] = {
      ...updated[index],
      title,
    };
    setSubtasks(updated);
  };

  const handleToggleSubtaskCompletion = (index: number) => {
    const updated = [...subtasks];
    updated[index] = {
      ...updated[index],
      completed: !(updated[index].completed ?? false),
    };
    setSubtasks(updated);
  };

  const handleSubtaskDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(subtasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSubtasks(items);
  };

  const handleSubmit = (values: CreateTaskInput & { dueDate?: Date }) => {
    // Convert Date object to ISO string for API and only include valid fields
    const taskData: CreateTaskInput = {
      title: values.title,
      description: values.description,
      quadrant: values.quadrant,
      priority: values.priority,
      dueDate: values.dueDate
        ? values.dueDate instanceof Date
          ? values.dueDate.toISOString()
          : values.dueDate
        : undefined,
      estimatedMinutes: values.estimatedMinutes,
      tags: values.tags,
      goalId: values.goalId,
      subtasks:
        subtasks.length > 0
          ? subtasks.map(st => ({
              ...st,
              completed: st.completed ?? false,
            }))
          : undefined,
    };
    onSubmit(taskData);
    // Note: Don't close modal or reset form here - parent will handle it after API success
  };

  return (
    <OverlayModal
      opened={opened}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
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
              withinPortal
              zIndex={10000}
              comboboxProps={{ zIndex: 10000 }}
              {...form.getInputProps('quadrant')}
            />

            <Select
              label="Priority"
              placeholder="Select priority"
              data={priorityOptions}
              required
              withinPortal
              zIndex={10000}
              comboboxProps={{ zIndex: 10000 }}
              {...form.getInputProps('priority')}
            />
          </Group>

          {/* Temporarily disabled goal search to fix infinite loop */}
          {/* <GoalSearchSelect
            value={form.values.goalId}
            onChange={value => form.setFieldValue('goalId', value)}
            disabled={loading}
          /> */}

          <Group grow>
            <DateInput
              label="Due Date"
              placeholder="Select due date"
              clearable
              withinPortal
              zIndex={10000}
              popoverProps={{ zIndex: 10000 }}
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

          <Divider label="Subtasks (Optional)" labelPosition="left" />

          {/* Subtasks List with Drag & Drop */}
          {subtasks.length > 0 && (
            <DragDropContext onDragEnd={handleSubtaskDragEnd}>
              <Droppable droppableId="subtasks-list">
                {provided => (
                  <Stack
                    gap="xs"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {subtasks.map((subtask, index) => (
                      <Draggable
                        key={`subtask-${index}`}
                        draggableId={`subtask-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Group
                            gap="xs"
                            wrap="nowrap"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.5 : 1,
                            }}
                          >
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              size="sm"
                              style={{ cursor: 'grab' }}
                              {...provided.dragHandleProps}
                            >
                              <IconGripVertical size={14} />
                            </ActionIcon>
                            <Checkbox
                              size="sm"
                              checked={subtask.completed ?? false}
                              onChange={() =>
                                handleToggleSubtaskCompletion(index)
                              }
                            />
                            <TextInput
                              value={subtask.title}
                              onChange={e =>
                                handleUpdateSubtaskTitle(
                                  index,
                                  e.currentTarget.value
                                )
                              }
                              placeholder="Subtask title"
                              style={{
                                flex: 1,
                                textDecoration:
                                  (subtask.completed ?? false)
                                    ? 'line-through'
                                    : 'none',
                                color:
                                  (subtask.completed ?? false)
                                    ? 'var(--mantine-color-gray-5)'
                                    : 'var(--mantine-color-gray-7)',
                              }}
                            />
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => handleRemoveSubtask(index)}
                              size="sm"
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          </Group>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
          )}

          {/* Add Subtask Input */}
          <Group gap="xs" wrap="nowrap">
            {/* Empty space to align with grip icons above */}
            <ActionIcon
              variant="transparent"
              size="sm"
              style={{ visibility: 'hidden', pointerEvents: 'none' }}
            >
              <IconGripVertical size={14} />
            </ActionIcon>
            <TextInput
              value={newSubtaskTitle}
              onChange={e => setNewSubtaskTitle(e.currentTarget.value)}
              placeholder="Add a subtask..."
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              style={{ flex: 1 }}
            />
            <ActionIcon
              onClick={handleAddSubtask}
              variant="light"
              color="blue"
              size="lg"
            >
              <IconPlus size={18} />
            </ActionIcon>
          </Group>

          <TagsInput
            label="Tags"
            placeholder="Add tags..."
            description="Press Enter to add tags"
            {...form.getInputProps('tags')}
          />

          <Text size="xs" style={{ color: 'var(--mantine-color-gray-6)' }}>
            You can drag tasks between quadrants after creation to reorganize
            them.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </Group>
        </Stack>
      </form>
    </OverlayModal>
  );
}
