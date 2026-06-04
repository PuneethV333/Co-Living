import OpenAI from "openai";
import { config } from "./data.config";

export const aiClient = new OpenAI({
    apiKey:config.openAiApiKey
})

