import { QdrantClient } from "@qdrant/js-client-rest";
import { config } from "./data.config";

export const qdrantClient = new QdrantClient({
    url:config.qdrantUrl,
    apiKey:config.qdrantApiKey
})