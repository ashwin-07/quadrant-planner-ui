import type { User } from '@/types';
import { AppShell } from '@mantine/core';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

export function AppLayout({
  user,
  onLogout,
  onThemeToggle,
  isDarkMode,
}: AppLayoutProps) {
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);

  return (
    <AppShell
      navbar={{
        width: navbarCollapsed ? 80 : 280,
        breakpoint: 'sm',
        collapsed: { mobile: false },
      }}
      header={{ height: 60 }}
      padding="md"
    >
      <Header
        user={user}
        onLogout={onLogout}
        onThemeToggle={onThemeToggle}
        isDarkMode={isDarkMode}
        navbarCollapsed={navbarCollapsed}
        onToggleNavbar={() => setNavbarCollapsed(prev => !prev)}
      />
      <Sidebar onLogout={onLogout} collapsed={navbarCollapsed} />

      <AppShell.Main style={{ width: '100%', maxWidth: 'none' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
