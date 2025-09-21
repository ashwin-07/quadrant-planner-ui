import { Button, Stack, Text, Title } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

interface GoogleSignInProps {
  onSuccess: (credential: string) => void;
  loading?: boolean;
}

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

export function GoogleSignIn({
  onSuccess,
  loading = false,
}: GoogleSignInProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [hasGoogleClient, setHasGoogleClient] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (
      typeof window !== 'undefined' &&
      window.google &&
      clientId &&
      clientId !== 'your-client-id'
    ) {
      setHasGoogleClient(true);

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: GoogleCredentialResponse) => {
          if (response.credential) {
            onSuccess(response.credential);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    } else {
      setHasGoogleClient(false);
    }
  }, [onSuccess]);

  const handleDemoSignIn = () => {
    // For demo purposes, simulate a successful login
    onSuccess('demo-token');
  };

  return (
    <Stack gap="md" align="center">
      <div>
        <Title order={2} size="h3" ta="center" mb="xs">
          Welcome to Quadrant Planner
        </Title>
        <Text size="sm" c="dimmed" ta="center">
          Sign in to organize your tasks and achieve your goals
        </Text>
      </div>

      {hasGoogleClient ? (
        <>
          <div
            ref={googleButtonRef}
            style={{ width: '100%', maxWidth: '300px' }}
          />
          <Text size="xs" c="dimmed" ta="center">
            Or try the demo version
          </Text>
        </>
      ) : (
        <Text size="sm" c="dimmed" ta="center" mb="md">
          Google Sign-In not configured. Using demo mode.
        </Text>
      )}

      <Button
        variant="outline"
        fullWidth
        leftSection={<IconBrandGoogle size={16} />}
        onClick={handleDemoSignIn}
        loading={loading}
        disabled={loading}
        style={{ maxWidth: '300px' }}
      >
        {hasGoogleClient ? 'Try Demo Mode' : 'Continue with Demo'}
      </Button>
    </Stack>
  );
}
