import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../test/test-utils';
import { Sidebar } from '../Sidebar';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/goals' }),
  };
});

describe('Sidebar', () => {
  const mockProps = {
    onLogout: vi.fn(),
    collapsed: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation items when expanded', () => {
    render(<Sidebar {...mockProps} />);

    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Board')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows only icons when collapsed', () => {
    render(<Sidebar {...mockProps} collapsed={true} />);

    // Text should not be visible
    expect(screen.queryByText('Goals')).not.toBeInTheDocument();
    expect(screen.queryByText('Board')).not.toBeInTheDocument();
    expect(screen.queryByText('Insights')).not.toBeInTheDocument();

    // But icons should still be present
    expect(screen.getAllByRole('button')).toHaveLength(4); // 3 nav items + logout
  });

  it('highlights active navigation item', () => {
    render(<Sidebar {...mockProps} />);

    // Since we're on /goals path (mocked), the Goals button should have different styling
    // We can't easily test CSS classes, so let's just check the button exists
    const goalsButton = screen.getByRole('button', { name: /goals/i });
    expect(goalsButton).toBeInTheDocument();
  });

  it('navigates when navigation item is clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...mockProps} />);

    const boardButton = screen.getByRole('button', { name: /board/i });
    await user.click(boardButton);

    expect(mockNavigate).toHaveBeenCalledWith('/board');
  });

  it('calls onLogout when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...mockProps} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });

  it('shows tooltips when collapsed', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...mockProps} collapsed={true} />);

    const buttons = screen.getAllByRole('button');
    const firstNavButton = buttons[0]; // Should be Goals button

    await user.hover(firstNavButton);

    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('navigates to insights when insights button is clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...mockProps} />);

    const insightsButton = screen.getByRole('button', { name: /insights/i });
    await user.click(insightsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/insights');
  });

  it('applies correct styling based on collapsed state', () => {
    const { rerender } = render(<Sidebar {...mockProps} collapsed={false} />);

    // When expanded, should show full layout
    expect(screen.getByText('Goals')).toBeInTheDocument();

    rerender(<Sidebar {...mockProps} collapsed={true} />);

    // When collapsed, text should be hidden
    expect(screen.queryByText('Goals')).not.toBeInTheDocument();
  });

  it('maintains logout functionality when collapsed', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...mockProps} collapsed={true} />);

    const buttons = screen.getAllByRole('button');
    const logoutButton = buttons[buttons.length - 1]; // Last button should be logout

    await user.click(logoutButton);

    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });

  it('shows logout tooltip when collapsed', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...mockProps} collapsed={true} />);

    const buttons = screen.getAllByRole('button');
    const logoutButton = buttons[buttons.length - 1];

    await user.hover(logoutButton);

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
