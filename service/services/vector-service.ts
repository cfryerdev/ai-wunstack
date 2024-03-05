import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// https://js.langchain.com/docs/integrations/vectorstores/chroma

/** Add a record to the Vector Store */
const addText = async (chunks, collectionName, metaData) => {
    await Chroma.fromTexts(chunks, metaData,
        new OpenAIEmbeddings(), { collectionName: collectionName }
    );
}

export default {
    addText
}