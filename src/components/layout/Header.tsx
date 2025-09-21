import type { User } from '@/types';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Group,
  Menu,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronLeft,
  IconLogout,
  IconMenu2,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { useState } from 'react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  navbarCollapsed: boolean;
  onToggleNavbar: () => void;
}

export function Header({
  user,
  onLogout,
  navbarCollapsed,
  onToggleNavbar,
}: HeaderProps) {
  const theme = useMantineTheme();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <AppShell.Header
      style={{
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
        backgroundColor: 'white',
        padding: `0 ${theme.spacing.md}`,
      }}
    >
      <Group h="100%" justify="space-between">
        {/* Left side - Logo and Navigation Toggle */}
        <Group gap="md">
          {/* Navigation Toggle */}
          <ActionIcon variant="subtle" size="lg" onClick={onToggleNavbar}>
            {navbarCollapsed ? (
              <IconMenu2 size={18} stroke={1.5} />
            ) : (
              <IconChevronLeft size={18} stroke={1.5} />
            )}
          </ActionIcon>

          {/* Logo */}
          <Group gap="xs">
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: rem(32),
                height: rem(32),
                borderRadius: theme.radius.md,
                background:
                  'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-green-6))',
              }}
            >
              <Text size="lg" fw={700} style={{ color: 'white' }}>
                ※
              </Text>
            </Box>
            <Text
              size="lg"
              fw={700}
              style={{ color: 'var(--mantine-color-gray-8)' }}
            >
              Quadrant Planner
            </Text>
          </Group>
        </Group>

        {/* Right side - User actions */}
        <Group gap="sm">
          {/* Theme Toggle - Hidden for now */}
          {/* <Tooltip
            label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={onThemeToggle}
              size="lg"
            >
              {isDarkMode ? (
                <IconSun size={18} stroke={1.5} />
              ) : (
                <IconMoon size={18} stroke={1.5} />
              )}
            </ActionIcon>
          </Tooltip> */}

          {/* User Menu */}
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                style={{
                  padding: `${rem(8)} ${rem(12)}`,
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.colors.gray[2]}`,
                  backgroundColor: userMenuOpened
                    ? theme.colors.gray[0]
                    : 'white',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!userMenuOpened) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.gray[0];
                  }
                }}
                onMouseLeave={e => {
                  if (!userMenuOpened) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <Group gap="sm">
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    radius="xl"
                    size="sm"
                    color="blue"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500} lineClamp={1}>
                      {user.name}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {user.email}
                    </Text>
                  </div>
                  <IconChevronDown
                    size={16}
                    stroke={1.5}
                    style={{
                      transform: userMenuOpened
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>

              <Menu.Item
                leftSection={<IconUser size={16} stroke={1.5} />}
                onClick={() => {
                  // TODO: Navigate to profile page
                  console.log('Navigate to profile');
                }}
              >
                Profile Settings
              </Menu.Item>

              <Menu.Item
                leftSection={<IconSettings size={16} stroke={1.5} />}
                onClick={() => {
                  // TODO: Navigate to settings page
                  console.log('Navigate to settings');
                }}
              >
                App Settings
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={<IconLogout size={16} stroke={1.5} />}
                color="red"
                onClick={onLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
