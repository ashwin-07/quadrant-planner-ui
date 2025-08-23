import {
  AppShell,
  Box,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconChartBar,
  IconLayoutBoard,
  IconLogout,
  IconTarget,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  icon: React.ComponentType<{ size?: string | number; stroke?: number }>;
  color: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: IconTarget, color: 'blue', label: 'Goals', path: '/goals' },
  { icon: IconLayoutBoard, color: 'green', label: 'Board', path: '/board' },
  { icon: IconChartBar, color: 'violet', label: 'Insights', path: '/insights' },
];

interface NavItemComponentProps {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

function NavItemComponent({
  item,
  active,
  onClick,
  collapsed,
}: NavItemComponentProps) {
  const theme = useMantineTheme();

  const button = (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
        color: active
          ? 'var(--mantine-color-blue-6)'
          : 'var(--mantine-color-gray-6)',
        backgroundColor: active ? 'var(--mantine-color-blue-0)' : 'transparent',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s ease',
        border: active
          ? '1px solid var(--mantine-color-blue-2)'
          : '1px solid transparent',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {collapsed ? (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: rem(28),
            height: rem(28),
            borderRadius: theme.radius.sm,
            backgroundColor: active
              ? 'var(--mantine-color-blue-1)'
              : 'var(--mantine-color-gray-1)',
            margin: '0 auto',
          }}
        >
          <item.icon
            size={16}
            stroke={2}
            style={{
              color: active
                ? 'var(--mantine-color-blue-6)'
                : 'var(--mantine-color-gray-6)',
            }}
          />
        </Box>
      ) : (
        <Group gap="sm">
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: rem(28),
              height: rem(28),
              borderRadius: theme.radius.sm,
              backgroundColor: active
                ? 'var(--mantine-color-blue-1)'
                : 'var(--mantine-color-gray-1)',
            }}
          >
            <item.icon
              size={16}
              stroke={2}
              style={{
                color: active
                  ? 'var(--mantine-color-blue-6)'
                  : 'var(--mantine-color-gray-6)',
              }}
            />
          </Box>
          <Text size="sm" fw={active ? 600 : 400}>
            {item.label}
          </Text>
        </Group>
      )}
    </UnstyledButton>
  );

  if (collapsed) {
    return (
      <Tooltip label={item.label} position="right" withArrow>
        {button}
      </Tooltip>
    );
  }

  return button;
}

interface SidebarProps {
  onLogout: () => void;
  collapsed: boolean;
}

export function Sidebar({ onLogout, collapsed }: SidebarProps) {
  const theme = useMantineTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <AppShell.Navbar
      p="md"
      style={{
        borderRight: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-gray-0)',
      }}
    >
      {/* Navigation Items */}
      <Box style={{ flex: 1 }} mt="md">
        {navItems.map(item => (
          <Box key={item.path} mb="xs">
            <NavItemComponent
              item={item}
              active={location.pathname === item.path}
              onClick={() => handleNavClick(item.path)}
              collapsed={collapsed}
            />
          </Box>
        ))}
      </Box>

      {/* Bottom Actions */}
      <Box>
        {collapsed ? (
          <Tooltip label="Logout" position="right" withArrow>
            <UnstyledButton
              onClick={onLogout}
              style={{
                display: 'block',
                width: '100%',
                padding: theme.spacing.sm,
                borderRadius: theme.radius.md,
                color: 'var(--mantine-color-gray-6)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  'var(--mantine-color-red-0)';
                e.currentTarget.style.color = 'var(--mantine-color-red-6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--mantine-color-gray-6)';
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: rem(28),
                  height: rem(28),
                  borderRadius: theme.radius.sm,
                  backgroundColor: 'var(--mantine-color-gray-1)',
                  margin: '0 auto',
                }}
              >
                <IconLogout size={16} stroke={2} />
              </Box>
            </UnstyledButton>
          </Tooltip>
        ) : (
          <UnstyledButton
            onClick={onLogout}
            style={{
              display: 'block',
              width: '100%',
              padding: theme.spacing.sm,
              borderRadius: theme.radius.md,
              color: 'var(--mantine-color-gray-6)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                'var(--mantine-color-red-0)';
              e.currentTarget.style.color = 'var(--mantine-color-red-6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--mantine-color-gray-6)';
            }}
          >
            <Group gap="sm">
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: rem(28),
                  height: rem(28),
                  borderRadius: theme.radius.sm,
                  backgroundColor: 'var(--mantine-color-gray-1)',
                }}
              >
                <IconLogout size={16} stroke={2} />
              </Box>
              <Text size="sm">Logout</Text>
            </Group>
          </UnstyledButton>
        )}
      </Box>
    </AppShell.Navbar>
  );
}
