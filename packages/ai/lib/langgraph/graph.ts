import { StateGraph, Annotation, END, START } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";
import {
	routerNode,
	toolExecutorNode,
	responseFormatterNode,
	routeNext,
} from "./nodes";
import { getCheckpointer, generateThreadId } from "./checkpointer";
import type { AgentIntent, ToolResult, StreamEvent } from "./types";

/**
 * Define the state annotation for the graph
 */
const AgentStateAnnotation = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		reducer: (prev, next) => [...prev, ...next],
		default: () => [],
	}),
	currentAgent: Annotation<
		"router" | "tool_executor" | "response_formatter" | "end"
	>({
		reducer: (_, next) => next,
		default: () => "router",
	}),
	intent: Annotation<AgentIntent | undefined>({
		reducer: (_, next) => next,
		default: () => undefined,
	}),
	toolResults: Annotation<ToolResult[] | undefined>({
		reducer: (_, next) => next,
		default: () => undefined,
	}),
	userId: Annotation<string | undefined>({
		reducer: (_, next) => next,
		default: () => undefined,
	}),
	organizationId: Annotation<string | undefined>({
		reducer: (_, next) => next,
		default: () => undefined,
	}),
	threadId: Annotation<string>({
		reducer: (_, next) => next,
		default: () => "",
	}),
});

/**
 * Create the multi-agent graph
 */
function createAgentGraph() {
	const workflow = new StateGraph(AgentStateAnnotation)
		// Add nodes
		.addNode("router", routerNode)
		.addNode("tool_executor", toolExecutorNode)
		.addNode("response_formatter", responseFormatterNode)
		// Add edges
		.addEdge(START, "router")
		.addConditionalEdges("router", routeNext)
		.addEdge("tool_executor", "response_formatter")
		.addEdge("response_formatter", END);

	return workflow;
}

/**
 * Compile the graph with checkpointer
 */
export async function getCompiledGraph() {
	const checkpointer = await getCheckpointer();
	const workflow = createAgentGraph();

	return workflow.compile({
		checkpointer,
	});
}

/**
 * Invoke the agent graph with a message
 */
export async function invokeAgent(params: {
	message: string;
	userId?: string;
	organizationId?: string;
	chatId?: string;
}): Promise<{
	response: string;
	toolResults?: ToolResult[];
}> {
	const { message, userId, organizationId, chatId } = params;

	const graph = await getCompiledGraph();
	const threadId = generateThreadId(userId, organizationId, chatId);

	const result = await graph.invoke(
		{
			messages: [new HumanMessage(message)],
			currentAgent: "router",
			userId,
			organizationId,
			threadId,
		},
		{
			configurable: {
				thread_id: threadId,
			},
		},
	);

	// Extract the final assistant message
	const lastMessage = result.messages[result.messages.length - 1];
	const response =
		typeof lastMessage.content === "string"
			? lastMessage.content
			: JSON.stringify(lastMessage.content);

	return {
		response,
		toolResults: result.toolResults,
	};
}

/**
 * Stream the agent graph with a message
 * Yields events for real-time updates in the UI
 */
export async function* streamAgent(params: {
	message: string;
	userId?: string;
	organizationId?: string;
	chatId?: string;
}): AsyncGenerator<StreamEvent> {
	const { message, userId, organizationId, chatId } = params;

	const graph = await getCompiledGraph();
	const threadId = generateThreadId(userId, organizationId, chatId);

	const stream = await graph.stream(
		{
			messages: [new HumanMessage(message)],
			currentAgent: "router",
			userId,
			organizationId,
			threadId,
		},
		{
			configurable: {
				thread_id: threadId,
			},
			streamMode: "values",
		},
	);

	let finalMessage = "";

	for await (const event of stream) {
		// Emit thinking event for each agent transition
		if (event.currentAgent && event.currentAgent !== "end") {
			yield {
				type: "thinking",
				agent: event.currentAgent,
			};
		}

		// Emit tool events
		if (event.toolResults && event.toolResults.length > 0) {
			for (const toolResult of event.toolResults) {
				yield {
					type: "tool_end",
					toolName: toolResult.toolName,
					output: toolResult.result,
				};
			}
		}

		// Track final message
		if (event.messages && event.messages.length > 0) {
			const lastMessage = event.messages[event.messages.length - 1];
			if (lastMessage.content) {
				finalMessage =
					typeof lastMessage.content === "string"
						? lastMessage.content
						: JSON.stringify(lastMessage.content);
			}
		}
	}

	// Emit final message
	if (finalMessage) {
		yield {
			type: "done",
			finalMessage,
		};
	}
}

export { generateThreadId };
