import { QdrantClient } from "@qdrant/js-client-rest";
import { config } from "./data.config";

export const qdrantClient = new QdrantClient({
    url: config.qdrantUrl,
    apiKey: config.qdrantApiKey
});

export const initQdrant = async () => {
    const collections = await qdrantClient.getCollections();
    const roomMateExists = collections.collections.some(c => c.name === "roomMate");
    const propertyExists = collections.collections.some(c => c.name === "properties");

    if (!roomMateExists) {
        await qdrantClient.createCollection("roomMate", {
            vectors: { size: 3072, distance: "Cosine" },
        });
        console.log("✅ Qdrant collection 'roomMate' created");
    } else {
        console.log("✅ Qdrant collection 'roomMate' already exists");
    }

    if (!propertyExists) {
        await qdrantClient.createCollection("property", {
            vectors: { size: 3072, distance: "Cosine" },
        });
        console.log("✅ Qdrant collection 'property' created");
    } else {
        console.log("✅ Qdrant collection 'property' already exists");
    }
};