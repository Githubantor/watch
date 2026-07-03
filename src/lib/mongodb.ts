import mongoose from "mongoose";

const SRV_URI = "mongodb+srv://rbantor2003_db_user:Antor0019@cluster0.ag5rfcz.mongodb.net/watch-dealer?retryWrites=true&w=majority&appName=Cluster0";
const DIRECT_URI = "mongodb://rbantor2003_db_user:Antor0019@cluster0-shard-00-00.ag5rfcz.mongodb.net:27017,cluster0-shard-00-01.ag5rfcz.mongodb.net:27017,cluster0-shard-00-02.ag5rfcz.mongodb.net:27017/watch-dealer?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        return await mongoose.connect(SRV_URI, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
          family: 4,
        });
      } catch {
        console.warn("SRV connection failed, trying direct connection");
        return await mongoose.connect(DIRECT_URI, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
        });
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
