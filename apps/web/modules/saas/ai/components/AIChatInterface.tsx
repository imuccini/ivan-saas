"use client";

import { SuggestionChips } from "@saas/ai/components/SuggestionChips";
import { useAiSuggestions } from "@saas/ai/hooks/use-ai-suggestions";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { cn } from "@ui/lib";
import {
	BrainIcon,
	CheckCircle2Icon,
	LoaderIcon,
	SearchIcon,
	SendIcon,
	SettingsIcon,
	SparklesIcon,
	WrenchIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
	createdAt?: Date;
	status?: "thinking" | "tool" | "streaming" | "complete";
	toolName?: string;
}

interface StreamEvent {
	type: "thinking" | "tool_start" | "tool_end" | "token" | "done";
	agent?: string;
	toolName?: string;
	input?: unknown;
	output?: unknown;
	content?: string;
	finalMessage?: string;
}

interface AIChatInterfaceProps {
	initialMessage?: string;
	className?: string;
}

/**
 * Get an icon for the current agent/tool state
 */
function getAgentIcon(agent?: string, toolName?: string) {
	if (toolName) {
		switch (toolName) {
			case "search_knowledge_base":
				return <SearchIcon className="size-4 animate-pulse" />;
			case "get_setup_steps":
				return <WrenchIcon className="size-4 animate-pulse" />;
			case "update_config":
				return <SettingsIcon className="size-4 animate-pulse" />;
			default:
				return <WrenchIcon className="size-4 animate-pulse" />;
		}
	}

	switch (agent) {
		case "router":
			return <BrainIcon className="size-4 animate-pulse" />;
		case "tool_executor":
			return <WrenchIcon className="size-4 animate-pulse" />;
		case "response_formatter":
			return <SparklesIcon className="size-4 animate-pulse" />;
		default:
			return <LoaderIcon className="size-4 animate-spin" />;
	}
}

/**
 * Get a human-readable status message
 */
function getStatusMessage(agent?: string, toolName?: string): string {
	if (toolName) {
		switch (toolName) {
			case "search_knowledge_base":
				return "Searching documentation...";
			case "get_setup_steps":
				return "Getting setup steps...";
			case "update_config":
				return "Preparing configuration update...";
			default:
				return `Running ${toolName}...`;
		}
	}

	switch (agent) {
		case "router":
			return "Analyzing your request...";
		case "tool_executor":
			return "Executing tools...";
		case "response_formatter":
			return "Generating response...";
		default:
			return "Processing...";
	}
}

/**
 * Simple markdown renderer for code blocks and basic formatting
 */
function renderMarkdown(content: string): React.ReactNode {
	// Split by code blocks
	const parts = content.split(/(```[\s\S]*?```)/g);

	return parts.map((part, index) => {
		if (part.startsWith("```")) {
			// Code block
			const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
			if (match) {
				const [, lang, code] = match;
				return (
					<pre
						key={index}
						className="my-2 overflow-x-auto rounded-md bg-muted p-3 text-xs"
					>
						{lang && (
							<div className="mb-1 text-xs text-muted-foreground">
								{lang}
							</div>
						)}
						<code>{code.trim()}</code>
					</pre>
				);
			}
		}

		// Handle inline formatting
		return (
			<span key={index}>
				{part.split("\n").map((line, lineIndex) => (
					<span key={lineIndex}>
						{lineIndex > 0 && <br />}
						{line
							.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)
							.map((segment, segIndex) => {
								if (segment.startsWith("**") && segment.endsWith("**")) {
									return (
										<strong key={segIndex}>
											{segment.slice(2, -2)}
										</strong>
									);
								}
								if (segment.startsWith("*") && segment.endsWith("*")) {
									return <em key={segIndex}>{segment.slice(1, -1)}</em>;
								}
								if (segment.startsWith("`") && segment.endsWith("`")) {
									return (
										<code
											key={segIndex}
											className="rounded bg-muted px-1 py-0.5 text-xs"
										>
											{segment.slice(1, -1)}
										</code>
									);
								}
								return segment;
							})}
					</span>
				))}
			</span>
		);
	});
}

