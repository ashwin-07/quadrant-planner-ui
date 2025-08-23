import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockGoal, render } from '../../../test/test-utils';
import { GoalCard } from '../GoalCard';

describe('GoalCard', () => {
  const mockProps = {
    goal: mockGoal,
    taskCount: 5,
    completedTaskCount: 2,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onArchive: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders goal information correctly', () => {
    render(<GoalCard {...mockProps} />);

    expect(screen.getByText('Test Goal')).toBeInTheDocument();
    expect(screen.getByText('Test goal description')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getByText('3 months')).toBeInTheDocument();
  });

  it('displays task progress correctly', () => {
    render(<GoalCard {...mockProps} />);

    expect(screen.getByText('2/5 tasks')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('shows no tasks state when taskCount is 0', () => {
    render(<GoalCard {...mockProps} taskCount={0} completedTaskCount={0} />);

    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('opens menu when dots button is clicked', async () => {
    render(<GoalCard {...mockProps} />);

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    // Wait for menu to open
    await screen.findByText('Edit Goal');
    expect(screen.getByText('Archive')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onEdit when edit is clicked', async () => {
    render(<GoalCard {...mockProps} />);

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    const editButton = await screen.findByText('Edit Goal');
    fireEvent.click(editButton);

    expect(mockProps.onEdit).toHaveBeenCalledWith(mockGoal);
  });

  it('calls onArchive when archive is clicked', async () => {
    render(<GoalCard {...mockProps} />);

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    const archiveButton = await screen.findByText('Archive');
    fireEvent.click(archiveButton);

    expect(mockProps.onArchive).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete is clicked', async () => {
    render(<GoalCard {...mockProps} />);

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    const deleteButton = await screen.findByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('displays correct timeframe for different values', () => {
    const goalWith6Months = { ...mockGoal, timeframe: '6_months' as const };
    render(<GoalCard {...mockProps} goal={goalWith6Months} />);

    expect(screen.getByText('6 months')).toBeInTheDocument();
  });

  it('displays correct timeframe for ongoing', () => {
    const ongoingGoal = { ...mockGoal, timeframe: 'ongoing' as const };
    render(<GoalCard {...mockProps} goal={ongoingGoal} />);

    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('calculates completion rate correctly', () => {
    render(<GoalCard {...mockProps} taskCount={10} completedTaskCount={3} />);

    expect(screen.getByText('3/10 tasks')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('handles 100% completion correctly', () => {
    render(<GoalCard {...mockProps} taskCount={5} completedTaskCount={5} />);

    expect(screen.getByText('5/5 tasks')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
