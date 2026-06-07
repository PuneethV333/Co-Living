// import axios from "axios";
// import { config } from "../config/data.config";

import { aiClient } from "../config/genAi.config";

// export const getEmbeddingServices = async (
//     text: string
// ): Promise<number[]> => {
//     try {
//         const response = await axios.post(
//             config.ollamUrl,
//             {
//                 model: "nomic-embed-text",
//                 prompt: text,
//             }
//         );

//         return response.data.embedding;
//     } catch (err: any) {
//         console.error(
//             "Embedding Error:",
//             err.response?.data || err.message
//         );
//         throw err;
//     }
// };


export const getEmbeddingServices = async (
  text: string
): Promise<number[]> => {
  const response = await aiClient.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  return response.embeddings![0].values!;
};