export function AIChatInterface({
	initialMessage,
	className,
}: AIChatInterfaceProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentStatus, setCurrentStatus] = useState<{
		agent?: string;
		toolName?: string;
	}>({});
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const hasInitialized = useRef(false);

	// Add initial message when component mounts
	useEffect(() => {
		if (initialMessage && !hasInitialized.current) {
			hasInitialized.current = true;
			const userMsg: Message = {
				id: Date.now().toString(),
				role: "user",
				content: initialMessage,
				createdAt: new Date(),
			};
			setMessages([userMsg]);
			// Trigger AI response for initial message
			sendMessage([userMsg]);
		}
	}, [initialMessage]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
		}
	}, [messages, currentStatus]);

	const sendMessage = useCallback(async (currentMessages: Message[]) => {
		setIsLoading(true);
		setCurrentStatus({});

		try {
			const apiMessages = currentMessages.map(({ role, content }) => ({
				role,
				content,
			}));

			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: apiMessages }),
			});

			if (!response.ok) throw new Error("Failed to send message");

			if (response.body) {
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				const assistantMsgId = (Date.now() + 1).toString();
				let finalContent = "";

				// Add placeholder assistant message
				setMessages((prev) => [
					...prev,
					{
						id: assistantMsgId,
						role: "assistant",
						content: "",
						createdAt: new Date(),
						status: "thinking",
					},
				]);

				let buffer = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });

					// Process complete SSE messages
					const lines = buffer.split("\n\n");
					buffer = lines.pop() || "";

					for (const line of lines) {
						if (line.startsWith("data: ")) {
							try {
								const event: StreamEvent = JSON.parse(line.slice(6));

								switch (event.type) {
									case "thinking":
										setCurrentStatus({ agent: event.agent });
										setMessages((prev) =>
											prev.map((msg) =>
												msg.id === assistantMsgId
													? { ...msg, status: "thinking" }
													: msg,
											),
										);
										break;

									case "tool_start":
										setCurrentStatus({ toolName: event.toolName });
										setMessages((prev) =>
											prev.map((msg) =>
												msg.id === assistantMsgId
													? {
															...msg,
															status: "tool",
															toolName: event.toolName,
														}
													: msg,
											),
										);
										break;

									case "tool_end":
										setCurrentStatus({ toolName: event.toolName });
										break;

									case "token":
										if (event.content) {
											finalContent += event.content;
											setMessages((prev) =>
												prev.map((msg) =>
													msg.id === assistantMsgId
														? {
																...msg,
																content: finalContent,
																status: "streaming",
															}
														: msg,
												),
											);
										}
										break;

									case "done":
										if (event.finalMessage) {
											finalContent = event.finalMessage;
										}
										setMessages((prev) =>
											prev.map((msg) =>
												msg.id === assistantMsgId
													? {
															...msg,
															content: finalContent,
															status: "complete",
														}
													: msg,
											),
										);
										setCurrentStatus({});
										break;
								}
							} catch {
								// Ignore invalid JSON
							}
						}
					}
				}

				// Ensure final message is marked complete
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === assistantMsgId
							? { ...msg, content: finalContent || msg.content, status: "complete" }
							: msg,
					),
				);
			}
		} catch (error) {
			console.error("Error sending message:", error);
			// Add error message
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					role: "assistant",
					content:
						"I apologize, but I encountered an error. Please try again.",
					status: "complete",
				},
			]);
		} finally {
			setIsLoading(false);
			setCurrentStatus({});
		}
	}, []);

	const suggestions = useAiSuggestions();

	const handleSuggestionClick = (suggestion: string) => {
		setInput(suggestion);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const currentInput = input;
		setInput("");

		const userMsg: Message = {
			id: Date.now().toString(),
			role: "user",
			content: currentInput,
			createdAt: new Date(),
		};

		const newMessages = [...messages, userMsg];
		setMessages(newMessages);

		await sendMessage(newMessages);
	};

	return (
		<div
			className={`flex flex-col h-full overflow-hidden ${className || ""}`}
		>
			<div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4">
				<div className="space-y-4 py-4">
					{messages.length === 0 && (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
								<SparklesIcon className="size-8 text-indigo-500" />
							</div>
							<h3 className="mt-4 font-semibold">AI Assistant</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								I can help you with documentation, setup guides, and
								configuration.
							</p>
							{suggestions.length > 0 && (
								<div className="mt-6 w-full px-4">
									<SuggestionChips
										suggestions={suggestions}
										onSelect={handleSuggestionClick}
									/>
								</div>
							)}
						</div>
					)}

					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
						>
							<div
								className={cn(
									"max-w-[85%] rounded-lg px-4 py-2",
									message.role === "user"
										? "bg-primary text-primary-foreground"
										: "bg-muted",
								)}
							>
								{/* Status indicator for assistant messages */}
								{message.role === "assistant" &&
									message.status &&
									message.status !== "complete" && (
										<div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
											{getAgentIcon(
												currentStatus.agent,
												currentStatus.toolName || message.toolName,
											)}
											<span>
												{getStatusMessage(
													currentStatus.agent,
													currentStatus.toolName || message.toolName,
												)}
											</span>
										</div>
									)}

								{/* Message content */}
								{message.content ? (
									<div className="text-sm whitespace-pre-wrap">
										{renderMarkdown(message.content)}
									</div>
								) : (
									message.status !== "complete" && (
										<div className="flex items-center gap-2 py-1">
											<LoaderIcon className="size-4 animate-spin" />
										</div>
									)
								)}

								{/* Timestamp */}
								{message.createdAt && message.status === "complete" && (
									<p className="mt-1 text-xs opacity-70">
										{message.createdAt.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								)}
							</div>
						</div>
					))}

					{/* Loading indicator when no assistant message yet */}
					{isLoading && messages[messages.length - 1]?.role === "user" && (
						<div className="flex justify-start">
							<div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
								<div className="flex items-center gap-2">
									{getAgentIcon(currentStatus.agent, currentStatus.toolName)}
									<span className="text-xs text-muted-foreground">
										{getStatusMessage(
											currentStatus.agent,
											currentStatus.toolName,
										)}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="border-t p-4 pb-safe">
				<form onSubmit={handleSubmit} className="flex gap-2">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Ask me anything..."
						disabled={isLoading}
						className="flex-1"
					/>
					<Button
						type="submit"
						size="icon"
						disabled={isLoading || !input.trim()}
					>
						<SendIcon className="size-4" />
					</Button>
				</form>
			</div>
		</div>
	);
}
