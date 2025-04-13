import mongoose, { Connection } from 'mongoose';
import dbConnect from '../dbConnect';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('Database Connection', () => {
  let mockConnect: jest.Mock;
  let mockConnection: Connection;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Reset global mongoose state
    if (global.mongoose) {
      global.mongoose.conn = null;
      global.mongoose.promise = null;
    }

    mockConnect = mongoose.connect as jest.Mock;
    
    // Define mock connection with proper typing
    mockConnection = {
      connection: {
        readyState: 1,
      },
    } as unknown as Connection;

    mockConnect.mockResolvedValue(mockConnection);
  });

  it('should connect to the database successfully', async () => {
    const connection = await dbConnect();
    
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledWith(
      expect.stringContaining('mongodb'),
      expect.any(Object)
    );
    expect(connection).toBe(mockConnection);
  });

  it('should reuse existing connection if already connected', async () => {
    const connection1 = await dbConnect();
    const connection2 = await dbConnect();

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(connection2).toBe(connection1);
  });

  it('should reuse pending connection promise if connection is in progress', async () => {
    // Create two concurrent connection attempts
    const promise1 = dbConnect();
    const promise2 = dbConnect();

    const [connection1, connection2] = await Promise.all([promise1, promise2]);

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(connection1).toBe(connection2);
  });

  it('should handle connection errors', async () => {
    const error = new Error('Connection failed');
    mockConnect.mockRejectedValue(error);

    try {
      await dbConnect();
      fail('Expected dbConnect to throw an error');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe('Connection failed');
    }

    expect(mockConnect).toHaveBeenCalledTimes(1);
  });
});
