"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface ChatContextType {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	initialMessage: string;
	setInitialMessage: (message: string) => void;
	openWithMessage: (message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [initialMessage, setInitialMessage] = useState("");

	const openWithMessage = (message: string) => {
		setInitialMessage(message);
		setIsOpen(true);
	};

	return (
		<ChatContext.Provider
			value={{
				isOpen,
				setIsOpen,
				initialMessage,
				setInitialMessage,
				openWithMessage,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export function useChatContext() {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChatContext must be used within ChatProvider");
	}
	return context;
}
