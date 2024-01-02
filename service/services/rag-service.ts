import { BuildModel, PromptModel } from "../utilities/trainer";
import { singleton } from "../utilities/singleton";

const AskPrompt = async (prompt: string) => {
	if (!prompt) return null;
	const getRag = singleton("rag", () => BuildModel());
	const llm = await getRag;
	return await PromptModel(prompt, llm);
}

const TeachPrompt = async () => {
	return singleton("rag", () => BuildModel());
}

export default {
	AskPrompt,
	TeachPrompt
};