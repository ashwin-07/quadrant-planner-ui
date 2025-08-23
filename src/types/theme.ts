import type { GoalCategory } from './index';

export type QuadrantType = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'staging';

export type QuadrantColorKeys =
  | 'red-quadrant'
  | 'green-quadrant'
  | 'yellow-quadrant'
  | 'gray-quadrant'
  | 'staging-blue';

export type GoalCategoryColorKeys =
  | 'career-blue'
  | 'health-green'
  | 'relationships-pink'
  | 'learning-violet'
  | 'financial-amber'
  | 'personal-orange';

export interface QuadrantConfig {
  title: string;
  subtitle: string;
  color: string;
  description: string;
  emoji: string;
}

export interface GoalCategoryConfig {
  label: string;
  color: string;
  emoji: string;
}

export interface ThemeColors {
  quadrantColors: Record<QuadrantType, string>;
  goalCategoryColors: Record<GoalCategory, string>;
}

// Extend Mantine's DefaultMantineColor to include our custom colors
declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<
      | 'red-quadrant'
      | 'green-quadrant'
      | 'yellow-quadrant'
      | 'gray-quadrant'
      | 'staging-blue'
      | 'career-blue'
      | 'health-green'
      | 'relationships-pink'
      | 'learning-violet'
      | 'financial-amber'
      | 'personal-orange'
      | 'quadrant1'
      | 'quadrant2'
      | 'quadrant3'
      | 'quadrant4'
      | 'staging',
      [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    >;
  }
}
