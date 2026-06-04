import { z } from "zod";
export const envSchema = z.object({
    PORT: z.string().default("5000"),
    FRONTEND_URL: z.string(),
    REDIS_URL: z.string(),
    MONGO_URL: z.string(),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_CLIENT_EMAIL: z.string(),
    FIREBASE_PRIVATE_KEY: z.string(),
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
    TWILIO_VERIFY_SERVICE_SID: z.string(),
    QDRANT_URL: z.string(),
    QDRANT_API_KEY: z.string(),
    OPENAI_API_KEY:z.string()
});
