import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const signup = (email: string, password: string) =>
  api.post('/auth/signup', { email, password });

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const createWorld = (token: string) =>
  api.post('/world/create', {}, { headers: { Authorization: `Bearer ${token}` } });

export const joinWorld = (token: string, joinCode: string) =>
  api.post('/world/join', { joinCode }, { headers: { Authorization: `Bearer ${token}` } });

export const getWorldState = (token: string) =>
  api.get('/world/state', { headers: { Authorization: `Bearer ${token}` } });

export const getTurnState = (token: string) =>
  api.get('/turn/state', { headers: { Authorization: `Bearer ${token}` } });

export const processTurn = (token: string, actions: unknown[]) =>
  api.post('/turn/process', { actions }, { headers: { Authorization: `Bearer ${token}` } });

export const endTurn = (token: string) =>
  api.post('/turn/end', {}, { headers: { Authorization: `Bearer ${token}` } });
