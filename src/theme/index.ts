import {
  createTheme,
  type MantineColorsTuple,
  virtualColor,
  parseThemeColor,
  rem,
} from '@mantine/core';

// Custom color palettes for quadrants
const redQuadrant: MantineColorsTuple = [
  '#ffe5e5',
  '#ffb3b3',
  '#ff8080',
  '#ff4d4d',
  '#ff1a1a',
  '#e60000',
  '#cc0000',
  '#b30000',
  '#990000',
  '#800000',
];

const greenQuadrant: MantineColorsTuple = [
  '#e8f5e8',
  '#d4f5d4',
  '#a8e8a8',
  '#7dd87d',
  '#52c752',
  '#42a542',
  '#328332',
  '#226122',
  '#124012',
  '#021f02',
];

const yellowQuadrant: MantineColorsTuple = [
  '#fff4e6',
  '#ffe6b3',
  '#ffd780',
  '#ffc84d',
  '#ffb71a',
  '#e6a500',
  '#cc9200',
  '#b38000',
  '#996e00',
  '#805c00',
];

const stagingBlue: MantineColorsTuple = [
  '#e3f2fd',
  '#bbdefb',
  '#90caf9',
  '#64b5f6',
  '#42a5f5',
  '#2196f3',
  '#1e88e5',
  '#1976d2',
  '#1565c0',
  '#0d47a1',
];

// Goal category colors
const careerBlue: MantineColorsTuple = [
  '#e3f2fd',
  '#bbdefb',
  '#90caf9',
  '#64b5f6',
  '#42a5f5',
  '#2196f3',
  '#1e88e5',
  '#1976d2',
  '#1565c0',
  '#0d47a1',
];

const healthGreen: MantineColorsTuple = [
  '#e8f5e8',
  '#c8e6c8',
  '#a4d6a4',
  '#81c681',
  '#66bb66',
  '#4caf50',
  '#43a047',
  '#388e3c',
  '#2e7d32',
  '#1b5e20',
];

const relationshipsPink: MantineColorsTuple = [
  '#fce4ec',
  '#f8bbd9',
  '#f48fb1',
  '#f06292',
  '#ec407a',
  '#e91e63',
  '#d81b60',
  '#c2185b',
  '#ad1457',
  '#880e4f',
];

const learningViolet: MantineColorsTuple = [
  '#f3e5f5',
  '#e1bee7',
  '#ce93d8',
  '#ba68c8',
  '#ab47bc',
  '#9c27b0',
  '#8e24aa',
  '#7b1fa2',
  '#6a1b9a',
  '#4a148c',
];

const financialAmber: MantineColorsTuple = [
  '#fff8e1',
  '#ffecb3',
  '#ffe082',
  '#ffd54f',
  '#ffca28',
  '#ffc107',
  '#ffb300',
  '#ffa000',
  '#ff8f00',
  '#ff6f00',
];

const personalOrange: MantineColorsTuple = [
  '#fff3e0',
  '#ffe0b2',
  '#ffcc80',
  '#ffb74d',
  '#ffa726',
  '#ff9800',
  '#fb8c00',
  '#f57c00',
  '#ef6c00',
  '#e65100',
];

const grayQuadrant: MantineColorsTuple = [
  '#f8f9fa',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#868e96',
  '#495057',
  '#343a40',
  '#212529',
  '#000000',
];

