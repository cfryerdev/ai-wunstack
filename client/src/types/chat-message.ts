export type Senders = "me" | "bot";

export type ChatMessage = {
	from: Senders;
	message: string;
};