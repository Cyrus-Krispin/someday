import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { api, setToken, getToken } from '../api/client';
import { connectSocket, disconnectSocket, listenForTurnStart } from '../services/socket';
import type { PlayerProfile } from '../types';

interface AuthState {
  token: string | null;
  player: PlayerProfile | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_AUTH'; token: string; player: PlayerProfile }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PLAYER'; player: PlayerProfile };

const initialState: AuthState = {
  token: null,
  player: null,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'SET_AUTH':
      return { ...state, token: action.token, player: action.player, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'UPDATE_PLAYER':
      return { ...state, player: action.player };
    default:
      return state;
  }
};

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'someday_token';

const loadStoredToken = (): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(TOKEN_KEY);
    }
  } catch {}
  return null;
};

const storeToken = (token: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  } catch {}
};

const removeToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const tryRestoreSession = async (token: string) => {
    setToken(token);
    try {
      const data = await api.getProfile();
      dispatch({ type: 'SET_AUTH', token, player: data.player });
      connectSocket(data.player.id);
    } catch {
      removeToken();
      setToken(null);
      dispatch({ type: 'LOGOUT' });
    }
  };

  useEffect(() => {
    const storedToken = loadStoredToken();
    if (storedToken) {
      tryRestoreSession(storedToken);
    } else {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const data = await api.login(email, password);
      setToken(data.token);
      storeToken(data.token);

      const profileData = await api.getProfile();
      dispatch({ type: 'SET_AUTH', token: data.token, player: profileData.player });
      connectSocket(profileData.player.id);
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', error: err.message });
      throw err;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const data = await api.signup(email, password);
      setToken(data.token);
      storeToken(data.token);

      const profileData = await api.getProfile();
      dispatch({ type: 'SET_AUTH', token: data.token, player: profileData.player });
      connectSocket(profileData.player.id);
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', error: err.message });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    disconnectSocket();
    removeToken();
    setToken(null);
    dispatch({ type: 'LOGOUT' });
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await api.getProfile();
      dispatch({ type: 'UPDATE_PLAYER', player: data.player });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', error: err.message });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', error: '' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, refreshProfile, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
