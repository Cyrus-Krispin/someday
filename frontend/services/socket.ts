import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  turnNotification: { playerId: string; playerName: string } | null;
}

const SocketContext = createContext<SocketContextValue | null>(null);

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

interface SocketProviderProps {
  children: React.ReactNode;
  token?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, token }) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [turnNotification, setTurnNotification] = useState<SocketContextValue['turnNotification']>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('turn_start', (data: { playerId: string; playerName: string }) => {
      setTurnNotification(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return React.createElement(
    SocketContext.Provider,
    { value: { socket: socketRef.current, connected, turnNotification } },
    children
  );
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
