import {
  Box,
  Center,
  ColorSchemeScript,
  Loader,
  MantineProvider,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Board } from './pages/Board';
import { Goals } from './pages/Goals';
import { Insights } from './pages/Insights';
import { Login } from './pages/Login';
import { theme } from './theme';

interface AppContentProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

function AppContent({ onThemeChange }: AppContentProps) {
  const { user, loading, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode state from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    onThemeChange(newTheme);
  };

  if (loading) {
    return (
      <Center h="100vh" w="100vw">
        <Stack align="center" gap="lg" ta="center">
          {/* Logo */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: rem(64),
              height: rem(64),
              borderRadius: rem(16),
              background:
                'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-green-6))',
              marginBottom: rem(8),
            }}
          >
            <Text
              size="xl"
              fw={700}
              style={{ color: 'white', fontSize: rem(28) }}
            >
              ※
            </Text>
          </Box>

          <Title
            order={1}
            ta="center"
            fw={700}
            style={{ color: 'var(--mantine-color-gray-8)' }}
          >
            Quadrant Planner
          </Title>
          <Text size="md" style={{ color: 'var(--mantine-color-gray-6)' }}>
            Loading your productivity workspace...
          </Text>
          <Loader size="md" style={{ marginTop: rem(16) }} />
        </Stack>
      </Center>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout
            user={user}
            onLogout={logout}
            onThemeToggle={handleThemeToggle}
            isDarkMode={isDarkMode}
          />
        }
      >
        <Route index element={<Navigate to="/goals" replace />} />
        <Route path="goals" element={<Goals />} />
        <Route path="board" element={<Board />} />
        <Route path="insights" element={<Insights />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setColorScheme(savedTheme);
    }
  }, []);

  // Save theme preference to localStorage
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setColorScheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider
        theme={theme}
        defaultColorScheme={colorScheme}
        forceColorScheme={colorScheme}
      >
        <Notifications />
        <ModalsProvider>
          <BrowserRouter>
            <AuthProvider>
              <AppContent onThemeChange={handleThemeChange} />
            </AuthProvider>
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
