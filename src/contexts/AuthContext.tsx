import type { User } from '@/types';
import { createMockUser } from '@/utils/mockData';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    provider?: string,
    userData?: Partial<User>,
    token?: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const initAuth = async () => {
      try {
        // Simulate API call to check session
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check for existing session
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('jwt_token');

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedToken) {
          console.log(
            'Loading JWT token from localStorage:',
            savedToken.substring(0, 20) + '...'
          );
          setToken(savedToken);
        }
        // No auto-login - user must sign in
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    provider: string = 'email',
    userData?: Partial<User>,
    jwtToken?: string
  ) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      let loginUser: User;

      if (userData && provider === 'google-oauth') {
        // Use real Google user data
        loginUser = {
          id: userData.id || 'google-user',
          email: email,
          name: userData.name || 'Google User',
          fullName: userData.name || 'Google User',
          avatarUrl: (userData as { avatar?: string }).avatar || '',
          onboarded: true,
          lastLoginAt: new Date().toISOString(),
          preferences: {
            colorScheme: 'auto',
            defaultQuadrant: 'staging',
            stagingReminders: true,
            emailNotifications: true,
            weeklyReview: true,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Fallback to mock user for demo/guest mode
        loginUser = createMockUser(email);
      }

      setUser(loginUser);
      localStorage.setItem('user', JSON.stringify(loginUser));

      // Store JWT token if provided
      if (jwtToken) {
        setToken(jwtToken);
        localStorage.setItem('jwt_token', jwtToken);
      }
    } catch {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
