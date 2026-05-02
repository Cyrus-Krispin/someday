import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock AuthContext before importing the component
const mockLogin = vi.fn();
const mockSignup = vi.fn();
const mockClearError = vi.fn();
let mockAuthState = {
  login: mockLogin,
  signup: mockSignup,
  error: null as string | null,
  loading: false,
  clearError: mockClearError,
  player: null,
  token: null,
  logout: vi.fn(),
  refreshProfile: vi.fn(),
};

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockAuthState,
}));

// Mock navigation
vi.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: vi.fn() }),
}));

import { AuthScreen } from '../screens/AuthScreen';

const renderAuthScreen = () => render(<AuthScreen navigation={undefined as any} />);

describe('AuthScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState = {
      login: mockLogin,
      signup: mockSignup,
      error: null,
      loading: false,
      clearError: mockClearError,
      player: null,
      token: null,
      logout: vi.fn(),
      refreshProfile: vi.fn(),
    };
  });

  describe('tab switching', () => {
    it('renders LOGIN tab active by default', () => {
      renderAuthScreen();
      expect(screen.getByText('LOGIN')).toBeInTheDocument();
      expect(screen.getByText('SIGN UP')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/confirm password/i)).not.toBeInTheDocument();
    });

    it('shows confirm-password field after switching to SIGN UP tab', async () => {
      renderAuthScreen();
      await userEvent.click(screen.getByText('SIGN UP'));
      expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    });

    it('hides confirm-password field after switching back to LOGIN', async () => {
      renderAuthScreen();
      await userEvent.click(screen.getByText('SIGN UP'));
      await userEvent.click(screen.getByText('LOGIN'));
      expect(screen.queryByPlaceholderText(/confirm password/i)).not.toBeInTheDocument();
    });
  });

  describe('inline validation errors (signup)', () => {
    beforeEach(async () => {
      renderAuthScreen();
      await userEvent.click(screen.getByText('SIGN UP'));
    });

    it('shows password-too-short error under password field without making a network call', async () => {
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'abc');
      await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'abc');
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      expect(mockSignup).not.toHaveBeenCalled();
    });

    it('shows password-mismatch error under confirm-password field without making a network call', async () => {
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'abcdef');
      await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'XXXXXX');
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      expect(mockSignup).not.toHaveBeenCalled();
    });

    it('no validation errors shown on initial render', () => {
      expect(screen.queryByText(/password must be at least/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    });

    it('clears password error when user retypes password field', async () => {
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'abc');
      await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'abc');
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();

      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'd');
      expect(screen.queryByText(/password must be at least 6 characters/i)).not.toBeInTheDocument();
    });
  });

  describe('server errors', () => {
    it('shows server error from AuthContext when login fails', async () => {
      mockAuthState = { ...mockAuthState, error: 'Invalid credentials' };
      renderAuthScreen();
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('shows server error from AuthContext when login call rejects', async () => {
      mockLogin.mockRejectedValue(new Error('Invalid credentials'));
      renderAuthScreen();
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /log in/i }));
      expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'password123');
    });
  });

  describe('successful submission', () => {
    it('calls login with email and password on valid login submit', async () => {
      mockLogin.mockResolvedValue(undefined);
      renderAuthScreen();
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /log in/i }));
      expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'password123');
    });

    it('calls signup with email and password on valid signup submit', async () => {
      mockSignup.mockResolvedValue(undefined);
      renderAuthScreen();
      await userEvent.click(screen.getByText('SIGN UP'));
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'password123');
      await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
      expect(mockSignup).toHaveBeenCalledWith('user@test.com', 'password123');
    });
  });

  describe('loading state', () => {
    it('shows loading spinner and disables button while submitting', async () => {
      mockLogin.mockImplementation(() => new Promise(() => {})); // never resolves
      renderAuthScreen();
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        const btn = screen.getByRole('button', { name: /log in/i });
        expect(btn).toBeDisabled();
      });
    });
  });
});
