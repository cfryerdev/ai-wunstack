import { ChatOpenAI } from "langchain/chat_models/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SYSTEM_TEMPLATE, QuestionKeyword, ModelName, ChunkSize, ChunkOverlap } from "../prompts/openai";
import { webLoad, githubLoad, youtubeLoad } from "../loaders";
import webSources from "../data/sources.json";

/** Loads all of our configured sources and returns the docs  */
const LoadDocs = async () => {
	const _webLoaders = webSources.websites.map((item) => webLoad({ url: item.url }));
	const _youtubeLoaders = webSources.videos.map((item) => youtubeLoad({ url: item.url }));
	const _githubLoaders = webSources.repos.map((item) => githubLoad({ url: item.url, branch: item.branch }));
	const loaders = await Promise.all([..._youtubeLoaders, ..._webLoaders, ..._githubLoaders]);
	return loaders.map((l) => l[0]);
}

/** Ask our prompt questions */
const PromptModel = async (prompt: string, chain: RunnableSequence<any, string>) => {
	return chain.stream(prompt);
};

/** Builds our model and trains it based on the loaders configured. */
const BuildModel = async () => {
	const model = new ChatOpenAI({ streaming: true, modelName: ModelName, openAIApiKey: process.env.OPENAI_API_KEY, verbose: true });
	const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: ChunkSize, chunkOverlap: ChunkOverlap });
	const splitDocs = await textSplitter.splitDocuments(await LoadDocs());
	const vectorStore = await HNSWLib.fromDocuments(splitDocs, new OpenAIEmbeddings());
	const vectorStoreRetriever = vectorStore.asRetriever();
	const messages = [
		SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
		HumanMessagePromptTemplate.fromTemplate(QuestionKeyword),
	];
	const prompt = ChatPromptTemplate.fromMessages(messages);
	const chain = RunnableSequence.from([
		{
			context: vectorStoreRetriever.pipe(formatDocumentsAsString),
			question: new RunnablePassthrough(),
		},
		prompt,
		model,
		new StringOutputParser(),
	]);
	return chain;
};

/** Expose parts of our trainer functionality */
export {
	LoadDocs,
    BuildModel,
    PromptModel
};
