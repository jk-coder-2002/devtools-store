import mongoose from 'mongoose';
import { env } from './env';

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: typeof mongoose;
};

const mongooseOptions: mongoose.ConnectOptions = {
  dbName: 'devtools-store'
};

export async function dbConnect() {
  if (globalWithMongoose?.mongoose?.connection?.readyState) {
    return globalWithMongoose.mongoose;
  }

  const conn = await mongoose.connect(env.MONGODB_URI, mongooseOptions);
  globalWithMongoose.mongoose = mongoose;
  return conn;
}
