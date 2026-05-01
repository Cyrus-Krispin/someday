const mockPost = jest.fn();
const mockGet = jest.fn();

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: mockPost,
    get: mockGet,
  })),
}));

import { signup, login } from '../services/api';

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should call POST /auth/signup with email and password', async () => {
      mockPost.mockResolvedValueOnce({ data: { token: 'test-token' } });

      await signup('test@example.com', 'password123');

      expect(mockPost).toHaveBeenCalledWith('/auth/signup', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('login', () => {
    it('should call POST /auth/login with email and password', async () => {
      mockPost.mockResolvedValueOnce({ data: { token: 'test-token' } });

      await login('test@example.com', 'password123');

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
