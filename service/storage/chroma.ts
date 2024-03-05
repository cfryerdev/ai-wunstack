import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const createChromaStore = async ({ docs, connectionString, collectionName }) => {
    return await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
        url: connectionString,
        collectionName: collectionName,
        collectionMetadata: {
            "hnsw:space": "cosine",
        },
    });
};