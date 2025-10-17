import { Box, Paper } from '@mantine/core';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface OverlayModalProps {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number | string;
  title?: ReactNode;
}

export function OverlayModal({
  opened,
  onClose,
  children,
  width = 520,
  title,
}: OverlayModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (opened) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [opened, onClose]);

  if (!opened) return null;

  return createPortal(
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.35)',
        zIndex: 9000,
      }}
      onClick={onClose}
    >
      <Paper
        shadow="md"
        radius="md"
        withBorder
        p="md"
        style={{
          width,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'var(--mantine-color-body)',
          position: 'relative',
          zIndex: 9001,
        }}
        onClick={e => e.stopPropagation()}
      >
        {title ? (
          <Box mb="sm" style={{ fontWeight: 600 }}>
            {title}
          </Box>
        ) : null}
        {children}
      </Paper>
    </Box>,
    document.body
  );
}
