import { aiClient } from "../config/genAi.config";

export const getEmbeddingServices = async (
    text: string
): Promise<number[]> => {
    const response = await aiClient.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
    });

    return response.embeddings![0].values!;
};