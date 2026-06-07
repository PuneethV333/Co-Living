import { GoogleGenAI } from "@google/genai";
import { config } from "./data.config";

export const aiClient = new GoogleGenAI({
    apiKey:config.genAiApiKey,
})