import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;
if (!mongodbUrl) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}

let cache = global.mongoose;
if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongodbUrl).then((conn) => {
      return conn.connection;
    });
  }
  try {
    const conn = await cache.promise;
    return conn;
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
};

export default connectDb;
