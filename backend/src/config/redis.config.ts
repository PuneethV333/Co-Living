import { createClient } from "redis";
import { config } from "./data.config";

export const redisClient = createClient({
    url: config.redisUrl
})

redisClient.on("error", (err: Error) => {
    console.log("Redis error", err.message);
});
redisClient.on("connect", () => {
    console.log("Redis connected...");
});
redisClient.on("ready", () => {
    console.log("Redis ready to use...");
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to redis");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};