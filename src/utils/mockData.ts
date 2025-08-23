import type { User } from '@/types';

// Mock user data for development
export const createMockUser = (email?: string): User => ({
  id: 'user1',
  email: email || 'john.doe@example.com',
  name: 'John Doe',
  fullName: 'John Doe',
  avatarUrl: '',
  onboarded: true,
  lastLoginAt: new Date().toISOString(),
  preferences: {
    colorScheme: 'light',
    defaultQuadrant: 'staging',
    stagingReminders: true,
    emailNotifications: true,
    weeklyReview: true,
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
});
