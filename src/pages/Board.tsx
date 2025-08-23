import { Container, Title, Text, Paper, Stack, Center } from '@mantine/core';
import { IconLayoutBoard } from '@tabler/icons-react';

export function Board() {
  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        <div>
          <Title order={1} size="h2" fw={700} mb="xs">
            Quadrant Board
          </Title>
          <Text size="md" c="dimmed">
            Organize your tasks using Stephen Covey's Time Management Matrix.
          </Text>
        </div>

        <Center py="xl">
          <Paper p="xl" shadow="sm" radius="md" withBorder>
            <Stack align="center" gap="md">
              <IconLayoutBoard size={48} color="var(--mantine-color-gray-4)" />
              <Text size="lg" fw={500} c="dimmed">
                Board Coming Soon
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                The quadrant task board will be available in the next phase of
                development.
              </Text>
            </Stack>
          </Paper>
        </Center>
      </Stack>
    </Container>
  );
}
