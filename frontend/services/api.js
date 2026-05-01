const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

// API client for backend
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auth endpoints
export const signup = (email, password) =>
  api.post('/auth/signup', { email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// World endpoints
export const createWorld = (token) =>
  api.post('/world/create', {}, { headers: { Authorization: `Bearer ${token}` } });

export const joinWorld = (token, joinCode) =>
  api.post('/world/join', { joinCode }, { headers: { Authorization: `Bearer ${token}` } });

export const getWorldState = (token) =>
  api.get('/world/state', { headers: { Authorization: `Bearer ${token}` } });

// Turn endpoints
export const getTurnState = (token) =>
  api.get('/turn/state', { headers: { Authorization: `Bearer ${token}` } });

export const processTurn = (token, actions) =>
  api.post('/turn/process', { actions }, { headers: { Authorization: `Bearer ${token}` } });

export const endTurn = (token) =>
  api.post('/turn/end', {}, { headers: { Authorization: `Bearer ${token}` } });
