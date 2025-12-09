"use client";

import { Button } from "./button";
import { Input } from "./input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";
import { AnimatePresence, motion } from "framer-motion";
import {
	BellIcon,
	BookIcon,
	LoaderIcon,
	SendIcon,
	Sparkles,
	XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAiSuggestions } from "@saas/ai/hooks/use-ai-suggestions";
import { SuggestionChips } from "@saas/ai/components/SuggestionChips";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

interface RightPanelProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	initialMessage?: string;
}

export function RightPanel({
	isOpen,
	onOpenChange,
	initialMessage,
}: RightPanelProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	// Add initial message when panel opens
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
			scrollAreaRef.current.scrollTop =
				scrollAreaRef.current.scrollHeight;
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
		<>
			<motion.div
				initial={{ width: "3rem" }}
				animate={{ width: isOpen ? 424 : "3rem" }}
				transition={{ duration: isOpen ? 0.3 : 0.2, ease: "easeInOut" }}
				className="shrink-0 bg-transparent"
			/>
			<div className="fixed right-0 top-0 h-screen z-20 flex pointer-events-none">
				<AnimatePresence mode="wait" initial={false}>
					{!isOpen ? (
						<motion.div
							key="icons"
							initial={{ opacity: 0, width: 0 }}
							animate={{ opacity: 1, width: "3rem" }}
							exit={{ opacity: 0, width: 0 }}
							transition={{ duration: 0.2 }}
							className="bg-sidebar flex flex-col items-center py-4 gap-4 h-full pointer-events-auto"
						>
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="default"
											size="icon"
											className="size-9 rounded-xl shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
											onClick={() => onOpenChange(true)}
										>
											<Sparkles className="size-4" />
											<span className="sr-only">
												AI Chat
											</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent side="left">
										AI Chat
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="size-8 rounded-lg"
										>
											<BellIcon className="size-4" />
											<span className="sr-only">
												Notifications
											</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent side="left">
										Notifications
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<a
											href="https://supastarter.dev/docs/nextjs"
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center justify-center size-8 rounded-lg hover:bg-accent hover:text-accent-foreground"
										>
											<BookIcon className="size-4" />
											<span className="sr-only">
												Documentation
											</span>
										</a>
									</TooltipTrigger>
									<TooltipContent side="left">
										Documentation
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</motion.div>
					) : (
						<motion.div
							key="chat"
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: 400, opacity: 1 }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="bg-background overflow-hidden flex flex-col relative shadow-sm border rounded-xl m-2 h-[calc(100vh-1rem)] pointer-events-auto"
						>
							<div className="flex items-center justify-between p-4 border-b">
								<div className="flex items-center gap-2">
									<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
										<Sparkles className="size-4 text-primary" />
									</div>
									<h2 className="font-semibold">
										AI Assistant
									</h2>
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
												Start a conversation with the AI
												assistant
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
												className={`max-w-[80%] rounded-lg px-4 py-2 ${
													message.role === "user"
														? "bg-primary text-primary-foreground"
														: "bg-muted"
												}`}
											>
												<p className="text-sm">
													{message.content}
												</p>
												<p className="mt-1 text-xs opacity-70">
													{message.timestamp.toLocaleTimeString(
														[],
														{
															hour: "2-digit",
															minute: "2-digit",
														},
													)}
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

							<div className="border-t p-4">
								<form
									onSubmit={handleSubmit}
									className="flex gap-2"
								>
									<Input
										value={input}
										onChange={(e) =>
											setInput(e.target.value)
										}
										placeholder="Type your message..."
										disabled={isLoading}
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
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
}
