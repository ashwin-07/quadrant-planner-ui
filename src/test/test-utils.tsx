import { AppShell, MantineProvider } from '@mantine/core';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '../theme';
import { createMockUser } from '../utils/mockData';

// Custom render function that includes providers
interface AllTheProvidersProps {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <AppShell padding="md">{children}</AppShell>
      </MantineProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

export { customRender as render };

// Common test data
export const mockGoal = {
  id: '1',
  userId: 'user1',
  title: 'Test Goal',
  description: 'Test goal description',
  category: 'career' as const,
  timeframe: '3_months' as const,
  color: 'blue',
  archived: false,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockUser = {
  ...createMockUser('test@example.com'),
  name: 'Test User',
  fullName: 'Test User',
};

export const mockTask = {
  id: '1',
  userId: 'user1',
  goalId: '1',
  title: 'Test Task',
  description: 'Test task description',
  quadrant: 'Q2' as const,
  priority: 'medium' as const,
  completed: false,
  isStaged: false,
  dueDate: '2025-12-31',
  estimatedMinutes: 60,
  tags: ['test'],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};
