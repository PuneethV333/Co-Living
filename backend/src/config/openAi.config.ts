import OpenAI from "openai";
import { config } from "./data.config";

export const aiClient = new OpenAI({
    apiKey:config.openAiApiKey,
    baseURL:"https://integrate.api.nvidia.com/v1"
})

