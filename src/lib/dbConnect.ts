import mongoose, { Connection, ConnectOptions } from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: Connection | null; promise: Promise<Connection> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiznation';

const dbConnect = async (): Promise<Connection> => {
  try {
    if (!global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }

    if (global.mongoose.conn) {
      return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
      const opts: ConnectOptions = {
        bufferCommands: false,
      };

      global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose.connection);
    }

    const conn = await global.mongoose.promise;
    if (!conn) throw new Error('Failed to connect to MongoDB');
    
    global.mongoose.conn = conn;
    return conn;
  } catch (error) {
    if (global.mongoose) {
      global.mongoose.promise = null;
    }
    throw error;
  }
};

export default dbConnect;
