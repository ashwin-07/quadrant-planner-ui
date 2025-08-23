import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { Goals } from '../Goals';

// Mock the generateId utility
vi.mock('../../utils', () => ({
  generateId: () => 'mock-id-123',
}));

describe('Goals Page', () => {
  it('renders the page title and description', () => {
    render(<Goals />);

    expect(screen.getByText('My Active Goals')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Track your objectives and make consistent progress towards what matters most.'
      )
    ).toBeInTheDocument();
  });

  it('renders the Quick Create Goal section', () => {
    render(<Goals />);

    expect(screen.getByText('Quick Create Goal')).toBeInTheDocument();
    expect(
      screen.getByText('Define your next objective with ease.')
    ).toBeInTheDocument();
  });

  it('expands Quick Create Goal section when clicked', async () => {
    const user = userEvent.setup();
    render(<Goals />);

    const quickCreateHeader = screen
      .getByText('Quick Create Goal')
      .closest('div');
    expect(quickCreateHeader).toBeInTheDocument();

    // Form should not be visible initially
    expect(screen.queryByLabelText('Goal Title')).not.toBeInTheDocument();

    // Click to expand
    await user.click(quickCreateHeader!);

    // Form should now be visible
    expect(screen.getByLabelText('Goal Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Target Timeframe')).toBeInTheDocument();
  });

  it('renders category filter tabs', () => {
    render(<Goals />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Learning')).toBeInTheDocument();
    expect(screen.getByText('Financial')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('displays mock goals', () => {
    render(<Goals />);

    // Check for some of the mock goals
    expect(screen.getByText('Master Advanced React Hooks')).toBeInTheDocument();
    expect(screen.getByText('Run a Half Marathon')).toBeInTheDocument();
    expect(
      screen.getByText('Automate Monthly Financial Report')
    ).toBeInTheDocument();
  });

  it('filters goals by category', async () => {
    const user = userEvent.setup();
    render(<Goals />);

    // Click on Career tab
    await user.click(screen.getByText('Career'));

    // Should show career goals
    expect(
      screen.getByText('Complete Cloud Certification (AWS)')
    ).toBeInTheDocument();

    // Should not show health goals
    expect(screen.queryByText('Run a Half Marathon')).not.toBeInTheDocument();
  });

  it('submits a new goal when form is filled and submitted', async () => {
    const user = userEvent.setup();
    render(<Goals />);

    // Expand the quick create section
    const quickCreateHeader = screen
      .getByText('Quick Create Goal')
      .closest('div');
    await user.click(quickCreateHeader!);

    // Fill out the form
    await user.type(screen.getByLabelText('Goal Title'), 'New Test Goal');
    await user.type(
      screen.getByLabelText('Description'),
      'This is a test goal description'
    );

    // Submit the form
    await user.click(screen.getByRole('button', { name: /create goal/i }));

    // The new goal should appear in the list
    await waitFor(() => {
      expect(screen.getByText('New Test Goal')).toBeInTheDocument();
    });
  });

  it('shows empty state when no goals match filter', async () => {
    const user = userEvent.setup();
    render(<Goals />);

    // Click on Relationships tab (which has 0 goals in mock data)
    await user.click(screen.getByText('Relationships'));

    expect(screen.getByText('No goals found')).toBeInTheDocument();
    expect(
      screen.getByText('No goals in the relationships category yet.')
    ).toBeInTheDocument();
  });

  it('shows correct goal counts in category tabs', () => {
    render(<Goals />);

    // Check that tabs show correct counts (based on mock data)
    expect(screen.getByText('2')).toBeInTheDocument(); // Career has 2 goals
    expect(screen.getByText('2')).toBeInTheDocument(); // Learning has 2 goals
    expect(screen.getByText('0')).toBeInTheDocument(); // Relationships has 0 goals
  });

  it('collapses Quick Create Goal section when clicked again', async () => {
    const user = userEvent.setup();
    render(<Goals />);

    const quickCreateHeader = screen
      .getByText('Quick Create Goal')
      .closest('div');

    // Expand
    await user.click(quickCreateHeader!);
    expect(screen.getByLabelText('Goal Title')).toBeInTheDocument();

    // Collapse
    await user.click(quickCreateHeader!);

    // Form should be hidden again
    await waitFor(() => {
      expect(screen.queryByLabelText('Goal Title')).not.toBeInTheDocument();
    });
  });

  it('resets form after successful goal creation', async () => {
    const user = userEvent.setup();
    render(<Goals />);

    // Expand and fill form
    const quickCreateHeader = screen
      .getByText('Quick Create Goal')
      .closest('div');
    await user.click(quickCreateHeader!);

    const titleInput = screen.getByLabelText('Goal Title');
    await user.type(titleInput, 'Test Goal');

    // Submit
    await user.click(screen.getByRole('button', { name: /create goal/i }));

    // Form should be reset
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
    });
  });
});
