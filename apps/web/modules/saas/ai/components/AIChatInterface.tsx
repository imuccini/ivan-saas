"use client";

import { SuggestionChips } from "@saas/ai/components/SuggestionChips";
import { useAiSuggestions } from "@saas/ai/hooks/use-ai-suggestions";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { LoaderIcon, SendIcon, SparklesIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	createdAt?: Date;
}

interface AIChatInterfaceProps {
	initialMessage?: string;
	className?: string;
}

export function AIChatInterface({
	initialMessage,
	className,
}: AIChatInterfaceProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
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
			scrollAreaRef.current.scrollTop =
				scrollAreaRef.current.scrollHeight;
		}
	}, [messages]);

	const sendMessage = async (currentMessages: Message[]) => {
		setIsLoading(true);
		try {
			// Format messages for API (remove extra fields if needed)
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
				let assistantMessage = "";
				const assistantMsgId = (Date.now() + 1).toString();

				// Add placeholder assistant message
				setMessages((prev) => [
					...prev,
					{
						id: assistantMsgId,
						role: "assistant",
						content: "",
						createdAt: new Date(),
					},
				]);

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					const chunk = decoder.decode(value, { stream: true });
					// Simple text stream handling
					// Note: Vercel AI SDK returns a protocol. We might see "0:..."
					// For now, let's assume raw text or try to parse if needed.
					// If it's protocol, we need to parse it.
					// But for now, let's just append and see.
					assistantMessage += chunk;

					// Update assistant message content
					setMessages((prev) =>
						prev.map((msg) =>
							msg.id === assistantMsgId
								? { ...msg, content: assistantMessage }
								: msg,
						),
					);
				}
			}
		} catch (error) {
			console.error("Error sending message:", error);
		} finally {
			setIsLoading(false);
		}
	};

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
							<div className="flex size-16 items-center justify-center rounded-full bg-muted">
								<SparklesIcon className="size-8 text-muted-foreground" />
							</div>
							<p className="mt-4 text-sm text-muted-foreground">
								Start a conversation with the AI assistant
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
								className={`max-w-[85%] rounded-lg px-4 py-2 ${
									message.role === "user"
										? "bg-primary text-primary-foreground"
										: "bg-muted"
								}`}
							>
								<p className="text-sm whitespace-pre-wrap">
									{message.content}
								</p>
								{message.createdAt && (
									<p className="mt-1 text-xs opacity-70">
										{message.createdAt.toLocaleTimeString(
											[],
											{
												hour: "2-digit",
												minute: "2-digit",
											},
										)}
									</p>
								)}
							</div>
						</div>
					))}

					{isLoading && (
						<div className="flex justify-start">
							<div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
								<LoaderIcon className="size-4 animate-spin" />
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
						placeholder="Type your message..."
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
