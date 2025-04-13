import { createMocks } from 'node-mocks-http';
import registerHandler from '../register';
import { User } from '@/backend/models/user';
import dbConnect from '@/lib/dbConnect';

jest.mock('@/lib/dbConnect');
jest.mock('@/backend/models/user', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Register API Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Method not allowed',
    });
  });

  it('returns 400 if required fields are missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        firstName: 'John',
        // Missing other required fields
      },
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Please provide all required fields',
    });
  });

  it('returns 400 if user already exists', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password123',
      },
    });

    (User.findOne as jest.Mock).mockResolvedValueOnce({
      email: 'existing@example.com',
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'User already exists',
    });
  });

  it('successfully registers a new user', async () => {
    const mockCreatedUser = {
      _id: 'user_id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    };

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    });

    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    (User.create as jest.Mock).mockResolvedValueOnce(mockCreatedUser);

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'User registered successfully',
      user: {
        _id: mockCreatedUser._id,
        firstName: mockCreatedUser.firstName,
        lastName: mockCreatedUser.lastName,
        email: mockCreatedUser.email,
      },
    });
  });

  it('handles database connection errors', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    });

    (dbConnect as jest.Mock).mockRejectedValueOnce(new Error('Database connection failed'));

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Database connection failed',
    });
  });
});
