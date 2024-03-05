import { useState, useMemo, memo, useEffect } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import Loader from "./components/loader";
import Error from "./components/error";
import { ChatMessage } from "./types/chat-message";

const Home = () => {
	const [lastMessage, setLastMessage] = useState<string | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [loading, setLoading] = useState(false);
	const [apiAvilable, setApiAvailable] = useState(false);
	const [hasError, setHasError] = useState(false);

	const checkHealthAndSetLoading = async () => {
		try {
			const response = await fetch('http://localhost:8080/api/health');
			if (response.status === 200) {
				setApiAvailable(true);
			} else {
				// Retry after 5 seconds if the response status is not 200
				setTimeout(checkHealthAndSetLoading, 5000);
			}
		} catch (error) {
			// Retry after 5 seconds if there's an error
			setTimeout(checkHealthAndSetLoading, 5000);
		}
	}

	useEffect(() => {
		checkHealthAndSetLoading();
	}, [])

	const handleChatMessage = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
			const prompt = event.currentTarget.value;

			setMessages((oldMessages) => [
				...(oldMessages ?? []),
				{ from: "me", message: prompt },
			]);
			setLoading(true);
			setHasError(false);

			fetch("http://localhost:8080/api/chat", { 
				method: 'POST', 
				body: JSON.stringify({ prompt }),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).then((response) => {
				setLoading(false);
				reader = response.body!.getReader();
				let data = "";
				const readStream = async () => {
					const { done, value } = await reader!.read();
					if (done) {
						setMessages((oldMessages) => [...oldMessages,
							{ from: "bot", message: data },
						]);
						setLastMessage(null);
						reader?.releaseLock();
						return;
					}
					data += new TextDecoder("utf-8").decode(value);
					setLastMessage(data);
					readStream();
					window.scrollTo(0, document.body.scrollHeight);
				};
				readStream();
			}).catch((error: Error) => {
				console.error('Error talking to open-ai agent Wun.');
				setHasError(true);
			});
			event.currentTarget.value = "";
		}
	};

	const ChatMessage = memo(({ from, message }: ChatMessage) => {
		const className = () => {
			const subClass = from === "bot" ? "" : "bg-light";
			return `list-group-item ${subClass}`
		}
		// const MeTag = (message: string) => {
		// 	return <><i className="fa-solid fa-person-circle-question"></i> Me: {message}</>
		// }
		// const WunTag = (message: string) => {
		// 	return <><i className="fa-solid fa-robot"></i> Wun: {message}</>
		// }
		return (
			<li className={className()}>
				<Markdown
					children={message}
					components={{
						p(props) {
							const { children, className, node, ...rest } = props;

							//Special handling because I'm giving it a specific format.
							const hasVideo = /v=(\w+)/.exec(String(message) || "");
							console.log(message, hasVideo);

							return (
								<>
									<p>{children}</p>
									{hasVideo && (
										<LiteYouTubeEmbed
											id={hasVideo[1]}
											title={""}
										></LiteYouTubeEmbed>
									)}
								</>
							);
						},
						code(props) {
							const { children, className, node, ...rest } = props;
							const languageType = /language-(\w+)/.exec(className || "");
							return (
								<SyntaxHighlighter
									children={String(children).replace(/\n$/, "")}
									style={dracula}
									language={languageType ? languageType[1] : ""}
								/>
							);
						},
					}}
				/>
			</li>
		);
	});

	const chatMessages = useMemo(() => {
		return messages.map(({ from, message }, index) => (
			<ChatMessage from={from} message={message} key={index} />
		));
	}, [messages]);

	return apiAvilable ? (
		<>
			<ul className="list-group">
				{chatMessages}
				{lastMessage && (
					<ChatMessage from="bot" message={lastMessage} />
				)}
				{hasError ? <Error /> : loading && <Loader /> }
				
			</ul>
			<div className="mt-4 card card-body">
				<textarea
					name="prompt"
					style={{ width: '100%', border: 'none', background: 'transparent' }}
					placeholder=" Enter your question here..."
					className="chat-input rounded-md pl-6 pr-6 pt-2 pb-2"
					onKeyDownCapture={handleChatMessage}
				/>
			</div>
		</>
	) : <div>Waiting for api to become available...</div>;
};

export default Home;
