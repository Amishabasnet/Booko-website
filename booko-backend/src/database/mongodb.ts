import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) {
    console.log(" MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);

    isConnected = true;

    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