export const theme = createTheme({
  colors: {
    // Quadrant colors
    'red-quadrant': redQuadrant,
    'green-quadrant': greenQuadrant,
    'yellow-quadrant': yellowQuadrant,
    'gray-quadrant': grayQuadrant,
    'staging-blue': stagingBlue,

    // Goal category colors
    'career-blue': careerBlue,
    'health-green': healthGreen,
    'relationships-pink': relationshipsPink,
    'learning-violet': learningViolet,
    'financial-amber': financialAmber,
    'personal-orange': personalOrange,

    // Virtual colors for semantic meaning
    quadrant1: virtualColor({
      name: 'quadrant1',
      dark: 'red-quadrant',
      light: 'red-quadrant',
    }),
    quadrant2: virtualColor({
      name: 'quadrant2',
      dark: 'green-quadrant',
      light: 'green-quadrant',
    }),
    quadrant3: virtualColor({
      name: 'quadrant3',
      dark: 'yellow-quadrant',
      light: 'yellow-quadrant',
    }),
    quadrant4: virtualColor({
      name: 'quadrant4',
      dark: 'gray-quadrant',
      light: 'gray-quadrant',
    }),
    staging: virtualColor({
      name: 'staging',
      dark: 'staging-blue',
      light: 'staging-blue',
    }),
  },

  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 8 },
  defaultRadius: 'md',

  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  headings: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(34), lineHeight: '1.3' },
      h2: { fontSize: rem(26), lineHeight: '1.35' },
      h3: { fontSize: rem(22), lineHeight: '1.4' },
      h4: { fontSize: rem(18), lineHeight: '1.45' },
      h5: { fontSize: rem(16), lineHeight: '1.5' },
      h6: { fontSize: rem(14), lineHeight: '1.5' },
    },
  },

  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },

  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(8),
    lg: rem(16),
    xl: rem(32),
  },

  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05), 0 20px 25px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px rgba(0, 0, 0, 0.15)',
  },

  components: {
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        withBorder: true,
        padding: 'md',
      },
      styles: {
        root: {
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },

    Paper: {
      defaultProps: {
        shadow: 'xs',
        radius: 'md',
        withBorder: true,
        padding: 'md',
      },
    },

    Button: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
      },
    },

    ActionIcon: {
      defaultProps: {
        radius: 'md',
        variant: 'subtle',
      },
    },

    Input: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        },
      },
    },

    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },

    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },

    Select: {
      defaultProps: {
        radius: 'md',
      },
    },

    Badge: {
      defaultProps: {
        radius: 'sm',
        variant: 'light',
      },
      styles: {
        root: {
          fontWeight: 500,
        },
      },
    },

    Modal: {
      defaultProps: {
        radius: 'md',
        shadow: 'lg',
        overlayProps: {
          backgroundOpacity: 0.4,
          blur: 2,
        },
      },
    },

    Notification: {
      defaultProps: {
        radius: 'md',
      },
    },

    Tabs: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        tab: {
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
      },
    },

    Progress: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },

    Menu: {
      defaultProps: {
        radius: 'md',
        shadow: 'md',
      },
    },

    Popover: {
      defaultProps: {
        radius: 'md',
        shadow: 'md',
      },
    },

    Alert: {
      defaultProps: {
        radius: 'md',
      },
    },

    Spotlight: {
      defaultProps: {
        radius: 'md',
        shadow: 'lg',
      },
    },
  },

  other: {
    // Custom theme values for our app
    quadrantColors: {
      Q1: 'red-quadrant.5',
      Q2: 'green-quadrant.5',
      Q3: 'yellow-quadrant.5',
      Q4: 'gray.5',
      staging: 'staging-blue.5',
    },
    goalCategoryColors: {
      career: 'career-blue.5',
      health: 'health-green.5',
      relationships: 'relationships-pink.5',
      learning: 'learning-violet.5',
      financial: 'financial-amber.5',
      personal: 'personal-orange.5',
    },
  },
});

// Helper function to get quadrant color
export function getQuadrantColor(
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'staging'
): string {
  const colorMap = {
    Q1: 'red-quadrant',
    Q2: 'green-quadrant',
    Q3: 'yellow-quadrant',
    Q4: 'gray-quadrant',
    staging: 'staging-blue',
  };
  return colorMap[quadrant];
}

// Helper function to get goal category color
export function getGoalCategoryColor(
  category:
    | 'career'
    | 'health'
    | 'relationships'
    | 'learning'
    | 'financial'
    | 'personal'
): string {
  const colorMap = {
    career: 'career-blue',
    health: 'health-green',
    relationships: 'relationships-pink',
    learning: 'learning-violet',
    financial: 'financial-amber',
    personal: 'personal-orange',
  };
  return colorMap[category];
}

// Color resolver for dynamic theming
export function resolveQuadrantColor(
  color: string,
  theme: Record<string, unknown>
) {
  const parsed = parseThemeColor({ color, theme });
  return parsed.value;
}
