import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const createInMemStore = async ({ docs }) => {
    return await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
};