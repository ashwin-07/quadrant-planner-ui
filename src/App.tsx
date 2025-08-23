import {
  MantineProvider,
  ColorSchemeScript,
  AppShell,
  Title,
  Text,
  Container,
  Grid,
  Card,
  Badge,
  Group,
  Stack,
  Paper,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { theme } from './theme';
import { QUADRANT_CONFIG, GOAL_CATEGORIES } from '@/utils/constants';

// Theme demonstration component
function ThemeDemo() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1} ta="center" mb="md">
            🎯 Quadrant Planner
          </Title>
          <Text
            ta="center"
            size="lg"
            style={{ color: 'var(--mantine-color-gray-6)' }}
          >
            Philosophy-driven productivity with Stephen Covey's Time Management
            Matrix
          </Text>
        </div>

        {/* Quadrant Colors Demo */}
        <div>
          <Title order={2} mb="md">
            Quadrant Color System
          </Title>
          <Grid>
            {Object.entries(QUADRANT_CONFIG).map(([key, config]) => (
              <Grid.Col key={key} span={6}>
                <Paper
                  p="md"
                  style={{
                    backgroundColor: `var(--mantine-color-${config.color === 'gray' ? 'gray-quadrant' : config.color + '-quadrant'}-0)`,
                    borderLeft: `4px solid var(--mantine-color-${config.color === 'gray' ? 'gray-quadrant' : config.color + '-quadrant'}-5)`,
                  }}
                >
                  <Group gap="xs" mb="xs">
                    <Text size="lg">{config.emoji}</Text>
                    <Title
                      order={4}
                      style={{
                        color: `var(--mantine-color-${config.color === 'gray' ? 'gray-quadrant' : config.color + '-quadrant'}-7)`,
                      }}
                    >
                      {key}: {config.title}
                    </Title>
                  </Group>
                  <Text
                    size="sm"
                    style={{ color: 'var(--mantine-color-gray-6)' }}
                    mb="xs"
                  >
                    {config.subtitle}
                  </Text>
                  <Text
                    size="xs"
                    style={{ color: 'var(--mantine-color-gray-7)' }}
                  >
                    {config.description}
                  </Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </div>

        {/* Staging Zone Demo */}
        <div>
          <Title order={2} mb="md">
            Staging Zone
          </Title>
          <Paper
            p="md"
            style={{
              border: '2px dashed var(--mantine-color-staging-blue-3)',
              backgroundColor: 'var(--mantine-color-staging-blue-0)',
            }}
          >
            <Group gap="xs" mb="xs">
              <Text size="lg">📦</Text>
              <Title
                order={4}
                style={{ color: 'var(--mantine-color-staging-blue-7)' }}
              >
                Staging Zone
              </Title>
              <Badge
                style={{
                  backgroundColor: 'var(--mantine-color-staging-blue-1)',
                  color: 'var(--mantine-color-staging-blue-7)',
                }}
              >
                0/5
              </Badge>
            </Group>
            <Text size="sm" style={{ color: 'var(--mantine-color-gray-6)' }}>
              Stage quick thoughts here, then organize into quadrants
            </Text>
          </Paper>
        </div>

        {/* Goal Categories Demo */}
        <div>
          <Title order={2} mb="md">
            Goal Categories
          </Title>
          <Grid>
            {Object.entries(GOAL_CATEGORIES).map(([key, category]) => (
              <Grid.Col key={key} span={4}>
                <Card
                  style={{
                    borderLeft: `4px solid var(--mantine-color-${category.color === 'blue' ? 'career-blue' : category.color === 'green' ? 'health-green' : category.color === 'pink' ? 'relationships-pink' : category.color === 'violet' ? 'learning-violet' : category.color === 'yellow' ? 'financial-amber' : 'personal-orange'}-5)`,
                  }}
                >
                  <Group gap="xs">
                    <Text size="lg">{category.emoji}</Text>
                    <div>
                      <Text fw={500}>{category.label}</Text>
                      <Badge
                        style={{
                          backgroundColor: `var(--mantine-color-${category.color === 'blue' ? 'career-blue' : category.color === 'green' ? 'health-green' : category.color === 'pink' ? 'relationships-pink' : category.color === 'violet' ? 'learning-violet' : category.color === 'yellow' ? 'financial-amber' : 'personal-orange'}-1)`,
                          color: `var(--mantine-color-${category.color === 'blue' ? 'career-blue' : category.color === 'green' ? 'health-green' : category.color === 'pink' ? 'relationships-pink' : category.color === 'violet' ? 'learning-violet' : category.color === 'yellow' ? 'financial-amber' : 'personal-orange'}-7)`,
                        }}
                        size="xs"
                      >
                        {key}
                      </Badge>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>

        {/* Success Message */}
        <Card
          style={{
            backgroundColor: 'var(--mantine-color-green-quadrant-0)',
            borderColor: 'var(--mantine-color-green-quadrant-3)',
            border: '1px solid var(--mantine-color-green-quadrant-3)',
          }}
        >
          <Group gap="xs">
            <Text size="lg">✅</Text>
            <div>
              <Text
                fw={500}
                style={{ color: 'var(--mantine-color-green-quadrant-7)' }}
              >
                Theme Setup Complete!
              </Text>
              <Text size="sm" style={{ color: 'var(--mantine-color-gray-6)' }}>
                All quadrant colors, goal categories, and component styling are
                configured and working perfectly.
              </Text>
            </div>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}

function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications />
        <ModalsProvider>
          <AppShell padding="md">
            <AppShell.Main>
              <ThemeDemo />
            </AppShell.Main>
          </AppShell>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
