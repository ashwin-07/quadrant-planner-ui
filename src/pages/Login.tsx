import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { IconBrandGoogle, IconUser } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Google OAuth types
interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select: boolean;
  cancel_on_tap_outside: boolean;
}

interface GoogleButtonConfig {
  theme: string;
  size: string;
  width: string;
  text: string;
  shape: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          renderButton: (
            element: HTMLElement,
            config: GoogleButtonConfig
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

// Custom Google Sign-In Button Component
function GoogleSignInButton({
  onSuccess,
  loading,
}: {
  onSuccess: (credential: string) => void;
  loading?: boolean;
}) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [hasGoogleClient, setHasGoogleClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const initializeGoogle = () => {
      if (
        typeof window !== 'undefined' &&
        window.google &&
        clientId &&
        clientId !== 'your-client-id'
      ) {
        console.log('Initializing Google OAuth...');
        setHasGoogleClient(true);

        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: GoogleCredentialResponse) => {
              console.log('Google OAuth callback received:', response);
              if (response.credential) {
                onSuccess(response.credential);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Wait a bit for the element to be ready
          setTimeout(() => {
            if (googleButtonRef.current) {
              console.log('Rendering Google button...');
              window.google.accounts.id.renderButton(googleButtonRef.current, {
                theme: 'outline',
                size: 'large',
                width: '100%',
                text: 'signin_with',
                shape: 'rectangular',
              });
            }
          }, 100);
        } catch (error) {
          console.error('Google OAuth initialization failed:', error);
          setHasGoogleClient(false);
        }
      } else {
        console.log('Google OAuth not available, using demo mode');
        setHasGoogleClient(false);
      }
      setIsInitialized(true);
    };

    // Check if Google is already loaded
    if (window.google) {
      initializeGoogle();
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogle();
        }
      }, 100);

      // Timeout after 3 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        if (!window.google) {
          console.log('Google script failed to load, using demo mode');
          setHasGoogleClient(false);
          setIsInitialized(true);
        }
      }, 3000);
    }
  }, [onSuccess]);

  const handleDemoSignIn = () => {
    console.log('Demo sign-in clicked');
    onSuccess('demo-token');
  };

  // Force re-render when Google button is ready
  useEffect(() => {
    if (hasGoogleClient && googleButtonRef.current && isInitialized) {
      // Force a re-render to ensure the Google button is visible
      const timer = setTimeout(() => {
        if (
          googleButtonRef.current &&
          googleButtonRef.current.children.length === 0
        ) {
          console.log('Re-rendering Google button...');
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          });
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [hasGoogleClient, isInitialized]);

  // Always show a button, even while initializing
  return (
    <Box style={{ width: '100%' }}>
      {hasGoogleClient && isInitialized ? (
        <div
          ref={googleButtonRef}
          style={{
            width: '100%',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      ) : (
        <Button
          size="lg"
          variant="outline"
          leftSection={<IconBrandGoogle size={20} />}
          onClick={handleDemoSignIn}
          loading={loading}
          disabled={loading}
          style={{
            height: '48px',
            borderColor: '#e0e0e0',
            color: '#333',
            width: '100%',
          }}
        >
          {isInitialized ? 'Continue with Google' : 'Loading...'}
        </Button>
      )}
    </Box>
  );
}

export function Login() {
  const { login, user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/goals', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleSuccess = async (credential: string) => {
    setIsSigningIn(true);
    try {
      // In a real app, you would send this credential to your backend
      // to verify and create a session. For now, we'll simulate it.
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Parse the JWT token to get user info (in production, verify on backend)
      const payload = JSON.parse(atob(credential.split('.')[1]));

      // Extract Google user data
      const googleUserData = {
        id: payload.sub || payload.id,
        name:
          payload.name ||
          `${payload.given_name || ''} ${payload.family_name || ''}`.trim() ||
          'Google User',
        avatar: payload.picture || '',
        email: payload.email,
      };

      await login(payload.email, 'google-oauth', googleUserData, credential);

      // Redirect to goals page
      navigate('/goals', { replace: true });
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleError = (error: string) => {
    console.error('Google sign-in error:', error);
    setIsSigningIn(false);
  };

  const handleGuestLogin = async () => {
    setIsSigningIn(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await login('guest@quadrantplanner.com', 'guest');
      navigate('/goals', { replace: true });
    } catch (error) {
      console.error('Guest login error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <Box
        h="100vh"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>Loading...</div>
      </Box>
    );
  }

  return (
    <Box h="100vh" style={{ display: 'flex' }}>
      {/* Left Panel - Branding Only */}
      <Box
        w="50%"
        style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
        }}
      >
        {/* Centered Branding */}
        <Box style={{ textAlign: 'center' }}>
          <Box
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4a90e2, #7ed321)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Text
              size="xl"
              fw={700}
              style={{ color: 'white', fontSize: '36px' }}
            >
              ※
            </Text>
          </Box>
          <Title order={1} size="h1" fw={700} c="dark" mb="md">
            Quadrant Planner
          </Title>
          <Text size="lg" c="dark.6" fw={500}>
            Focus Your Day. Master Your Goals.
          </Text>
        </Box>
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        w="50%"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          background: '#ffffff',
        }}
      >
        <Box style={{ width: '100%', maxWidth: '400px' }}>
          <Stack gap="xl">
            {/* Welcome Message */}
            <Box>
              <Title order={1} size="h2" fw={700} c="dark" mb="xs">
                Welcome to Quadrant Planner!
              </Title>
              <Text size="md" c="dark.6">
                Sign in or sign up to organize your tasks and conquer your
                priorities.
              </Text>
            </Box>

            {/* Social Sign-In Options */}
            <Stack gap="md">
              {/* Google Sign-In Button */}
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                loading={isSigningIn}
              />
            </Stack>

            {/* Divider */}
            <Group>
              <Divider style={{ flex: 1 }} />
              <Text size="sm" c="dimmed" px="md">
                OR
              </Text>
              <Divider style={{ flex: 1 }} />
            </Group>

            {/* Guest Option */}
            <Button
              size="lg"
              variant="outline"
              leftSection={<IconUser size={20} />}
              onClick={handleGuestLogin}
              loading={isSigningIn}
              disabled={isSigningIn}
              style={{
                height: '48px',
                borderColor: '#e0e0e0',
                color: '#333',
                backgroundColor: '#ffffff',
              }}
            >
              Continue as Guest
            </Button>

            {/* Sign Up Prompt */}
            <Text size="sm" c="dimmed" ta="center" mt="md">
              New to Quadrant Planner? Sign in with Google or continue as a
              guest to get started.
            </Text>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
