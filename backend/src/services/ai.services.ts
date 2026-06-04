import { aiClient } from "../config/openAi.config"

export const getEmbeddingServices = async (text: string): Promise<number[]> => {
    try {
        const res = await aiClient.embeddings.create({
            model: "text-embedding-3-small",
            input: text
        });
        return res.data[0].embedding
    } catch (err) {
        console.error(err);
        throw err
    }
}