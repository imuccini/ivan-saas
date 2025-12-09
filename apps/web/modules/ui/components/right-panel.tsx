"use client";

import { AIChatInterface } from "@saas/ai/components/AIChatInterface";
import { Button } from "@ui/components/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@ui/components/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { BellIcon, BookIcon, Sparkles, XIcon } from "lucide-react";

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

							<AIChatInterface initialMessage={initialMessage} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
}
