import type { User } from '@/types';
import { createMockUser } from '@/utils/mockData';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const initAuth = async () => {
      try {
        // Simulate API call to check session
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, automatically log in with mock user
        // In real app, check localStorage/sessionStorage for token
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Auto-login for demo
          const mockUser = createMockUser();
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo, always succeed with mock user
      const loginUser = createMockUser(email);
      setUser(loginUser);
      localStorage.setItem('user', JSON.stringify(loginUser));
    } catch {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
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
