import type { AuthResponse, MyWorld, PlayerProfile, WorldState, TurnState } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

let authToken: string | null = null;

export const setToken = (token: string | null) => {
  authToken = token;
};

export const getToken = () => authToken;

const headers = (): Record<string, string> => {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) {
    h['Authorization'] = `Bearer ${authToken}`;
  }
  return h;
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

export const api = {
  signup: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  getProfile: async (): Promise<{ player: PlayerProfile }> => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      headers: headers(),
    });
    return handleResponse(res);
  },

  createWorld: async (): Promise<{
    world: { id: string; seed: string; joinCode: string; gameDay: number; status: string };
  }> => {
    const res = await fetch(`${BASE_URL}/world/create`, {
      method: 'POST',
      headers: headers(),
    });
    return handleResponse(res);
  },

  joinWorld: async (joinCode: string): Promise<{
    world: { id: string; joinCode: string; gameDay: number };
    spawnPosition: { x: number; y: number };
  }> => {
    const res = await fetch(`${BASE_URL}/world/join`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ joinCode }),
    });
    return handleResponse(res);
  },

  rejoinWorld: async (): Promise<{
    world: { id: string; joinCode: string; gameDay: number; status: string };
  }> => {
    const res = await fetch(`${BASE_URL}/world/rejoin`, {
      method: 'POST',
      headers: headers(),
    });
    return handleResponse(res);
  },

  getMyWorld: async (): Promise<{ world: MyWorld }> => {
    const res = await fetch(`${BASE_URL}/world/myworld`, {
      headers: headers(),
    });
    return handleResponse(res);
  },

  getWorldState: async (): Promise<WorldState> => {
    const res = await fetch(`${BASE_URL}/world/state`, {
      headers: headers(),
    });
    return handleResponse(res);
  },

  getTurnState: async (): Promise<TurnState> => {
    const res = await fetch(`${BASE_URL}/turn/state`, {
      headers: headers(),
    });
    return handleResponse(res);
  },

  processTurn: async (actions: Array<{
    type: string;
    targetX?: number;
    targetY?: number;
    structureType?: string;
  }>): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${BASE_URL}/turn/process`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ actions }),
    });
    return handleResponse(res);
  },

  endTurn: async (): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${BASE_URL}/turn/end`, {
      method: 'POST',
      headers: headers(),
    });
    return handleResponse(res);
  },
};
