import dotenv from "dotenv";
import path from "path";
import { envSchema } from "../types/data.types";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
    console.error("\n❌ Environment Validation Failed:\n");

    envValidation.error.issues.forEach((error) => {
        const field = error.path.join(".");
        const value = process.env[field];
        console.error(`  Field: ${field}`);
        console.error(`  Error: ${error.message}`);
        console.error(`  Current value: ${value ? "✅ Set" : "❌ Missing"}`);
        console.error("");
    });

    console.error("📋 All loaded env vars:");
    Object.entries(process.env).forEach(([key, value]) => {
        if (
            [
                "PORT",
                "FRONTEND_URL",
                "REDIS_URL",
                "MONGO_URL",
                "FIREBASE_PROJECT_ID",
                "FIREBASE_CLIENT_EMAIL",
                "FIREBASE_PRIVATE_KEY",
                "TWILIO_ACCOUNT_SID",
                "TWILIO_AUTH_TOKEN",
                "TWILIO_VERIFY_SERVICE_SID",
                "QDRANT_URL",
                "QDRANT_API_KEY",
                "OPENAI_API_KEY",
                "OLLAMA_URL",
                "GENAI_API_KEY",
                "RESENT_API_KEY",
                "PASS",
                "EMAIL"
            ].includes(key)
        ) {
            console.error(`  ${key}: ${value ? "✅" : "❌"}`);
        }
    });

    console.error("\n💡 Make sure all required variables are in .env file\n");
    process.exit(1);
}

export const config = {
    port: envValidation.data.PORT,
    frontendUrl: envValidation.data.FRONTEND_URL,
    mongoUrl: envValidation.data.MONGO_URL,
    redisUrl: envValidation.data.REDIS_URL,
    firebaseProjectId: envValidation.data.FIREBASE_PROJECT_ID,
    firebaseClientEmail: envValidation.data.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: envValidation.data.FIREBASE_PRIVATE_KEY,
    accountSid: envValidation.data.TWILIO_ACCOUNT_SID,
    authToken: envValidation.data.TWILIO_AUTH_TOKEN,
    serviceSid: envValidation.data.TWILIO_VERIFY_SERVICE_SID,
    qdrantApiKey: envValidation.data.QDRANT_API_KEY,
    qdrantUrl: envValidation.data.QDRANT_URL,
    openAiApiKey: envValidation.data.OPENAI_API_KEY,
    ollamUrl: envValidation.data.OLLAMA_URL,
    genAiApiKey: envValidation.data.GENAI_API_KEY,
    resendApiKey: envValidation.data.RESENT_API_KEY,
    email: envValidation.data.EMAIL,
    pass: envValidation.data.PASS,
} as const;

console.log("✅ Configuration loaded successfully");
