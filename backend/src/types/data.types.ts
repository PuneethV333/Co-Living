import { z } from "zod";
export const envSchema = z.object({
  PORT: z.string().default("5000"),
  FRONTEND_URL: z.string(),
  REDIS_URL: z.string(),
  MONGO_URL: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
});
