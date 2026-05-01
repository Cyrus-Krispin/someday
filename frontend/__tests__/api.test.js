const { signup, login, createWorld, joinWorld } = require('../services/api');

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
}));

const mockedAxios = require('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should call POST /auth/signup with email and password', async () => {
      const mockPost = jest.fn().mockResolvedValue({ data: { token: 'test-token' } });
      mockedAxios.create.mockReturnValue({ post: mockPost, get: jest.fn() });

      await signup('test@example.com', 'password123');

      expect(mockPost).toHaveBeenCalledWith('/auth/signup', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('login', () => {
    it('should call POST /auth/login with email and password', async () => {
      const mockPost = jest.fn().mockResolvedValue({ data: { token: 'test-token' } });
      mockedAxios.create.mockReturnValue({ post: mockPost, get: jest.fn() });

      await login('test@example.com', 'password123');

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
