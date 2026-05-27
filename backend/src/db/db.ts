import mongoose from "mongoose";
import { config } from "../config/data.config";

const connectDB = async (): Promise<void> => {
  try {
    if (!config.mongoUrl) {
      throw new Error("Mongo url not defined in .env");
    }
    await mongoose.connect(config.mongoUrl);
    console.log("connected to db");
  } catch (err: any) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("mongodb disconnected");
  process.exit(0);
});

export default connectDB;