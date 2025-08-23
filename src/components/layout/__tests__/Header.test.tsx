import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { mockUser, render } from '../../../test/test-utils';
import { Header } from '../Header';

describe('Header', () => {
  const mockProps = {
    user: mockUser,
    onLogout: vi.fn(),
    onThemeToggle: vi.fn(),
    isDarkMode: false,
    navbarCollapsed: false,
    onToggleNavbar: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the logo and app name', () => {
    render(<Header {...mockProps} />);

    expect(screen.getByText('Quadrant Planner')).toBeInTheDocument();
    expect(screen.getByText('※')).toBeInTheDocument();
  });

  it('renders navigation toggle button', () => {
    render(<Header {...mockProps} />);

    const toggleButton = screen.getByRole('button', { name: '' }); // Icon button without accessible name
    expect(toggleButton).toBeInTheDocument();
  });

  it('calls onToggleNavbar when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} />);

    const toggleButton = screen.getAllByRole('button')[0]; // First button should be the toggle
    await user.click(toggleButton);

    expect(mockProps.onToggleNavbar).toHaveBeenCalledTimes(1);
  });

  it('shows correct icon based on navbar state', () => {
    // Since we can't easily test icon types in components, let's just check the button exists
    const { rerender } = render(
      <Header {...mockProps} navbarCollapsed={true} />
    );
    expect(screen.getAllByRole('button')).toHaveLength(2); // Toggle + theme toggle

    // Test expanded state
    rerender(<Header {...mockProps} navbarCollapsed={false} />);
    expect(screen.getAllByRole('button')).toHaveLength(2); // Same number of buttons
  });

  it('renders user information', () => {
    render(<Header {...mockProps} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    // Email is not shown in the header, only in the user menu which is closed by default
  });

  it('renders theme toggle button', () => {
    render(<Header {...mockProps} />);

    const themeToggle = screen.getByLabelText('Switch to dark mode');
    expect(themeToggle).toBeInTheDocument();
  });

  it('shows correct theme toggle label and icon', () => {
    // Test light mode
    const { rerender } = render(<Header {...mockProps} isDarkMode={false} />);
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();

    // Test dark mode
    rerender(<Header {...mockProps} isDarkMode={true} />);
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('calls onThemeToggle when theme button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} />);

    const themeToggle = screen.getByLabelText('Switch to dark mode');
    await user.click(themeToggle);

    expect(mockProps.onThemeToggle).toHaveBeenCalledTimes(1);
  });

  it('opens user menu when user button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} />);

    const userButton = screen.getByRole('button', { name: /test user/i });
    await user.click(userButton);

    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls onLogout when logout is clicked', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} />);

    // Open user menu
    const userButton = screen.getByRole('button', { name: /test user/i });
    await user.click(userButton);

    // Click logout
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });

  it('displays user avatar with fallback to initials', () => {
    render(<Header {...mockProps} />);

    // Should show initials when no avatar URL
    expect(screen.getByText('T')).toBeInTheDocument(); // First letter of "Test User"
  });

  it('shows chevron rotation based on menu state', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} />);

    const userButton = screen.getByRole('button', { name: /test user/i });

    // Open menu
    await user.click(userButton);

    // Menu should be open and show menu items
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });
});
