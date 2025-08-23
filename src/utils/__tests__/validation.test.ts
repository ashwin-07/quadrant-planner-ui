import { describe, expect, it } from 'vitest';
import {
  validateEmail,
  validateGoal,
  validateLength,
  validateRange,
  validateRequired,
  validateTask,
} from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects invalid email addresses', () => {
      const result = validateEmail('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Please enter a valid email address');
    });

    it('rejects empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    it('rejects email with just spaces', () => {
      const result = validateEmail('   ');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });
  });

  describe('validateGoal', () => {
    const validGoal = {
      title: 'Learn React',
      description: 'Master React development',
      category: 'learning' as const,
      timeframe: '3_months' as const,
    };

    it('validates correct goal data', () => {
      const result = validateGoal(validGoal);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects goal without title', () => {
      const result = validateGoal({ ...validGoal, title: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Goal title is required');
    });

    it('rejects goal with title too long', () => {
      const longTitle = 'a'.repeat(101);
      const result = validateGoal({ ...validGoal, title: longTitle });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Goal title must be less than 100 characters'
      );
    });

    it('warns about very short titles', () => {
      const result = validateGoal({ ...validGoal, title: 'Hi' });
      expect(result.valid).toBe(true);
      expect(result.warnings?.[0]).toContain(
        'Goal titles are more effective when descriptive'
      );
    });

    it('rejects invalid category', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = validateGoal({ ...validGoal, category: 'invalid' as any });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Please select a valid goal category');
    });

    it('rejects invalid timeframe', () => {
      const result = validateGoal({
        ...validGoal,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeframe: 'invalid' as any,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Please select a valid timeframe');
    });
  });

  describe('validateTask', () => {
    const validTask = {
      title: 'Complete project',
      description: 'Finish the React project',
      quadrant: 'Q2' as const,
      priority: 'high' as const,
      estimatedMinutes: 120,
      tags: ['react', 'project'],
    };

    it('validates correct task data', () => {
      const result = validateTask(validTask);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects task without title', () => {
      const result = validateTask({ ...validTask, title: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Task title is required');
    });

    it('rejects task with too many tags', () => {
      const manyTags = Array(11).fill('tag');
      const result = validateTask({ ...validTask, tags: manyTags });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Tasks can have at most 10 tags');
    });

    it('warns about very long tasks', () => {
      const result = validateTask({ ...validTask, estimatedMinutes: 300 });
      expect(result.valid).toBe(true);
      expect(result.warnings?.[0]).toContain(
        'Consider breaking down tasks longer than 4 hours'
      );
    });
  });

  describe('validateRequired', () => {
    it('passes for non-empty values', () => {
      const result = validateRequired('value', 'Field');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails for null values', () => {
      const result = validateRequired(null, 'Field');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field is required');
    });

    it('fails for empty strings', () => {
      const result = validateRequired('', 'Field');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field is required');
    });
  });

  describe('validateLength', () => {
    it('passes for strings within length bounds', () => {
      const result = validateLength('hello', 'Field', 3, 10);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails for strings too short', () => {
      const result = validateLength('hi', 'Field', 3, 10);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field must be at least 3 characters');
    });

    it('fails for strings too long', () => {
      const result = validateLength('verylongstring', 'Field', 3, 10);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field must be less than 10 characters');
    });
  });

  describe('validateRange', () => {
    it('passes for numbers within range', () => {
      const result = validateRange(5, 'Field', 1, 10);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails for numbers too small', () => {
      const result = validateRange(0, 'Field', 1, 10);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field must be at least 1');
    });

    it('fails for numbers too large', () => {
      const result = validateRange(15, 'Field', 1, 10);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field must be no more than 10');
    });
  });
});
