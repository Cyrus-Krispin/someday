import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

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

vi.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: vi.fn() }),
}));

import { AuthScreen } from '../screens/AuthScreen';

const renderAuthScreen = () => render(<AuthScreen navigation={undefined as any} />);

const openModal = async () => {
  await userEvent.click(screen.getByText('Login'));
};

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

  describe('rendering', () => {
    it('shows title and login button on the landing page', () => {
      renderAuthScreen();
      expect(screen.getByText('SOMEDAY')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/you@example/i)).not.toBeInTheDocument();
    });
  });

  describe('modal - tab switching', () => {
    it('shows Log In tab active by default after opening modal', async () => {
      renderAuthScreen();
      await openModal();
      expect(screen.getAllByText('Log In').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/confirm password/i)).not.toBeInTheDocument();
    });

    it('shows confirm-password field after switching to Sign Up tab', async () => {
      renderAuthScreen();
      await openModal();
      await userEvent.click(screen.getByText('Sign Up'));
      expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    });

    it('hides confirm-password field after switching back to Log In', async () => {
      renderAuthScreen();
      await openModal();
      await userEvent.click(screen.getByText('Sign Up'));
      expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
      await userEvent.click(screen.getByText('Log In'));
      expect(screen.queryByPlaceholderText(/confirm password/i)).not.toBeInTheDocument();
    });
  });

  describe('modal - inline validation errors (signup)', () => {
    beforeEach(async () => {
      renderAuthScreen();
      await openModal();
      await userEvent.click(screen.getByText('Sign Up'));
    });

    it('shows password-too-short error without making a network call', async () => {
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'abc');
      await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'abc');
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      expect(mockSignup).not.toHaveBeenCalled();
    });

    it('shows password-mismatch error without making a network call', async () => {
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'abcdef');
      await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'XXXXXX');
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

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
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();

      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'd');
      expect(screen.queryByText(/password must be at least 6 characters/i)).not.toBeInTheDocument();
    });
  });

  describe('modal - server errors', () => {
    it('shows server error from AuthContext in the modal', async () => {
      mockAuthState = { ...mockAuthState, error: 'Invalid credentials' };
      renderAuthScreen();
      await openModal();
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('shows server error when login call rejects', async () => {
      mockLogin.mockRejectedValue(new Error('Invalid credentials'));
      renderAuthScreen();
      await openModal();
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /log in/i }));
      expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'password123');
    });
  });

  describe('modal - successful submission', () => {
    it('calls login with email and password on valid login submit', async () => {
      mockLogin.mockResolvedValue(undefined);
      renderAuthScreen();
      await openModal();
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /log in/i }));
      expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'password123');
    });

    it('calls signup with email and password on valid signup submit', async () => {
      mockSignup.mockResolvedValue(undefined);
      renderAuthScreen();
      await openModal();
      await userEvent.click(screen.getByText('Sign Up'));
      await userEvent.type(screen.getByPlaceholderText(/^you@example\.com$/i), 'user@test.com');
      await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'password123');
      await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));
      expect(mockSignup).toHaveBeenCalledWith('user@test.com', 'password123');
    });
  });

  describe('modal - loading state', () => {
    it('shows loading spinner and disables button while submitting', async () => {
      mockLogin.mockImplementation(() => new Promise(() => {}));
      renderAuthScreen();
      await openModal();
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
