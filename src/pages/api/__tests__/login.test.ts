import { createMocks } from 'node-mocks-http';
import loginHandler from '../login';
import { User } from '@/backend/models/user';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';

jest.mock('@/lib/dbConnect');
jest.mock('@/backend/models/user');
jest.mock('jsonwebtoken');

describe('Login API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Method not allowed',
    });
  });

  it('returns 400 if email or password is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Please provide email and password',
    });
  });

  it('returns 401 if user is not found', async () => {
    const mockFindOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    (User.findOne as jest.Mock) = mockFindOne;

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Invalid email or password',
    });
  });

  it('returns 401 if password does not match', async () => {
    const mockUser = {
      _id: 'user_id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      matchPassword: jest.fn().mockResolvedValue(false),
    };

    const mockFindOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
    (User.findOne as jest.Mock) = mockFindOne;

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Invalid email or password',
    });
  });

  it('returns 200 and user data with token for successful login', async () => {
    const mockUser = {
      _id: 'user_id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      matchPassword: jest.fn().mockResolvedValue(true),
    };

    const mockFindOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
    (User.findOne as jest.Mock) = mockFindOne;

    const mockToken = 'mock_token';
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Login successful',
      user: {
        id: mockUser._id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
      },
      token: mockToken,
    });

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id },
      expect.any(String),
      { expiresIn: '30d' }
    );
  });

  it('returns 500 if database connection fails', async () => {
    (dbConnect as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Error logging in',
    });
  });
});
