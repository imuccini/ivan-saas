"use client";

import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@ui/components/sheet";
import { LoaderIcon, SendIcon, Sparkles, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAiSuggestions } from "@saas/ai/hooks/use-ai-suggestions";
import { SuggestionChips } from "@saas/ai/components/SuggestionChips";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

interface MobileChatDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	initialMessage?: string;
}

export function MobileChatDrawer({
	isOpen,
	onOpenChange,
	initialMessage,
}: MobileChatDrawerProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	// Add initial message when drawer opens
	useEffect(() => {
		if (isOpen && initialMessage && messages.length === 0) {
			const userMessage: Message = {
				id: Date.now().toString(),
				role: "user",
				content: initialMessage,
				timestamp: new Date(),
			};
			setMessages([userMessage]);

			// Simulate AI response
			setTimeout(() => {
				const aiMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content:
						"I understand you'd like to " +
						initialMessage.toLowerCase() +
						". Let me help you with that. This is a demo response - in production, this would connect to an AI service to provide intelligent assistance.",
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, aiMessage]);
			}, 1000);
		}
	}, [isOpen, initialMessage]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		// Simulate AI response
		setTimeout(() => {
			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content:
					"This is a simulated AI response. In production, this would connect to your AI service to provide intelligent assistance based on your Cloud NAC data.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, aiMessage]);
			setIsLoading(false);
		}, 1500);
	};

	const suggestions = useAiSuggestions();

	const handleSuggestionClick = (suggestion: string) => {
		setInput(suggestion);
	};

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent
				side="bottom"
				className="h-[85vh] flex flex-col rounded-t-2xl p-0"
			>
				{/* Handle bar for drag indicator */}
				<div className="flex justify-center pt-2 pb-1">
					<div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
				</div>

				<SheetHeader className="px-4 pb-2 border-b">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
								<Sparkles className="size-4 text-primary" />
							</div>
							<SheetTitle>AI Assistant</SheetTitle>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="size-8"
							onClick={() => onOpenChange(false)}
						>
							<XIcon className="size-4" />
							<span className="sr-only">Close</span>
						</Button>
					</div>
					<SheetDescription className="sr-only">
						Chat with the AI Assistant
					</SheetDescription>
				</SheetHeader>

				<div
					ref={scrollAreaRef}
					className="flex-1 overflow-y-auto px-4"
				>
					<div className="space-y-4 py-4">
						{messages.length === 0 && (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="flex size-16 items-center justify-center rounded-full bg-muted">
									<Sparkles className="size-8 text-muted-foreground" />
								</div>
								<p className="mt-4 text-sm text-muted-foreground">
									Start a conversation with the AI assistant
								</p>
								{suggestions.length > 0 && (
									<div className="mt-6 w-full">
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
									<p className="text-sm">{message.content}</p>
									<p className="mt-1 text-xs opacity-70">
										{message.timestamp.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
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

				{/* Input area with safe area for mobile bottom */}
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
			</SheetContent>
		</Sheet>
	);
}
