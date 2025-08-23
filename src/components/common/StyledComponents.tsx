// Common styled components that work around theme type issues
import { Text, Badge, ActionIcon, Menu } from '@mantine/core';
import type { ComponentProps } from 'react';

// Dimmed text component that works with our theme
export function DimmedText(props: ComponentProps<typeof Text>) {
  return (
    <Text
      {...props}
      style={{ color: 'var(--mantine-color-gray-6)', ...props.style }}
    />
  );
}

// Styled badge that accepts string colors
interface StyledBadgeProps extends Omit<ComponentProps<typeof Badge>, 'color'> {
  colorName?: string;
}

export function StyledBadge({ colorName, ...props }: StyledBadgeProps) {
  if (colorName) {
    return (
      <Badge
        {...props}
        style={{
          backgroundColor: `var(--mantine-color-${colorName}-1)`,
          color: `var(--mantine-color-${colorName}-7)`,
          ...props.style,
        }}
      />
    );
  }
  return <Badge {...props} />;
}

// Styled action icon that accepts string colors
interface StyledActionIconProps
  extends Omit<ComponentProps<typeof ActionIcon>, 'color'> {
  colorName?: string;
}

export function StyledActionIcon({
  colorName,
  ...props
}: StyledActionIconProps) {
  if (colorName) {
    return (
      <ActionIcon
        {...props}
        style={{
          color: `var(--mantine-color-${colorName}-6)`,
          ...props.style,
        }}
      />
    );
  }
  return <ActionIcon {...props} variant="subtle" />;
}

// Styled menu item that accepts string colors
interface StyledMenuItemProps
  extends Omit<ComponentProps<typeof Menu.Item>, 'color'> {
  colorName?: string;
}

export function StyledMenuItem({ colorName, ...props }: StyledMenuItemProps) {
  if (colorName) {
    return (
      <Menu.Item
        {...props}
        style={{
          color: `var(--mantine-color-${colorName}-6)`,
          ...props.style,
        }}
      />
    );
  }
  return <Menu.Item {...props} />;
}
