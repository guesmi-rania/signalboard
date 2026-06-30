import mongoose from "mongoose";

let usingMemoryStore = false;

/**
 * Connects to MongoDB if MONGO_URI is provided and reachable.
 * Falls back to an in-memory store (see services/memoryStore.js) so the
 * app is demoable instantly without any DB setup — but the real
 * Mongoose/MongoDB path is fully implemented for production use.
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("⚠️  No MONGO_URI set — running with in-memory store (data resets on restart).");
    usingMemoryStore = true;
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ MongoDB connected");
    return true;
  } catch (err) {
    console.warn(`⚠️  Could not connect to MongoDB (${err.message}) — falling back to in-memory store.`);
    usingMemoryStore = true;
    return false;
  }
}

export function isUsingMemoryStore() {
  return usingMemoryStore;
}
