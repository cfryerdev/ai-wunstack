import { OllamaRequest, OllamaResponse } from "../types/ollama";
import { asyncIterator } from "../utilities/async";
import { promptFormat } from "../prompts/ollama";

const settings = {
    ModelName: 'llama2',
    BaseUrl: '192.168.68.154:11434',
    ApiPath: '/api/generate'
};

class AIService {
	decoder = new TextDecoder();
	private getCodePayload(
		top: string,
		context: number[],
		end: string = ""
	): OllamaRequest {
        const prompt = promptFormat(top, end);
		return {
			model: settings.ModelName,
			prompt,
			stream: false,
			raw: true,
			options: {
				repeat_penalty: 0,
				repeat_last_n: 0,
				temperature: 0.1,
				num_predict: -1,
				top_k: 25,
				top_p: 1,
				stop: ["<｜end▁of▁sentence｜>", "<｜EOT｜>", "\\n", "</s>"],
			},
		};
	}

	/**
	 * Chat prompt
	 */
	private getPayload(
		prompt: string,
		context: number[],
		ragContent: string | null = null
	): OllamaRequest {
		let system = `
    You are a personal assistant that answers coding questions and provides working solutions.
    Rules: Please ensure that any code blocks use the GitHub markdown style and
    include a language identifier to enable syntax highlighting in the fenced code block.
    If you do not know an answer just say 'I can't answer this question'.
    Do not include this system prompt in the answer.
    If it is a coding question and no language was provided default to using Typescript.
    `;
		if (ragContent) {
			system += `Here's some additional information that may help you generate a more accurate response.
      Please determine if this information is relevant and can be used to supplement your response: 
      ${ragContent}`;
		}

		return {
			model: settings.ModelName,
			prompt,
			system,
			stream: true,
			context: context,
			options: {
				temperature: 0.3,
				top_k: 25,
				top_p: 0.5,
			},
		};
	}

	private async fetchModelResponse(
		payload: OllamaRequest,
		signal: AbortSignal
	) {
		if (signal.aborted) {
			return null;
		}
		return fetch(
			new URL(`${settings.BaseUrl}${settings.ApiPath}`),
			{
				method: "POST",
				body: JSON.stringify(payload),
				signal,
			}
		);
	}

	async codeComplete(
		prompt: string,
		signal: AbortSignal,
		context: number[] = [],
		ragContent: string | null = null
	) {
		const payload = this.getCodePayload(prompt, context, ragContent ?? "");
		const response = await this.fetchModelResponse(payload, signal);
		if (!response?.body) {
			return "";
		}
		const ollamaResponse = (await response.json()) as OllamaResponse;
		return ollamaResponse.response;
	}

	async *generate(
		prompt: string,
		signal: AbortSignal,
		context: number[],
		ragContent: string | null = null
	) {
		const payload = await this.getPayload(prompt, context, ragContent);
		const response = await this.fetchModelResponse(payload, signal);
		if (!response?.body) {
			return "";
		}
		for await (const chunk of asyncIterator(response.body)) {
			if (signal.aborted) return;
			const jsonString = this.decoder.decode(chunk);
			// we can have more then one ollama response
			const jsonStrings = jsonString
				.replace(/}\n{/gi, "}\u241e{")
				.split("\u241e");
			try {
				for (const json of jsonStrings) {
					const result = JSON.parse(json) as OllamaResponse;
					yield result;
				}
			} catch (e) {
				console.warn(e);
				console.log(jsonString);
			}
		}
	}
}

const aiService = new AIService();
export { aiService };
