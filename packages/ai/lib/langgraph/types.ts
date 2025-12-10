import type { BaseMessage } from "@langchain/core/messages";

/**
 * State for the multi-agent graph
 */
export interface AgentState {
	messages: BaseMessage[];
	currentAgent: "router" | "tool_executor" | "response_formatter" | "end";
	intent?: AgentIntent;
	toolResults?: ToolResult[];
	userId?: string;
	organizationId?: string;
	threadId: string;
}

/**
 * Intent classification from the router agent
 */
export interface AgentIntent {
	type:
		| "search_knowledge"
		| "get_setup_steps"
		| "update_config"
		| "general_chat";
	confidence: number;
	entities?: Record<string, string>;
}

/**
 * Tool execution result
 */
export interface ToolResult {
	toolName: string;
	result: unknown;
	error?: string;
}

/**
 * Streaming event types for the frontend
 */
export type StreamEvent =
	| { type: "thinking"; agent: string }
	| { type: "tool_start"; toolName: string; input: unknown }
	| { type: "tool_end"; toolName: string; output: unknown }
	| { type: "token"; content: string }
	| { type: "done"; finalMessage: string };
