import { Container, Title, Text, Paper, Stack, Center } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';

export function Insights() {
  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        <div>
          <Title order={1} size="h2" fw={700} mb="xs">
            Productivity Insights
          </Title>
          <Text size="md" c="dimmed">
            Analyze your task patterns and productivity trends.
          </Text>
        </div>

        <Center py="xl">
          <Paper p="xl" shadow="sm" radius="md" withBorder>
            <Stack align="center" gap="md">
              <IconChartBar size={48} color="var(--mantine-color-gray-4)" />
              <Text size="lg" fw={500} c="dimmed">
                Insights Coming Soon
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Analytics and insights dashboard will be available in the next
                phase.
              </Text>
            </Stack>
          </Paper>
        </Center>
      </Stack>
    </Container>
  );
}
