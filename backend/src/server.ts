import app from "./app";
import connectDB from "./db/db";
import { config } from "./config/data.config";
import { connectRedis } from "./config/redis.config";
import { initQdrant } from "./config/qdrant.config";

const PORT: number = Number(config.port);

const startServer = async () => {
  try {
    await connectDB();
    await initQdrant();
    await connectRedis();
    app.listen(PORT, () => {
      console.log(`server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
