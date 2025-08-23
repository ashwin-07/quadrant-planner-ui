import type { CreateGoalInput } from '@/types';
import { GOAL_CATEGORIES, GOAL_TIMEFRAMES } from '@/utils/constants';
import { validateGoal } from '@/utils/validation';
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface GoalFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (goal: CreateGoalInput) => void;
  loading?: boolean;
}

export function GoalForm({
  opened,
  onClose,
  onSubmit,
  loading,
}: GoalFormProps) {
  const form = useForm<CreateGoalInput>({
    initialValues: {
      title: '',
      description: '',
      category: 'career',
      timeframe: '3_months',
    },
    validate: {
      title: value => {
        const result = validateGoal({
          title: value,
          category: 'career',
          timeframe: '3_months',
        });
        return result.errors.find(error => error.includes('title')) || null;
      },
      description: value => {
        if (value && value.length > 500) {
          return 'Goal description must be less than 500 characters';
        }
        return null;
      },
    },
  });

  const handleSubmit = (values: CreateGoalInput) => {
    const validation = validateGoal(values);
    if (!validation.valid) {
      // Set form errors
      validation.errors.forEach(error => {
        if (error.includes('title')) {
          form.setFieldError('title', error);
        } else if (error.includes('description')) {
          form.setFieldError('description', error);
        } else if (error.includes('category')) {
          form.setFieldError('category', error);
        } else if (error.includes('timeframe')) {
          form.setFieldError('timeframe', error);
        }
      });
      return;
    }

    onSubmit(values);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Convert categories and timeframes to select options
  const categoryOptions = Object.entries(GOAL_CATEGORIES).map(
    ([key, config]) => ({
      value: key,
      label: `${config.emoji} ${config.label}`,
    })
  );

  const timeframeOptions = Object.entries(GOAL_TIMEFRAMES).map(
    ([key, label]) => ({
      value: key,
      label,
    })
  );

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text size="lg" fw={600}>
          Quick Create Goal
        </Text>
      }
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Define your next objective with ease.
          </Text>

          <TextInput
            label="Goal Title"
            placeholder="e.g., Learn a new programming language"
            required
            {...form.getInputProps('title')}
          />

          <Textarea
            label="Description"
            placeholder="Provide a detailed description of your goal, including steps and expected outcomes."
            minRows={3}
            {...form.getInputProps('description')}
          />

          <Group grow>
            <Select
              label="Category"
              data={categoryOptions}
              required
              {...form.getInputProps('category')}
            />

            <Select
              label="Target Timeframe"
              data={timeframeOptions}
              required
              {...form.getInputProps('timeframe')}
            />
          </Group>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Goal
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
