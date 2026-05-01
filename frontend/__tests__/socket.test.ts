import { SocketProvider, useSocket } from '../services/socket';

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    connected: false,
  })),
}));

describe('Socket Service', () => {
  it('should export SocketProvider as a function', () => {
    expect(SocketProvider).toBeDefined();
    expect(typeof SocketProvider).toBe('function');
  });

  it('should export useSocket as a function', () => {
    expect(useSocket).toBeDefined();
    expect(typeof useSocket).toBe('function');
  });
});
